import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export default async function UnsubscribePage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Invalid Link</h1>
          <p className="text-slate-400">The unsubscribe link is missing or malformed.</p>
        </div>
      </div>
    );
  }

  try {
    const jwtSecret = process.env.WEBHOOK_SECRET || "default_jwt_secret";
    const decoded = jwt.verify(token, jwtSecret) as { lead_id: number };

    if (!decoded.lead_id) {
      throw new Error("Invalid payload");
    }

    // Mark as suppressed
    await db.update(leads)
      .set({ suppressList: true, status: "rejected" })
      .where(eq(leads.id, decoded.lead_id));

    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4 bg-[#111118] border border-white/10 p-8 rounded-xl">
          <h1 className="text-2xl font-bold text-green-400">Successfully Unsubscribed</h1>
          <p className="text-slate-400">
            You have been removed from our mailing list and will not receive any further emails.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Error</h1>
          <p className="text-slate-400">This unsubscribe link has expired or is invalid.</p>
        </div>
      </div>
    );
  }
}
