import Link from "next/link";
import { notFound } from "next/navigation";
import { getJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function JobDetail({ params }: { params: { id: string } }) {
  let jobs: Awaited<ReturnType<typeof getJobs>> = [];
  try {
    jobs = await getJobs();
  } catch {
    jobs = [];
  }
  const job = jobs.find((j) => j.id === params.id);
  if (!job) notFound();

  const dateStr = job.date ? new Date(job.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/jobs" className="text-sm underline underline-offset-4" style={{ color: "var(--mute)" }}>Back to jobs</Link>
      <div className="hairline mt-4 p-6">
        <div className="flex flex-wrap gap-2 text-xs font-mono uppercase mb-4" style={{ color: "var(--mute)" }}>
          <span className="hairline px-2 py-0.5">{job.source}</span>
          {job.type && <span className="hairline px-2 py-0.5">{job.type}</span>}
          {job.remote && <span className="hairline px-2 py-0.5">remote</span>}
        </div>
        <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "Georgia, serif" }}>{job.title}</h1>
        <div className="text-sm mb-5" style={{ color: "var(--mute)" }}>
          {job.company} · {job.location}
          {dateStr && <span> · posted {dateStr}</span>}
        </div>
        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {job.tags.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5" style={{ backgroundColor: "rgba(14,107,63,0.08)", color: "var(--moss)" }}>{t}</span>
            ))}
          </div>
        )}
        <a href={job.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-block">
          Open the original posting
        </a>
        <p className="text-xs mt-4" style={{ color: "var(--mute)" }}>
          Listed by {job.source}. Apply on the employer's own site; we never hold your details.
        </p>
      </div>
      <div className="hairline mt-6 p-6">
        <h2 className="font-semibold mb-2">Before you apply</h2>
        <p className="text-sm" style={{ color: "var(--mute)" }}>
          Run this posting through the <Link href="/tools/ats-checker" className="underline underline-offset-4">ATS checker</Link> with your resume, and draft the cover letter with the <Link href="/tools/cover-letter" className="underline underline-offset-4">cover letter tool</Link>. Both are free and nothing is stored.
        </p>
      </div>
    </div>
  );
}
