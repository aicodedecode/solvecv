"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

function norm(t: string): string[] {
  return t.toLowerCase().replace(/[^a-z0-9+#./ -]/g, " ").split(/\s+/).filter(Boolean);
}

const STOP = new Set(["and", "or", "the", "a", "an", "to", "of", "in", "for", "with", "on", "at", "is", "are", "be", "will", "you", "we", "our", "your", "their", "this", "that", "as", "by", "it", "from", "have", "has", "can", "should", "must", "other", "years", "year", "experience", "work", "working", "team", "teams", "role", "job", "company", "candidate", "candidates", "strong", "good", "new", "who", "what", "how", "all", "any", "not", "also", "more", "than"]);

function score(resumeText: string, jdText: string) {
  const jdWords = norm(jdText).filter((w) => !STOP.has(w) && w.length > 1);
  const resWords = new Set(norm(resumeText));
  const jdFreq = new Map<string, number>();
  for (const w of jdWords) jdFreq.set(w, (jdFreq.get(w) || 0) + 1);
  const kwScored = [...jdFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 25);
  const kwHave = kwScored.filter(([w]) => resWords.has(w));
  const kwMissing = kwScored.filter(([w]) => !resWords.has(w));
  const kwScore = Math.round((kwHave.length / Math.max(1, kwScored.length)) * 40);

  const fmtItems = [
    { ok: /@/.test(resumeText), label: "Email address present" },
    { ok: /(experience|employment|work history)/i.test(resumeText), label: "Experience section heading" },
    { ok: /(education|academic)/i.test(resumeText), label: "Education section heading" },
    { ok: /(skills|technical skills)/i.test(resumeText), label: "Skills section heading" },
    { ok: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d\d)/i.test(resumeText), label: "Dates in plain text" },
    { ok: resumeText.split(/\n/).length >= 12, label: "Multi-line structure (not one blob)" },
    { ok: !/\t{2,}/.test(resumeText), label: "No column-tab artifacts" },
  ];
  const fmtHave = fmtItems.filter((f) => f.ok).length;
  const fmtScore = Math.round((fmtHave / fmtItems.length) * 30);

  const jdSentences = jdText.split(/[.\n]/).filter((s) => s.trim().length > 15);
  const relevant = jdSentences.filter((s) => {
    const ws = norm(s);
    return ws.filter((w) => resWords.has(w)).length / Math.max(1, ws.length) > 0.25;
  }).length;
  const relScore = Math.min(30, Math.round((relevant / Math.max(1, jdSentences.length)) * 30));

  const total = kwScore + fmtScore + relScore;
  return { total, kwScore, fmtScore, relScore, kwMissing, kwHave, fmtItems };
}

export default function AtsChecker() {
  const [resume, setResume] = useState("");
  const [jd, setJd] = useState("");
  const [ran, setRan] = useState(false);
  const r = useMemo(() => (ran && jd ? score(resume, jd) : null), [ran, resume, jd]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>ATS resume checker</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>
        Runs entirely in your browser: nothing is uploaded anywhere. Paste both, get the score and the fixes.
      </p>
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Your resume text</label>
          <textarea rows={12} value={resume} onChange={(e) => setResume(e.target.value)} className="w-full bg-transparent p-3 text-sm outline-none mb-4" style={{ border: "1px solid var(--line)" }} />
          <label className="block text-sm font-medium mb-1">Job description</label>
          <textarea rows={12} value={jd} onChange={(e) => setJd(e.target.value)} className="w-full bg-transparent p-3 text-sm outline-none" style={{ border: "1px solid var(--line)" }} />
          <button onClick={() => setRan(true)} disabled={!resume || !jd} className="btn-primary text-sm mt-4">Score it</button>
        </div>
        <div>
          {r ? (
            <div>
              <div className="hairline p-5 mb-4">
                <div className="font-mono text-5xl font-semibold" style={{ color: r.total >= 70 ? "var(--moss)" : r.total >= 50 ? "var(--ink)" : "#a03030" }}>{r.total}<span className="text-xl" style={{ color: "var(--mute)" }}>/100</span></div>
                <p className="text-xs mt-1" style={{ color: "var(--mute)" }}>70+ clears most keyword screens. Below 50 needs real rework, not tweaks.</p>
              </div>
              <div className="hairline p-5 mb-4 text-sm">
                <div className="font-mono">keywords {r.kwScore}/40 · format {r.fmtScore}/30 · relevance {r.relScore}/30</div>
              </div>
              {r.kwMissing.length > 0 && (
                <div className="hairline p-5 mb-4">
                  <div className="font-semibold mb-2">Missing keywords worth adding</div>
                  <p className="text-sm" style={{ color: "var(--mute)" }}>{r.kwMissing.map(([w]) => w).join(", ")}</p>
                  <p className="text-xs mt-2" style={{ color: "var(--mute)" }}>Only add the ones your work genuinely covers. The honest phrasing beats keyword stuffing; screeners do read.</p>
                </div>
              )}
              <div className="hairline p-5">
                <div className="font-semibold mb-2">Format checks</div>
                <ul className="text-sm space-y-1">
                  {r.fmtItems.map((f) => (
                    <li key={f.label} style={{ color: f.ok ? "var(--moss)" : "#a03030" }}>{f.ok ? "ok" : "missing"} · {f.label}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="hairline p-5 h-full flex items-center justify-center text-sm" style={{ color: "var(--mute)" }}>
              Scores: keywords 40 · format 30 · relevance 30. Plain text only; copy out of your PDF rather than uploading it.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
