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
  salary?: string;
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
  if (t.includes("full") || t.includes("permanent")) return "full-time";
  if (t.includes("part")) return "part-time";
  if (t.includes("contract")) return "contract";
  if (t.includes("intern") || t.includes("trainee")) return "internship";
  if (t.includes("freelance")) return "contract";
  if (t.includes("temporary") || t.includes("temp")) return "contract";
  return "";
}

function detectCountry(location: string, remote: boolean): string {
  if (remote && (!location || /remote|anywhere|work from home/i.test(location))) return "remote";
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
const sub = (o: Raw, k: string): Raw => (o[k] && typeof o[k] === "object" ? (o[k] as Raw) : {});

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

const ADZUNA_FEEDS: [string, string, string][] = [
  ["in", "india", "\u20b9"],
  ["gb", "united kingdom", "\u00a3"],
  ["us", "united states", "$"],
  ["de", "germany", "\u20ac"],
  ["ca", "canada", "C$"],
];

function compactMoney(n: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 0 }).format(n);
}

async function loadAdzuna(): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];
  const feeds = await Promise.allSettled(
    ADZUNA_FEEDS.map(async ([cc, country, currency]) => {
      const url = `https://api.adzuna.com/v1/api/jobs/${cc}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=50&content-type=application/json`;
      const data = (await fetchJson(url)) as { results?: Raw[] };
      return ((data.results || []) as Raw[]).map((j: Raw): Job => {
        const title = s(j, "title").replace(/<[^>]+>/g, "").trim();
        const company = s(sub(j, "company"), "display_name");
        const loc = s(sub(j, "location"), "display_name");
        const remote = /remote|work from home/i.test(loc);
        const min = typeof j.salary_min === "number" ? (j.salary_min as number) : 0;
        const max = typeof j.salary_max === "number" ? (j.salary_max as number) : 0;
        const salary =
          min > 0 && max > 0
            ? `${currency}${compactMoney(min)} \u2013 ${currency}${compactMoney(max)}`
            : min > 0
              ? `${currency}${compactMoney(min)}+`
              : undefined;
        const cat = s(sub(j, "category"), "tag");
        return {
          id: makeId("adzuna", s(j, "redirect_url")),
          title,
          company,
          location: loc || country,
          remote,
          type: normalizeType(s(j, "contract_type")),
          tags: [cat].filter(Boolean).slice(0, 3),
          url: s(j, "redirect_url"),
          source: "adzuna",
          date: s(j, "created") || null,
          category: detectCategory(title + " " + cat),
          country: remote ? detectCountry(loc, remote) : country,
          salary,
        };
      });
    })
  );
  const out: Job[] = [];
  for (const r of feeds) if (r.status === "fulfilled") out.push(...r.value);
  return out;
}

const SOURCES = [loadAdzuna, loadArbeitnow, loadRemotive, loadJobicy, loadRemoteOk];

export async function getJobs(): Promise<Job[]> {
  if (cache && Date.now() - cache.at < TTL) return cache.jobs;
  const results = await Promise.allSettled(SOURCES.map((fn) => fn()));
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

export type FilterOpts = {
  q?: string;
  country?: string;
  category?: string;
  type?: string;
  remote?: boolean;
  sort?: "date" | "relevance";
};

const isWordChar = (c: string) => /[a-z0-9+#.]/.test(c);

// "exact": token is a full word in hay ("react" inside "react developer").
// "prefix": token starts a word but extends it ("analyst" inside "analysts").
function wordMatch(hay: string, token: string): "exact" | "prefix" | "none" {
  if (!hay || !token) return "none";
  let i = hay.indexOf(token);
  while (i !== -1) {
    const before = i === 0 ? " " : hay[i - 1];
    const end = i + token.length;
    const after = end >= hay.length ? " " : hay[end];
    if (!isWordChar(before) && !isWordChar(after)) return "exact";
    if (!isWordChar(before)) return "prefix";
    i = hay.indexOf(token, i + 1);
  }
  return "none";
}

function recencyBonus(date: string | null): number {
  if (!date) return 0;
  const age = Date.now() - Date.parse(date);
  if (!Number.isFinite(age)) return 0;
  const days = age / 86400000;
  if (days <= 3) return 2;
  if (days <= 7) return 1;
  if (days <= 14) return 0.5;
  return 0;
}

export function relevanceScore(j: Job, tokens: string[]): number {
  const title = j.title.toLowerCase();
  const company = j.company.toLowerCase();
  const tags = j.tags.join(" ").toLowerCase();
  const location = j.location.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    const tm = wordMatch(title, t);
    if (tm === "exact") score += 4;
    else if (tm === "prefix") score += 2;
    const gm = wordMatch(tags, t);
    if (gm === "exact") score += 1.5;
    else if (gm === "prefix") score += 0.75;
    if (wordMatch(company, t) !== "none") score += 1;
    if (wordMatch(location, t) !== "none") score += 1;
  }
  if (tokens.length > 1) {
    const phrase = tokens.join(" ");
    if (title.includes(phrase)) score += 3;
    else if (tags.includes(phrase) || location.includes(phrase)) score += 1.5;
  }
  return score + recencyBonus(j.date);
}

export function filterJobs(jobs: Job[], opts: FilterOpts): Job[] {
  const q = (opts.q || "").trim().toLowerCase();
  const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
  const filtered = jobs.filter((j) => {
    if (opts.remote === true && !j.remote) return false;
    if (opts.country && opts.country !== "all" && j.country !== opts.country) return false;
    if (opts.category && opts.category !== "all" && j.category !== opts.category) return false;
    if (opts.type && opts.type !== "all" && j.type !== opts.type) return false;
    if (q) {
      const hay = (j.title + " " + j.company + " " + j.tags.join(" ") + " " + j.location).toLowerCase();
      if (!tokens.every((t) => wordMatch(hay, t) !== "none")) return false;
    }
    return true;
  });
  if (tokens.length > 0 && opts.sort !== "date") {
    return filtered.sort(
      (a, b) =>
        relevanceScore(b, tokens) - relevanceScore(a, tokens) ||
        (b.date || "").localeCompare(a.date || "")
    );
  }
  return filtered.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
}

export function facetCounts(jobs: Job[]): {
  country: Record<string, number>;
  category: Record<string, number>;
  type: Record<string, number>;
} {
  const out = { country: {} as Record<string, number>, category: {} as Record<string, number>, type: {} as Record<string, number> };
  for (const j of jobs) {
    out.country[j.country] = (out.country[j.country] || 0) + 1;
    out.category[j.category] = (out.category[j.category] || 0) + 1;
    if (j.type) out.type[j.type] = (out.type[j.type] || 0) + 1;
  }
  return out;
}

export const COUNTRY_LIST = [
  "remote", "india", "united states", "united kingdom", "germany", "canada", "france",
  "netherlands", "singapore", "australia", "spain", "poland", "middle east", "other",
];

export const CATEGORY_LIST = [
  "engineering", "data and ai", "design", "product", "marketing", "support", "finance", "hr", "sales", "healthcare", "other",
];

export const TYPE_LIST = ["full-time", "part-time", "contract", "internship"];
