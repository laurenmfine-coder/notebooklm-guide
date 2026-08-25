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

| # | Email | Step delay in automation | Days from signup |
|---|---|---|---|
| 1 | Reminder — Week 0 (Welcome) | trigger | 0 |
| 2 | Tip 1 — Study guide | 15 days | 15 |
| 3 | Tip 2 — Flashcards | 15 days | 30 |
| 4 | Tip 3 — Match your learning style | 15 days | 45 |
| 5 | Reminder — Week 8 | 11 days | 56 |
| 6 | Tip 4 — Ask your notes questions | 4 days | 60 |
| 7 | Tip 5 — Active recall | 15 days | 75 |
| 8 | Tip 6 — Combine multiple sources | 15 days | 90 |
| 9 | Tip 7 — Connect concepts across blocks | 15 days | 105 |
| 10 | Reminder — Week 16 | 7 days | 112 |
| 11 | Tip 8 — Rapid review sheet | 8 days | 120 |
| 12 | Tip 9 — Learn on the go | 15 days | 135 |
| 13 | Tip 10 — Simulate exam questions | 15 days | 150 |
| 14 | Tip 11 — Feynman technique | 15 days | 165 |
| 15 | Reminder — Week 24 | 3 days | 168 |
| 16 | Tip 12 — Cumulative review notebook | 12 days | 180 |
| 17 | Tip 13 — Target your weak spots | 15 days | 195 |
| 18 | Tip 14 — Make it a keeper | 15 days | 210 |
| 19 | Reminder — Week 32 (Final) | 14 days | 224 |

Sorted by send order. The "step delay" column is the delay configured on each
step in the Resend Automation; delays are cumulative and add up to the "days
from signup" column.

**Survey reminders — fixed by protocol.** Days 0 / 56 / 112 / 168 / 224, matching
the Week 0/8/16/24/32 timepoints in the IRB submission. Do not change these.

**Tips — every 15 days, days 15 through 210.** The IRB protocol commits only to
"brief tips on what to try next" and specifies no frequency, so the cadence is a
design choice. 15 days spreads the 14 tips evenly across the full 32 weeks.

A 16-day spacing was considered first, but it lands tips on day 112 and day 224 —
the same days as the Week 16 and final survey reminders. Two emails on the final
survey day would compete with the one send that matters most for data collection,
so 15 days was used instead. It produces no collisions; the closest approach is
day 165 (Tip 11) against day 168 (Week 24 reminder).

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

**Delays verified.** The step delays configured in the live Resend Automation
were checked against the table above and match exactly. No change needed.

**Where the templates actually live.** The 19 templates are stored *in Resend*,
not in this repo. `rendered/` is the source of truth for the content, but editing
a file here and re-running `render.js` does **not** change what participants
receive — the corresponding template has to be updated in Resend as well.

**Editing a live automation.** Resend does not allow editing an enabled
automation; you have to duplicate it. In-flight runs keep executing the version
they started on, so changes only reach people who enroll after the new version
goes live.

## Note on the reminder-vs-signup-completion distinction

Right now every email (including survey reminders) is scheduled relative to
**signup for the reminder list**, not relative to actually completing each
survey. This matches the relative-delay behavior you wanted and is the
simplest version to launch. If later you'd rather trigger, say, the Week 8
reminder off of actually completing the Week 0 survey (rather than a fixed
56 days after signup), that needs a webhook from Microsoft Forms into
Resend, which is a bigger lift, happy to help set that up if you want it.

## Study closeout — required by the IRB protocol

The IRB submission commits, in four separate places, that the reminder email list
is **deleted at the end of the study**:

> "The email list is kept separate from all survey data, is never linked to survey
> responses or study codes, is not reviewed by the study team, and is deleted at
> the end of the study." — Procedures, step 5

> "The optional email reminder list is stored within the third-party email service
> (Loops or Resend), separate from all survey data, and is deleted at study closeout."

This is a commitment with a deadline, so it is written down here rather than left
to memory.

### Closeout checklist

1. Confirm the last enrolled participant has passed day 224 (their Week 32 survey).
2. Disable the "NSU MD Study — Reminders & Tips" automation in Resend so no further
   sends can trigger.
3. Delete every contact in the study segment from the Resend audience.
4. Confirm the audience shows zero remaining study contacts.
5. Record the date the deletion was completed, in case it is asked for at
   continuing review or closeout.

### Notes

- Rolling enrollment across two phases (fall MS2, winter MS1) means closeout is
  224 days after the *last* signup, not after the first.
- Unsubscribing is not deletion. A contact set to "Unsubscribed" stops receiving
  email but still exists in the audience, so it still has to be deleted at closeout.
- The protocol also states the list "is not reviewed by the study team." Routine
  administration is unavoidable; be deliberate about anything beyond that.
