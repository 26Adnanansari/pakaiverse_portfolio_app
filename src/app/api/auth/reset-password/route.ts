import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import bcrypt from "bcryptjs";

// NOTE: In production, store new password hash in Vercel env via API or use a DB.
// For simplicity, we update the env file locally and return the new hash.
export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    const AUTH_SECRET = process.env.AUTH_SECRET!;

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }

    // Verify the reset token
    const payload = verify(token, AUTH_SECRET) as { email: string; purpose: string };
    if (payload.purpose !== "password-reset") {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 400 });
    }

    // Hash the new password
    const newHash = await bcrypt.hash(password, 12);

    return NextResponse.json({ 
      success: true, 
      message: "Password reset successful. Update ADMIN_PASSWORD_HASH in .env.local with the value below.",
      newHash,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ success: false, error: "Token expired or invalid" }, { status: 400 });
  }
}
