"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import type { Job } from "@/lib/jobs";

type Counts = { country: Record<string, number>; category: Record<string, number>; type: Record<string, number> };

const COUNTRIES = ["all", "remote", "india", "united states", "united kingdom", "germany", "canada", "singapore", "other"];
const CATEGORIES = ["all", "engineering", "data and ai", "design", "product", "marketing", "support", "finance", "sales", "other"];
const TYPES = ["all", "full-time", "part-time", "contract", "internship"];
const SUGGESTIONS = ["react", "python", "analyst", "marketing", "devops", "intern"];

export default function JobsPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState<"relevance" | "date">("relevance");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const firstLoad = useRef(true);

  const fetchJobs = useCallback(
    async (p: number, append: boolean) => {
      if (append) setLoadingMore(true);
      else setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (country !== "all") params.set("country", country);
        if (category !== "all") params.set("category", category);
        if (type !== "all") params.set("type", type);
        if (remoteOnly) params.set("remote", "1");
        params.set("sort", sort);
        params.set("page", String(p));
        const r = await fetch("/api/jobs?" + params.toString());
        const d = await r.json();
        setJobs((prev) => (append ? [...prev, ...(d.jobs || [])] : d.jobs || []));
        setTotal(d.total || 0);
        if (d.counts) setCounts(d.counts);
        if (d.error) setError(d.error);
      } catch {
        setError("Could not load the job index. Try again in a minute.");
      }
      setLoading(false);
      setLoadingMore(false);
      firstLoad.current = false;
    },
    [q, country, category, type, remoteOnly, sort]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchJobs(1, false);
    }, q.trim() ? 300 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, country, category, type, remoteOnly, sort]);

  const pages = Math.ceil(total / 25);
  const hasMore = page < pages;
  const n = (dim: Record<string, number> | undefined, key: string) => (dim && dim[key] ? dim[key].toLocaleString("en-IN") : "");

  const activeFilters: { label: string; clear: () => void }[] = [];
  if (country !== "all") activeFilters.push({ label: country, clear: () => setCountry("all") });
  if (category !== "all") activeFilters.push({ label: category, clear: () => setCategory("all") });
  if (type !== "all") activeFilters.push({ label: type, clear: () => setType("all") });
  if (remoteOnly) activeFilters.push({ label: "remote only", clear: () => setRemoteOnly(false) });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        Live <span className="gradient-text">jobs</span>
      </h1>
      <p className="text-zinc-500 mb-8">Refreshed continuously from five public job sources. Every listing opens at the original employer posting.</p>

      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l4 4" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search role, company, or skill..."
          className="w-full glass rounded-2xl pl-12 pr-12 py-4 text-base outline-none placeholder:text-zinc-600 transition-all focus:border-emerald-500/50"
          style={{ boxShadow: "0 0 0 0 rgba(16,185,129,0)" }}
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300" aria-label="Clear search">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 5l10 10M15 5L5 15" /></svg>
          </button>
        )}
      </div>

      {/* Suggestions + sort */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <span className="text-xs text-zinc-600 uppercase tracking-wider">Try</span>
        {SUGGESTIONS.map((sg) => (
          <button key={sg} onClick={() => setQ(sg)} className="chip text-zinc-400 hover:text-emerald-300">{sg}</button>
        ))}
        <div className="ml-auto flex items-center glass rounded-full p-1 text-xs">
          {(["relevance", "date"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-full transition-colors ${sort === s ? "bg-emerald-500/20 text-emerald-300" : "text-zinc-500 hover:text-zinc-300"}`}
            >
              {s === "relevance" ? "Best match" : "Newest"}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 mb-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
        <button
          onClick={() => setRemoteOnly(!remoteOnly)}
          className={`rounded-lg px-3 py-2.5 border text-left transition-colors ${remoteOnly ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-white/20"}`}
        >
          {remoteOnly ? "\u2713 Remote only" : "Remote only"}
        </button>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
          {COUNTRIES.map((c) => <option key={c} value={c}>{c === "all" ? "All countries" : c + (counts ? " (" + n(counts.country, c) + ")" : "")}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c === "all" ? "All fields" : c}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-white/[0.04] rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
          {TYPES.map((c) => <option key={c} value={c}>{c === "all" ? "All job types" : c}</option>)}
        </select>
      </div>

      {/* Active filters + count */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-xs text-zinc-500">
          {loading ? "searching..." : total.toLocaleString("en-IN") + " jobs"}
        </span>
        {activeFilters.map((f) => (
          <button key={f.label} onClick={f.clear} className="chip text-xs text-emerald-300 border-emerald-500/40 bg-emerald-500/10">
            {f.label} \u00d7
          </button>
        ))}
        {activeFilters.length > 1 && (
          <button
            onClick={() => { setCountry("all"); setCategory("all"); setType("all"); setRemoteOnly(false); }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4"
          >
            clear all
          </button>
        )}
      </div>

      {error && <div className="glass p-5 text-sm text-red-400 mb-5">{error}</div>}

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass p-5 animate-pulse">
              <div className="h-4 w-3/4 bg-white/[0.07] rounded mb-3" />
              <div className="h-3 w-1/2 bg-white/[0.05] rounded" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j) => (
              <Link key={j.id} href={`/jobs/${j.id}`} className="glass card-hover p-5 block group">
                <div className="flex justify-between gap-3 mb-2">
                  <div className="font-medium group-hover:text-emerald-300 transition-colors truncate">{j.title}</div>
                  <span className="shrink-0 text-[10px] uppercase tracking-wider font-mono text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">{j.source}</span>
                </div>
                <div className="text-sm text-zinc-500 flex justify-between gap-3 mb-2">
                  <span className="truncate">{j.company}</span>
                  <span className="shrink-0 font-mono text-xs">{j.location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {j.salary && <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2 py-0.5">{j.salary}</span>}
                  {j.type && <span className="text-[11px] text-zinc-400 border border-white/10 rounded-full px-2 py-0.5">{j.type}</span>}
                  {j.tags.slice(0, 2).map((t) => (
                    <span key={t} className="text-[11px] text-zinc-500 border border-white/10 rounded-full px-2 py-0.5 truncate max-w-32">{t}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button onClick={() => { const p = page + 1; setPage(p); fetchJobs(p, true); }} disabled={loadingMore} className="btn-secondary text-sm">
                {loadingMore ? "Loading..." : "Load more jobs"}
              </button>
            </div>
          )}
        </>
      ) : (
        !firstLoad.current && (
          <div className="glass p-8 text-center">
            <p className="text-sm text-zinc-500 mb-4">Nothing matches that combination.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {activeFilters.length > 0 && (
                <button onClick={() => { setCountry("all"); setCategory("all"); setType("all"); setRemoteOnly(false); }} className="btn-secondary text-xs">Clear filters</button>
              )}
              <button onClick={() => setQ("")} className="btn-secondary text-xs">Clear search</button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
