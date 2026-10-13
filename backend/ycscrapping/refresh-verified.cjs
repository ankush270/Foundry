// Refresh existing company profiles from public YC payloads; never invent fields.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '../../frontend/src');
function load(file) {
  const mod = {exports:{}};
  const code = ts.transpileModule(fs.readFileSync(path.join(root,file), 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  new Function('exports','require','module',code)(mod.exports, require, mod);
  return mod.exports;
}
async function main() {
  const dataset = load('data/startups.ts');
  const startups = dataset.allStartups || dataset.startups;
  const {refreshYCProfile} = load('lib/yc-refresh.ts');
  const limitFlag = process.argv.find(arg=>arg.startsWith('--limit='));
  const limit = limitFlag ? Number(limitFlag.split('=')[1]) : startups.length;
  if (!Number.isInteger(limit) || limit < 1) throw new Error('Invalid refresh limit');
  let next = 0, success = 0;
  const failures = [];
  const refreshed = [...startups];
  await Promise.all(Array.from({length:3}, async()=>{
    while(next < Math.min(limit,startups.length)) {
      const i = next++;
      try { refreshed[i] = await refreshYCProfile(startups[i]); success++; }
      catch { failures.push(startups[i].slug); }
      if ((success+failures.length)%25===0) console.log(`Checked ${success+failures.length}; updated ${success}; failed ${failures.length}`);
      await new Promise(resolve=>setTimeout(resolve,250));
    }
  }));
  if (!success || failures.length > Math.min(limit,startups.length)*.3) throw new Error(`Refresh rejected: ${success} succeeded, ${failures.length} failed; existing dataset preserved`);
  const target=path.join(root,'data/startups.ts');
  const output='import type { Startup } from "./types";\nexport type { Startup, Founder, JobPosting, NewsItem } from "./types";\nexport const allStartups: Startup[] = '+JSON.stringify(refreshed,null,2)+';\nexport const startups: Startup[] = allStartups.filter(startup => Boolean(startup.sourceCheckedAt));\n';
  fs.writeFileSync(target+'.tmp',output);
  fs.renameSync(target+'.tmp',target);
  console.log(JSON.stringify({updated:success,failed:failures.length,failedSlugs:failures}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
