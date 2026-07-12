import jwt from "jsonwebtoken";

export const getBaseEmailTemplate = ({
  content,
  companyName,
  leadId,
  ctaText = "Book a quick call",
  ctaLink = "https://calendly.com/pakaiverse",
}: {
  content: string;
  companyName: string;
  leadId?: string;
  ctaText?: string;
  ctaLink?: string;
}) => {
  const appUrl = process.env.APP_URL || "https://pakaiverse.com";
  const companyAddress = "PakAiVerse, DHA Phase 6, Karachi, Pakistan";
  const jwtSecret = process.env.JWT_SECRET || "fallback_jwt_secret";

  let unsubscribeToken = "preview_mode";
  if (leadId) {
    unsubscribeToken = jwt.sign({ lead_id: leadId }, jwtSecret, { expiresIn: "30d" });
  }
  const unsubscribeUrl = `${appUrl}/unsubscribe?token=${unsubscribeToken}`;

  // Plain, text-heavy template — avoids Gmail Promotions tab.
  // No logo image, no coloured banner, no big graphic CTA button.
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Message from PakAiVerse</title>
  <style>
    body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; color: #1a1a1a; font-size: 16px; line-height: 1.65; }
    .container { max-width: 560px; margin: 0 auto; }
    p { margin: 0 0 18px 0; }
    a { color: #0066cc; }
    .cta-link { display: inline-block; color: #0066cc; font-weight: 500; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 28px 0; }
    .footer { font-size: 12px; color: #9ca3af; line-height: 1.5; }
    .footer a { color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    ${content}
    <p style="margin-top: 24px;">
      <a href="${ctaLink}" class="cta-link">${ctaText} &rarr;</a>
    </p>
    <hr class="divider">
    <div class="footer">
      <p>${companyName} &middot; ${companyAddress}</p>
      <p>
        <a href="${unsubscribeUrl}">Unsubscribe</a> &nbsp;&middot;&nbsp;
        <a href="${appUrl}/privacy">Privacy Policy</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Standard outreach template — wraps AI-generated body text
 */
export const getOutreachEmailHtml = ({
  leadName,
  bodyText,
  companyName,
  leadId,
}: {
  leadName: string;
  bodyText: string;
  companyName: string;
  leadId?: string;
}) => {
  const formattedBody = bodyText
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");

  const content = `
    <p>Hi ${leadName},</p>
    ${formattedBody}
  `;

  return getBaseEmailTemplate({ content, companyName, leadId });
};

export const getAdminSummaryTemplate = ({
  sentCount,
  followUpScheduledCount,
  errors,
  aiFailedCount,
}: {
  sentCount: number;
  followUpScheduledCount: number;
  errors: { id: number; error: string }[];
  aiFailedCount: number;
}) => {
  return `
    <h2>Daily Outreach Summary</h2>
    <p><strong>Total Sent:</strong> ${sentCount}</p>
    <p><strong>Follow-ups Scheduled:</strong> ${followUpScheduledCount}</p>
    <p><strong>Failures:</strong> ${errors.length}</p>
    <p><strong>AI Drafts Failed (Need Manual Retry):</strong> <span style="color:red; font-weight:bold;">${aiFailedCount}</span></p>
    ${errors.length > 0 ? `<p><strong>Error Details:</strong></p><ul>${errors.map(e => `<li>Task ID ${e.id}: ${e.error}</li>`).join("")}</ul>` : ""}
  `;
};
