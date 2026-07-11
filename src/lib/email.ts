import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER || "hello@pakaiverse.com";

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `PakAiVerse <${fromEmail}>`,
          to,
          subject,
          reply_to: "replies@replies.pakaiverse.com",
          html,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        console.warn(`Resend Error: ${res.status}`, errorData);
        throw new Error("Resend failed, trying fallback");
      }

      return await res.json();
    } catch (error) {
      console.warn("Falling back to SMTP due to Resend failure:", error);
    }
  }

  // Fallback to nodemailer (Gmail / SMTP)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error("Failed to send email: No Resend API key and no SMTP credentials configured.");
    return { success: false, error: "Missing email credentials" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"PakAiVerse" <${fromEmail}>`,
      to,
      subject,
      replyTo: "replies@replies.pakaiverse.com",
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("SMTP sending failed:", error);
    return { success: false, error: String(error) };
  }
}
