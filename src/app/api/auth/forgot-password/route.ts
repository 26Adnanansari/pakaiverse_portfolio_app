import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
    const AUTH_SECRET = process.env.AUTH_SECRET!;

    if (email !== ADMIN_EMAIL) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate a reset token valid for 1 hour
    const token = sign({ email, purpose: "password-reset" }, AUTH_SECRET, { expiresIn: "1h" });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/admin/reset-password?token=${token}`;

    await sendEmail({
      to: ADMIN_EMAIL,
      subject: "PakAiVerse Admin — Password Reset",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#0a0a0f;color:#fff;border-radius:16px">
          <h2 style="color:#22c55e;margin-bottom:8px">PakAiVerse Admin</h2>
          <p style="color:#94a3b8">You requested a password reset. Click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#22c55e;color:#000;font-weight:700;border-radius:12px;text-decoration:none">
            Reset Password
          </a>
          <p style="color:#64748b;font-size:13px">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
