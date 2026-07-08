import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, settings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { country, city, category } = await req.json();

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Google Places API key is missing. Please add GOOGLE_PLACES_API_KEY to your environment variables." },
        { status: 400 }
      );
    }

    // Fetch configurable minimum reviews threshold, default to 3
    let minReviewsThreshold = 3;
    try {
      const [setting] = await db.select().from(settings).where(eq(settings.id, "min_reviews_threshold"));
      if (setting && setting.value) {
        minReviewsThreshold = parseInt(setting.value, 10);
      }
    } catch (e) {
      console.warn("Failed to fetch min_reviews_threshold from settings, using default.", e);
    }

    const searchQuery = `${category} in ${city ? city + ", " : ""}${country}`;

    // Call Google Places Text Search API
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.id,places.businessStatus,places.userRatingCount,places.rating"
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        languageCode: "en",
        maxResultCount: 20, // Increased to max allowed per request
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API Error:", data);
      return NextResponse.json({ success: false, error: "Failed to fetch from Google Places API" }, { status: 500 });
    }

    const places = data.places || [];

    if (places.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: "No places found" });
    }

    let insertedCount = 0;
    let filteredCount = 0;
    const filterLog: { name: string; reason: string }[] = [];
    const seenPhones = new Set<string>();
    const seenAddresses = new Set<string>();

    for (const place of places) {
      const name = place.displayName?.text || "Unknown Business";

      // Filter 1: Must be operational
      if (place.businessStatus !== "OPERATIONAL") {
        filteredCount++;
        filterLog.push({ name, reason: `Not operational (${place.businessStatus})` });
        continue;
      }

      const reviewCount = place.userRatingCount || 0;
      
      // Filter 2: Min reviews threshold
      if (reviewCount < minReviewsThreshold) {
        filteredCount++;
        filterLog.push({ name, reason: `Too few reviews (${reviewCount} < ${minReviewsThreshold})` });
        continue;
      }

      const phone = place.nationalPhoneNumber || "";
      
      // Filter 3: Must have phone number
      if (!phone) {
        filteredCount++;
        filterLog.push({ name, reason: "No phone number" });
        continue;
      }

      const address = place.formattedAddress || "";
      const normalizedPhone = phone.replace(/\D/g, '');
      const normalizedAddress = address.toLowerCase().trim();

      // Filter 4: Deduplicate by phone or address
      if (seenPhones.has(normalizedPhone) || seenAddresses.has(normalizedAddress)) {
        filteredCount++;
        filterLog.push({ name, reason: "Duplicate (same phone or address)" });
        continue;
      }

      seenPhones.add(normalizedPhone);
      seenAddresses.add(normalizedAddress);

      const website = place.websiteUri || "";
      const placeId = place.id;
      const rating = place.rating || 0;

      let qualityFlag = "";
      if (rating === 5.0 && reviewCount < 10) {
        qualityFlag = "[Low-Review-High-Rating] ";
      }
      
      // Google places doesn't return emails, we use a placeholder that clearly indicates pending enrichment
      const placeholderEmail = `pending_enrichment_${placeId}@pakaiverse.local`;

      await db.insert(leads).values({
        name: name,
        email: placeholderEmail,
        phone: phone,
        projectType: category,
        message: `${qualityFlag}Found via Prospector. Address: ${address}. Website: ${website}. Rating: ${rating} (${reviewCount} reviews)`,
        source: "prospector",
        status: "new",
      });

      insertedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      count: insertedCount, 
      filtered: filteredCount,
      total_found: places.length,
      filter_log: filterLog,  // So admin can see exactly what was dropped and why
    });

  } catch (error: unknown) {
    console.error("Prospector API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
