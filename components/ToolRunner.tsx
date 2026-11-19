"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { marked } from "marked";
import type { Tool } from "@/lib/tools";

export default function ToolRunner({ tool }: { tool: Tool }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(k: string, v: string) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function run() {
    setLoading(true);
    setError("");
    setResult("");
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: tool.slug, values }),
      });
      const data = await r.json();
      if (data.error) setError(data.error);
      else {
        setResult(data.result);
        try {
          const saved = JSON.parse(localStorage.getItem("solvecv:history") || "[]");
          saved.unshift({ tool: tool.slug, name: tool.name, at: Date.now(), input: values, result: data.result });
          localStorage.setItem("solvecv:history", JSON.stringify(saved.slice(0, 50)));
        } catch { /* storage unavailable */ }
      }
    } catch {
      setError("Could not reach the AI engine. Try again.");
    }
    setLoading(false);
  }

  const html = result ? marked.parse(result) as string : "";

  const downloadUrl = useMemo(
    () => (result ? URL.createObjectURL(new Blob([result], { type: "text/markdown" })) : ""),
    [result]
  );
  useEffect(() => {
    return () => {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    };
  }, [downloadUrl]);

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div>
        {tool.fields?.map((f) => (
          <div key={f.name} className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor={f.name}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                id={f.name}
                rows={f.rows || 6}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-transparent p-3 text-sm outline-none focus:border-ink"
                style={{ border: "1px solid var(--line)" }}
              />
            ) : f.type === "select" ? (
              <select
                id={f.name}
                value={values[f.name] || f.options?.[0] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                className="w-full bg-transparent px-3 py-2 text-sm"
                style={{ border: "1px solid var(--line)" }}
              >
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input
                id={f.name}
                type={f.type === "number" ? "number" : "text"}
                value={values[f.name] || ""}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
                className="w-full bg-transparent px-3 py-2 text-sm outline-none focus:border-ink"
                style={{ border: "1px solid var(--line)" }}
              />
            )}
          </div>
        ))}
        <button onClick={run} disabled={loading} className="btn-primary text-sm mt-2">
          {loading ? "Working" : "Run it"}
        </button>
        {loading && <p className="text-sm mt-3" style={{ color: "var(--mute)" }}>Writing. This takes up to half a minute.</p>}
        {error && <div role="alert" className="hairline p-4 mt-3 text-sm" style={{ color: "#f87171" }}>{error}</div>}
      </div>
      <div>
        {result ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide" style={{ color: "var(--moss)" }}>Result</span>
              <div className="flex gap-3 text-xs">
                <button onClick={() => navigator.clipboard.writeText(result)} className="underline underline-offset-4">Copy</button>
                <a href={downloadUrl} download={tool.slug + ".md"} className="underline underline-offset-4">Download</a>
              </div>
            </div>
            <div className="hairline p-5 result-md" dangerouslySetInnerHTML={{ __html: html }} />
            <p className="text-xs mt-2" style={{ color: "var(--mute)" }}>
              Saved to your <Link href="/dashboard" className="underline underline-offset-4">tracker</Link> in this browser.
            </p>
          </div>
        ) : (
          <div className="hairline p-5 h-full flex items-center justify-center text-sm" style={{ color: "var(--mute)" }}>
            Fill the left side and run it. Nothing is stored on a server.
          </div>
        )}
      </div>
    </div>
  );
}
