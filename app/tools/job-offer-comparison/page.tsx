"use client";

import { useState, useMemo } from "react";

type Offer = { name: string; base: number; bonus: number; commuteMin: number; remoteDays: number; learning: number; brand: number; risk: number };
const WEIGHTS = { pay: 0.35, commute: 0.15, learning: 0.2, brand: 0.15, risk: 0.15 };

function score(o: Offer) {
  const totalPay = o.base + o.bonus;
  const payN = Math.min(100, (totalPay / 4000000) * 100); // calibrated against ~40 LPA total as ceiling
  const commuteN = Math.max(0, 100 - o.commuteMin * 1.6) * (o.remoteDays >= 3 ? 1 : 0.85);
  return Math.round(payN * WEIGHTS.pay + commuteN * WEIGHTS.commute + o.learning * WEIGHTS.learning + o.brand * WEIGHTS.brand + (100 - o.risk * 20) * WEIGHTS.risk);
}

export default function OfferComparison() {
  const [a, setA] = useState<Offer>({ name: "Offer A", base: 1200000, bonus: 0, commuteMin: 45, remoteDays: 0, learning: 70, brand: 60, risk: 2 });
  const [b, setB] = useState<Offer>({ name: "Offer B", base: 1400000, bonus: 100000, commuteMin: 15, remoteDays: 2, learning: 55, brand: 75, risk: 1 });
  const [ran, setRan] = useState(false);
  const s = useMemo(() => (ran ? { a: score(a), b: score(b) } : null), [ran, a, b]);

  function upd(side: "a" | "b", k: keyof Offer, v: string) {
    const val = k === "name" ? v : Number(v) || 0;
    const set = side === "a" ? setA : setB;
    set((p) => ({ ...p, [k]: val }));
  }

  const fields: { k: keyof Offer; label: string }[] = [
    { k: "name", label: "Label" },
    { k: "base", label: "Base pay (INR/yr)" },
    { k: "bonus", label: "Expected bonus (INR/yr)" },
    { k: "commuteMin", label: "One-way commute (min)" },
    { k: "remoteDays", label: "Remote days per week" },
    { k: "learning", label: "Learning / growth (0-100)" },
    { k: "brand", label: "Brand / resume value (0-100)" },
    { k: "risk", label: "Risk (0 stable - 5 shaky)" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Job offer comparison</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>
        Two offers, one score each. Weights: pay 35, growth 20, commute 15, brand 15, risk 15. Edit the weights in the source if your priorities differ.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {(["a", "b"] as const).map((side) => {
          const o = side === "a" ? a : b;
          return (
            <div key={side} className="hairline p-5">
              <div className="font-semibold mb-3" style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>{o.name}</div>
              {fields.map((f) => (
                <label key={f.k} className="block text-sm mb-2">
                  <span className="block mb-1" style={{ color: "var(--mute)" }}>{f.label}</span>
                  <input
                    type={f.k === "name" ? "text" : "number"}
                    value={String(o[f.k])}
                    onChange={(e) => upd(side, f.k, e.target.value)}
                    className="w-full bg-transparent px-3 py-2 font-mono"
                    style={{ border: "1px solid var(--line)" }}
                  />
                </label>
              ))}
            </div>
          );
        })}
      </div>
      <button onClick={() => setRan(true)} className="btn-primary text-sm mt-6">Compare</button>
      {s && (
        <div className="hairline mt-6 p-6">
          <div className="flex items-baseline gap-6 mb-4">
            <div>
              <div className="font-mono text-4xl font-semibold" style={{ color: s.a >= s.b ? "var(--moss)" : "var(--ink)" }}>{s.a}</div>
              <div className="text-xs" style={{ color: "var(--mute)" }}>{a.name}</div>
            </div>
            <div>
              <div className="font-mono text-4xl font-semibold" style={{ color: s.b > s.a ? "var(--moss)" : "var(--ink)" }}>{s.b}</div>
              <div className="text-xs" style={{ color: "var(--mute)" }}>{b.name}</div>
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--mute)" }}>
            {s.a === s.b
              ? "A tie on the weights. The tiebreaker that matters in practice: which manager you would learn more from."
              : (s.a > s.b ? a.name : b.name) + " wins on these weights. The gap is " + Math.abs(s.a - s.b) + " points; if it is under 10, treat it as a tie and weigh what the score cannot see: the team and the work you would actually do."}
          </p>
          <p className="text-xs mt-3" style={{ color: "var(--mute)" }}>A number organizes the decision; it does not make it. Stock, visa, family, and the manager sit outside this score.</p>
        </div>
      )}
    </div>
  );
}
