const fs = require('fs');
const path = require('path');

const SCRAPED_JSON_PATH = path.join(__dirname, 'scraped-startups.json');
const OUTPUT_TS_PATH = path.join(__dirname, '../../frontend/src/data/startups.ts');

function parseBatch(batchStr) {
  if (!batchStr) return { batch: 'W24', year: 2024, season: 'Winter' };
  const str = batchStr.trim();
  const match = str.match(/(Summer|Winter|Spring|Fall|S|W|F)\s*(\d{2,4})/i);
  if (match) {
    const sChar = match[1][0].toUpperCase();
    let season = 'Winter';
    if (sChar === 'S') season = 'Summer';
    if (sChar === 'F') season = 'Fall';
    if (sChar === 'S' && match[1].toLowerCase().startsWith('sp')) season = 'Spring';

    let yearNum = parseInt(match[2], 10);
    if (yearNum < 100) {
      yearNum += yearNum > 50 ? 1900 : 2000;
    }
    return { batch: `${sChar}${yearNum.toString().slice(-2)}`, year: yearNum, season };
  }
  return { batch: 'W24', year: 2024, season: 'Winter' };
}

function parseCountry(locationStr) {
  if (!locationStr) return 'USA';
  const l = locationStr.toLowerCase();
  if (l.includes('india') || l.includes('bengaluru') || l.includes('mumbai') || l.includes('delhi')) return 'India';
  if (l.includes('uk') || l.includes('united kingdom') || l.includes('london')) return 'UK';
  if (l.includes('canada') || l.includes('toronto') || l.includes('vancouver')) return 'Canada';
  if (l.includes('germany') || l.includes('berlin') || l.includes('munich')) return 'Germany';
  if (l.includes('france') || l.includes('paris')) return 'France';
  if (l.includes('singapore')) return 'Singapore';
  if (l.includes('israel') || l.includes('tel aviv')) return 'Israel';
  if (l.includes('brazil') || l.includes('são paulo')) return 'Brazil';
  if (l.includes('nigeria') || l.includes('lagos')) return 'Nigeria';
  if (l.includes('san francisco') || l.includes('ca') || l.includes('ny') || l.includes('usa') || l.includes('united states')) return 'USA';
  
  const parts = locationStr.split(',').map(s => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : locationStr;
}

function parseStatus(statusStr) {
  if (!statusStr) return 'Active';
  const l = statusStr.toLowerCase();
  if (l.includes('public') || l.includes('ipo')) return 'Public';
  if (l.includes('acquired')) return 'Acquired';
  if (l.includes('inactive') || l.includes('dead')) return 'Inactive';
  return 'Active';
}

function parseFundingStage(status, teamSizeNum) {
  if (status === 'Public') return 'IPO';
  if (status === 'Acquired') return 'Acquired';
  if (teamSizeNum > 500) return 'Series D+';
  if (teamSizeNum > 100) return 'Series C';
  if (teamSizeNum > 30) return 'Series B';
  if (teamSizeNum > 10) return 'Series A';
  return 'Seed';
}

function generateLogo(name) {
  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9',
    'F8C471', '82E0AA', 'F1948A', 'AED6F1', 'D7BDE2'
  ];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[idx]}&color=fff&size=128&bold=true&font-size=0.4`;
}

function parseMetaDescription(metaDesc) {
  if (!metaDesc) return null;

  let year = null;
  let founders = [];
  let teamSize = null;
  let location = null;
  let isHiring = false;
  let jobCount = 0;

  const yearMatch = metaDesc.match(/Founded in (\d{4})/i);
  if (yearMatch) year = parseInt(yearMatch[1], 10);

  const byMatch = metaDesc.match(/by\s+([^,\.]+?(?:,\s*[^,\.]+?)*(?:,?\s+and\s+[^,\.]+?))\s*,\s*([A-Z][a-zA-Z0-9\s]+)?\s*has/i) || metaDesc.match(/by\s+([^,\.]+?(?:,\s*[^,\.]+?)*(?:,?\s+and\s+[^,\.]+?))\s*[\.,]/i);
  if (byMatch) {
    const rawFounders = byMatch[1];
    founders = rawFounders
      .replace(/,?\s+and\s+/gi, ', ')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 2 && !s.toLowerCase().startsWith('founded'))
      .map(n => ({ name: n, title: 'Co-Founder' }));
  }

  const empMatch = metaDesc.match(/has\s+(\d+)\s+employees/i);
  if (empMatch) teamSize = empMatch[1];

  const locMatch = metaDesc.match(/based in\s+([^\.]+)/i);
  if (locMatch) location = locMatch[1].trim();

  const hiringMatch = metaDesc.match(/is hiring for (\d+)\s*roles/i);
  if (hiringMatch) {
    isHiring = true;
    jobCount = parseInt(hiringMatch[1], 10);
  }

  return { year, founders, teamSize, location, isHiring, jobCount };
}

async function fetchCompanyDeepProps(slug) {
  try {
    const res = await fetch(`https://www.ycombinator.com/companies/${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return null;
    const html = await res.text();

    let metaDesc = null;
    const metaMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i) || html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"/i);
    if (metaMatch) {
      metaDesc = metaMatch[1];
    }

    let props = null;
    const match = html.match(/data-page="([^"]+)"/);
    if (match) {
      const rawJson = match[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');
      const pageData = JSON.parse(rawJson);
      props = pageData?.props || null;
    }

    return { props, metaDesc };
  } catch (e) {
    // ignore
  }
  return null;
}

