// Vercel Serverless Function — study reminder signup.
// Served at  https://notebook.meded.studio/api/signup
//
// The signup box on the study page POSTs { email } here. This function adds the
// address to the Resend Audience and fires the "study.enrolled" event that starts
// the reminder + weekly-tips Automation. It stores ONLY the email — it never sees
// survey responses, so the reminder list stays separate from the Microsoft Forms data.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      - injected automatically by the Resend Vercel integration,
//                         or pasted in manually.
//   RESEND_AUDIENCE_ID  - id of the "NSU MD Study Participants" audience.

const { Resend } = require("resend");

const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const EVENT_NAME = "study.enrolled";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Not configured yet (env vars missing) — fail clearly instead of crashing.
  if (!process.env.RESEND_API_KEY || !AUDIENCE_ID) {
    return res.status(503).json({ ok: false, error: "Email signup isn't switched on yet." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : (req.body || {});

  // Honeypot: real users leave "website" empty; bots fill it.
  if (body.website) {
    return res.status(200).json({ ok: true });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // 1) Add (or upsert) the contact into the study audience.
  try {
    await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
  } catch (err) {
    if (!/exist/i.test(String(err && err.message))) {
      console.error("contact create failed", err);
      return res.status(502).json({ ok: false, error: "Could not save your email. Please try again." });
    }
  }

  // 2) Fire the custom event that starts the Automation.
  try {
    await resend.events.send({ event: EVENT_NAME, email });
  } catch (err) {
    console.error("event send failed", err); // contact is saved; don't block the user
  }

  return res.status(200).json({ ok: true });
};
