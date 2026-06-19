import { NextResponse } from "next/server";
import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, paymentStatus, orderStatus } = data;

    if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

    const updateData: Record<string, string | Date | null> = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (orderStatus) updateData.orderStatus = orderStatus;

    if (orderStatus === "Active") {
      updateData.startDate = new Date();
      // Assume 1 year expiration by default for guest posts, or permanent
      // We will leave it null for permanent, or set 1 year
    }

    await db.update(guest_post_orders)
      .set(updateData)
      .where(eq(guest_post_orders.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}