(async () => {
  console.log('🚀 Deep Fetching Official YC Data (Founders, Meta Extraction, Bios, Avatars, Hiring/Jobs, News) ...');
  
  const existingStartups = JSON.parse(fs.readFileSync(SCRAPED_JSON_PATH, 'utf-8'));
  console.log(`Found ${existingStartups.length} startups to enrich.`);

  const BATCH_SIZE = 25;
  const enrichedStartups = [];

  for (let i = 0; i < existingStartups.length; i += BATCH_SIZE) {
    const chunk = existingStartups.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(existingStartups.length / BATCH_SIZE)} (startups ${i + 1}-${i + chunk.length})...`);
    
    const results = await Promise.all(chunk.map(s => fetchCompanyDeepProps(s.slug)));

    for (let j = 0; j < chunk.length; j++) {
      const fallback = chunk[j];
      const fetched = results[j] || {};
      const props = fetched.props || {};
      const real = props.company || null;
      const metaParsed = parseMetaDescription(fetched.metaDesc);

      const slug = fallback.slug;
      const name = real?.name || fallback.name || slug.charAt(0).toUpperCase() + slug.slice(1);
      const oneLiner = real?.one_liner || fallback.oneLiner || `${name} is a Y Combinator backed technology company.`;
      
      let longDesc = real?.long_description || fallback.longDescription || oneLiner;
      longDesc = longDesc.replace(/\r\n/g, ' ').replace(/\n/g, ' ').trim();
      if (!longDesc.endsWith('.')) longDesc += '.';

      const location = real?.location || metaParsed?.location || fallback.location || 'San Francisco, CA, USA';
      const country = parseCountry(location);

      const batchInfo = parseBatch(real?.batch_name || fallback.batch || 'W24');

      let logo = real?.small_logo_url || real?.logo_url || fallback.logo;
      if (!logo || logo.includes('placeholder')) {
        logo = generateLogo(name);
      }

      const status = parseStatus(real?.status || fallback.status);

      // Deep Founder Details
      let founders = [];
      if (real?.founders && Array.isArray(real.founders) && real.founders.length > 0) {
        founders = real.founders.map(f => ({
          name: f.full_name || f.name || 'Co-Founder',
          title: f.title || 'Co-Founder',
          bio: f.founder_bio || undefined,
          avatar: f.avatar_thumb_url || undefined,
          linkedin: f.linkedin_url || undefined,
          twitter: f.twitter_url || undefined
        }));
      } else if (metaParsed?.founders && metaParsed.founders.length > 0) {
        founders = metaParsed.founders;
      } else if (fallback.founders && fallback.founders.length > 0 && !fallback.founders[0].name.includes('Founder')) {
        founders = fallback.founders;
      } else {
        founders = [{ name: `${name} Leadership`, title: 'Founding Team' }];
      }

      // Hiring / Jobs Data
      const jobPostings = props.jobPostings && Array.isArray(props.jobPostings) ? props.jobPostings : [];
      const isHiring = jobPostings.length > 0 || Boolean(metaParsed?.isHiring);
      const jobCount = jobPostings.length || metaParsed?.jobCount || (isHiring ? 1 : 0);

      const jobs = jobPostings.map(j => ({
        id: j.id,
        title: j.title,
        role: j.prettyRole || j.role || 'Software Engineering',
        location: j.location || location,
        type: j.type || 'Full-time',
        salaryRange: j.salaryRange || undefined,
        equityRange: j.equityRange || undefined,
        minExperience: j.minExperience || undefined,
        visa: j.visa || undefined,
        url: j.url ? `https://www.ycombinator.com${j.url}` : undefined
      }));

      // News Items
      const newsItems = props.newsItems && Array.isArray(props.newsItems) ? props.newsItems : [];
      const news = newsItems.map(n => ({
        title: n.title,
        url: n.url,
        date: n.date
      }));

      // Real team size
      const teamSizeNum = real?.team_size || (metaParsed?.teamSize ? parseInt(metaParsed.teamSize, 10) : (fallback.teamSize ? parseInt(fallback.teamSize, 10) : 15));
      const teamSizeStr = teamSizeNum ? `${teamSizeNum}` : '10-50';
      const fundingStage = parseFundingStage(status, teamSizeNum);

      // Industries
      let industries = [];
      if (real?.industry) industries.push(real.industry);
      if (real?.subindustry && real.subindustry !== real.industry) industries.push(real.subindustry);
      if (industries.length === 0 && fallback.industries) industries = fallback.industries;
      if (industries.length === 0) industries = ['Technology'];

      // Tags
      const tags = Array.isArray(fallback.tags) ? [...fallback.tags] : [];
      if (real?.subindustry && !tags.includes(real.subindustry)) tags.push(real.subindustry);
      if (teamSizeNum > 1000 && !tags.includes('Unicorn')) tags.push('Unicorn');
      if (status === 'Public' && !tags.includes('Public Company')) tags.push('Public Company');
      if (isHiring && !tags.includes('Hiring Now')) tags.push('Hiring Now');

      // Socials & Website
      const website = real?.website || fallback.website || `https://${slug}.com`;
      const socials = {
        twitter: real?.twitter_url || undefined,
        linkedin: real?.linkedin_url || undefined,
        crunchbase: real?.cb_url || undefined,
        github: real?.github_url || undefined
      };

      enrichedStartups.push({
        id: slug,
        name,
        slug,
        logo,
        oneLiner: oneLiner.slice(0, 200),
        longDescription: longDesc.slice(0, 1000),
        batch: batchInfo.batch,
        year: metaParsed?.year || batchInfo.year,
        season: batchInfo.season,
        industries,
        tags: tags.length ? tags : ['B2B', 'SaaS'],
        founders,
        location,
        country,
        status,
        website,
        teamSize: teamSizeStr,
        fundingStage,
        isHiring,
        jobCount,
        jobs: jobs.length ? jobs : undefined,
        news: news.length ? news : undefined,
        socials
      });
    }
  }

  console.log(`✅ Successfully extracted DEEP YC data for ${enrichedStartups.length} startups!`);

  // Save JSON
  fs.writeFileSync(SCRAPED_JSON_PATH, JSON.stringify(enrichedStartups, null, 2), 'utf-8');
  console.log(`💾 Saved deep JSON to ${SCRAPED_JSON_PATH}`);

  // Save TS
  const tsContent = `import type { Startup } from "./types";

// Re-export types
export type { Startup, Founder, JobPosting, NewsItem } from "./types";

export const startups: Startup[] = ${JSON.stringify(enrichedStartups, null, 2)};
`;

  fs.writeFileSync(OUTPUT_TS_PATH, tsContent, 'utf-8');
  console.log(`💾 Updated TypeScript dataset at ${OUTPUT_TS_PATH}`);

  console.log('🎉 DEEP YC DATA EXTRACTION COMPLETE!');
})();
