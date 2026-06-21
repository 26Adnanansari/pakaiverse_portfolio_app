import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Missing key or value" }, { status: 400 });
    }

    // Upsert logic using standard insert ON CONFLICT
    await db.insert(settings)
      .values({ id: key, value })
      .onConflictDoUpdate({
        target: settings.id,
        set: { value, updatedAt: new Date() }
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
