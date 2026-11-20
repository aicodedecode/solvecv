import { NextResponse } from "next/server";
import { getJobs, filterJobs, facetCounts } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const all = await getJobs();
    const q = searchParams.get("q") || undefined;
    const country = searchParams.get("country") || undefined;
    const category = searchParams.get("category") || undefined;
    const type = searchParams.get("type") || undefined;
    const remote = searchParams.get("remote") === "1" ? true : undefined;
    const sort = searchParams.get("sort") === "date" ? "date" : "relevance";
    const filtered = filterJobs(all, { q, country, category, type, remote, sort });
    const total = filtered.length;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const per = 25;
    const jobs = filtered.slice((page - 1) * per, page * per);
    const counts = {
      country: facetCounts(filterJobs(all, { q, country: undefined, category, type, remote, sort })).country,
      category: facetCounts(filterJobs(all, { q, country, category: undefined, type, remote, sort })).category,
      type: facetCounts(filterJobs(all, { q, country, category, type: undefined, remote, sort })).type,
    };
    return NextResponse.json({ jobs, total, page, per, counts });
  } catch {
    return NextResponse.json({ jobs: [], total: 0, error: "Job sources did not respond. Try again in a minute." }, { status: 502 });
  }
}
