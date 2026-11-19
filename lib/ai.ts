import { SYSTEM_PROMPT } from "./tools";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

function friendlyError(status: number, detail: string): string {
  const d = detail.toLowerCase();
  if (status === 503 || d.includes("unavailable") || d.includes("high demand") || d.includes("overloaded")) {
    return "The AI engine is busy right now. Wait a few seconds and run it again.";
  }
  if (status === 429) {
    return "Too many requests hit the AI engine just now. Try again in a minute.";
  }
  if (status === 400 && (d.includes("api key") || d.includes("api_key") || d.includes("api_key_invalid"))) {
    return "The AI engine rejected the API key. Check GEMINI_API_KEY in Vercel project settings, then redeploy.";
  }
  if (status === 404 && d.includes("model")) {
    return "The AI model this site calls is no longer available. Update the model name in lib/ai.ts and redeploy.";
  }
  return "The AI engine could not finish this one. Try again in a moment.";
}

async function callModel(userPrompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not set on this deployment. Add it in Vercel project settings (Environment Variables), then redeploy.");
  }
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent?key=" + key;
  const body = {
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
  };
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const t = await r.text();
    const err = new Error(friendlyError(r.status, t)) as Error & { status?: number };
    err.status = r.status;
    throw err;
  }
  const data = (await r.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("").trim();
  if (!text) throw new Error("The AI engine returned nothing readable. Run it again.");
  return text;
}

export async function runGemini(userPrompt: string): Promise<string> {
  try {
    return await callModel(userPrompt);
  } catch (e) {
    const status = (e as { status?: number }).status;
    if (status === 503 || status === 429) {
      await new Promise((res) => setTimeout(res, 2000));
      return callModel(userPrompt);
    }
    throw e;
  }
}
