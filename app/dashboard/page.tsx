"use client";

import { useEffect, useState } from "react";

const STATUSES = ["applied", "follow-up sent", "interview", "offer", "rejected", "withdrawn"] as const;
type Status = (typeof STATUSES)[number];
type App = { id: string; company: string; role: string; link: string; status: Status; appliedOn: string; nextStep: string; notes: string };

export default function Dashboard() {
  const [apps, setApps] = useState<App[]>([]);
  const [history, setHistory] = useState<{ tool: string; name: string; at: number }[]>([]);
  const [form, setForm] = useState({ company: "", role: "", link: "", notes: "" });

  useEffect(() => {
    try {
      setApps(JSON.parse(localStorage.getItem("solvecv:apps") || "[]"));
      setHistory(JSON.parse(localStorage.getItem("solvecv:history") || "[]"));
    } catch { /* fresh browser */ }
  }, []);

  function persist(next: App[]) {
    setApps(next);
    try { localStorage.setItem("solvecv:apps", JSON.stringify(next)); } catch { /* storage unavailable */ }
  }

  function add() {
    if (!form.company || !form.role) return;
    const app: App = { id: crypto.randomUUID(), ...form, status: "applied", appliedOn: new Date().toISOString().slice(0, 10), nextStep: "", notes: form.notes };
    persist([app, ...apps]);
    setForm({ company: "", role: "", link: "", notes: "" });
  }

  function setStatus(id: string, status: Status) {
    persist(apps.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  function remove(id: string) {
    persist(apps.filter((a) => a.id !== id));
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(apps, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "solvecv-tracker.json";
    a.click();
  }

  const counts = STATUSES.map((s) => ({ s, n: apps.filter((a) => a.status === s).length }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "Georgia, serif" }}>Application tracker</h1>
        <button onClick={exportJson} className="text-sm underline underline-offset-4">Export JSON</button>
      </div>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>Lives in this browser only: no account, no server, nothing synced. Export before you switch machines.</p>

      <div className="hairline p-4 mb-6 grid sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-mono text-sm">
        {counts.map((c) => (
          <div key={c.s}>
            <div className="text-xl font-semibold">{c.n}</div>
            <div className="text-xs" style={{ color: "var(--mute)" }}>{c.s}</div>
          </div>
        ))}
      </div>

      <div className="hairline p-4 mb-8 grid sm:grid-cols-5 gap-3">
        <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company" className="bg-transparent px-3 py-2 text-sm" style={{ border: "1px solid var(--line)" }} />
        <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role" className="bg-transparent px-3 py-2 text-sm" style={{ border: "1px solid var(--line)" }} />
        <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="Posting link (optional)" className="sm:col-span-2 bg-transparent px-3 py-2 text-sm" style={{ border: "1px solid var(--line)" }} />
        <button onClick={add} className="btn-primary text-sm">Add application</button>
      </div>

      {apps.length > 0 && (
        <div className="hairline divide-y mb-10" style={{ borderColor: "var(--line)" }}>
          {apps.map((a) => (
            <div key={a.id} className="p-4">
              <div className="flex justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium">{a.role} · {a.company}</div>
                  <div className="text-xs" style={{ color: "var(--mute)" }}>
                    applied {a.appliedOn}
                    {a.link ? <span> · <a href={a.link} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">posting</a></span> : null}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={a.status} onChange={(e) => setStatus(a.id, e.target.value as Status)} className="bg-transparent px-2 py-1 text-xs" style={{ border: "1px solid var(--line)" }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => remove(a.id)} className="text-xs underline underline-offset-4" style={{ color: "var(--mute)" }}>remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-3" style={{ fontFamily: "Georgia, serif" }}>Tool history</h2>
      {history.length > 0 ? (
        <div className="hairline divide-y" style={{ borderColor: "var(--line)" }}>
          {history.slice(0, 10).map((h, i) => (
            <div key={i} className="px-4 py-2.5 text-sm flex justify-between">
              <span>{h.name}</span>
              <span className="font-mono text-xs" style={{ color: "var(--mute)" }}>{new Date(h.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm" style={{ color: "var(--mute)" }}>Run any tool and its output lands here, in this browser.</p>
      )}
    </div>
  );
}
