export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  type: string;
  tags: string[];
  url: string;
  source: string;
  date: string | null;
  category: string;
  country: string;
};

const COUNTRIES: [RegExp, string][] = [
  [/remote|anywhere|worldwide|global/i, "remote"],
  [/india|bangalore|bengaluru|mumbai|delhi|hyderabad|chennai|pune|kolkata|gurgaon|gurugram|noida|ahmedabad|jaipur|indore|kochi|coimbatore|telangana|karnataka|maharashtra|tamil nadu|gujarat|rajasthan|kerala|uttar pradesh|haryana/i, "india"],
  [/united states|\busa\b|new york|san francisco|california|texas|seattle|austin|boston|chicago|denver|atlanta/i, "united states"],
  [/germany|berlin|munich|hamburg|bavaria/i, "germany"],
  [/united kingdom|\buk\b|london|manchester|england|scotland|wales/i, "united kingdom"],
  [/canada|toronto|vancouver|montreal|ottawa/i, "canada"],
  [/france|paris/i, "france"],
  [/netherlands|amsterdam|rotterdam/i, "netherlands"],
  [/singapore/i, "singapore"],
  [/australia|sydney|melbourne/i, "australia"],
  [/spain|madrid|barcelona/i, "spain"],
  [/poland|warsaw/i, "poland"],
  [/portugal|lisbon/i, "portugal"],
  [/brazil|sao paulo/i, "brazil"],
  [/japan|tokyo/i, "japan"],
  [/united arab emirates|\buae\b|dubai|abu dhabi|saudi|riyadh/i, "middle east"],
];

const CATEGORIES: [RegExp, string][] = [
  [/engineer|developer|software|backend|frontend|full.?stack|devops|sre|sde|architect|programmer|mobile|android|ios|qa|test|security|blockchain|embedded/i, "engineering"],
  [/data|analyst|scientist|machine learning|\bml\b|\bai\b|analytics|statistic/i, "data and ai"],
  [/design|ux|ui\b|graphic|illustrat/i, "design"],
  [/product manager|\bpm\b|product owner/i, "product"],
  [/market|growth|\bseo\b|content|brand|social media/i, "marketing"],
  [/support|bpo|customer|helpdesk|call center/i, "support"],
  [/finance|account|audit|tax|fiscal|bookkeep/i, "finance"],
  [/hr\b|recruit|talent|hiring|people operations/i, "hr"],
  [/sales|business development|account executive/i, "sales"],
  [/nurse|medical|health|clinic/i, "healthcare"],
];

function normalizeType(raw: string): string {
  const t = (raw || "").toLowerCase().replace(/[_-]/g, " ");
  if (t.includes("full")) return "full-time";
  if (t.includes("part")) return "part-time";
  if (t.includes("contract")) return "contract";
  if (t.includes("intern") || t.includes("trainee")) return "internship";
  if (t.includes("freelance")) return "contract";
  if (t.includes("temporary") || t.includes("temp")) return "contract";
  return "";
}

function detectCountry(location: string, remote: boolean): string {
  if (remote && (!location || /remote|anywhere/i.test(location))) return "remote";
  for (const [re, name] of COUNTRIES) {
    if (re.test(location)) return name;
  }
  return "other";
}

function detectCategory(text: string): string {
  for (const [re, name] of CATEGORIES) {
    if (re.test(text)) return name;
  }
  return "other";
}

function makeId(source: string, url: string): string {
  return Buffer.from(source + "|" + url).toString("base64url").slice(0, 60);
}

let cache: { jobs: Job[]; at: number } | null = null;
const TTL = 30 * 60 * 1000;

type Raw = Record<string, unknown>;
const s = (o: Raw, k: string): string => (typeof o[k] === "string" ? (o[k] as string) : "");

async function fetchJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const r = await fetch(url, {
    headers: { "User-Agent": "solvecv/1.0 (job aggregator)", Accept: "application/json", ...headers },
    next: { revalidate: 1800 },
  });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

async function loadArbeitnow(): Promise<Job[]> {
  const data = (await fetchJson("https://www.arbeitnow.com/api/job-board-api")) as { data?: Raw[] };
  return (data.data || []).map((j: Raw) => {
    const remote = Boolean(j.remote);
    const title = s(j, "title");
    return {
      id: makeId("arbeitnow", s(j, "url")),
      title,
      company: s(j, "company_name"),
      location: s(j, "location") || (remote ? "Remote" : ""),
      remote,
      type: normalizeType(Array.isArray(j.job_types) ? (j.job_types as string[]).join(",") : ""),
      tags: (Array.isArray(j.tags) ? j.tags : []).slice(0, 6) as string[],
      url: s(j, "url"),
      source: "arbeitnow",
      date: s(j, "created") || null,
      category: detectCategory(title),
      country: detectCountry(s(j, "location") || (remote ? "Remote" : ""), remote),
    };
  });
}

