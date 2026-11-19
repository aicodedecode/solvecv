import { notFound } from "next/navigation";
import { getTool, publicTools } from "@/lib/tools";
import ToolRunner from "@/components/ToolRunner";

export function generateStaticParams() {
  return publicTools().filter((t) => !t.customPage).map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  return { title: tool ? tool.name : "Tool" };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool || tool.kind === "internal") notFound();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-2" style={{ fontFamily: "Georgia, serif" }}>{tool.name}</h1>
      <p className="text-sm mb-8" style={{ color: "var(--mute)" }}>{tool.blurb}</p>
      <ToolRunner tool={tool} />
    </div>
  );
}
