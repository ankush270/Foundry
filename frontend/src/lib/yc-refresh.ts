import type { Startup } from "@/data/types";

type RecordValue = Record<string, unknown>;
const record = (value: unknown): RecordValue => value && typeof value === "object" && !Array.isArray(value) ? value as RecordValue : {};
const string = (value: unknown) => typeof value === "string" ? value : "";
const records = (value: unknown) => Array.isArray(value) ? value.map(record) : [];

export function parseYCProfile(html: string, previous: Startup, checkedAt: string): Startup {
  const attribute = html.match(/data-page="([^"]+)"/);
  if (!attribute) throw new Error("YC profile payload missing");
  const decoded = attribute[1].replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
  const props = record(record(JSON.parse(decoded)).props);
  const company = record(props.company);
  if (!company.name || string(company.slug).toLowerCase() !== previous.slug.toLowerCase()) throw new Error("YC company identity mismatch");
  const status = string(company.ycdc_status);
  if (!["Active", "Acquired", "Inactive", "Public"].includes(status)) throw new Error("YC status unrecognized");
  const batch = string(company.batch_name).match(/^(Winter|Summer|Spring|Fall)\s+(\d{4})$/);
  if (!batch) throw new Error("YC batch missing");
  const tags = Array.isArray(company.tags) ? company.tags.filter((t): t is string => typeof t === "string") : [];
  const jobs = Array.isArray(props.jobPostings) ? records(props.jobPostings).filter(j => j.id && j.title).map(j => ({
    id: String(j.id), title: string(j.title), location: string(j.location),
    url: string(j.url) ? new URL(string(j.url), "https://www.ycombinator.com").href : undefined,
  })) : undefined;
  const country = string(company.country);
  let countryName = country;
  try { countryName = country.length === 2 ? new Intl.DisplayNames(["en"], {type: "region"}).of(country) || country : country; } catch { /* Preserve source value. */ }
  return {
    id: previous.id, slug: previous.slug, name: string(company.name),
    logo: string(company.small_logo_url) || string(company.logo_url) || "/founder-placeholder.svg",
    oneLiner: string(company.one_liner), longDescription: string(company.long_description),
    batch: `${batch[1][0]}${batch[2].slice(-2)}`, year: Number(batch[2]), season: batch[1],
    industries: tags, tags, status: status as Startup["status"],
    location: string(company.location) || string(company.city), country: countryName,
    website: string(company.website), teamSize: typeof company.team_size === "number" && company.team_size > 0 ? String(company.team_size) : undefined,
    founders: records(company.founders).filter(f => f.is_active !== false && f.full_name).map(f => ({
      name: string(f.full_name), title: string(f.title) || "Founder", bio: string(f.founder_bio),
      avatar: string(f.avatar_thumb_url), linkedin: string(f.linkedin_url), twitter: string(f.twitter_url),
    })),
    jobs, jobCount: jobs?.length, isHiring: jobs ? jobs.length > 0 : undefined,
    news: records(props.newsItems).filter(n => n.title && n.url).map(n => ({title: string(n.title), url: string(n.url), date: string(n.date)})),
    socials: { github: string(company.github_url), twitter: string(company.twitter_url), linkedin: string(company.linkedin_url), crunchbase: string(company.cb_url) },
    sourceCheckedAt: checkedAt, sourceUrl: `https://www.ycombinator.com/companies/${previous.slug}`,
  };
}

export async function refreshYCProfile(previous: Startup): Promise<Startup> {
  const response = await fetch(`https://www.ycombinator.com/companies/${encodeURIComponent(previous.slug)}`, {
    cache: "no-store", signal: AbortSignal.timeout(12000), headers: {"User-Agent": "Foundry-ProfileRefresh/1.0"},
  });
  if (!response.ok) throw new Error(`YC source returned ${response.status}`);
  return parseYCProfile(await response.text(), previous, new Date().toISOString());
}
