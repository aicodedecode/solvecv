import Link from "next/link";
import { publicTools, TOOL_CATEGORIES } from "@/lib/tools";

export const metadata = { title: "All tools" };

export default function ToolsIndex() {
  const tools = publicTools();
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight mb-3">
        All <span className="gradient-text">tools</span>
      </h1>
      <p className="text-zinc-500 mb-10">28 tools. Free, no signup, results stay in your browser.</p>
      {TOOL_CATEGORIES.map((cat) => {
        const list = tools.filter((t) => t.category === cat);
        if (list.length === 0) return null;
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-lg font-semibold text-zinc-300 mb-4">{cat}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((t) => (
                <Link key={t.slug} href={t.customPage || `/tools/${t.slug}`} className="glass card-hover p-5 block group">
                  <div className="font-medium mb-1.5 group-hover:text-emerald-300 transition-colors">{t.name}</div>
                  <div className="text-sm text-zinc-500 leading-relaxed">{t.blurb}</div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
