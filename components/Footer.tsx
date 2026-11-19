import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div className="col-span-2">
          <div className="text-lg font-bold mb-3">
            solve<span className="gradient-text">CV</span>
          </div>
          <p className="text-[13px] max-w-xs text-zinc-500 leading-relaxed">
            Free AI tools for job seekers, plus live listings from public job sources. Your data never leaves your browser.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Tools</div>
          <ul className="space-y-2 text-zinc-400">
            <li><Link href="/tools/ats-checker" className="hover:text-emerald-400 transition-colors">ATS checker</Link></li>
            <li><Link href="/tools/cover-letter" className="hover:text-emerald-400 transition-colors">Cover letter</Link></li>
            <li><Link href="/tools/mock-interview" className="hover:text-emerald-400 transition-colors">Mock interview</Link></li>
            <li><Link href="/tools" className="hover:text-emerald-400 transition-colors">All tools</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Site</div>
          <ul className="space-y-2 text-zinc-400">
            <li><Link href="/jobs" className="hover:text-emerald-400 transition-colors">Jobs</Link></li>
            <li><Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Tracker</Link></li>
            <li><Link href="/post-a-job" className="hover:text-emerald-400 transition-colors">Post a job</Link></li>
            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 py-5 text-xs flex flex-wrap justify-between gap-2 text-zinc-600">
          <span>Listings come from public job APIs and link to the original posting. India, UK, US, Germany and Canada feeds include Jobs by Adzuna.</span>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
