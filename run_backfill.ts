import { db } from "./src/db";
import { leads } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function runBackfill() {
  console.log("Running DB Backfill...");

  const allLeads = await db.select().from(leads);

  for (const lead of allLeads) {
    if (lead.source === "website") {
      let newSource = "prospector"; // default
      
      if (lead.budget && lead.budget !== "N/A" && lead.projectType) {
         newSource = "chatbot";
      } else if (lead.message && lead.message.includes("Found via Prospector")) {
         newSource = "prospector";
      } else if (lead.message && lead.message.length > 5 && !lead.message.includes("Found via Prospector")) {
         newSource = "contact-form";
      }
      
      console.log(`Updating Lead ${lead.id} to source: ${newSource}`);
      await db.update(leads).set({ source: newSource }).where(eq(leads.id, lead.id));
    }
  }

  console.log("Backfill complete.");
}

runBackfill().catch(console.error);
