import Link from "next/link";
import { publicTools, TOOL_CATEGORIES } from "@/lib/tools";

export const metadata = { title: "All tools" };

export default function ToolsIndex() {
  const tools = publicTools();
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>All tools</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>28 tools. Free, no signup, results stay in your browser.</p>
      {TOOL_CATEGORIES.map((cat) => {
        const list = tools.filter((t) => t.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="text-lg font-semibold mb-3" style={{ fontFamily: "Georgia, serif" }}>{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "var(--line)" }}>
              {list.map((t) => (
                <Link key={t.slug} href={t.customPage || `/tools/${t.slug}`} className="bg-paper p-5 hover:bg-black/[0.03] block">
                  <div className="font-medium mb-1">{t.name}</div>
                  <div className="text-sm" style={{ color: "var(--mute)" }}>{t.blurb}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
