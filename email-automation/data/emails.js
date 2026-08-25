// All content sourced from Website_Update_Plan_Notebook_2.docx, lightly formatted for HTML email.
// delayDays is relative to the "study.enrolled" event (when the participant signs up for
// reminders/tips on the study page) — NOT a calendar date. This is the Flodesk-style
// behavior: sign up today, get the Week 8 email in 56 days; sign up next week, get it
// 56 days from your own signup.

const STUDY_PAGE = "https://notebook.meded.studio/study/index.html";

// Survey links (same as docs/study/index.html)
const SURVEY_LINKS = {
  week0: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=MS0rLD4u8U21cfs3wEL_G42ta3mG12JHqWNuDxk7uWtUNkZJMkZGS1hQUk02NDM0V0lMWlBaR1AxWS4u",
  week8: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=MS0rLD4u8U21cfs3wEL_G42ta3mG12JHqWNuDxk7uWtUQ0pDTjBDQVVIREpMVDdMTFRaODVFNDlMUC4u",
  week16: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=MS0rLD4u8U21cfs3wEL_G42ta3mG12JHqWNuDxk7uWtUOUlBVkRZQzFRNTBYOUNEUFdBTlpFS0VPVy4u",
  week24: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=MS0rLD4u8U21cfs3wEL_G42ta3mG12JHqWNuDxk7uWtUOFRTWUtGNFc2WDI2TE1NMFFQOUZZVjBDMC4u",
  week32: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=MS0rLD4u8U21cfs3wEL_G42ta3mG12JHqWNuDxk7uWtUMU5KWk1XRVBWSjcwN1A4SlBUTU1QUDVYUi4u",
};

function promptBox(promptText) {
  return `<div style="background-color:#f6f7f6; border:1px solid #e3e7e3; border-radius:8px; padding:14px 18px; margin:16px 0; font-family:'Courier New', monospace; font-size:13.5px; color:#3d4a3d; line-height:1.5;">${promptText}</div>`;
}

const reminders = [
  {
    id: "reminder-week0",
    category: "reminder",
    weekLabel: "Week 0",
    delayDays: 0,
    eyebrow: "Survey Reminder \u00b7 Week 0",
    subject: "Welcome — start here with your enrollment survey",
    preheader: "Your enrollment survey takes about 10–15 minutes.",
    heading: "Welcome to the study!",
    bodyHtml: `
      <p>To get started, please complete your enrollment (Week 0) survey — it takes about 10–15 minutes.</p>
      <p>Once that's done, head to the study page to find out your learner type and start exploring Gemini Notebook.</p>
      <p>Questions? Just reply to this email.</p>
    `,
    ctaText: "Open enrollment survey",
    ctaLink: SURVEY_LINKS.week0,
  },
  {
    id: "reminder-week8",
    category: "reminder",
    weekLabel: "Week 8",
    delayDays: 56,
    eyebrow: "Survey Reminder \u00b7 Week 8",
    subject: "Time for your Week 8 check-in",
    preheader: "About 10–20 minutes — tell us how it's going.",
    heading: "It's been about 8 weeks",
    bodyHtml: `
      <p>Time for your next survey (about 10–20 minutes). This one asks how you've been using Gemini Notebook and which features have helped most.</p>
      <p>Thanks for staying with the study!</p>
    `,
    ctaText: "Open Week 8 survey",
    ctaLink: SURVEY_LINKS.week8,
  },
  {
    id: "reminder-week16",
    category: "reminder",
    weekLabel: "Week 16",
    delayDays: 112,
    eyebrow: "Survey Reminder \u00b7 Week 16",
    subject: "Your Week 16 survey is ready",
    preheader: "You're at the halfway point!",
    heading: "You're at the halfway point!",
    bodyHtml: `
      <p>Please take a few minutes for your Week 16 survey.</p>
      <p>Thanks for continuing to share your experience.</p>
    `,
    ctaText: "Open Week 16 survey",
    ctaLink: SURVEY_LINKS.week16,
  },
  {
    id: "reminder-week24",
    category: "reminder",
    weekLabel: "Week 24",
    delayDays: 168,
    eyebrow: "Survey Reminder \u00b7 Week 24",
    subject: "Week 24 check-in",
    preheader: "About 10 minutes — almost there!",
    heading: "Time for a quick check-in",
    bodyHtml: `
      <p>Your Week 24 survey is ready (about 10 minutes).</p>
      <p>Almost there!</p>
    `,
    ctaText: "Open Week 24 survey",
    ctaLink: SURVEY_LINKS.week24,
  },
  {
    id: "reminder-week32",
    category: "reminder",
    weekLabel: "Week 32 (Final)",
    delayDays: 224,
    eyebrow: "Survey Reminder \u00b7 Final",
    subject: "Last one — your final study survey",
    preheader: "Thank you for being part of this study for the full 32 weeks.",
    heading: "You've reached the final survey",
    bodyHtml: `
      <p>Thank you for being part of this study for the full 32 weeks! We'd love your reflections on the experience.</p>
    `,
    ctaText: "Open final survey",
    ctaLink: SURVEY_LINKS.week32,
  },
];

