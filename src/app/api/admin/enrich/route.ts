import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { inArray } from "drizzle-orm";
import { auth } from "@/auth";

// Basic HTML parsing without heavy dependencies like cheerio
function extractEmails(html: string): string[] {
  // Regex to extract valid emails
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = html.match(regex) || [];
  
  // Filter out dummy/placeholder emails
  const blacklist = ["example", "sentry", "wixpress", "domain.com", "yourdomain", "test"];
  
  return matches.filter(email => {
    const lower = email.toLowerCase();
    // Exclude emails ending with common image extensions or containing blacklisted words
    if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".gif")) return false;
    if (blacklist.some(word => lower.includes(word))) return false;
    return true;
  });
}

// Timeout wrapper for fetch
async function fetchWithTimeout(url: string, timeoutMs: number = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { leadIds } = await req.json();

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ success: false, error: "leadIds required" }, { status: 400 });
    }

    const targets = await db.select().from(leads).where(inArray(leads.id, leadIds));

    const results = [];
    
    for (const lead of targets) {
      if (!lead.websiteUrl) {
        results.push({ id: lead.id, status: "failed", reason: "No websiteUrl provided" });
        continue;
      }

      let url = lead.websiteUrl;
      if (!url.startsWith("http")) {
        url = `https://${url}`;
      }

      try {
        let html = "";
        try {
          const res = await fetchWithTimeout(url, 8000);
          html = await res.text();
        } catch (e) {
          // Ignore homepage fetch error and try /contact later if needed
          console.warn(`Failed to fetch ${url}`, e);
        }

        let emails = extractEmails(html);

        // If no emails found on homepage, try /contact
        if (emails.length === 0) {
          try {
            const contactUrl = url.endsWith("/") ? `${url}contact` : `${url}/contact`;
            const contactRes = await fetchWithTimeout(contactUrl, 8000);
            if (contactRes.ok) {
              const contactHtml = await contactRes.text();
              emails = extractEmails(contactHtml);
            }
          } catch (e) {
             console.warn(`Failed to fetch /contact for ${url}`, e);
          }
        }

        if (emails.length > 0) {
          // Take the first valid email
          const firstEmail = emails[0];
          await db.update(leads)
            .set({ email: firstEmail, status: "enriched" })
            .where(inArray(leads.id, [lead.id])); // using inArray since eq might need import
            
          results.push({ id: lead.id, status: "enriched", email: firstEmail });
        } else {
          // No email found
          const newMessage = lead.message ? `${lead.message}\n[No contact found via scraping]` : "[No contact found via scraping]";
          await db.update(leads)
            .set({ message: newMessage })
            .where(inArray(leads.id, [lead.id]));
            
          results.push({ id: lead.id, status: "no_contact_found" });
        }
      } catch (error) {
        results.push({ id: lead.id, status: "error", reason: String(error) });
      }

      // 1-second delay between iterations to prevent overwhelming servers or getting blocked
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ success: true, results });

  } catch (error: unknown) {
    console.error("Enrichment error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
