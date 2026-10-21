const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const exists = name => fs.existsSync(path.join(root, name));
test('both portfolios have separate static entry points and content', () => {
  assert(read('index.html').includes('assets/js/content.js'));
  const html = read('portfolio-3d/index.html');
  assert(html.includes('id="root"'));
  assert(!html.includes('/src/main.tsx'));
  assert(exists('.nojekyll'));
  assert(exists('portfolio-3d/LICENSE'));
  assert(JSON.parse(read('data/portfolio.json')).profile);
  assert(JSON.parse(read('portfolio-3d/data/portfolio.json')).site);
});
test('built scripts, styles, fonts, and icons stay inside the 3D path', () => {
  const html = read('portfolio-3d/index.html');
  const urls = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"#]+)"/g)].map(m => m[1]);
  assert(urls.length > 0);
  for (const url of urls) {
    assert(url.startsWith('/portfolio-3d/'), url);
    assert(exists(decodeURIComponent(url.slice(1))), url);
  }
  for (const name of fs.readdirSync(path.join(root, 'portfolio-3d/assets'))) {
    if (!name.endsWith('.css')) continue;
    const css = read('portfolio-3d/assets/' + name);
    for (const [,url] of css.matchAll(/url\(["']?(\/[^)"']+)["']?\)/g)) {
      assert(url.startsWith('/portfolio-3d/'), url);
      assert(exists(decodeURIComponent(url.slice(1))), url);
    }
  }
  for (const name of ['models/parth-coder-avatar-v1.0.glb','models/char_enviorment.hdr','draco/draco_decoder.js','draco/draco_decoder.wasm']) {
    assert(exists('portfolio-3d/' + name), name);
  }
});
