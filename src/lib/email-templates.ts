import jwt from "jsonwebtoken";

export const getBaseEmailTemplate = ({
  content,
  companyName,
  leadId,
  ctaText = "Let's Talk",
  ctaLink = "https://calendly.com/pakaiverse",
}: {
  content: string;
  companyName: string;
  leadId?: string;
  ctaText?: string;
  ctaLink?: string;
}) => {
  const appUrl = process.env.APP_URL || "https://pakaiverse.com";
  const companyAddress = "PakAiVerse, Office #13-C, Mezzanine Floor, Lane 5, Bukhari Commercial, DHA Phase 6, Karachi, Pakistan";
  const jwtSecret = process.env.JWT_SECRET || "fallback_jwt_secret";

  // Generate secure 30-day JWT for unsubscription
  let unsubscribeToken = "preview_mode";
  if (leadId) {
    unsubscribeToken = jwt.sign({ lead_id: leadId }, jwtSecret, { expiresIn: "30d" });
  }
  const unsubscribeUrl = `${appUrl}/unsubscribe?token=${unsubscribeToken}`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PakAiVerse</title>
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #111827; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f9fafb; padding: 40px 0; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; }
    .header { padding: 30px; text-align: center; background-color: #0A0A0F; border-bottom: 3px solid #00F0FF; }
    .header img { max-width: 160px; display: block; margin: 0 auto; }
    .content { padding: 40px 40px 20px 40px; font-size: 16px; line-height: 1.6; color: #374151; }
    .content p { margin: 0 0 16px 0; }
    .content a { color: #0088cc; text-decoration: none; }
    .cta-container { padding: 10px 40px 40px 40px; text-align: left; }
    .cta-button { display: inline-block; background-color: #00F0FF; color: #0A0A0F; font-weight: 600; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-size: 16px; }
    .footer { padding: 30px 40px; text-align: left; font-size: 13px; color: #6b7280; background-color: #f3f4f6; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0 0 10px 0; line-height: 1.5; }
    .footer a { color: #6b7280; text-decoration: underline; }
    @media screen and (max-width: 600px) { 
      .main { border-radius: 0; border: none; } 
      .content { padding: 30px 20px 10px 20px; } 
      .cta-container { padding: 10px 20px 30px 20px; }
      .footer { padding: 30px 20px; }
    }
  </style>
</head>
<body>
  <center class="wrapper">
    <table class="main" width="100%">
      <tr>
        <td class="header">
          <a href="${appUrl}" target="_blank">
            <img src="${appUrl}/projects/Main-logo.png" alt="PakAiVerse">
          </a>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="cta-container">
          <table width="100%">
            <tr>
              <td>
                <a href="${ctaLink}" class="cta-button">${ctaText}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>
            You received this because we believe <strong>${companyName}</strong> could benefit from specialized web development services.
          </p>
          <p>
            <strong>PakAiVerse</strong><br>
            ${companyAddress}
          </p>
          <p style="margin-top: 20px;">
            <a href="${unsubscribeUrl}" target="_blank">Unsubscribe</a> | 
            <a href="${appUrl}/privacy" target="_blank">Privacy Policy</a>
          </p>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
};

/**
 * Standard outreach template
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
