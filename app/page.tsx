import Link from "next/link";
import { getJobs } from "@/lib/jobs";
import { publicTools } from "@/lib/tools";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Parallax from "@/components/Parallax";
import LetterFlow from "@/components/LetterFlow";
import Spotlight from "@/components/Spotlight";
import type { Job } from "@/lib/jobs";

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

export default async function Home() {
  let jobs: Job[] = [];
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
        <Parallax speed={0.18} className="absolute w-[500px] h-[500px] -top-40 -left-40">
          <div className="orb w-[500px] h-[500px] animate-float" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.22), transparent 70%)" }} />
        </Parallax>
        <Parallax speed={0.08} className="absolute w-[420px] h-[420px] top-10 right-0">
          <div className="orb w-[420px] h-[420px] animate-float-slow" style={{ background: "radial-gradient(circle, rgba(56,189,248,0.16), transparent 70%)" }} />
        </Parallax>
        <div className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none" aria-hidden="true">
          <div className="aurora aurora-teal w-[560px] h-[360px] -bottom-44 left-1/4" />
          <div className="aurora aurora-blue w-[520px] h-[340px] -bottom-36 right-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 pt-24 pb-20 relative">
          <div className="max-w-3xl">
            <Reveal>
              <div className="glass inline-flex items-center gap-2 px-4 py-1.5 text-xs text-zinc-300 mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Free. No signup. No resume upload.
              </div>
            </Reveal>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] mb-6">
              <LetterFlow text="The job hunt, minus" startDelay={120} />
              <LetterFlow text="everything that wastes it." gradient startDelay={420} />
            </h1>
            <Reveal delay={180}>
              <p className="text-lg text-zinc-400 max-w-xl mb-9 leading-relaxed">
                Live openings from public job sources, 28 AI tools that write the documents, score the resume, and run the interview. Everything stays in your browser.
              </p>
            </Reveal>
            <Reveal delay={270}>
              <div className="flex flex-wrap gap-4">
                <Link href="/jobs" className="btn-primary">Browse live jobs</Link>
                <Link href="/tools/ats-checker" className="btn-secondary">Score my resume</Link>
              </div>
            </Reveal>
            <Reveal delay={360}>
              <p className="font-mono text-xs text-zinc-600 mt-8 tracking-wide">
                28 TOOLS · ₹0 FOREVER · NO ACCOUNTS
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Reveal delay={0}><StatCard value={<CountUp end={28} />} label="free tools" /></Reveal>
          <Reveal delay={90}><StatCard value={<CountUp end={4} />} label="live job sources" /></Reveal>
          <Reveal delay={180}><StatCard value="₹0" label="forever" /></Reveal>
          <Reveal delay={270}><StatCard value="0" label="accounts required" /></Reveal>
        </div>
      </section>

      {/* Latest jobs */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Latest openings</h2>
            <Link href="/jobs" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">See all →</Link>
          </div>
        </Reveal>
        {jobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j, i) => (
              <Reveal key={j.id} delay={Math.min(i * 70, 350)}>
                <Spotlight className="h-full">
                <Link href={`/jobs/${j.id}`} className="glass card-hover p-5 block group h-full">
                  <div className="flex justify-between gap-3 mb-2">
                    <div className="font-medium group-hover:text-emerald-300 transition-colors truncate">{j.title}</div>
                    <span className="shrink-0 text-[10px] uppercase tracking-wider font-mono text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">{j.source}</span>
                  </div>
                  <div className="text-sm text-zinc-500 flex justify-between gap-3">
                    <span className="truncate">{j.company}</span>
                    <span className="shrink-0 font-mono text-xs">{j.location}</span>
                  </div>
                </Link>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="glass p-8 text-sm text-zinc-500">The job index is warming up. Try the browse page in a minute.</div>
        )}
      </section>

      {/* Browse */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse by place</h2>
        </Reveal>
        <div className="flex flex-wrap gap-2.5 mb-10">
          {COUNTRIES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 45} y={14}>
              <Link href={`/jobs?country=${encodeURIComponent(c.slug)}`} className="chip text-zinc-300">
                {c.label}
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <h2 className="text-2xl font-bold tracking-tight mb-6">Browse by field</h2>
        </Reveal>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c} delay={i * 45} y={14}>
              <Link href={`/jobs?category=${encodeURIComponent(c)}`} className="chip text-zinc-300">
                {c}
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tools bento */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <Reveal>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">The toolkit</h2>
            <Link href="/tools" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">All 28 →</Link>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {featured.map((t, i) => (
            <Reveal key={t.slug} delay={Math.min(i * 80, 400)}>
              <Spotlight className="h-full">
              <Link
                href={t.customPage || `/tools/${t.slug}`}
                className={`glass card-hover p-6 block group h-full ${i === 0 ? "md:col-span-2 relative overflow-hidden" : ""}`}
              >
                {i === 0 && (
                  <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-60" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.25), transparent 70%)" }} />
                )}
                <div className="text-[10px] uppercase tracking-widest text-emerald-400/80 mb-2">{t.category}</div>
                <div className="font-semibold text-lg mb-1.5 group-hover:text-emerald-300 transition-colors">{t.name}</div>
                <div className="text-sm text-zinc-500 leading-relaxed">{t.blurb}</div>
              </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <Reveal>
          <div className="p-[1px] rounded-2xl bg-gradient-to-r from-emerald-500/40 via-emerald-500/10 to-sky-500/30">
            <div className="rounded-2xl bg-[#0d0d10] px-8 py-14 text-center relative overflow-hidden">
              <div className="orb w-72 h-72 -bottom-32 left-1/2 -translate-x-1/2" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)" }} />
              <h2 className="text-3xl font-bold tracking-tight mb-3 relative">Job alerts, once a week</h2>
              <p className="text-sm text-zinc-500 mb-8 relative">A Friday email with the week's best matches by field. One click to leave.</p>
              <Link href="/subscribe" className="btn-primary relative">Get the alerts</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function StatCard({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="glass card-hover p-6">
      <div className="font-mono text-3xl font-bold gradient-text">{value}</div>
      <div className="text-xs uppercase tracking-widest text-zinc-500 mt-1">{label}</div>
    </div>
  );
}
