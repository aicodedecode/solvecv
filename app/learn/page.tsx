import Link from "next/link";

export const metadata = { title: "Learn AI" };

const TRACKS = [
  { name: "AI fundamentals", weeks: "6 weeks", what: "What models actually do, tokens to embeddings, without math you will never use." },
  { name: "Prompt engineering", weeks: "4 weeks", what: "Structured prompting, evaluation, and when prompting stops working and fine-tuning starts." },
  { name: "Data analysis", weeks: "8 weeks", what: "Spreadsheets to SQL to pandas. Real datasets, wrong answers included." },
  { name: "Web development", weeks: "10 weeks", what: "HTML, CSS, JavaScript, React, one framework, one deployment. You finish with a live site." },
  { name: "Python for automation", weeks: "6 weeks", what: "Scripts that clean data, fill forms, and watch inboxes. Built around tasks you actually have." },
  { name: "Machine learning basics", weeks: "10 weeks", what: "Linear models to gradient boosting, with the intuition written out and the proofs skipped." },
  { name: "Product management", weeks: "8 weeks", what: "Discovery to launch, with the artifacts PMs actually produce: specs, roadmaps, metrics." },
  { name: "Interview DSA", weeks: "8 weeks", what: "Arrays to graphs in the order interviews actually test them, with patterns instead of problem memorization." },
];

export default function Learn() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Learn AI</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>Structured tracks, module 1 free in each. Paid tracks are optional; the free module stands alone.</p>
      <div className="grid sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--line)" }}>
        {TRACKS.map((t) => (
          <div key={t.name} className="bg-paper p-5">
            <div className="flex justify-between items-baseline mb-1">
              <div className="font-medium">{t.name}</div>
              <div className="font-mono text-xs" style={{ color: "var(--mute)" }}>{t.weeks}</div>
            </div>
            <p className="text-sm" style={{ color: "var(--mute)" }}>{t.what}</p>
          </div>
        ))}
      </div>
      <p className="text-xs mt-6" style={{ color: "var(--mute)" }}>
        Module 1 of each track opens with the <Link href="/tools" className="underline underline-offset-4">tools</Link>; no enrollment needed.
      </p>
    </div>
  );
}
