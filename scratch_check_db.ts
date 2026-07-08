import { db } from "./src/db";
import { emailQueue, leads } from "./src/db/schema";
import { desc } from "drizzle-orm";

async function check() {
  console.log("Checking leads (last 5)...");
  const l = await db.select({ id: leads.id, name: leads.name, email: leads.email, status: leads.status }).from(leads).orderBy(desc(leads.createdAt)).limit(5);
  console.log(l);
}
check().catch(console.error).then(() => process.exit(0));
