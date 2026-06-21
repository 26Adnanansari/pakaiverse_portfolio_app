import { NextResponse } from "next/server";
import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { orderId, paymentProofUrl } = await req.json();

    if (!orderId || !paymentProofUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Update order with payment proof
    await db.update(guest_post_orders)
      .set({ 
        paymentProofUrl,
        paymentStatus: "Under Review",
      })
      .where(eq(guest_post_orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update payment proof:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update payment proof" },
      { status: 500 }
    );
  }
}
