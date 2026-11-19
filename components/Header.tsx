import Link from "next/link";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/tools", label: "Tools" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/blog", label: "Guides" },
  { href: "/post-a-job", label: "Post a job" },
];

export default function Header() {
  return (
    <header className="border-b" style={{ borderColor: "var(--line)" }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold tracking-tight" style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem" }}>
          solve<span style={{ color: "var(--moss)" }}>CV</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline underline-offset-4">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="hidden md:inline text-sm hover:underline underline-offset-4">
            Browse jobs
          </Link>
          <Link href="/tools/ats-checker" className="btn-primary text-sm">
            Check my resume
          </Link>
        </div>
      </div>
      <nav className="sm:hidden flex items-center gap-4 px-4 pb-2 overflow-x-auto text-sm border-t" style={{ borderColor: "var(--line)" }}>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap py-2">
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
