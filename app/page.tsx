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
  ["4", "job sources"],
  ["0", "rupees, ever"],
  ["1", "page of setup"],
];

export default async function Home() {
  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  try {
    jobs = (await getJobs()).slice(0, 12);
  } catch {
    jobs = [];
  }
  const tools = publicTools().filter((t) => t.kind === "ai" || t.customPage).slice(0, 8);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 pt-14 pb-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--moss)" }}>
            Free. No signup. No resume upload.
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-5" style={{ fontFamily: "Georgia, serif" }}>
            Everything a job search needs, minus the paywall.
          </h1>
          <p className="text-[15px] mb-7" style={{ color: "var(--mute)" }}>
            Fresh listings from public job sources, 28 tools that write the documents, score the resume, and run the interview. Your applications live in your browser, not our servers.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/jobs" className="btn-primary text-sm">Browse jobs</Link>
            <Link href="/tools/ats-checker" className="btn-secondary text-sm">Score my resume</Link>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 font-mono">
          {STATS.map(([n, l]) => (
            <div key={l}>
              <div className="text-3xl font-semibold">{n}</div>
              <div className="text-xs uppercase tracking-wide mt-1 opacity-80">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>Latest jobs</h2>
          <Link href="/jobs" className="text-sm underline underline-offset-4">See all</Link>
        </div>
        {jobs.length > 0 ? (
          <div className="hairline divide-y" style={{ borderColor: "var(--line)" }}>
            {jobs.map((j) => (
              <Link key={j.id} href={`/jobs/${j.id}`} className="block px-4 py-3 hover:bg-black/[0.03]">
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">{j.title}</div>
                    <div className="text-sm" style={{ color: "var(--mute)" }}>{j.company}</div>
                  </div>
                  <div className="text-right text-xs shrink-0 font-mono" style={{ color: "var(--mute)" }}>
                    <div>{j.location}</div>
                    <div className="uppercase">{j.source}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--mute)" }}>The job index is warming up. Try the browse page in a minute.</p>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Georgia, serif" }}>Browse by place</h2>
        <div className="flex flex-wrap gap-2 mb-8">
          {COUNTRIES.map((c) => (
            <Link key={c.slug} href={`/jobs?country=${encodeURIComponent(c.slug)}`} className="hairline px-3 py-1.5 text-sm hover:border-ink">
              {c.label}
            </Link>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mb-5" style={{ fontFamily: "Georgia, serif" }}>Browse by field</h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/jobs?category=${encodeURIComponent(c)}`} className="hairline px-3 py-1.5 text-sm hover:border-ink">
              {c}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>The tools</h2>
          <Link href="/tools" className="text-sm underline underline-offset-4">All 28</Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-px" style={{ backgroundColor: "var(--line)" }}>
          {tools.map((t) => (
            <Link key={t.slug} href={t.customPage || `/tools/${t.slug}`} className="bg-paper p-5 hover:bg-black/[0.03] block">
              <div className="font-medium mb-1">{t.name}</div>
              <div className="text-sm" style={{ color: "var(--mute)" }}>{t.blurb}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="hairline p-8 md:p-12 text-center">
          <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "Georgia, serif" }}>Job alerts, once a week</h2>
          <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>A Friday email with the week's best matches by field. Unsubscribe in one click.</p>
          <Link href="/subscribe" className="btn-primary text-sm">Get the alerts</Link>
        </div>
      </section>
    </div>
  );
}
