"use client";

import { useState, useMemo } from "react";

export default function NoticePeriod() {
  const [resignDate, setResignDate] = useState("");
  const [weeks, setWeeks] = useState(4);
  const [leave, setLeave] = useState(0);

  const out = useMemo(() => {
    if (!resignDate) return null;
    const start = new Date(resignDate + "T00:00:00");
    const lwd = new Date(start);
    lwd.setDate(lwd.getDate() + weeks * 7 - leave * 7);
    const days = Math.ceil((lwd.getTime() - start.getTime()) / 86400000);
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    const handover = [
      { at: -14, what: "Write the handover doc: passwords, recurring tasks, open threads. Start early; nothing disappears on the last day." },
      { at: -7, what: "Hand over live work in pairs. Introduce your replacement to every stakeholder by name, in writing." },
      { at: -3, what: "Close access requests: tools you own, shared folders, pending approvals. Export what you may keep." },
      { at: -1, what: "Final wrap: exit interview scheduled, ID and asset return planned, reference request asked while goodwill is warm." },
    ];
    return { lwd, days, fmt, handover };
  }, [resignDate, weeks, leave]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Notice period calculator</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>Resignation date, notice length, and the handover plan that fits inside it.</p>
      <div className="hairline p-5 mb-6 grid sm:grid-cols-3 gap-4">
        <label className="text-sm">
          <span className="block mb-1" style={{ color: "var(--mute)" }}>Resignation date</span>
          <input type="date" value={resignDate} onChange={(e) => setResignDate(e.target.value)} className="w-full bg-transparent px-3 py-2" style={{ border: "1px solid var(--line)" }} />
        </label>
        <label className="text-sm">
          <span className="block mb-1" style={{ color: "var(--mute)" }}>Notice period</span>
          <select value={weeks} onChange={(e) => setWeeks(parseInt(e.target.value))} className="w-full bg-transparent px-3 py-2" style={{ border: "1px solid var(--line)" }}>
            {[2, 4, 6, 8, 12].map((w) => <option key={w} value={w}>{w === 4 ? "30 days" : w === 2 ? "15 days" : (w * 7) + " days"}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="block mb-1" style={{ color: "var(--mute)" }}>Leave adjusted (weeks)</span>
          <input type="number" min={0} max={weeks} value={leave} onChange={(e) => setLeave(parseInt(e.target.value) || 0)} className="w-full bg-transparent px-3 py-2" style={{ border: "1px solid var(--line)" }} />
        </label>
      </div>
      {out && (
        <div className="hairline p-6">
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--mute)" }}>Last working day</div>
              <div className="font-mono text-lg">{out.fmt(out.lwd)}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--mute)" }}>Calendar days served</div>
              <div className="font-mono text-lg">{out.days}</div>
            </div>
          </div>
          <div className="font-semibold mb-2">Handover plan</div>
          <ul className="space-y-2 text-sm">
            {out.handover.map((h) => (
              <li key={h.what}>
                <span className="font-mono text-xs" style={{ color: "var(--moss)" }}>{h.at === -1 ? "last day" : "day " + (out.days + h.at)}</span>
                <span style={{ color: "var(--mute)" }}> · {h.what}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs mt-4" style={{ color: "var(--mute)" }}>Check your appointment letter for the buyout clause before committing a date to the new employer.</p>
        </div>
      )}
    </div>
  );
}
