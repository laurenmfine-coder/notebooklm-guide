// Shared layout wrapper for all study emails.
// Uses table-based, inline-styled HTML for maximum email client compatibility
// (Outlook/Gmail strip <style> blocks and web fonts unreliably, so we keep it simple).
// Brand colors match docs/styles.css: sage-600 (#4a5c4a), sky-600 (#3d7199), stone-800 (#292524).

function renderButton(text, url) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td style="background-color:#3d7199; border-radius:100px;">
        <a href="${url}" style="display:inline-block; padding:14px 28px; font-family:Georgia, 'Times New Roman', serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:100px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function renderLayout({ preheader, eyebrow, heading, bodyHtml, ctaText, ctaLink }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${heading}</title>
</head>
<body style="margin:0; padding:0; background-color:#fafaf9; font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${preheader || ''}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafaf9;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px; text-align:center;">
              <span style="font-family:Georgia, 'Times New Roman', serif; font-size:16px; font-weight:bold; color:#292524; letter-spacing:-0.01em;">Gemini Notebook Guide</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#ffffff; border:1px solid #e7e5e4; border-radius:14px; padding:36px 32px;">

              ${eyebrow ? `<div style="font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; font-weight:bold; color:#4a5c4a; text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px;">${eyebrow}</div>` : ''}

              <h1 style="font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:bold; color:#292524; margin:0 0 18px; letter-spacing:-0.01em;">${heading}</h1>

              <div style="font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:15px; line-height:1.65; color:#44403c;">
                ${bodyHtml}
              </div>

              ${ctaText && ctaLink ? renderButton(ctaText, ctaLink) : ''}

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 8px; text-align:center;">
              <p style="font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; color:#78716c; margin:0 0 6px;">NSU MD Research Study &middot; Gemini Notebook Guide</p>
              <p style="font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; color:#a8a29e; margin:0 0 6px;">This reminder list is separate from your survey responses. Your email is never linked to your answers.</p>
              <p style="font-family:-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif; font-size:12px; color:#a8a29e; margin:0;"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#a8a29e;">Unsubscribe</a> from these emails at any time.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { renderLayout };
