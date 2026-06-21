import { NextResponse } from "next/server";
import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";


export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Save order to database
    const newOrder = await db.insert(guest_post_orders).values({
      clientName: data.clientName,
      email: data.email,
      phone: data.phone,
      packageName: data.packageName,
      websiteUrl: data.websiteUrl,
      targetKeyword: data.targetKeyword,
    }).returning();
    
    // Return redirect to checkout page
    return NextResponse.json({
      success: true,
      orderId: newOrder[0].id,
      checkoutUrl: `/checkout/${newOrder[0].id}`,
    });
  } catch (error) {
    console.error("Failed to save order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
