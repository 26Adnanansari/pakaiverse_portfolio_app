import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await db.update(leads)
      .set({ status })
      .where(eq(leads.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { companyName, contactEmail, contactName, projectType, message } = await request.json();

    if (!companyName || !contactEmail) {
      return NextResponse.json({ success: false, error: "Company Name and Contact Email are required" }, { status: 400 });
    }

    await db.insert(leads).values({
      name: companyName,
      email: contactEmail,
      projectType: projectType || null,
      message: message ? `Contact: ${contactName || "Unknown"}\nNotes: ${message}` : `Contact: ${contactName || "Unknown"}`,
      source: "manual",
      status: "new",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating manual lead:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
