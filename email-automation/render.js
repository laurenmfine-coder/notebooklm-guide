const fs = require("fs");
const path = require("path");
const { renderLayout } = require("./layout");
const { reminders, tips } = require("./data/emails");

const outDir = path.join(__dirname, "rendered");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writeEmail(email) {
  const html = renderLayout({
    preheader: email.preheader,
    eyebrow: email.eyebrow,
    heading: email.heading,
    bodyHtml: email.bodyHtml,
    ctaText: email.ctaText,
    ctaLink: email.ctaLink,
  });
  const filePath = path.join(outDir, `${email.id}.html`);
  fs.writeFileSync(filePath, html, "utf8");
  return filePath;
}

let count = 0;
[...reminders, ...tips].forEach((email) => {
  writeEmail(email);
  count++;
});

console.log(`Rendered ${count} email templates to ${outDir}`);
