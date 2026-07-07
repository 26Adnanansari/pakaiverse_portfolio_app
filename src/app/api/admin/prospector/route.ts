import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

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

    const searchQuery = `${category} in ${city ? city + ", " : ""}${country}`;

    // Call Google Places Text Search API (New)
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.websiteUri,places.nationalPhoneNumber,places.id"
      },
      body: JSON.stringify({
        textQuery: searchQuery,
        languageCode: "en",
        maxResultCount: 5, // Limiting to 5 for test
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

    for (const place of places) {
      const name = place.displayName?.text || "Unknown Business";
      const address = place.formattedAddress || "";
      const phone = place.nationalPhoneNumber || "";
      const website = place.websiteUri || "";
      const placeId = place.id;
      
      // Google places doesn't return emails, we use a placeholder that clearly indicates pending enrichment
      const placeholderEmail = `pending_enrichment_${placeId}@pakaiverse.local`;

      await db.insert(leads).values({
        name: name,
        email: placeholderEmail,
        phone: phone,
        projectType: category,
        message: `Found via Prospector. Address: ${address}. Website: ${website}`,
        source: "prospector",
        status: "new",
      });

      insertedCount++;
    }

    return NextResponse.json({ success: true, count: insertedCount });

  } catch (error: unknown) {
    console.error("Prospector API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
