import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { location, category, radius = 2500, websiteStatus = "any", openNow = false } = await req.json();

    if (!location || !category) {
      return NextResponse.json({ success: false, error: "location and category are required" }, { status: 400 });
    }

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

    const searchQuery = `${category} in ${location}`;

    // Build the request body for Google Places Text Search API
    const requestBody: Record<string, unknown> = {
      textQuery: searchQuery,
      languageCode: "en",
      maxResultCount: 20,
      locationBias: {
        circle: {
          // We pass radius as a location bias around the queried location.
          // Google Places resolves the text query center — no lat/lng needed.
          radius: Number(radius),
        },
      },
    };

    if (openNow) {
      requestBody.openNow = true;
    }

    // Field masking: only request fields we actually use (keeps billing in Basic tier)
    const fieldMask = [
      "places.displayName",
      "places.websiteUri",
      "places.internationalPhoneNumber",
      "places.formattedAddress",
      "places.businessStatus",
      "places.rating",
      "places.userRatingCount",
      "places.id",
    ].join(",");

    console.log("[Prospector] Request →", JSON.stringify({ searchQuery, radius, websiteStatus, openNow, fieldMask }));

    // Call Google Places Text Search API
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API Error:", data);
      return NextResponse.json({ success: false, error: "Failed to fetch from Google Places API", details: data }, { status: 500 });
    }

    const places = data.places || [];

    if (places.length === 0) {
      return NextResponse.json({ success: true, count: 0, total_found: 0, filtered: 0, message: "No places found for this search." });
    }

    let insertedCount = 0;
    let filteredCount = 0;
    const filterLog: { name: string; reason: string }[] = [];
    const seenPhones = new Set<string>();
    const seenAddresses = new Set<string>();

    for (const place of places) {
      const name = place.displayName?.text || "Unknown Business";
      const website = place.websiteUri || "";

      // -------------------------------------------------------
      // FILTER: Website Status (3-way)
      // -------------------------------------------------------
      if (websiteStatus === "no_website" && website) {
        filteredCount++;
        filterLog.push({ name, reason: "Has website (excluded by No Website filter)" });
        continue;
      }
      if (websiteStatus === "has_website" && !website) {
        filteredCount++;
        filterLog.push({ name, reason: "No website (excluded by Has Website filter)" });
        continue;
      }

      // Filter: Must be operational
      if (place.businessStatus !== "OPERATIONAL") {
        filteredCount++;
        filterLog.push({ name, reason: `Not operational (${place.businessStatus})` });
        continue;
      }

      const reviewCount = place.userRatingCount || 0;
      
      // Filter: Min reviews threshold
      if (reviewCount < minReviewsThreshold) {
        filteredCount++;
        filterLog.push({ name, reason: `Too few reviews (${reviewCount} < ${minReviewsThreshold})` });
        continue;
      }

      // Use internationalPhoneNumber (e.g. +1 512-555-0199) for cross-border searches
      const phone = place.internationalPhoneNumber || "";
      
      // Filter: Must have phone number
      if (!phone) {
        filteredCount++;
        filterLog.push({ name, reason: "No phone number" });
        continue;
      }

      const address = place.formattedAddress || "";
      const normalizedPhone = phone.replace(/\D/g, "");
      const normalizedAddress = address.toLowerCase().trim();

      // Filter: Deduplicate by phone or address
      if (seenPhones.has(normalizedPhone) || seenAddresses.has(normalizedAddress)) {
        filteredCount++;
        filterLog.push({ name, reason: "Duplicate (same phone or address)" });
        continue;
      }

      seenPhones.add(normalizedPhone);
      seenAddresses.add(normalizedAddress);

      const placeId = place.id;
      const rating = place.rating || 0;

      let qualityFlag = "";
      if (rating === 5.0 && reviewCount < 10) {
        qualityFlag = "[Low-Review-High-Rating] ";
      }
      
      // Google places doesn't return emails — placeholder for enrichment
      const placeholderEmail = `pending_enrichment_${placeId}@pakaiverse.local`;

      await db.insert(leads).values({
        name: name,
        email: placeholderEmail,
        phone: phone,
        projectType: category,
        message: `${qualityFlag}Found via Prospector. Location: ${location}. Address: ${address}. Rating: ${rating} (${reviewCount} reviews). Website: ${website || "none"}`,
        websiteUrl: website,
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
      filter_log: filterLog,
    });

  } catch (error: unknown) {
    console.error("Prospector API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
