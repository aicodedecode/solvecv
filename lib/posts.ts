export type Post = { slug: string; title: string; date: string; blurb: string; body: string };

export const POSTS: Post[] = [
  {
    slug: "ats-resume-format-guide",
    title: "The ATS resume format that does not get filtered",
    date: "2026-11-10",
    blurb: "What parser-safe formatting actually means, without the myths.",
    body: `Most ATS rejection advice is about templates. It should be about parsers. An ATS parses text; anything that confuses the parser costs you information.

What survives parsing:

- One column. Two-column layouts reorder unpredictably once parsed.
- Standard headings: Summary, Experience, Education, Skills, Projects. Creative headings ("Where I have made magic") parse as noise.
- Bullets starting with - or *. Tables, text boxes and images often parse as nothing at all.
- Dates in plain text: "Jul 2024 - Mar 2026". Date pickers in Canva-style exports sometimes produce glyphs parsers cannot read.
- A real email address and city near the top.

What does not matter as much as people claim: fonts, margins, color, photo or no photo (unless the country expects one). The parser reads structure, not aesthetics.

The part nobody does: mirroring the posting. If the JD says "REST APIs", your resume should not only say "API development". Exact phrase matches carry weight in keyword ranking. Run the free ATS checker on solveCV against each posting before you send.`,
  },
  {
    slug: "cover-letter-myths",
    title: "Cover letters: what they are for now",
    date: "2026-11-02",
    blurb: "Short, specific, and written for the one human who will read it.",
    body: `The cover letter is not a formality anymore, because almost nobody writes a good one. That is the opportunity.

A letter earns its read by doing three things in under 250 words: naming the specific reason you fit this role (not any role), giving one piece of proof with a number in it, and answering the posting's hardest requirement head-on.

Things that end a letter's usefulness instantly: "I am writing to express my interest", "esteemed organization", "passionate about innovation", a paragraph restating your resume. The reader has your resume. The letter's job is the connective tissue the resume cannot carry: why this company, why now, why you.

If you have no strong reason for wanting that specific company, write the letter anyway but keep the middle honest: what you would work on, what you noticed in their product. Specific and ordinary beats generic and impressive.`,
  },
  {
    slug: "interview-answer-structure",
    title: "Interview answers: structure beats brilliance",
    date: "2026-10-25",
    blurb: "Why 'situation, action, result' keeps winning, and how to keep it from sounding rehearsed.",
    body: `Interviewers listen for structure because they are taking notes. An unstructured answer gives them nothing to write down, and nothing written down means you do not survive the debrief.

The workable pattern: one sentence of situation, two or three sentences of what you specifically did, one sentence of result with a number. Then stop. Most candidates fail by adding a fourth sentence that undoes the third.

Two things keep it from sounding rehearsed: use your real numbers (approximations you can defend beat invented precision), and vary the order. "Result first, then how" works well for behavioral questions: "We cut load time from 6 seconds to 2. The way we got there was..."

Practice out loud, not in your head. Written practice trains writing; spoken practice trains recall under pressure.`,
  },
  {
    slug: "notice-period-negotiation-india",
    title: "Notice periods in India: the short version",
    date: "2026-10-18",
    blurb: "What is standard, what is negotiable, and how to shorten one honestly.",
    body: `Standard notice in Indian private companies runs 30 to 90 days, and it is written into your appointment letter, not into law. Read that letter before you resign; the buyout clause, not the notice length, is usually what matters.

Ways a notice gets shorter: leave adjustment (if your balance covers it), buyout (you pay base salary for the remaining days, if policy allows), or negotiated early release (your new employer sometimes agrees to wait, sometimes pays).

What actually breaks offers: telling the new employer a date you cannot meet, then asking for delays twice. Give a date with a buffer, commit to it, and use the notice period to finish a clean handover. References outlive jobs; a messy exit costs more than two weeks of waiting.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
