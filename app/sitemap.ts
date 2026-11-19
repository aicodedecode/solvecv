import type { MetadataRoute } from "next";
import { publicTools } from "@/lib/tools";
import { POSTS } from "@/lib/posts";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://solvecv.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/jobs", "/tools", "/blog", "/learn", "/subscribe", "/post-a-job", "/privacy", "/terms"].map((p) => ({
    url: BASE + p,
    lastModified: new Date(),
  }));
  const tools = publicTools().filter((t) => !t.customPage).map((t) => ({
    url: `${BASE}/tools/${t.slug}`,
    lastModified: new Date(),
  }));
  const posts = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...staticPages, ...tools, ...posts];
}
