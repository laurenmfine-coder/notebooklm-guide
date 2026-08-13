# NSU MD Research Study — Email Reminders & Tips

**Status: Live.** Deployed to Vercel, Resend Automation built and running,
triggered off the `study.enrolled` custom event fired by
`docs/api/signup.js` when someone submits the form on the study page.

19 ready-to-use HTML email templates: 5 survey reminders + 14 weekly tips,
built from the drafts in `Website_Update_Plan_Notebook_2.docx`. All delays
are relative to each participant's own sign-up date, not a fixed calendar
date — so someone who signs up today and someone who signs up next week
each get their Week 8 email 56 days after *their own* sign-up.

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

## Live architecture (as deployed)

- **Sign-up form:** `docs/study/index.html` — posts `{ email }` to `/api/signup`
- **API:** `docs/api/signup.js` — Vercel serverless function. Adds the contact to Resend, then fires the `study.enrolled` event.
- **Automation:** built in the Resend dashboard, triggered by `study.enrolled`, with delay + send-email steps following the schedule below.
- **Hosting:** Vercel project, deployed at `notebook.meded.studio` (and the `meded.studio` root hub in `hub/index.html`).

## Setup steps — now complete ✅

These are kept here as a record of what was done, since the system is now live:

1. ✅ Resend account, domain verified, API key generated (stored as `RESEND_API_KEY` in Vercel env vars).
2. ✅ `study.enrolled` event wired as the Automation trigger (via the Vercel function, not a plain "contact added to audience" trigger — this is more flexible since it also lets the same event later carry survey-completion data if we build that in).
3. ✅ 19 templates created in Resend, matching the files in `rendered/`.
4. ✅ Automation built with delay + send-email steps following the schedule above, and turned on.
5. ✅ Sign-up form on `docs/study/index.html` wired to `/api/signup`, deployed on Vercel.

**Still worth double-checking:** that the delay values actually configured in the Resend Automation match the schedule table above exactly (56/112/168/224 days for reminders, and the tip-email days). If any of those differ from what's here, let me know and I'll update this table to match reality rather than the other way around.

## Note on the reminder-vs-signup-completion distinction

Right now every email (including survey reminders) is scheduled relative to
**signup for the reminder list**, not relative to actually completing each
survey. This matches the relative-delay behavior you wanted and is the
simplest version to launch. If later you'd rather trigger, say, the Week 8
reminder off of actually completing the Week 0 survey (rather than a fixed
56 days after signup), that needs a webhook from Microsoft Forms into
Resend, which is a bigger lift, happy to help set that up if you want it.