const tips = [
  {
    id: "tip-01-study-guide",
    order: 1,
    delayDays: 15,
    stage: "Foundations",
    subject: "Study tip: Turn your lecture notes into a study guide",
    preheader: "Start simple — organize a whole lecture in seconds.",
    heading: "Turn your lecture notes into a study guide",
    bodyHtml: `
      <p>Start simple. Upload a set of lecture notes or slides, then try the prompt below. In seconds you'll have an organized review sheet.</p>
      ${promptBox("Create a study guide from these notes focusing on the highest-yield concepts.")}
      <p>Try it with this week's material.</p>
    `,
  },
  {
    id: "tip-02-flashcards",
    order: 2,
    delayDays: 30,
    stage: "Foundations",
    subject: "Study tip: Instant flashcards",
    preheader: "Let Notebook do the heavy lifting.",
    heading: "Instant flashcards",
    bodyHtml: `
      <p>Spending hours making flashcards? Let Notebook do the heavy lifting:</p>
      ${promptBox("Generate flashcards for the key drugs in this pharmacology lecture, with mechanism and common side effects.")}
      <p>Review, tweak, and you're set.</p>
    `,
  },
  {
    id: "tip-03-learner-type",
    order: 3,
    delayDays: 45,
    stage: "Foundations",
    subject: "Study tip: Match the tool to how you learn",
    preheader: "Using Notebook in your style makes it stick.",
    heading: "Match the tool to how you learn",
    bodyHtml: `
      <p>Revisit your learner-type guide. Audio learner? Try:</p>
      ${promptBox("Make an audio overview of this lecture highlighting the must-know points.")}
      <p>Read/write learner? Try:</p>
      ${promptBox("Turn this material into a structured briefing document with headers and bullet points.")}
      <p>Using Notebook in your style makes it stick.</p>
    `,
  },
  {
    id: "tip-04-qa",
    order: 4,
    delayDays: 60,
    stage: "Foundations",
    subject: "Study tip: Ask your notes questions",
    preheader: "It's like having office hours with your notes.",
    heading: "Ask your notes questions",
    bodyHtml: `
      <p>Stuck on a concept? Use the Q&amp;A/chat feature to ask your own material directly:</p>
      ${promptBox("Explain the difference between these two mechanisms as if I'm a first-year student.")}
      <p>It's like having office hours with your notes.</p>
    `,
  },
  {
    id: "tip-05-active-recall",
    order: 5,
    delayDays: 75,
    stage: "Building Skills",
    subject: "Study tip: Quiz yourself for active recall",
    preheader: "A fast way to find weak spots before an exam.",
    heading: "Quiz yourself for active recall",
    bodyHtml: `
      <p>Active recall beats re-reading. Try:</p>
      ${promptBox("Quiz me on the material in this notebook with 10 questions, then check my answers and explain the ones I missed.")}
      <p>A fast way to find weak spots before an exam.</p>
    `,
  },
  {
    id: "tip-06-combine-sources",
    order: 6,
    delayDays: 90,
    stage: "Building Skills",
    subject: "Study tip: Combine multiple sources",
    preheader: "One clear picture instead of five scattered ones.",
    heading: "Combine multiple sources",
    bodyHtml: `
      <p>Studying a big topic? Add several sources to one notebook — lecture slides, a textbook chapter, your own notes — then try:</p>
      ${promptBox("Synthesize these sources into one organized summary and point out where they disagree.")}
      <p>One clear picture instead of five scattered ones.</p>
    `,
  },
  {
    id: "tip-07-connect-concepts",
    order: 7,
    delayDays: 105,
    stage: "Building Skills",
    subject: "Study tip: Connect concepts across blocks",
    preheader: "Linking new material to old strengthens long-term memory.",
    heading: "Connect concepts across blocks",
    bodyHtml: `
      <p>Medicine builds on itself. Try:</p>
      ${promptBox("Connect the material in this notebook to what I learned about [earlier topic], and show how they relate.")}
      <p>Linking new material to old strengthens long-term memory.</p>
    `,
  },
  {
    id: "tip-08-rapid-review",
    order: 8,
    delayDays: 120,
    stage: "Building Skills",
    subject: "Study tip: Make a rapid review sheet",
    preheader: "Perfect for the night before or a quick morning refresh.",
    heading: "Make a rapid review sheet",
    bodyHtml: `
      <p>Short on time before a quiz? Try:</p>
      ${promptBox("Create a one-page high-yield review sheet for this material with the most testable points.")}
      <p>Perfect for the night before or a quick morning refresh.</p>
    `,
  },
  {
    id: "tip-09-learn-on-the-go",
    order: 9,
    delayDays: 135,
    stage: "Building Skills",
    subject: "Study tip: Learn on the go",
    preheader: "Turn dead time into study time.",
    heading: "Learn on the go",
    bodyHtml: `
      <p>Turn dead time into study time. Generate an Audio Overview of this week's material and listen on your commute or at the gym:</p>
      ${promptBox("Make an audio overview of this cardiology material highlighting the must-know points.")}
    `,
  },
  {
    id: "tip-10-exam-questions",
    order: 10,
    delayDays: 150,
    stage: "Advanced & Exam-Focused",
    subject: "Study tip: Simulate exam questions",
    preheader: "Practicing in exam format builds test-day reasoning.",
    heading: "Simulate exam questions",
    bodyHtml: `
      <p>Level up your quizzing. Try:</p>
      ${promptBox("Write five board-style vignette questions based on this material, then explain the answers.")}
      <p>Practicing in exam format builds the reasoning you'll need on test day.</p>
    `,
  },
  {
    id: "tip-11-feynman",
    order: 11,
    delayDays: 165,
    stage: "Advanced & Exam-Focused",
    subject: "Study tip: Explain it back (the Feynman technique)",
    preheader: "If you can teach it, you know it.",
    heading: "Explain it back (the Feynman technique)",
    bodyHtml: `
      <p>Teaching is the best test of understanding. Try:</p>
      ${promptBox("Ask me to explain [concept] in my own words, then point out anything I got wrong or left out.")}
      <p>If you can teach it, you know it.</p>
    `,
  },
  {
    id: "tip-12-cumulative-review",
    order: 12,
    delayDays: 180,
    stage: "Advanced & Exam-Focused",
    subject: "Study tip: Build a cumulative review notebook",
    preheader: "A single place to review everything before finals.",
    heading: "Build a cumulative review notebook",
    bodyHtml: `
      <p>As the semester winds down, gather your key materials into one notebook and try:</p>
      ${promptBox("Create a comprehensive review guide across all of these sources, organized by system.")}
      <p>A single place to review everything before finals.</p>
    `,
  },
  {
    id: "tip-13-weak-spots",
    order: 13,
    delayDays: 195,
    stage: "Advanced & Exam-Focused",
    subject: "Study tip: Target your weak spots",
    preheader: "Efficient studying is smart studying.",
    heading: "Target your weak spots",
    bodyHtml: `
      <p>Don't waste time on what you already know. Try:</p>
      ${promptBox("Based on the questions I got wrong, tell me which topics I should focus on and quiz me only on those.")}
      <p>Efficient studying is smart studying.</p>
    `,
  },
];

// Final "keeper" message — not in the original cadence table but drafted
// as a closing tip in the plan doc. Scheduled just ahead of the Week 32 survey.
tips.push({
  id: "tip-14-make-it-a-keeper",
  order: 14,
  delayDays: 210,
  stage: "Advanced & Exam-Focused",
  subject: "Study tip: Make it a keeper",
  preheader: "The best tool is the one you'll actually keep using.",
  heading: "Make it a keeper",
  bodyHtml: `
    <p>You've built a real skill over these weeks. Think about which Notebook habits you'll carry forward — the study guide workflow, audio reviews, self-quizzing — and keep the ones that made studying easier.</p>
    <p>The best tool is the one you'll actually keep using.</p>
  `,
});

// Shared CTA for all tips emails
tips.forEach((t) => {
  t.category = "tip";
  t.eyebrow = `Study Tip \u00b7 ${t.stage}`;
  t.ctaText = "Open your study page";
  t.ctaLink = STUDY_PAGE;
});

module.exports = { reminders, tips, STUDY_PAGE, SURVEY_LINKS };
