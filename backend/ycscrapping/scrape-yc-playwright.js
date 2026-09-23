const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_JSON_PATH = path.join(__dirname, 'scraped-startups.json');
const OUTPUT_TS_PATH = path.join(__dirname, '../../frontend/src/data/startups.ts');

function parseCountry(locationStr) {
  if (!locationStr) return 'USA';
  if (locationStr.includes('India')) return 'India';
  if (locationStr.includes('UK') || locationStr.includes('United Kingdom') || locationStr.includes('London')) return 'UK';
  if (locationStr.includes('Canada') || locationStr.includes('Toronto')) return 'Canada';
  if (locationStr.includes('Germany') || locationStr.includes('Berlin')) return 'Germany';
  if (locationStr.includes('France') || locationStr.includes('Paris')) return 'France';
  if (locationStr.includes('Singapore')) return 'Singapore';
  if (locationStr.includes('San Francisco') || locationStr.includes('CA') || locationStr.includes('NY') || locationStr.includes('USA') || locationStr.includes('United States')) {
    return 'USA';
  }
  const parts = locationStr.split(',').map(s => s.trim());
  return parts.length > 1 ? parts[parts.length - 1] : locationStr;
}

function parseBatch(batchStr) {
  if (!batchStr) return { batch: 'W24', year: 2024, season: 'Winter' };
  const str = batchStr.trim().toUpperCase();
  const match = str.match(/(SUMMER|WINTER|SPRING|FALL|S|W|F)(\s*)(\d{2,4})/i);
  if (match) {
    let sChar = match[1][0];
    let season = 'Winter';
    if (sChar === 'S') season = 'Summer';
    if (sChar === 'F') season = 'Fall';

    let yearNum = parseInt(match[3], 10);
    if (yearNum < 100) {
      yearNum += yearNum > 50 ? 1900 : 2000;
    }
    return { batch: `${sChar}${yearNum.toString().slice(-2)}`, year: yearNum, season };
  }
  return { batch: 'W24', year: 2024, season: 'Winter' };
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

(async () => {
  console.log('🚀 Starting Precision YC Playwright Scraper...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  const apiHitsMap = new Map();

  // Intercept any JSON payloads from YC or Algolia
  page.on('response', async (res) => {
    const url = res.url();
    try {
      if (url.includes('algolia') || url.includes('/query') || url.includes('companies')) {
        const ct = res.headers()['content-type'] || '';
        if (ct.includes('application/json')) {
          const json = await res.json().catch(() => null);
          if (json && json.hits && Array.isArray(json.hits)) {
            console.log(`📡 Intercepted API hits payload: ${json.hits.length} items`);
            json.hits.forEach(hit => {
              if (hit.slug || hit.name) {
                const slug = hit.slug || hit.id || hit.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                apiHitsMap.set(slug, { ...hit, slug });
              }
            });
          }
        }
      }
    } catch (e) {
      // ignore
    }
  });

  console.log('🌐 Navigating to YC Directory: https://www.ycombinator.com/companies');
  await page.goto('https://www.ycombinator.com/companies', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Auto scroll main directory page to trigger loading
  console.log('📜 Auto scrolling page to trigger rich DOM card hydration...');
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => window.scrollBy(0, 2500));
    await page.waitForTimeout(500);
  }

  // Extract structured cards from DOM
  const domCompanies = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href*="/companies/"]'));
    const results = [];

    links.forEach(a => {
      const href = a.getAttribute('href') || '';
      const match = href.match(/\/companies\/([^\/\?]+)/);
      if (!match) return;
      const slug = match[1];
      if (['founders', 'apply', 'launches', 'jobs', 'library'].includes(slug)) return;

      const img = a.querySelector('img');
      const logo = img ? img.src : '';

      // Get text node structure
      const nameNode = a.querySelector('._name_1t0d2_31, .font-bold, h3') || a;
      let name = nameNode ? nameNode.innerText.trim() : slug;
      
      // Clean name if multi-line
      if (name.includes('\n')) {
        name = name.split('\n')[0].trim();
      }

      // Collect all text strings from span/p elements
      const textElements = Array.from(a.querySelectorAll('span, p, div')).map(el => el.innerText.trim()).filter(Boolean);
      
      // Separate tagline, location, batch, industry
      let location = '';
      let oneLiner = '';
      let batchStr = '';
      const industries = [];

      textElements.forEach(t => {
        if (t === name) return;

        // Check batch
        if (/(SUMMER|WINTER|SPRING|FALL)\s+\d{4}/i.test(t) || /^(W|S|F)\d{2}$/i.test(t)) {
          batchStr = t;
        } else if (t.includes(',') || t.includes('USA') || t.includes('India') || t.includes('CA') || t.includes('NY')) {
          if (!location && t.length < 50) {
            // Remove name prefix if present
            if (name && t.startsWith(name)) {
              location = t.slice(name.length).trim();
            } else {
              location = t;
            }
          }
        } else if (t === t.toUpperCase() && t.length > 2 && t.length < 30) {
          industries.push(t.charAt(0) + t.slice(1).toLowerCase());
        } else if (!oneLiner && t.length > 5 && t.length < 200 && !t.startsWith(name)) {
          oneLiner = t;
        }
      });

      results.push({
        slug,
        name,
        logo,
        location: location || 'San Francisco, CA',
        oneLiner: oneLiner || `${name} is a Y Combinator backed startup.`,
        batchStr: batchStr || 'W24',
        industries
      });
    });

    return results;
  });

  console.log(`📊 Scraped ${domCompanies.length} company cards from DOM.`);

  // Combine DOM data and API hits
  const uniqueCompanies = new Map();

  domCompanies.forEach(c => {
    uniqueCompanies.set(c.slug, c);
  });

  apiHitsMap.forEach((hit, slug) => {
    const existing = uniqueCompanies.get(slug) || {};
    uniqueCompanies.set(slug, { ...existing, ...hit, slug });
  });

  // Normalize final dataset
  const startups = [];
  for (const [slug, item] of uniqueCompanies.entries()) {
    const name = item.name || item.company_name || slug.charAt(0).toUpperCase() + slug.slice(1);
    
    // Clean location
    let location = item.location || item.city || 'San Francisco, CA';
    if (name && location.startsWith(name)) {
      location = location.slice(name.length).trim();
    }
    if (!location) location = 'San Francisco, CA, USA';

    const country = parseCountry(location);
    const batchInfo = parseBatch(item.batch || item.batch_name || item.batchStr || 'W24');

    let oneLiner = item.one_liner || item.oneLiner || item.small_description || item.headline || `${name} is a Y Combinator startup.`;
    if (name && oneLiner.startsWith(name)) {
      oneLiner = oneLiner.slice(name.length).trim();
    }
    if (!oneLiner) oneLiner = `${name} is a Y Combinator backed company based in ${location}.`;

    let logo = item.logo || item.small_logo_url || item.logo_url;
    if (!logo || logo.includes('placeholder')) {
      logo = generateLogo(name);
    }

    let industries = Array.isArray(item.industry) ? item.industry : (item.industries && item.industries.length ? item.industries : ['Technology']);

    const tags = Array.isArray(item.tags) ? item.tags : [];
    if (['stripe', 'airbnb', 'dropbox', 'coinbase', 'doordash', 'gitlab', 'brex', 'scale-ai', 'figma', 'rippling', 'groww', 'meesho', 'instacart', 'reddit'].includes(slug)) {
      if (!tags.includes('Top Company')) tags.push('Top Company');
      if (!tags.includes('Unicorn')) tags.push('Unicorn');
    }

    let founders = [];
    if (Array.isArray(item.founders)) {
      founders = item.founders.map(f => ({
        name: f.full_name || f.name || 'Founder',
        title: f.title || 'Co-Founder & CEO',
        linkedin: f.linkedin_url,
        twitter: f.twitter_url
      }));
    } else if (item.founders_names && Array.isArray(item.founders_names)) {
      founders = item.founders_names.map(n => ({ name: n, title: 'Founder' }));
    } else {
      founders = [{ name: `${name} Founder`, title: 'Co-Founder & CEO' }];
    }

    const status = item.status ? item.status : (['airbnb', 'coinbase', 'doordash', 'gitlab', 'reddit'].includes(slug) ? 'Public' : 'Active');
    const website = item.website || item.url || `https://${slug}.com`;
    const teamSize = item.team_size ? `${item.team_size}` : '10-50';
    const fundingStage = item.stage || (status === 'Public' ? 'IPO' : 'Series B');
    const longDescription = item.long_description || item.description || `${name} (${batchInfo.batch}) is a Y Combinator backed startup based in ${location}. ${oneLiner}`;

    startups.push({
      id: slug,
      name,
      slug,
      logo,
      oneLiner: oneLiner.slice(0, 200),
      longDescription,
      batch: batchInfo.batch,
      year: batchInfo.year,
      season: batchInfo.season,
      industries,
      tags: tags.length ? tags : ['B2B', 'SaaS'],
      founders,
      location,
      country,
      status,
      website,
      teamSize,
      fundingStage,
      socials: {
        twitter: item.twitter_url,
        linkedin: item.linkedin_url,
        github: item.github_url
      }
    });
  }

  console.log(`✅ Final clean YC dataset: ${startups.length} startups`);

  // Write JSON
  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(startups, null, 2), 'utf-8');
  console.log(`💾 Saved to ${OUTPUT_JSON_PATH}`);

  // Write TypeScript dataset
  const tsContent = `import type { Startup } from "./types";

// Re-export types
export type { Startup, Founder } from "./types";

export const startups: Startup[] = ${JSON.stringify(startups, null, 2)};
`;

  fs.writeFileSync(OUTPUT_TS_PATH, tsContent, 'utf-8');
  console.log(`💾 Updated TypeScript dataset at ${OUTPUT_TS_PATH}`);

  await browser.close();
  console.log('🎉 Done scraping YC startups with Playwright!');
})();
