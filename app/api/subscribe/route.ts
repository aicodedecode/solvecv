import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  const webhook = process.env.ALERTS_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      { error: "Alert delivery is not wired up on this deployment. Set ALERTS_WEBHOOK_URL to an email-provider endpoint (Buttondown, Mailchimp, Resend) and redeploy." },
      { status: 503 }
    );
  }
  try {
    const r = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "solvecv-alerts", subscribedAt: new Date().toISOString() }),
    });
    if (!r.ok) return NextResponse.json({ error: "The email provider rejected the signup." }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not reach the email provider." }, { status: 502 });
  }
}
