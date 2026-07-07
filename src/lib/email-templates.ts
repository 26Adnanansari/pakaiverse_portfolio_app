import jwt from "jsonwebtoken";

export const getBaseEmailTemplate = ({
  content,
  companyName,
  leadId,
}: {
  content: string;
  companyName: string;
  leadId?: string;
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
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; color: #374151; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f9fafb; padding-bottom: 60px; }
    .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .header { padding: 30px; text-align: center; background-color: #0A0A0F; }
    .header img { max-width: 180px; }
    .content { padding: 40px 30px; font-size: 16px; line-height: 1.6; color: #1f2937; }
    .content p { margin: 0 0 16px 0; }
    .footer { padding: 30px; text-align: center; font-size: 13px; color: #6b7280; background-color: #f3f4f6; border-top: 1px solid #e5e7eb; }
    .footer p { margin: 0 0 10px 0; line-height: 1.5; }
    .footer a { color: #6b7280; text-decoration: underline; }
    @media screen and (max-width: 600px) { .main { border-radius: 0; } .content { padding: 20px; } }
  </style>
</head>
<body>
  <center class="wrapper">
    <div style="padding-top: 40px;"></div>
    <table class="main" width="100%">
      <tr>
        <td class="header">
          <a href="${appUrl}" target="_blank">
            <img src="${appUrl}/projects/Main-logo.png" alt="PakAiVerse" style="display: block; margin: 0 auto;">
          </a>
        </td>
      </tr>
      <tr>
        <td class="content">
          ${content}
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>
            You received this because we believe <strong>${companyName}</strong> could benefit from AI-powered development services.
          </p>
          <p>${companyAddress}</p>
          <p>
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
