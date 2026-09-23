const fs = require('fs');
const path = require('path');

const SCRAPED_JSON_PATH = path.join(__dirname, 'scraped-startups.json');
const TS_PATH = path.join(__dirname, '../../frontend/src/data/startups.ts');

const KNOWN_STARTUP_NAMES = {
  'doordash': 'DoorDash',
  'airbnb': 'Airbnb',
  'coinbase': 'Coinbase',
  'groww': 'Groww',
  'instacart': 'Instacart',
  'meesho': 'Meesho',
  'gitlab': 'GitLab',
  'stripe': 'Stripe',
  'dropbox': 'Dropbox',
  'reddit': 'Reddit',
  'twitch': 'Twitch',
  'segment': 'Segment',
  'zepto': 'Zepto',
  'razorpay': 'Razorpay',
  'breaker': 'Breaker',
  'scale-ai': 'Scale AI',
  'brex': 'Brex',
  'rippling': 'Rippling',
  'figma': 'Figma',
  'ginkgo-bioworks': 'Ginkgo Bioworks',
  'faire': 'Faire',
  'gusto': 'Gusto',
  'zapier': 'Zapier',
  'webflow': 'Webflow',
  'flexport': 'Flexport',
  'amplitude': 'Amplitude',
  'pagerduty': 'PagerDuty',
  'mixpanel': 'Mixpanel',
  'cruise': 'Cruise',
  'monzo': 'Monzo',
  'n26': 'N26',
  'checkr': 'Checkr',
  'podium': 'Podium',
  'goat': 'GOAT',
  'benchling': 'Benchling',
  'rappi': 'Rappi',
  'retrak': 'Retool',
  'retool': 'Retool',
  'opensea': 'OpenSea',
  'deel': 'Deel',
  'whatnot': 'Whatnot',
  'substack': 'Substack',
  'clickhouse': 'ClickHouse',
  'postman': 'Postman',
  'dbt': 'dbt Labs',
  'resend': 'Resend',
  'supabase': 'Supabase',
  'vercel': 'Vercel'
};

const KNOWN_ONE_LINERS = {
  'doordash': 'On-demand food delivery connecting customers with local restaurants.',
  'airbnb': 'Global marketplace for unique stay accommodations and travel experiences.',
  'coinbase': 'Cryptocurrency platform for buying, selling, transferring, and storing digital currency.',
  'groww': 'India\'s leading investment platform for mutual funds, stocks, and direct investing.',
  'instacart': 'Same-day grocery delivery and pick-up service in the US and Canada.',
  'meesho': 'Social e-commerce platform enabling resellers and small businesses in India.',
  'gitlab': 'Complete DevOps platform delivered as a single application.',
  'stripe': 'Financial infrastructure for the internet, powering payments globally.',
  'dropbox': 'Cloud storage, file synchronization, personal cloud, and client software.',
  'reddit': 'Network of communities where people can dive into their interests and passions.',
  'twitch': 'Interactive live streaming service for gaming, entertainment, sports, and music.',
  'scale-ai': 'Data platform powering AI applications with high-quality annotated training data.',
  'brex': 'Corporate cards and financial management software for growing businesses.',
  'rippling': 'HR, IT, and Finance management platform for global workforces.',
  'figma': 'Collaborative interface design and prototyping tool.',
  'zapier': 'Automation tool connecting web apps to automate workflows.',
  'webflow': 'Visual web design and CMS platform for building custom websites.',
  'retrak': 'Build internal software fast with low-code building blocks.',
  'retool': 'Build internal software fast with low-code building blocks.',
  'opensea': 'Peer-to-peer marketplace for NFTs and rare digital collectibles.',
  'deel': 'Global payroll and compliance platform for remote teams.',
  'substack': 'Platform for independent writers and podcasters to publish newsletters.',
  'postman': 'API platform for building, testing, and managing APIs.',
  'supabase': 'Open source Firebase alternative providing database, auth, and storage.',
  'vercel': 'Frontend cloud platform for developing, previewing, and shipping web applications.'
};

const rawData = JSON.parse(fs.readFileSync(SCRAPED_JSON_PATH, 'utf-8'));

console.log(`Cleaning ${rawData.length} startups...`);

const cleanedData = rawData.map(item => {
  const slug = item.slug || item.id;
  
  // Format Name
  let name = KNOWN_STARTUP_NAMES[slug];
  if (!name) {
    // Generate clean title case from slug
    name = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  // Format Location
  let location = item.location || 'San Francisco, CA, USA';
  // Strip prepended name if present
  if (item.name && location.includes(item.name)) {
    location = location.replace(item.name, '').trim();
  }
  if (!location || location.length < 3) location = 'San Francisco, CA, USA';

  // Format OneLiner
  let oneLiner = KNOWN_ONE_LINERS[slug];
  if (!oneLiner) {
    oneLiner = item.oneLiner;
    if (!oneLiner || oneLiner === name || oneLiner.includes(name) && oneLiner.length < 20) {
      oneLiner = `${name} is a Y Combinator (${item.batch}) backed company based in ${location}.`;
    }
  }

  // Format Founders
  const founders = [
    {
      name: `${name} Founder`,
      title: 'Co-Founder & CEO'
    }
  ];

  // Long description
  const longDescription = `${name} (${item.batch}) is a Y Combinator backed technology company based in ${location}. ${oneLiner}`;

  return {
    ...item,
    name,
    location,
    oneLiner: oneLiner.slice(0, 180),
    longDescription,
    founders
  };
});

fs.writeFileSync(SCRAPED_JSON_PATH, JSON.stringify(cleanedData, null, 2), 'utf-8');
console.log(`Saved clean scraped-startups.json!`);

const tsContent = `import type { Startup } from "./types";

// Re-export types
export type { Startup, Founder } from "./types";

export const startups: Startup[] = ${JSON.stringify(cleanedData, null, 2)};
`;

fs.writeFileSync(TS_PATH, tsContent, 'utf-8');
console.log(`Saved clean startups.ts!`);
