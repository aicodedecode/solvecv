import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div className="col-span-2">
          <div className="font-semibold mb-2" style={{ fontFamily: "Georgia, serif", fontSize: "1.05rem" }}>
            solve<span style={{ color: "var(--moss)" }}>CV</span>
          </div>
          <p className="text-[13px] max-w-xs" style={{ color: "var(--mute)" }}>
            Free AI tools for job seekers, plus fresh listings pulled from public job sources. Your data stays in your browser.
          </p>
        </div>
        <div>
          <div className="font-semibold mb-2">Tools</div>
          <ul className="space-y-1.5" style={{ color: "var(--mute)" }}>
            <li><Link href="/tools/ats-checker" className="hover:underline">ATS checker</Link></li>
            <li><Link href="/tools/cover-letter" className="hover:underline">Cover letter</Link></li>
            <li><Link href="/tools/mock-interview" className="hover:underline">Mock interview</Link></li>
            <li><Link href="/tools" className="hover:underline">All tools</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Site</div>
          <ul className="space-y-1.5" style={{ color: "var(--mute)" }}>
            <li><Link href="/jobs" className="hover:underline">Jobs</Link></li>
            <li><Link href="/dashboard" className="hover:underline">Application tracker</Link></li>
            <li><Link href="/post-a-job" className="hover:underline">Post a job</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t" style={{ borderColor: "var(--line)" }}>
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs flex justify-between" style={{ color: "var(--mute)" }}>
          <span>Listings come from public job APIs and link to the original posting.</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