async function loadRemotive(): Promise<Job[]> {
  const data = (await fetchJson("https://remotive.com/api/remote-jobs?limit=120")) as { jobs?: Raw[] };
  return (data.jobs || []).map((j: Raw) => {
    const title = s(j, "title");
    return {
      id: makeId("remotive", s(j, "url")),
      title,
      company: s(j, "company_name"),
      location: s(j, "candidate_required_location") || "Remote",
      remote: true,
      type: normalizeType(s(j, "job_type")),
      tags: (Array.isArray(j.tags) ? j.tags : []).slice(0, 6) as string[],
      url: s(j, "url"),
      source: "remotive",
      date: s(j, "publication_date") || null,
      category: detectCategory(title + " " + s(j, "category")),
      country: "remote",
    };
  });
}

async function loadJobicy(): Promise<Job[]> {
  const data = (await fetchJson("https://jobicy.com/api/v2/remote-jobs?count=100")) as { jobs?: Raw[] };
  return (data.jobs || []).map((j: Raw) => {
    const title = s(j, "jobTitle");
    return {
      id: makeId("jobicy", s(j, "url")),
      title,
      company: s(j, "companyName"),
      location: s(j, "jobGeo") || "Remote",
      remote: true,
      type: normalizeType(s(j, "jobType")),
      tags: (Array.isArray(j.jobLevel) ? j.jobLevel : []).slice(0, 3) as string[],
      url: s(j, "url"),
      source: "jobicy",
      date: s(j, "pubDate") || null,
      category: detectCategory(title + " " + s(j, "industryName")),
      country: "remote",
    };
  });
}

async function loadRemoteOk(): Promise<Job[]> {
  const data = (await fetchJson("https://remoteok.com/api")) as Raw[];
  return (Array.isArray(data) ? data : [])
    .filter((j) => j && typeof j === "object" && s(j, "position"))
    .map((j: Raw) => {
      const title = s(j, "position");
      const url = "https://remoteok.com" + s(j, "url");
      return {
        id: makeId("remoteok", url),
        title,
        company: s(j, "company"),
        location: s(j, "location") || "Remote",
        remote: true,
        type: normalizeType(s(j, "type")),
        tags: ((Array.isArray(j.tags) ? j.tags : []) as string[]).slice(0, 6),
        url,
        source: "remoteok",
        date: s(j, "date") || null,
        category: detectCategory(title),
        country: "remote",
      };
    });
}

export async function getJobs(): Promise<Job[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.jobs;
  const results = await Promise.allSettled([loadArbeitnow(), loadRemotive(), loadJobicy(), loadRemoteOk()]);
  const jobs: Job[] = [];
  const seen = new Set<string>();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const j of r.value) {
      if (!j.url || !j.title) continue;
      const key = (j.title + "|" + j.company).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      jobs.push(j);
    }
  }
  jobs.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  if (jobs.length > 0) cache = { jobs, at: Date.now() };
  return jobs;
}

export function filterJobs(
  jobs: Job[],
  opts: { q?: string; country?: string; category?: string; type?: string; remote?: boolean }
): Job[] {
  const q = (opts.q || "").trim().toLowerCase();
  return jobs.filter((j) => {
    if (opts.remote === true && !j.remote) return false;
    if (opts.country && opts.country !== "all" && j.country !== opts.country) return false;
    if (opts.category && opts.category !== "all" && j.category !== opts.category) return false;
    if (opts.type && opts.type !== "all" && j.type !== opts.type) return false;
    if (q) {
      const hay = (j.title + " " + j.company + " " + j.tags.join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export const COUNTRY_LIST = [
  "remote", "india", "united states", "united kingdom", "germany", "canada", "france",
  "netherlands", "singapore", "australia", "spain", "poland", "middle east", "other",
];

export const CATEGORY_LIST = [
  "engineering", "data and ai", "design", "product", "marketing", "support", "finance", "hr", "sales", "healthcare", "other",
];

export const TYPE_LIST = ["full-time", "part-time", "contract", "internship"];
