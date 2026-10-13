import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../src');
const cache = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (!file.endsWith('.ts')) file += '.ts';
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const requireHere = createRequire(file);
  const localRequire = (name) => name.startsWith('@/') ? load(name.slice(2))
    : name.startsWith('.') ? load(path.resolve(path.dirname(file), name)) : requireHere(name);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  new Function('exports', 'require', 'module', compiled)(loadedModule.exports, localRequire, loadedModule);
  return loadedModule.exports;
}

async function main() {
  const { startups } = load('data/startups');
  const { getSimilarStartups } = load('lib/utils');
  const supabase = startups.find(s => s.slug === 'supabase');
  const related = getSimilarStartups(supabase, 10);
  assert(getSimilarStartups({...supabase, id: 'test-copy'}, 5).some(s => s.id === supabase.id), 'Matching descriptions should remain discoverable');
  console.log('Supabase related:', related.map(s => s.name));
  assert(!related.some(s => ['clever', 'gutgutgoose', 'drchrono', 'outschool'].includes(s.slug)));
  assert.equal(getSimilarStartups({...supabase, oneLiner: 'A technology platform', longDescription: 'B2B SaaS software'}, 4).length, 0);
  const analytics = load('services/analytics.service');
  const unknownTeam = {...supabase, teamSize: '', tags: ['Top Company'], isHiring: false, jobCount: undefined, jobs: [{title:'Engineer'}]};
  assert.equal(analytics.computeTeamSizeDistribution([unknownTeam]).find(b => b.name === 'Unknown').value, 1);
  assert.equal(analytics.computeKPIs([unknownTeam]).unicorns, 0);
  assert.equal(analytics.computeKPIs([unknownTeam]).totalJobs, 1);
  assert.equal(analytics.computeHiringIntelligence([unknownTeam]).hiringCompanyCount, 1);
  const { SarvamTechNewsService } = load('services/technews/sarvam-technews.service');
  SarvamTechNewsService.getApiKey = () => null;
  await assert.rejects(() => SarvamTechNewsService.translateToIndic('Original English', 'hi'), /Translation unavailable/);
  const { GithubApiService } = load('services/github/github-api.service');
  const rawRepo = GithubApiService.mapGithubItemToRepo({id:1, name:'sample', full_name:'owner/sample', html_url:'https://github.com/owner/sample', description:'No matching keywords', stargazers_count:50000}, 'Fintech');
  assert.equal(rawRepo.metricsAvailable, false);
  assert.equal(rawRepo.isUnderrated, false);
  assert.equal(rawRepo.relevanceScore, 0);
  assert.equal(rawRepo.integrationGuide.installCommand, 'git clone https://github.com/owner/sample.git');
  const savedFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({total_count:0,items:[]}));
  const emptyLive = await GithubApiService.fetchLiveRepositories({query:'no-matches'});
  assert.equal(emptyLive.isLive, true); assert.equal(emptyLive.totalCount,0); assert.equal(emptyLive.hasMore,false); assert.deepEqual(emptyLive.repos,[]);
  global.fetch = async () => new Response('{}',{status:429});
  const unavailable = await GithubApiService.fetchLiveRepositories({query:'test'});
  assert.equal(unavailable.isLive,false); assert.deepEqual(unavailable.repos,[]); assert.equal(unavailable.hasMore,false);
  global.fetch = savedFetch;
  const { parseYCProfile } = load('lib/yc-refresh');
  const ycPayload = {props:{company:{name:'Test Company',slug:supabase.slug,batch_name:'Summer 2020',ycdc_status:'Active',tags:['Databases'],team_size:null,founders:[],country:'US'},jobPostings:[]}};
  const html = '<div data-page="'+JSON.stringify(ycPayload).replaceAll('"','&quot;')+'">';
  const clean = parseYCProfile(html,supabase,'2026-10-13T00:00:00Z');
  assert.equal(clean.teamSize,undefined); assert.equal(clean.fundingStage,undefined); assert.equal(clean.jobCount,0); assert(!clean.tags.includes('Unicorn'));
  assert.throws(()=>parseYCProfile(html,{...supabase,slug:'different'},'2026-10-13T00:00:00Z'),/identity/);
  const { isAIStartup } = load('lib/startup-classification');
  const { computeAIGrowth } = load('services/analytics.service');
  assert.equal(isAIStartup({ industries: ['Retail', 'Supply chain'], tags: [], oneLiner: 'Delivery' }), false);
  assert.equal(isAIStartup({ industries: [], tags: ['Machine Learning'], oneLiner: '' }), true);
  assert.equal(computeAIGrowth(startups).reduce((n, row) => n + row.ai, 0), startups.filter(isAIStartup).length);

  const { ProductHuntApiService: ph } = load('services/producthunt/producthunt-api.service');
  const { SAMPLE_PRODUCTHUNT_PRODUCTS: products } = load('data/producthunt-products');
  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const list = [{ ...products[0], id: 'old', launchDate: '2000-01-01' }, { ...products[0], id: 'today', launchDate: date }];
  assert.deepEqual(ph.filterAndSortProducts(list, { timeframe: 'Today' }).map((p) => p.id), ['today']);
  assert.deepEqual(ph.filterAndSortProducts(list, { timeframe: 'This Week' }).map((p) => p.id), ['today']);
  const sparse = { ...products[0], rating: undefined, makerComment: undefined, pricingTiers: undefined, techDetails: undefined };
  assert.deepEqual(ph.enrichProductDetails(sparse), sparse);
  const nativeFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ data: products, isLive: false, source: 'Curated Dataset' }));
  assert.equal((await ph.fetchProducts()).isLive, false);
  global.fetch = nativeFetch;

  const { SAMPLE_OSS_REPOSITORIES: repos } = load('data/githuboss-repos');
  const { detectRepositoryRelationship, getThreeWayNodeContext, generateTrifectaMatches } = load('lib/cross-intelligence');
  const fake = { ...repos[0], owner: 'unrelated', name: startups[0].slug, fullName: `unrelated/${startups[0].slug}` };
  assert.equal(detectRepositoryRelationship(startups[0], fake).isOfficial, false);
  assert.equal(getThreeWayNodeContext({ primaryType: 'yc', ycStartup: startups[0], allYc: startups, allGithub: [], allPh: [] }).bestTrifectaPair, undefined);
  const matches = generateTrifectaMatches(startups, repos, products);
  assert(matches.some((m) => startups.indexOf(m.ycStartup) >= 15), 'Matching must cover startups beyond the first 15');

  const store = new Map();
  global.window = {};
  global.localStorage = { getItem: (key) => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
  const { useWatchlistStore } = load('store/watchlist.store');
  const { useNotesStore } = load('store/notes.store');
  const { useQuizStore } = load('store/quiz.store');
  store.set('yc-watchlist', 'invalid-json');
  store.set('yc-notes', '{}');
  store.set('yc-quiz', 'null');
  useWatchlistStore.getState().load(); useNotesStore.getState().load(); useQuizStore.getState().load();
  assert.deepEqual(useWatchlistStore.getState().ids, []);
  assert.deepEqual(useNotesStore.getState().notes, []);
  assert.equal(useQuizStore.getState().totalAttempts, 0);
  useWatchlistStore.getState().toggle('doordash');
  useWatchlistStore.getState().load();
  assert.deepEqual(useWatchlistStore.getState().ids, ['doordash']);
  global.localStorage.setItem = () => { throw new Error('Storage unavailable'); };
  assert.doesNotThrow(() => useWatchlistStore.getState().toggle('stripe'));
  delete global.window;

  const { TechNewsApiService: news } = load('services/technews/technews-api.service');
  const { SAMPLE_TECH_NEWS: articles } = load('data/technews-items');
  news.getPageItems = async () => articles;
  const first = await news.getNewsItems({}, { page: 1, limit: 2 });
  const second = await news.getNewsItems({}, { page: 2, limit: 2 });
  assert.equal(first.total, articles.length);
  assert.equal(first.items.length, 2);
  assert(!first.items.some((item) => second.items.includes(item)));
  const empty = await news.getNewsItems({ searchQuery: 'no-such-news-12345' });
  assert.equal(empty.total, 0);
  assert.equal(empty.stats.totalAnalyzed, 0);
  assert.equal(await news.getNewsItemBySlug('nonexistent-news-slug'), null);
  assert.equal((await news.getNewsItemBySlug(articles[0].slug)).id, articles[0].id);
  console.log('Regression checks passed: classification, filters, source labels, data integrity, matching, storage, news pagination and lookup.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
