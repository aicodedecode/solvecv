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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Jobs</h1>
      <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>
        Pulled from public job APIs and refreshed continuously. Every listing opens at the original source.
      </p>

      <div className="hairline p-4 mb-6">
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          placeholder="Search title, company, or skill"
          className="w-full bg-transparent px-3 py-2 text-sm outline-none mb-3"
          style={{ border: "1px solid var(--line)" }}
        />
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span style={{ color: "var(--mute)" }}>Country</span>
            <select value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className="flex-1 bg-transparent px-2 py-1.5" style={{ border: "1px solid var(--line)" }}>
              {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span style={{ color: "var(--mute)" }}>Field</span>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="flex-1 bg-transparent px-2 py-1.5" style={{ border: "1px solid var(--line)" }}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span style={{ color: "var(--mute)" }}>Type</span>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="flex-1 bg-transparent px-2 py-1.5" style={{ border: "1px solid var(--line)" }}>
              {TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="text-xs font-mono mb-3" style={{ color: "var(--mute)" }}>
        {loading ? "loading..." : total + " jobs"}
      </div>

      {error && <p className="text-sm mb-4" style={{ color: "#a03030" }}>{error}</p>}

      {jobs.length > 0 && (
        <div className="hairline divide-y" style={{ borderColor: "var(--line)" }}>
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`} className="block px-4 py-3.5 hover:bg-black/[0.03]">
              <div className="flex justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-medium truncate">{j.title}</div>
                  <div className="text-sm" style={{ color: "var(--mute)" }}>
                    {j.company}
                    {j.tags.length > 0 && <span> · {j.tags.slice(0, 3).join(", ")}</span>}
                  </div>
                </div>
                <div className="text-right text-xs shrink-0 font-mono" style={{ color: "var(--mute)" }}>
                  <div>{j.location}</div>
                  <div className="uppercase">{j.source}{j.type ? " · " + j.type : ""}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-sm" style={{ color: "var(--mute)" }}>Nothing matches. Widen the filters; the index covers remote-heavy boards best.</p>
      )}

      {pages > 1 && (
        <div className="flex justify-center gap-3 mt-6 text-sm">
          {page > 1 && <button onClick={() => setPage(page - 1)} className="underline underline-offset-4">Previous</button>}
          <span className="font-mono" style={{ color: "var(--mute)" }}>{page} / {pages}</span>
          {page < pages && <button onClick={() => setPage(page + 1)} className="underline underline-offset-4">Next</button>}
        </div>
      )}
    </div>
  );
}
