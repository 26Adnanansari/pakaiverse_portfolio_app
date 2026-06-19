import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { PORTFOLIO } from "@/config/portfolio";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // 1. Save to database
    const newLead = await db.insert(leads).values({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      projectType: data.type || data.projectType,
      budget: data.budget || null,
      message: data.message,
      source: "website",
    }).returning();
    
    // 2. WhatsApp redirect URL
    const whatsappMsg = encodeURIComponent(
      `*New Lead from PakAiVerse Website*\n\n` +
      `*Name:* ${data.name}\n` +
      `*Email:* ${data.email}\n` +
      `*Project:* ${data.type || data.projectType}\n\n` +
      `*Message:*\n${data.message}`
    );
    
    // Clean up whatsapp number from PORTFOLIO or use default
    const waNumber = PORTFOLIO.whatsapp.replace(/[^0-9]/g, "");
    
    return NextResponse.json({
      success: true,
      leadId: newLead[0].id,
      whatsappUrl: `https://wa.me/${waNumber}?text=${whatsappMsg}`,
    });
  } catch (error) {
    console.error("Failed to save lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
