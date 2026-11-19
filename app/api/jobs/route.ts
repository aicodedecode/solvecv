import { NextResponse } from "next/server";
import { getJobs, filterJobs } from "@/lib/jobs";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  try {
    const all = await getJobs();
    const filtered = filterJobs(all, {
      q: searchParams.get("q") || undefined,
      country: searchParams.get("country") || undefined,
      category: searchParams.get("category") || undefined,
      type: searchParams.get("type") || undefined,
      remote: searchParams.get("remote") === "1" ? true : undefined,
    });
    const total = filtered.length;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const per = 25;
    const jobs = filtered.slice((page - 1) * per, page * per);
    return NextResponse.json({ jobs, total, page, per });
  } catch {
    return NextResponse.json({ jobs: [], total: 0, error: "Job sources did not respond. Try again in a minute." }, { status: 502 });
  }
}
