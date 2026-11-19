import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return { title: post ? post.title : "Guide" };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="max-w-2xl mx-auto px-4 py-10">
      <div className="font-mono text-xs mb-2" style={{ color: "var(--mute)" }}>{post.date}</div>
      <h1 className="text-3xl font-semibold mb-6" style={{ fontFamily: "Georgia, serif" }}>{post.title}</h1>
      <div className="prose-plain text-[15px] space-y-4">
        {post.body.split("\n\n").map((para, i) => (
          <div key={i}>
            {para.split("\n").map((line, j) => {
              if (line.startsWith("- ")) {
                return <li key={j} className="ml-5 list-disc" style={{ color: "var(--ink)" }}>{line.slice(2)}</li>;
              }
              return <p key={j}>{line}</p>;
            })}
          </div>
        ))}
      </div>
    </article>
  );
}
