"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/jobs", label: "Jobs" },
  { href: "/tools", label: "Tools" },
  { href: "/dashboard", label: "Tracker" },
  { href: "/blog", label: "Guides" },
  { href: "/post-a-job", label: "Post a job" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold tracking-tight" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          solve<span className="gradient-text">CV</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg transition-colors ${pathname === l.href ? "text-white bg-white/[0.07]" : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
          <Link href="/tools/ats-checker" className="btn-primary text-sm hidden sm:inline-block">
            Score my resume
          </Link>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/[0.06] px-4 py-2 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-2.5 px-2 rounded-lg text-sm ${pathname === l.href ? "text-white bg-white/[0.06]" : "text-zinc-400"}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/tools/ats-checker" onClick={() => setOpen(false)} className="btn-primary text-sm text-center my-2 sm:hidden">
            Score my resume
          </Link>
        </nav>
      )}
    </header>
  );
}
