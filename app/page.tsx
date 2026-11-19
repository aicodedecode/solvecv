import Link from "next/link";
import { getJobs } from "@/lib/jobs";
import { publicTools } from "@/lib/tools";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const COUNTRIES = [
  { slug: "remote", label: "Remote" },
  { slug: "india", label: "India" },
  { slug: "united states", label: "United States" },
  { slug: "united kingdom", label: "United Kingdom" },
  { slug: "germany", label: "Germany" },
  { slug: "canada", label: "Canada" },
];
const CATEGORIES = ["engineering", "data and ai", "design", "product", "marketing", "sales", "support"];

const STATS: [string, string][] = [
  ["28", "free tools"],
  ["4", "live job sources"],
  ["₹0", "forever"],
  ["0", "accounts required"],
];

export default async function Home() {
  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  try {
    jobs = (await getJobs()).slice(0, 8);
  } catch {
    jobs = [];
  }
  const featured = publicTools().filter((t) => t.kind === "ai" || t.customPage).slice(0, 7);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid" />
        <div className="orb w-[500px] h-[500px] -top-40 -left-40 animate-float" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)" }} />
        <div className="orb w-[420px] h-[420px] top-10 right-0 animate-float-slow" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)" }} />
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 relative">
          <div className="max-w-3xl animate-fade-up">
            <div className="glass inline-flex items-center gap-2 px-4 py-1.5 text-xs text-zinc-300 mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free. No signup. No resume upload.
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              The job hunt, minus
              <br />
              <span className="gradient-text">everything that wastes it.</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mb-9 leading-relaxed">
              Live openings from four public job sources, 28 AI tools that write the documents, score the resume, and run the interview. Everything stays in your browser.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/jobs" className="btn-primary">Browse live jobs</Link>
              <Link href="/tools/ats-checker" className="btn-secondary">Score my resume</Link>
            </div>
            <p className="font-mono text-xs text-zinc-600 mt-8 tracking-wide">
              4 SOURCES · 28 TOOLS · ₹0 FOREVER
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="glass card-hover p-6">
              <div className="font-mono text-3xl font-bold gradient-text">{n}</div>
              <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Latest openings</h2>
          <Link href="/jobs" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">See all →</Link>
        </div>
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <Link key={j.id} href={`/jobs/${j.id}`} className="glass card-hover p-5 block group">
                <div className="flex justify-between gap-3 mb-2">
                  <div className="font-medium group-hover:text-emerald-300 transition-colors truncate">{j.title}</div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider font-mono text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">{j.source}</span>
                </div>
                <div className="text-sm text-zinc-500 flex justify-between gap-3">
                  <span className="truncate">{j.company}</span>
                  <span className="shrink-0 font-mono text-xs">{j.location}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass p-8 text-sm text-zinc-500">The job index is warming up. Try the browse page in a minute.</div>
        )}
      </section>

      {/* Browse */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Browse by place</h2>
        <div className="flex flex-wrap gap-2.5 mb-10">
          {COUNTRIES.map((c) => (
            <Link key={c.slug} href={`/jobs?country=${encodeURIComponent(c.slug)}`} className="chip text-zinc-300">
              {c.label}
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">Browse by field</h2>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/jobs?category=${encodeURIComponent(c)}`} className="chip text-zinc-300">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Tools bento */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">The toolkit</h2>
          <Link href="/tools" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">All 28 →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((t, i) => (
            <Link
              key={t.slug}
              href={t.customPage || `/tools/${t.slug}`}
              className={`glass card-hover p-6 block group ${i === 0 ? "md:col-span-2 relative overflow-hidden" : ""}`}
            >
              {i === 0 && (
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-60" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)" }} />
              )}
              <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-2">{t.category}</div>
              <div className="font-semibold text-lg mb-1.5 group-hover:text-emerald-300 transition-colors">{t.name}</div>
              <div className="text-sm text-zinc-500 leading-relaxed">{t.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/40 via-emerald-500/10 to-sky-500/30">
          <div className="rounded-2xl bg-[#0d0d10] px-8 py-14 text-center relative overflow-hidden">
            <div className="orb w-72 h-72 -bottom-32 left-1/2 -translate-x-1/2" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)" }} />
            <h2 className="text-3xl font-bold tracking-tight mb-3 relative">Job alerts, once a week</h2>
            <p className="text-sm text-zinc-500 mb-8 relative">A Friday email with the week's best matches by field. One click to leave.</p>
            <Link href="/subscribe" className="btn-primary relative">Get the alerts</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
