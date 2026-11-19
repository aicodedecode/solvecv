import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const metadata = { title: "Guides" };

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>Guides</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>Short, practical, no courses behind the text.</p>
      <div className="space-y-8">
        {POSTS.map((p) => (
          <article key={p.slug} className="hairline p-5">
            <div className="font-mono text-xs mb-1" style={{ color: "var(--mute)" }}>{p.date}</div>
            <Link href={`/blog/${p.slug}`} className="text-lg font-semibold hover:underline underline-offset-4" style={{ fontFamily: "Georgia, serif" }}>{p.title}</Link>
            <p className="text-sm mt-1" style={{ color: "var(--mute)" }}>{p.blurb}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
