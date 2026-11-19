"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Job } from "@/lib/jobs";

const COUNTRIES = ["all", "remote", "india", "united states", "united kingdom", "germany", "canada", "singapore", "other"];
const CATEGORIES = ["all", "engineering", "data and ai", "design", "product", "marketing", "support", "finance", "sales", "other"];
const TYPES = ["all", "full-time", "part-time", "contract", "internship"];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (opts: { q: string; country: string; category: string; type: string; page: number }) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (opts.q) params.set("q", opts.q);
      if (opts.country !== "all") params.set("country", opts.country);
      if (opts.category !== "all") params.set("category", opts.category);
      if (opts.type !== "all") params.set("type", opts.type);
      params.set("page", String(opts.page));
      const r = await fetch("/api/jobs?" + params.toString());
      const d = await r.json();
      setJobs(d.jobs || []);
      setTotal(d.total || 0);
      if (d.error) setError(d.error);
    } catch {
      setError("Could not load the job index. Try again in a minute.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      load({ q, country, category, type, page });
    }, q ? 400 : 0);
    return () => clearTimeout(t);
  }, [q, country, category, type, page, load]);

  const pages = Math.ceil(total / 25);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        Live <span className="gradient-text">jobs</span>
      </h1>
      <p className="text-zinc-500 mb-8">Refreshed continuously from public job sources. Every listing opens at the original employer posting.</p>

      <div className="glass p-4 mb-8">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search title, company, or skill"
          className="w-full bg-white/[0.04] rounded-lg px-4 py-2.5 text-sm outline-none border border-white/10 focus:border-emerald-500/50 transition-colors mb-3 placeholder:text-zinc-600"
        />
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Country</span>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className="flex-1 bg-white/[0.04] rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Field</span>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="flex-1 bg-white/[0.04] rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-zinc-500 text-xs uppercase tracking-wider">Type</span>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="flex-1 bg-white/[0.04] rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-emerald-500/50 text-zinc-300">
              {TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="text-xs font-mono text-zinc-600 mb-4">
        {loading ? "loading..." : total.toLocaleString() + " jobs"}
      </div>

      {error && <p className="text-sm mb-4 text-red-400">{error}</p>}

      {jobs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="glass card-hover p-5 block group">
              <div className="flex justify-between gap-3 mb-2">
                <div className="font-medium group-hover:text-emerald-300 transition-colors truncate">{j.title}</div>
                <span className="shrink-0 text-[10px] uppercase tracking-wider font-mono text-zinc-500 border border-white/10 rounded-full px-2 py-0.5">{j.source}</span>
              </div>
              <div className="text-sm text-zinc-500 flex justify-between gap-3">
                <span className="truncate">{j.company}{j.tags.length > 0 && <span className="text-zinc-600"> · {j.tags.slice(0, 3).join(", ")}</span>}</span>
                <span className="shrink-0 font-mono text-xs">{j.location}{j.type ? " · " + j.type : ""}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="glass p-8 text-sm text-zinc-500">Nothing matches. Widen the filters; the index covers remote-heavy boards best.</div>
      )}

      {pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 text-sm">
          {page > 1 && <button onClick={() => setPage(page - 1)} className="btn-secondary text-xs">Previous</button>}
          <span className="font-mono text-xs text-zinc-500">{page} / {pages}</span>
          {page < pages && <button onClick={() => setPage(page + 1)} className="btn-secondary text-xs">Next</button>}
        </div>
      )}
    </div>
  );
}
