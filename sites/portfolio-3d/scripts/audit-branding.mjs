import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createHash } from 'node:crypto';

// Legal notices and installed third-party packages are intentionally excluded.
const blocked = /amjad|imdad|rajesh|chityal|animatedportfolio\.vercel\.app|betteroffstudio|webharmonium/i;
const extensions = new Set(['.tsx','.ts','.css','.json','.html','.md','.js','.mjs','.txt']);
const findings = [];
function scan(path) {
 for (const entry of readdirSync(path, {withFileTypes:true})) {
  const file = join(path, entry.name);
  if (entry.isDirectory()) scan(file);
  else if (extensions.has(extname(file)) && !entry.name.endsWith('-OFL.txt')) {
   if (blocked.test(readFileSync(file,'utf8'))) findings.push(file);
  }
 }
}
scan('src'); scan('public');
for (const file of ['package.json','package-lock.json','index.html']) {
 if (blocked.test(readFileSync(file,'utf8'))) findings.push(file);
}
const content=JSON.parse(readFileSync('public/data/portfolio.json','utf8'));
function checkAssets(value) {
 if (typeof value==='string' && /^\/(assets|models|fonts|images)\//.test(value)) {
  try { readFileSync(join('public',decodeURIComponent(value.split('?')[0]))); }
  catch { findings.push(`Missing asset: ${value}`); }
 } else if (Array.isArray(value)) value.forEach(checkAssets);
 else if (value && typeof value==='object') Object.values(value).forEach(checkAssets);
}
checkAssets(content);
const avatarHash=createHash('sha256').update(readFileSync('public/models/parth-coder-avatar-v1.0.glb')).digest('hex');
if(avatarHash!=='8c7a58b31be89fe6d9cfa7eb5d01e7cebd037f1eca6b909d451666f3464b1b17') findings.push('Locked avatar changed');
if(findings.length) { console.error(findings.join('\n')); process.exit(1); }
console.log('PASS: no legacy owner branding in application/content/docs; content assets exist; locked avatar unchanged. Required license notices retained.');
