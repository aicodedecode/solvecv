"use client";

import { useState } from "react";
import Link from "next/link";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit() {
    setState("sending");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (r.ok) { setState("done"); }
      else { setState("error"); setMsg(d.error || "Something went wrong."); }
    } catch {
      setState("error");
      setMsg("Could not reach the signup endpoint.");
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Weekly job alerts</h1>
      <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>
        One Friday email: the week's best openings by field, no filler. One click to leave.
      </p>
      {state === "done" ? (
        <div className="hairline p-6">
          <p className="font-medium">You are on the list.</p>
          <p className="text-sm mt-1" style={{ color: "var(--mute)" }}>First email lands Friday. Until then, the <Link href="/jobs" className="underline underline-offset-4">job board</Link> refreshes continuously.</p>
        </div>
      ) : (
        <div>
          <div className="flex gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              className="flex-1 bg-transparent px-3 py-2 text-sm"
              style={{ border: "1px solid var(--line)" }}
            />
            <button onClick={submit} disabled={state === "sending"} className="btn-primary text-sm">Subscribe</button>
          </div>
          {msg && <p className="text-sm mt-3" style={{ color: "#a03030" }}>{msg}</p>}
        </div>
      )}
    </div>
  );
}
