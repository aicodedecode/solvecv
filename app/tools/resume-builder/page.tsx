"use client";

import { useState } from "react";

const FIELDS = [
  "name", "headline", "email", "phone", "links", "city", "summary", "skills",
  "experience", "projects", "education", "extras", "targetRole"
] as const;
type Form = (typeof FIELDS)[number];

const LABELS: Record<Form, string> = {
  name: "Full name", headline: "Headline (what you are)", email: "Email", phone: "Phone",
  links: "Links (GitHub, portfolio, LinkedIn)", city: "City", summary: "Summary (optional, or let AI write it)",
  skills: "Skills (comma separated)", experience: "Experience (role, company, dates, then what you did)",
  projects: "Projects (name, then what it is and does)", education: "Education", extras: "Extras (certifications, languages)", targetRole: "Target role",
};

const EMPTY: Record<Form, string> = {
  name: "", headline: "", email: "", phone: "", links: "", city: "", summary: "", skills: "",
  experience: "", projects: "", education: "", extras: "", targetRole: "",
};

const INSTRUCTIONS = `Return ONLY valid JSON (no markdown fences, no commentary) matching this shape:
{"name":"","headline":"","contact":{"email":"","phone":"","links":"","city":""},"summary":"","skills":[""],"experience":[{"role":"","company":"","period":"","bullets":[""]}],"projects":[{"name":"","bullets":[""]}],"education":[""],"extras":[""]}
Rules: summary under 40 words. Bullets start with strong verbs and end with outcomes; use [bracketed placeholders] for unknown numbers, never invent. Drop filler sections. One page of content.`;

export default function ResumeBuilder() {
  const [form, setForm] = useState<Record<Form, string>>({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cv, setCv] = useState<{
    name: string; headline: string; contact: Record<string, string>; summary: string;
    skills: string[]; experience: { role: string; company: string; period: string; bullets: string[] }[];
    projects: { name: string; bullets: string[] }[]; education: string[]; extras: string[];
  } | null>(null);

  function set(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); }

  async function build() {
    setLoading(true); setError(""); setCv(null);
    const details = FIELDS.filter((f) => form[f]).map((f) => LABELS[f] + ": " + form[f]).join("\n");
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "resume-build", values: { details, targetRole: form.targetRole || "" }, instructions: INSTRUCTIONS }),
      });
      const d = await r.json();
      if (d.error) setError(d.error);
      else {
        const text = String(d.result).replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
        try { setCv(JSON.parse(text)); } catch { setError("The model returned text that is not valid JSON. Run it again."); }
      }
    } catch { setError("Could not reach the AI engine. Try again."); }
    setLoading(false);
  }

  const line = (v: string, fallback: string) => <p style={{ color: v ? undefined : "var(--mute)" }}>{v || fallback}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Resume builder</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>
        Fill what you have. The AI drafts the summary and bullets; the preview is print-ready A4. Nothing leaves your browser except the text you type.
      </p>
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          {FIELDS.map((f) => (
            <div key={f} className="mb-3">
              <label className="block text-sm font-medium mb-1" htmlFor={f}>{LABELS[f]}</label>
              {f === "summary" || f === "experience" || f === "projects" ? (
                <textarea rows={f === "summary" ? 3 : 5} id={f} value={form[f]} onChange={(e) => set(f, e.target.value)} className="w-full bg-transparent p-3 text-sm outline-none" style={{ border: "1px solid var(--line)" }} />
              ) : (
                <input id={f} value={form[f]} onChange={(e) => set(f, e.target.value)} className="w-full bg-transparent px-3 py-2 text-sm outline-none" style={{ border: "1px solid var(--line)" }} />
              )}
            </div>
          ))}
          <button onClick={build} disabled={loading} className="btn-primary text-sm mt-2">
            {loading ? "Building" : "Build the resume"}
          </button>
          {error && <p className="text-sm mt-3" style={{ color: "#a03030" }}>{error}</p>}
        </div>
        <div>
          <div className="sheet print-area font-sans text-[13px] leading-snug" style={{ fontFamily: "Georgia, serif" }}>
            {cv ? (
              <div>
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold">{cv.name || form.name}</div>
                  <div className="text-sm">{cv.headline || form.headline}</div>
                  <div className="text-xs mt-1" style={{ color: "#444" }}>
                    {[cv.contact?.email, cv.contact?.phone, cv.contact?.city, cv.contact?.links].filter(Boolean).join(" · ")}
                  </div>
                </div>
                {(cv.summary || form.summary) && <p className="mb-3 text-justify">{cv.summary || form.summary}</p>}
                {(cv.skills?.length > 0 || form.skills) && (
                  <div className="mb-3">
                    <div className="font-semibold border-b mb-1">Skills</div>
                    <p>{(cv.skills?.length ? cv.skills : form.skills.split(",").map((s) => s.trim())).join(" · ")}</p>
                  </div>
                )}
                {(cv.experience?.length > 0 || form.experience) && (
                  <div className="mb-3">
                    <div className="font-semibold border-b mb-1">Experience</div>
                    {cv.experience?.length > 0 ? cv.experience.map((e, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between"><span className="font-medium">{e.role} · {e.company}</span><span className="text-xs">{e.period}</span></div>
                        <ul className="list-disc ml-4 mt-0.5">{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                      </div>
                    )) : <p>{form.experience}</p>}
                  </div>
                )}
                {(cv.projects?.length > 0 || form.projects) && (
                  <div className="mb-3">
                    <div className="font-semibold border-b mb-1">Projects</div>
                    {cv.projects?.length > 0 ? cv.projects.map((p, i) => (
                      <div key={i} className="mb-2">
                        <div className="font-medium">{p.name}</div>
                        <ul className="list-disc ml-4 mt-0.5">{p.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                      </div>
                    )) : <p>{form.projects}</p>}
                  </div>
                )}
                {(cv.education?.length > 0 || form.education) && (
                  <div className="mb-3">
                    <div className="font-semibold border-b mb-1">Education</div>
                    {(cv.education?.length ? cv.education : form.education.split("\n")).map((e, i) => <div key={i}>{typeof e === "string" ? e : ""}</div>)}
                  </div>
                )}
                {(cv.extras?.length > 0 || form.extras) && (
                  <div>
                    <div className="font-semibold border-b mb-1">Extras</div>
                    {(cv.extras?.length ? cv.extras : form.extras.split("\n")).map((e, i) => <div key={i}>{typeof e === "string" ? e : ""}</div>)}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ color: "var(--mute)" }}>{line(form.name, "Your name")}{line(form.headline, "Headline")}</div>
            )}
          </div>
          {cv && <button onClick={() => window.print()} className="btn-secondary text-sm mt-4">Print or save as PDF</button>}
        </div>
      </div>
    </div>
  );
}
