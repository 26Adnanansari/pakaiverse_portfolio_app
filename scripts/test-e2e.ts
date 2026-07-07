import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "../src/db";
import { leads, emailQueue, replies } from "../src/db/schema";
import { eq, desc } from "drizzle-orm";
import { GET as cronHandler } from "../src/app/api/cron/daily/route";
import { POST as webhookHandler } from "../src/app/api/webhooks/resend/route";

async function runE2E() {
  console.log("🚀 Starting End-to-End Dummy Lead Test...");

  const testEmail = "test-e2e-pakaiverse@yopmail.com";

  // 1. Clean up old test data
  console.log("\n🧹 Cleaning up old test data...");
  const existingLead = await db.select().from(leads).where(eq(leads.email, testEmail));
  if (existingLead.length > 0) {
    await db.delete(emailQueue).where(eq(emailQueue.leadId, existingLead[0].id));
    await db.delete(replies).where(eq(replies.leadId, existingLead[0].id));
    await db.delete(leads).where(eq(leads.id, existingLead[0].id));
  }

  // 2. Insert Dummy Lead (Mocking Prospector -> Enrich)
  console.log("\n👤 1. Inserting Dummy Lead (Prospector + Enrich)...");
  const insertedLeads = await db.insert(leads).values({
    name: "John Doe (Test)",
    email: testEmail,
    projectType: "Web Development",
    source: "E2E_Test",
    status: "new"
  }).returning();
  
  const lead = insertedLeads[0];
  console.log(`✅ Lead Inserted: ID ${lead.id} - ${lead.email}`);

  // 3. Draft & Approve Email (Mocking 'Send to AI' + Approval)
  console.log("\n✉️  2. Queuing AI Drafted Email (Approval)...");
  const queuedEmails = await db.insert(emailQueue).values({
    leadId: lead.id,
    subject: "Web Development Services - Quick Question",
    body: "<p>Hi John,</p><p>We specialize in Next.js web apps and noticed you might need some help.</p><p>Are you open to a quick call?</p><p><a href='http://localhost:3000/unsubscribe?token=TEST'>Unsubscribe</a></p>",
    status: "pending",
    scheduledAt: new Date(Date.now() - 60000) // Scheduled 1 min ago
  }).returning();
  
  const queuedEmail = queuedEmails[0];
  console.log(`✅ Email Queued: ID ${queuedEmail.id} - Status: ${queuedEmail.status}`);

  // 4. Run Cron Job (Sending)
  console.log("\n⏱️  3. Running Cron Job (Sending & Suppress Check)...");
  // Mock Request for Next.js Route
  const cronReq = new Request("http://localhost/api/cron/daily", {
    headers: { "Authorization": `Bearer ${process.env.CRON_SECRET || ""}` }
  });
  const cronRes = await cronHandler(cronReq);
  const cronJson = await cronRes.json();
  console.log(`✅ Cron Job Response:`, cronJson);
  console.log(`✅ Cron Job Executed: Sent ${cronJson.sent} emails.`);
  if (cronJson.errors) console.error("Cron Errors:", cronJson.errors);

  // Check DB state after cron
  const updatedQueue = await db.select().from(emailQueue).where(eq(emailQueue.id, queuedEmail.id));
  const updatedLead = await db.select().from(leads).where(eq(leads.id, lead.id));
  console.log(`   - Queue Status: ${updatedQueue[0].status}`);
  console.log(`   - Lead Status: ${updatedLead[0].status}`);
  console.log(`   - Lead Follow-up Count: ${updatedLead[0].followUpCount}`);
  
  const followUpQueue = await db.select().from(emailQueue).where(eq(emailQueue.leadId, lead.id)).orderBy(desc(emailQueue.id));
  if (followUpQueue.length > 1) {
    console.log(`   - 📅 Follow-up scheduled successfully for: ${followUpQueue[0].scheduledAt}`);
  }

  // 5. Simulate Webhook (Reply)
  console.log("\n💬 4. Simulating Prospect Reply (Webhook)...");
  const webhookPayload = {
    type: "email.replied",
    data: {
      from: testEmail,
      text: "Yes, I am highly interested. Let's schedule a call tomorrow.",
      id: "msg_12345test"
    }
  };
  
  const webhookReq = new Request("http://localhost/api/webhooks/resend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload)
  });
  
  const webhookRes = await webhookHandler(webhookReq);
  const webhookJson = await webhookRes.json();
  console.log(`✅ Webhook Executed: Success? ${webhookJson.success}`);

  // Check DB state after webhook
  const savedReply = await db.select().from(replies).where(eq(replies.leadId, lead.id));
  console.log(`   - Reply Saved: "${savedReply[0].content}"`);
  console.log(`   - AI Sentiment Class: [${savedReply[0].sentiment}]`);
  console.log(`   - AI Drafted Response: "${savedReply[0].aiSuggestedResponse}"`);

  console.log("\n🎉 End-to-End Test Completed Successfully!");
  process.exit(0);
}

runE2E().catch(console.error);
