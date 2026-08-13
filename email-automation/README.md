# NSU MD Research Study — Email Reminders & Tips

19 ready-to-use HTML email templates: 5 survey reminders + 14 weekly tips,
built from the drafts in `Website_Update_Plan_Notebook_2.docx`. All delays
are relative to each participant's own sign-up date (the "Sign up for
reminders and tips" button on the study page), not a fixed calendar date —
so someone who signs up today and someone who signs up next week each get
their Week 8 email 56 days after *their own* sign-up.

## What's in this folder

- `data/emails.js` — all email content (subject, body, CTA, delay in days)
- `layout.js` — shared HTML wrapper matching the site's branding
- `render.js` — generates standalone `.html` files from the data
- `rendered/` — the 19 output files, one per email, ready to paste into Resend

Run `node render.js` any time you edit `data/emails.js` to regenerate the HTML.

## Send schedule

| Email | Trigger delay | Days from signup |
|---|---|---|
| Reminder — Week 0 (Welcome) | immediate | 0 |
| Tip 1 — Study guide | | 7 |
| Tip 2 — Flashcards | | 21 |
| Tip 3 — Match your learning style | | 35 |
| Tip 4 — Ask your notes questions | | 49 |
| Tip 5 — Active recall | | 63 |
| Reminder — Week 8 | | 56 |
| Tip 6 — Combine multiple sources | | 77 |
| Tip 7 — Connect concepts across blocks | | 91 |
| Tip 8 — Rapid review sheet | | 105 |
| Reminder — Week 16 | | 112 |
| Tip 9 — Learn on the go | | 126 |
| Tip 10 — Simulate exam questions | | 140 |
| Tip 11 — Feynman technique | | 161 |
| Reminder — Week 24 | | 168 |
| Tip 12 — Cumulative review notebook | | 189 |
| Tip 13 — Target your weak spots | | 210 |
| Tip 14 — Make it a keeper | | 217 |
| Reminder — Week 32 (Final) | | 224 |

*(Sorted by send order, not by category, so you can see the full cadence.)*

## Setting up in Resend — what I need from you at each step

**Step 1 — Account & domain**
1. Create a Resend account (or log in if you already have one).
2. Add and verify a sending domain (e.g. `updates.laurenfine.com` or similar — a subdomain keeps this separate from your main coaching email reputation). Resend gives you DNS records (TXT/CNAME) to add wherever your domain is hosted.
3. Once verified, generate an API key from **Settings → API Keys**.

👉 **What I need from you:** paste the API key here when you're ready to test sending. I won't store it in memory, just use it for the session.

**Step 2 — Audience / contact list**
1. In Resend, create an Audience (e.g. "NSU MD Study Participants").
2. This is what the "Sign up for reminders and tips" button on the study page will add people to.

👉 **What I need from you:** once the Audience exists, give me its Audience ID so I can wire up the sign-up form on the study page to actually submit to it (right now that button is a placeholder).

**Step 3 — Templates**
1. In Resend, go to **Templates** (or the Automations email-step editor) and create 19 templates.
2. For each one, copy the HTML from the matching file in `rendered/` and paste it into the template's HTML source.
3. Name each template to match its `id` (e.g. `reminder-week0`, `tip-01-study-guide`) so it's easy to reference when building the Automation.

👉 **What I need from you:** just confirm once these are created, or let me know if Resend's dashboard wants a different import format and I'll adjust the output.

**Step 4 — Automation**
1. Create a new Automation triggered by **Contact added to Audience** (the "NSU MD Study Participants" audience from Step 2).
2. Add a sequence of **Delay** steps and **Send Email** steps following the schedule table above — delay to the right number of days, then send the matching template.
3. Turn the Automation on.

👉 **What I need from you:** nothing extra here — this step is entirely inside the Resend dashboard. If you'd like, use Claude in Chrome for this part since it's live, logged-in dashboard work; I can talk you through the exact delay values as you go.

**Step 5 — Wire up the sign-up button**
Once you've got the Audience ID (Step 2), let me know and I'll update the "Sign up for reminders and tips" button on `docs/study/index.html` to actually submit to Resend instead of being a placeholder link.

## Note on the reminder-vs-signup-completion distinction

Right now every email (including survey reminders) is scheduled relative to
**signup for the reminder list**, not relative to actually completing each
survey. This matches the relative-delay behavior you wanted and is the
simplest version to launch. If later you'd rather trigger, say, the Week 8
reminder off of actually completing the Week 0 survey (rather than a fixed
56 days after signup), that needs a webhook from Microsoft Forms into
Resend, which is a bigger lift, happy to help set that up if you want it.
