import { NextResponse } from "next/server";
import { db } from "@/db";
import { guest_post_orders } from "@/db/schema";
import { PORTFOLIO } from "@/config/portfolio";

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
    
    // Generate WhatsApp redirect URL
    const whatsappMsg = encodeURIComponent(
      `*New Guest Post Order! 🚀*\n\n` +
      `*Package:* ${data.packageName}\n` +
      `*Name:* ${data.clientName}\n` +
      `*Email:* ${data.email}\n` +
      `*Phone:* ${data.phone}\n` +
      `*Website:* ${data.websiteUrl}\n` +
      `*Keyword:* ${data.targetKeyword}\n\n` +
      `Please provide the payment details to start the project.`
    );
    
    const waNumber = PORTFOLIO.whatsapp.replace(/[^0-9]/g, "");
    
    return NextResponse.json({
      success: true,
      orderId: newOrder[0].id,
      whatsappUrl: `https://wa.me/${waNumber}?text=${whatsappMsg}`,
    });
  } catch (error) {
    console.error("Failed to save order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order" },
      { status: 500 }
    );
  }
}
