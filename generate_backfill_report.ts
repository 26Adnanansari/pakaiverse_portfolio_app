import { db } from "./src/db";
import { leads } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function generateBackfillReport() {
  console.log("Generating Backfill Report...");

  const allLeads = await db.select().from(leads);
  
  let websiteSourceCount = 0;
  
  let suggestedChatbot = 0;
  let suggestedContactForm = 0;
  let suggestedProspector = 0;
  let ambiguous = 0;

  for (const lead of allLeads) {
    if (lead.source === "website") {
      websiteSourceCount++;
      let newSource = "prospector (ambiguous/default)";
      
      // Analyze fields to guess
      if (lead.budget && lead.budget !== "N/A" && lead.projectType) {
         // Chatbot usually captures budget
         newSource = "chatbot";
         suggestedChatbot++;
      } else if (lead.message && lead.message.includes("Found via Prospector")) {
         newSource = "prospector";
         suggestedProspector++;
      } else if (lead.message && lead.message.length > 5 && !lead.message.includes("Found via Prospector")) {
         newSource = "contact-form";
         suggestedContactForm++;
      } else {
         ambiguous++;
      }
      
      console.log(`Lead ID: ${lead.id} | Name: ${lead.name} | Email: ${lead.email}`);
      console.log(`  -> Current Source: ${lead.source}`);
      console.log(`  -> Suggested New Source: ${newSource}\n`);
    }
  }

  console.log("=========================================");
  console.log(`Total Leads with 'website' source: ${websiteSourceCount}`);
  console.log(`- Suggested Chatbot: ${suggestedChatbot}`);
  console.log(`- Suggested Contact Form: ${suggestedContactForm}`);
  console.log(`- Identified Prospector (via message): ${suggestedProspector}`);
  console.log(`- Ambiguous (defaulting to Prospector): ${ambiguous}`);
  console.log("=========================================");
}

generateBackfillReport().catch(console.error);
