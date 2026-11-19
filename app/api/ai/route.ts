import { NextResponse } from "next/server";
import { getTool, buildPrompt } from "@/lib/tools";
import { runGemini } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { tool?: string; values?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request body." }, { status: 400 });
  }
  const tool = getTool(body.tool || "");
  if (!tool || !tool.prompt) {
    return NextResponse.json({ error: "Unknown tool." }, { status: 404 });
  }
  const prompt = buildPrompt(tool, body.values || {});
  try {
    const text = await runGemini(prompt);
    return NextResponse.json({ result: text });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
