export type ToolField = {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  placeholder?: string;
  options?: string[];
  rows?: number;
};

export type Tool = {
  slug: string;
  name: string;
  blurb: string;
  category: string;
  kind: "ai" | "local" | "internal";
  fields?: ToolField[];
  prompt?: string;
  customPage?: string;
};

const SYSTEM_RULES =
  "Write plain, specific, dry prose. No exclamation marks. No marketing buzzwords. Never write 'delve', 'seamless', 'robust', 'leverage', 'vibrant'. Use short sentences. Prefer concrete numbers and named details over adjectives. Output clean markdown with short bold lead-ins where useful. Never invent facts about the user; if information is missing, leave a [bracketed placeholder].";

export const SYSTEM_PROMPT = SYSTEM_RULES;

export const TOOLS: Tool[] = [
  {
    slug: "ats-checker",
    name: "ATS resume checker",
    blurb: "Score your resume against the job posting and get the missing keywords and format fixes.",
    category: "Resume",
    kind: "local",
    customPage: "/tools/ats-checker",
  },
  {
    slug: "resume-builder",
    name: "Resume builder",
    blurb: "Fill in your work, get a clean one-page resume with bullets that read well, print-ready.",
    category: "Resume",
    kind: "ai",
    customPage: "/tools/resume-builder",
  },
  {
    slug: "cover-letter",
    name: "Cover letter generator",
    blurb: "Paste the job description, get a letter written for that exact role, not a template with the company name swapped.",
    category: "Applications",
    kind: "ai",
    fields: [
      { name: "jobDescription", label: "Job description", type: "textarea", rows: 10, placeholder: "Paste the full posting" },
      { name: "resume", label: "Your resume or background", type: "textarea", rows: 10, placeholder: "Paste your resume text" },
      { name: "companyName", label: "Company name", type: "text" },
      { name: "role", label: "Role", type: "text" },
    ],
    prompt: "Write a cover letter for the {{role}} role at {{companyName}}. Job description:\n\n{{jobDescription}}\n\nCandidate background:\n\n{{resume}}\n\nRules: 250 to 300 words. Open with the specific reason this candidate fits this exact role, not a generic interest statement. Reference concrete work from the background. Name the two or three requirements from the posting that matter most and answer each. No 'I am writing to express my interest'. No 'esteemed organization'. End with a plain close. Return only the letter, with the subject line if the posting is for email.",
  },
  {
    slug: "cold-email",
    name: "Cold email writer",
    blurb: "A short email to a recruiter or hiring manager that gets a reply.",
    category: "Applications",
    kind: "ai",
    fields: [
      { name: "role", label: "Role you want", type: "text" },
      { name: "company", label: "Company", type: "text" },
      { name: "recipient", label: "Who you are writing to", type: "text", placeholder: "Recruiter, hiring manager, founder" },
      { name: "background", label: "Your background", type: "textarea", rows: 8 },
      { name: "context", label: "Anything specific to mention", type: "textarea", rows: 4, placeholder: "Their recent launch, a mutual connection, a specific project of theirs" },
    ],
    prompt: "Write a cold email to a {{recipient}} at {{company}} about the {{role}} role. Candidate background:\n\n{{background}}\n\nSpecific context to use:\n\n{{context}}\n\nRules: under 120 words including the subject line. One specific opening line about them or their work, not a compliment about the company culture. Two lines of proof the candidate can do the job. One clear ask (a 15 minute call). No 'hope this finds you well'. Give the subject line first, then the body.",
  },
  {
    slug: "jd-decoder",
    name: "Job description decoder",
    blurb: "See what the posting actually wants, what you can skip, and what to prepare for.",
    category: "Job hunt",
    kind: "ai",
    fields: [
      { name: "jobDescription", label: "Job description", type: "textarea", rows: 12 },
    ],
    prompt: "Decode this job description:\n\n{{jobDescription}}\n\nReturn markdown with these sections: **What the role actually is** (two lines, plain); **Must-haves vs nice-to-haves** (two lists, sorted by what is really screened for); **The unsaid parts** (what the posting implies but does not say: workload, on-call, travel, team maturity); **Keywords to mirror** (exact terms an ATS would match, as a comma list); **Questions to ask them** (four, specific to this posting). Be direct about red flags.",
  },
  {
    slug: "hr-email-decoder",
    name: "HR email decoder",
    blurb: "Paste a recruiter email, see what it means and what to reply.",
    category: "Job hunt",
    kind: "ai",
    fields: [
      { name: "email", label: "The email you received", type: "textarea", rows: 10 },
      { name: "context", label: "Your situation (optional)", type: "textarea", rows: 4, placeholder: "Applied last week, second round done, waiting on another offer" },
    ],
    prompt: "Decode this HR or recruiter email:\n\n{{email}}\n\nMy situation: {{context}}\n\nReturn markdown with: **What it says**, **What it likely means** (including what is not being said: ghosting risk, budget level, urgency), **How hot this lead is** (one line: hot, warm, or cold, with the reason), **Suggested reply** (ready to send, in my voice, matching their length). If the email is a rejection, say so plainly and give the one line worth sending back.",
  },
  {
    slug: "employability-score",
    name: "Employability score",
    blurb: "Where your profile stands for the role you want, out of 100, with the fixes that move it.",
    category: "Job hunt",
    kind: "ai",
    fields: [
      { name: "resume", label: "Your resume", type: "textarea", rows: 10 },
      { name: "targetRole", label: "Target role", type: "text" },
      { name: "experience", label: "Years of experience", type: "select", options: ["Fresher", "0-1 years", "1-3 years", "3-6 years", "6+ years"] },
    ],
    prompt: "Score my employability for {{targetRole}} at {{experience}} level. Resume:\n\n{{resume}}\n\nReturn markdown: **Score: N/100** on the first line. Then **Where the score came from** (four sub-scores out of 25 each: skills match, proof of work, resume quality, story clarity, one line each). Then **Three fixes that move the score most** (each with the concrete action and the points it is worth). Be strict; a 55 should feel like a 55.",
  },
  {
    slug: "salary-negotiation",
    name: "Salary negotiation guide",
    blurb: "Walk into the offer call with a number, a script, and answers for every pushback.",
    category: "Offers and pay",
    kind: "ai",
    fields: [
      { name: "role", label: "Role", type: "text" },
      { name: "location", label: "City", type: "text", placeholder: "Bangalore" },
      { name: "experience", label: "Experience", type: "select", options: ["Fresher", "0-1 years", "1-3 years", "3-6 years", "6+ years"] },
      { name: "offer", label: "Offer details (what you have so far)", type: "textarea", rows: 6, placeholder: "Numbers, components, anything said on the call" },
    ],
    prompt: "Prepare my salary negotiation for a {{role}} role in {{location}} at {{experience}} level. Offer so far:\n\n{{offer}}\n\nReturn markdown: **The number** (a realistic range with the exact figure to name first, based on typical {{location}} pay for this role and level; say plainly when you are estimating and on what basis); **The script** (exact words for the opening ask); **Pushback answers** (four likely responses from them and a reply for each); **If they do not move** (what to negotiate instead: joining bonus, review timeline, title). No fake confidence language.",
  },
  {
    slug: "skill-gap",
    name: "Skill gap analyzer",
    blurb: "The missing skills between your resume and the role, as a learning path, not a guilt trip.",
    category: "Job hunt",
    kind: "ai",
    fields: [
      { name: "resume", label: "Your resume", type: "textarea", rows: 10 },
      { name: "targetRole", label: "Target role or job description", type: "textarea", rows: 6 },
    ],
    prompt: "Compare my resume against the target role and list the skill gaps.\n\nResume:\n\n{{resume}}\n\nTarget:\n\n{{targetRole}}\n\nReturn markdown: **Already there** (skills that carry over, one line each); **Gaps that matter** (each with why it is screened for and the fastest honest way to close it, with a realistic time estimate); **Gaps to ignore** (what the posting lists but rarely screens for); **A 4-week plan** (week by week, what to build or study, with the proof each week produces). Order the plan so something shippable exists by week 2.",
  },
  {
    slug: "sop-writer",
    name: "SOP writer",
    blurb: "A statement of purpose that sounds like you and fits the program.",
    category: "Studies",
    kind: "ai",
    fields: [
      { name: "program", label: "Program and university", type: "text" },
      { name: "background", label: "Your background: academics, projects, work", type: "textarea", rows: 10 },
      { name: "motivation", label: "Why this program, in your own words", type: "textarea", rows: 6 },
    ],
    prompt: "Write a statement of purpose for {{program}}. Background:\n\n{{background}}\n\nMotivation in the applicant's own words:\n\n{{motivation}}\n\nRules: 600 to 750 words. Open with a specific moment or problem, not 'From a young age'. Connect specific past work to specific parts of the program (name real course areas or labs only if they appear in the background; otherwise use placeholders). No 'sincerely passionate'. No 'esteemed institution'. Return only the SOP.",
  },
  {
    slug: "why-hire-me",
    name: "Why hire me",
    blurb: "A sharp answer to the one question every interview starts with.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "role", label: "Role", type: "text" },
      { name: "background", label: "Your background", type: "textarea", rows: 8 },
      { name: "jobDescription", label: "Job description (optional)", type: "textarea", rows: 6 },
    ],
    prompt: "Build my 'why should we hire you' answer for the {{role}} role. My background:\n\n{{background}}\n\nJob description:\n\n{{jobDescription}}\n\nReturn markdown: **The 30-second answer** (spoken-word version, plain sentences, one proof point); **Three supporting points** (each tied to a requirement in the description); **What not to say** (two lines). The answer must sound prepared, not rehearsed: no list-of-adjectives, no 'hardworking team player'.",
  },
  {
    slug: "company-research",
    name: "Company research",
    blurb: "The numbers, culture signals, and talking points before you interview there.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "company", label: "Company", type: "text" },
      { name: "role", label: "Role you are interviewing for", type: "text" },
    ],
    prompt: "Research {{company}} for my {{role}} interview. Return markdown: **What they do and make money from** (three lines); **Numbers to know** (revenue, headcount, funding or stock, recent moves; mark anything you are not certain about as 'verify: ...' and list what to check); **Culture signals** (what review sites and press say, plainly, including the negative ones); **Talking points** (three things to bring up in the interview that show real research); **Questions to ask** (four). Where your knowledge may be dated, say the year you are confident about and what to verify live.",
  },
  {
    slug: "gd-topics",
    name: "GD topics prep",
    blurb: "Group discussion topics with a stance, points, and counterpoints for campus rounds.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "company", label: "Company or exam (optional)", type: "text", placeholder: "TCS, Infosys, bank exams" },
      { name: "count", label: "How many topics", type: "select", options: ["5", "8", "10"] },
    ],
    prompt: "Prepare {{count}} group discussion topics for a campus placement round at {{company}}. For each topic return markdown: the topic as a bold line, then **Stance** (one sentence, pick a side), **Your three points** (each one line, with a fact or example where possible), **The strongest counterpoint** (one line), **Your rebuttal** (one line). Prefer topics that actually appear in Indian placement GDs: current economy, technology, policy.",
  },
  {
    slug: "job-kit",
    name: "Job application kit",
    blurb: "One paste of the job description, one kit back: resume points, cover letter, cold email.",
    category: "Applications",
    kind: "ai",
    fields: [
      { name: "jobDescription", label: "Job description", type: "textarea", rows: 10 },
      { name: "resume", label: "Your resume or background", type: "textarea", rows: 10 },
    ],
    prompt: "Build a complete application kit for this job:\n\n{{jobDescription}}\n\nMy background:\n\n{{resume}}\n\nReturn markdown with three sections in this order: **Tailored resume points** (eight to ten bullets, each starting with a strong verb, each with a number or concrete outcome where the background supports one, mirroring the posting's keywords); **Cover letter** (180 words); **Cold email** (90 words plus subject line). Use only facts from the background. Where a number is missing, use a [placeholder] rather than inventing one.",
  },
  {
    slug: "portfolio-writer",
    name: "Portfolio writer",
    blurb: "Turn your projects into copy a hiring manager actually reads.",
    category: "Resume",
    kind: "ai",
    fields: [
      { name: "projects", label: "Your projects (what each one is and does)", type: "textarea", rows: 10 },
      { name: "targetRole", label: "Target role", type: "text" },
      { name: "links", label: "Live links (optional)", type: "text" },
    ],
    prompt: "Write portfolio copy for these projects, aimed at a {{targetRole}} hiring manager.\n\nProjects:\n\n{{projects}}\n\nLinks: {{links}}\n\nFor each project return markdown: **name** as a bold line, then **What it does** (one sentence, plain), **Why it matters** (one sentence, tied to a real problem), **What to notice** (the technical or design decision a hiring manager should catch), **Resume bullet** (one line with a number or concrete outcome). No 'passionate about building solutions'.",
  },
  {
    slug: "project-ideas",
    name: "Project ideas",
    blurb: "Project ideas matched to the role you want, sized to the time you have.",
    category: "Resume",
    kind: "ai",
    fields: [
      { name: "targetRole", label: "Target role", type: "text" },
      { name: "time", label: "Time available", type: "select", options: ["A weekend", "Two weeks", "A semester"] },
      { name: "skills", label: "Skills you already have", type: "textarea", rows: 4 },
    ],
    prompt: "Give me {{time}}-sized project ideas for a {{targetRole}} role. Skills I have:\n\n{{skills}}\n\nReturn five ideas as markdown. For each: **name** as a bold line, then **What you build** (two lines), **Why it impresses for this role** (one line, specific to the role, not 'shows initiative'), **The resume bullet it earns** (one line with a concrete outcome), **Scope cut** (what to leave out so it actually ships in {{time}}). At least two ideas should be something a resume screener sees rarely.",
  },
  {
    slug: "recommendation-draft",
    name: "Recommendation draft",
    blurb: "Draft the letter your professor or manager just has to sign.",
    category: "Applications",
    kind: "ai",
    fields: [
      { name: "recommender", label: "Who signs it (name and title, if you want it named)", type: "text" },
      { name: "relationship", label: "How they know you", type: "textarea", rows: 3 },
      { name: "achievements", label: "What you did with them", type: "textarea", rows: 8 },
      { name: "purpose", label: "What it is for", type: "text", placeholder: "MS application, job reference" },
    ],
    prompt: "Draft a recommendation letter for {{purpose}}. The recommender: {{recommender}}. How they know me:\n\n{{relationship}}\n\nWhat I did under them:\n\n{{achievements}}\n\nRules: about 300 words, written in the recommender's voice, first person. One specific anecdote from the achievements. Compare me to a cohort where credible ('top of the projects I supervised') and use a [placeholder] where a number is missing. Return only the letter with the signature block as placeholders.",
  },
  {
    slug: "answer-polish",
    name: "Answer polish",
    blurb: "Paste an interview answer, get it rewritten with structure, numbers, and confidence.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "question", label: "The interview question", type: "text" },
      { name: "answer", label: "Your draft answer", type: "textarea", rows: 8 },
    ],
    prompt: "Polish my interview answer.\n\nQuestion: {{question}}\n\nMy draft:\n\n{{answer}}\n\nReturn markdown: **Rewritten answer** (150 to 200 words, structured situation-action-result, kept in the first person, my facts only, [placeholder] where a number is missing); **What changed and why** (three bullets); **Timing** (how long this takes spoken, and what to cut if asked to be brief).",
  },
  {
    slug: "interview-questions",
    name: "Interview questions bank",
    blurb: "The questions this role gets asked, with answer angles and practice prompts.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "role", label: "Role", type: "text" },
      { name: "company", label: "Company (optional)", type: "text" },
      { name: "level", label: "Level", type: "select", options: ["Fresher", "1-3 years", "3-6 years", "6+ years"] },
    ],
    prompt: "Build an interview question bank for a {{level}} {{role}} interview{{company}}.\n\nReturn markdown with three groups: **HR and fit** (four questions), **Technical or role-specific** (six), **Behavioral** (four). For each question: one line on the answer angle that scores, and one follow-up question the interviewer is likely to ask. End with **The five you must prepare** (which of the above to rehearse out loud, and why).",
  },
  {
    slug: "mock-interview",
    name: "Mock interview",
    blurb: "Practice with the questions this role and level actually get, plus a scoring rubric.",
    category: "Interviews",
    kind: "ai",
    fields: [
      { name: "role", label: "Role", type: "text" },
      { name: "level", label: "Level", type: "select", options: ["Fresher", "1-3 years", "3-6 years", "6+ years"] },
      { name: "company", label: "Company (optional)", type: "text" },
      { name: "resume", label: "Your resume (optional)", type: "textarea", rows: 6 },
    ],
    prompt: "Run a mock interview for a {{level}} {{role}}{{company}}. My resume:\n\n{{resume}}\n\nReturn markdown: **Round plan** (what rounds to expect for this role and level, one line each); **Eight questions in order**, each with **What a strong answer covers** (two lines) and **A trap to avoid** (one line); **Scoring rubric** (four criteria out of 5 each, so I can self-score after answering out loud); **Two curveballs** an interviewer may throw. Write questions as the interviewer would say them.",
  },
  {
    slug: "ai-job-risk",
    name: "AI job risk checker",
    blurb: "See what parts of your role AI can already do, and what makes you harder to replace.",
    category: "Job hunt",
    kind: "ai",
    fields: [
      { name: "role", label: "Your role", type: "text" },
      { name: "tasks", label: "Your typical tasks (optional)", type: "textarea", rows: 6 },
    ],
    prompt: "Assess AI exposure for a {{role}} role. Typical tasks:\n\n{{tasks}}\n\nReturn markdown: **Share of core tasks AI already handles** (a percentage with a one-line justification; mark it as an estimate); **What stays human** (the parts that do not automate, and why); **What is already automated** (be blunt); **Skills that harden the profile** (four, each with why it resists automation); **The 6-month move** (one concrete skill to add). Ground claims in how these tools actually perform today, not hype in either direction.",
  },
  {
    slug: "resignation-letter",
    name: "Resignation letter writer",
    blurb: "A clean resignation letter for any reason, notice period handled.",
    category: "Offers and pay",
    kind: "ai",
    fields: [
      { name: "reason", label: "Reason", type: "select", options: ["New offer", "Relocation", "Higher studies", "Personal reasons", "Better fit", "Do not state a reason"] },
      { name: "lastDay", label: "Last working day", type: "text", placeholder: "e.g. 15 December 2026" },
      { name: "notice", label: "Notice period", type: "text", placeholder: "e.g. 30 days, or 'serving notice from 15 Nov'" },
      { name: "manager", label: "Manager name and company", type: "text" },
      { name: "notes", label: "Anything to include (optional)", type: "textarea", rows: 4 },
    ],
    prompt: "Write my resignation letter. Reason to state: {{reason}}. Last working day: {{lastDay}}. Notice: {{notice}}. Addressed to: {{manager}}. Extra points to include:\n\n{{notes}}\n\nRules: under 150 words, formal, no drama, no over-explaining, thank the team in one sentence without gushing, offer a clean handover. Return only the letter.",
  },
  {
    slug: "linkedin-optimizer",
    name: "LinkedIn optimizer",
    blurb: "A complete profile rewrite from your resume: headline, about, experience bullets.",
    category: "LinkedIn",
    kind: "ai",
    fields: [
      { name: "resume", label: "Your resume", type: "textarea", rows: 10 },
      { name: "targetRole", label: "Target role", type: "text" },
    ],
    prompt: "Rewrite my LinkedIn profile for {{targetRole}}. Resume:\n\n{{resume}}\n\nReturn markdown: **Headline** (three options, each under 120 characters, role plus proof, no buzzwords); **About section** (150 words, first person, opens with a specific fact, ends with what I am looking for); **Experience bullets** (rewritten for the top roles, each with an outcome); **Skills to list** (the ones recruiters actually filter on, max 12); **One thing to fix today** (the profile element costing me the most visibility).",
  },
  {
    slug: "linkedin-post",
    name: "LinkedIn post generator",
    blurb: "Turn a project or win into a post that reads like you, not a template.",
    category: "LinkedIn",
    kind: "ai",
    fields: [
      { name: "topic", label: "What happened (project, win, job search update)", type: "textarea", rows: 6 },
      { name: "tone", label: "Format", type: "select", options: ["Lesson learned", "Short story", "Opinion", "Build log"] },
    ],
    prompt: "Write a LinkedIn post about:\n\n{{topic}}\n\nFormat: {{tone}}.\n\nRules: under 900 characters. First line is the hook and must work as a standalone sentence. Short paragraphs, line breaks between them. One specific detail beats three general claims. No 'thrilled to announce'. No 'humbled'. Maximum two hashtags, only if natural. End without a question-bait CTA; end on the point.",
  },
  {
    slug: "linkedin-headline",
    name: "LinkedIn headline generator",
    blurb: "Headlines recruiters can actually find, built from your role, skills, and outcomes.",
    category: "LinkedIn",
    kind: "ai",
    fields: [
      { name: "current", label: "Current headline (optional)", type: "text" },
      { name: "targetRole", label: "Target role", type: "text" },
      { name: "skills", label: "Top skills and one proof point", type: "textarea", rows: 4 },
    ],
    prompt: "Generate LinkedIn headlines for a {{targetRole}} profile. Current headline: {{current}}. Skills and proof:\n\n{{skills}}\n\nReturn five options as a numbered markdown list, each under 120 characters. Mix the patterns: role + outcome, role + stack, proof-first. No 'aspiring', no 'passionate', no emoji. Mark the one you would pick and say why in one line.",
  },
  {
    slug: "notice-period-calculator",
    name: "Notice period calculator",
    blurb: "Resignation date plus notice period, last working day and handover plan.",
    category: "Offers and pay",
    kind: "local",
    customPage: "/tools/notice-period-calculator",
  },
  {
    slug: "job-offer-comparison",
    name: "Job offer comparison",
    blurb: "Compare two offers on pay, remote days, commute, learning, and risk before accepting.",
    category: "Offers and pay",
    kind: "local",
    customPage: "/tools/job-offer-comparison",
  },
  {
    slug: "application-tracker",
    name: "Application tracker",
    blurb: "Every application, follow-up, interview, offer, and rejection, kept in this browser.",
    category: "Job hunt",
    kind: "local",
    customPage: "/dashboard",
  },
  {
    slug: "ats-fixes",
    name: "ATS fixes",
    blurb: "",
    category: "internal",
    kind: "internal",
    fields: [],
    prompt: "My resume scored low against this job posting. Resume:\n\n{{resume}}\n\nJob description:\n\n{{jobDescription}}\n\nMissing keywords found by the local checker:\n\n{{missing}}\n\nReturn markdown: **Five specific rewrites** of existing resume lines (before and after) that work in the missing keywords naturally and honestly; **Two structural fixes** (what to move, cut, or add); **Three bullet formulas** I can reuse for other postings in this family. Never fabricate experience; if a keyword is genuinely not in my background, say so and suggest the honest adjacent phrasing instead.",
  },
  {
    slug: "resume-build",
    name: "Resume build",
    blurb: "",
    category: "internal",
    kind: "internal",
    fields: [],
    prompt: "Build my one-page resume. Return ONLY valid JSON (no markdown fences, no commentary) matching this shape:\n{\"name\":\"\",\"headline\":\"\",\"contact\":{\"email\":\"\",\"phone\":\"\",\"links\":\"\"},\"summary\":\"\",\"skills\":[\"\"],\"experience\":[{\"role\":\"\",\"company\":\"\",\"period\":\"\",\"bullets\":[\"\"]}],\"projects\":[{\"name\":\"\",\"bullets\":[\"\"]}],\"education\":[\"\"],\"extras\":[\"\"]}\n\nRules: summary under 40 words, third person implied (no 'I'). Bullets start with strong verbs and end with outcomes or numbers; use [bracketed placeholders] for any number you do not know rather than inventing one. Drop filler sections. Keep it one page worth of content.\n\nMy details:\n\n{{details}}\n\nTarget role: {{targetRole}}",
  },
];

export function getTool(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function publicTools(): Tool[] {
  return TOOLS.filter((t) => t.kind !== "internal");
}

export const TOOL_CATEGORIES = [
  "Resume",
  "Applications",
  "Interviews",
  "LinkedIn",
  "Job hunt",
  "Offers and pay",
  "Studies",
];

export function buildPrompt(tool: Tool, values: Record<string, string>): string {
  let p = tool.prompt || "";
  for (const [k, v] of Object.entries(values)) {
    p = p.split("{{" + k + "}}").join(v || "[not provided]");
  }
  p = p.replace(/\{\{(\w+)\}\}/g, "[not provided]");
  return p;
}
