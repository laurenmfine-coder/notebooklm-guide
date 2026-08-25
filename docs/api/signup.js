// Vercel Serverless Function — study reminder signup.
// Served at  https://notebook.meded.studio/api/signup
//
// The signup box on the study page POSTs { email } here. This function adds the
// address to Resend and fires the "study.enrolled" event that starts the reminder
// + study-tips Automation. It stores ONLY the email — it never sees survey
// responses, so the reminder list stays separate from the Microsoft Forms data.
//
// IMPORTANT — Resend SDK error handling:
//   The Resend SDK does NOT throw on API errors. Every call resolves to
//   { data, error }. Wrapping these calls in try/catch therefore catches
//   nothing, and a failed signup would look like a success. Always inspect
//   the returned `error` field. (try/catch is still kept as a backstop for
//   network-level failures, which DO throw.)
//
// Duplicate protection:
//   The "study.enrolled" event starts a 224-day automation. Firing it twice for
//   the same person would run two overlapping copies of the whole sequence, so
//   we look the contact up first and only fire the event for genuinely new
//   contacts.
//
// CORS: this endpoint is called from more than one domain (notebook.meded.studio
// AND the GitHub Pages mirror at laurenmfine-coder.github.io), since GitHub Pages
// can't host this function itself. We allow a fixed list of our own origins.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY     - injected automatically by the Resend Vercel integration,
//                        or pasted in manually. (required)
//   RESEND_SEGMENT_ID  - optional. If set, new contacts are tagged with this Resend
//                        segment (e.g. "NSU MD Study Participants") so study sign-ups
//                        are grouped separately. Leave unset to just add them to the
//                        account's audience.

const { Resend } = require("resend");

const SEGMENT_ID = process.env.RESEND_SEGMENT_ID; // optional
const EVENT_NAME = "study.enrolled";

// Origins allowed to call this endpoint. Keep notebook.meded.studio and the
// GitHub Pages mirror in sync with wherever docs/study/index.html is served from.
const ALLOWED_ORIGINS = [
  "https://notebook.meded.studio",
  "https://www.meded.studio",
  "https://meded.studio",
  "https://laurenmfine-coder.github.io",
];

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;
  // Vercel preview deployments (*.vercel.app) are allowed so staging can be tested.
  const allowed =
    origin && (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin));
  if (allowed) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async (req, res) => {
  setCorsHeaders(req, res);

  // Preflight request (browsers send this automatically before a cross-origin POST).
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Not configured yet (API key missing) — fail clearly instead of crashing.
  if (!process.env.RESEND_API_KEY) {
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

  // 1) Is this person already on the list? If so, do NOT re-fire the event —
  //    that would start a second copy of the 224-day sequence on top of the
  //    one they're already in.
  let alreadyExists = false;
  try {
    const { data, error } = await resend.contacts.get({ email });
    if (data && data.id) {
      alreadyExists = true;
    } else if (error && !isNotFound(error)) {
      // A real lookup failure (bad key, outage). Don't guess — fail loudly.
      console.error("[signup] contact lookup failed", { email, error });
      return res.status(502).json({ ok: false, error: "Could not save your email. Please try again." });
    }
  } catch (err) {
    console.error("[signup] contact lookup threw", { email, err: String(err) });
    return res.status(502).json({ ok: false, error: "Could not save your email. Please try again." });
  }

  if (alreadyExists) {
    return res.status(200).json({ ok: true, alreadySubscribed: true });
  }

  // 2) Add the contact. Tag with the study segment if one is configured.
  const contact = { email, unsubscribed: false };
  if (SEGMENT_ID) contact.segments = [{ id: SEGMENT_ID }];
  try {
    const { error } = await resend.contacts.create(contact);
    if (error) {
      // Race: someone signed up twice in quick succession. Treat as success,
      // but don't fire the event a second time.
      if (/exist/i.test(String(error.message))) {
        return res.status(200).json({ ok: true, alreadySubscribed: true });
      }
      console.error("[signup] contact create failed", { email, error });
      return res.status(502).json({ ok: false, error: "Could not save your email. Please try again." });
    }
  } catch (err) {
    console.error("[signup] contact create threw", { email, err: String(err) });
    return res.status(502).json({ ok: false, error: "Could not save your email. Please try again." });
  }

  // 3) Fire the custom event that starts the Automation. The contact is already
  //    saved at this point, so a failure here means they are on the list but
  //    will receive nothing — that needs to be loud, and worth one retry.
  const eventOk = await sendEnrollmentEvent(resend, email);
  if (!eventOk) {
    // ALERT: search Vercel logs for "[signup] ENROLLMENT EVENT FAILED" to find
    // anyone who needs to be re-enrolled into the automation by hand.
    console.error("[signup] ENROLLMENT EVENT FAILED — contact saved but automation not started", { email });
    return res.status(200).json({ ok: true, automationStarted: false });
  }

  return res.status(200).json({ ok: true, automationStarted: true });
};

function isNotFound(error) {
  const name = String(error && error.name);
  const status = Number(error && error.statusCode);
  return status === 404 || /not_found|not found/i.test(name) || /not found/i.test(String(error && error.message));
}

async function sendEnrollmentEvent(resend, email) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const { error } = await resend.events.send({ event: EVENT_NAME, email });
      if (!error) return true;
      console.error("[signup] event send failed", { email, attempt, error });
    } catch (err) {
      console.error("[signup] event send threw", { email, attempt, err: String(err) });
    }
    if (attempt === 1) await new Promise((r) => setTimeout(r, 400));
  }
  return false;
}
