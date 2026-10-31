const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/content.js'), 'utf8');
const original = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio.json'), 'utf8'));
async function render(data, options = {}) {
  const nodes = new Map();
  const errors = [];
  const node = key => {
    if (!nodes.has(key)) nodes.set(key, {innerHTML: 'fallback', textContent: '', dataset: {}, children: [],
      firstChild: {textContent: ''}, insertAdjacentHTML(_where, html) { this.innerHTML = html; },
      querySelector(selector) { return node(key + ' ' + selector); }});
    return nodes.get(key);
  };
  node('#hero .typed').parentElement = node('roleLine');
  const document = {baseURI: 'http://localhost:8000/',
    querySelector: node, querySelectorAll: () => [],
    getElementById: id => ['hero','about','skills','experience','education','portfolio','contact'].includes(id) ? node('#' + id) : null};
  const context = {window: {}, document, URL, AbortSignal, fetch: options.fetch || (async () => ({ok:true, json:async () => data})), console: {error: (...args) => errors.push(args)}};
  vm.runInNewContext(source, context);
  return {ok: await context.window.portfolioReady, nodes, errors};
}
test('current JSON renders every existing collection', async () => {
  const r = await render(structuredClone(original));
  assert.equal(r.ok, true);
  assert.equal(r.errors.length, 0);
  assert.equal((r.nodes.get('.portfolio-container').innerHTML.match(/portfolio-item filter-web/g) || []).length, original.projects.length);
  assert.equal((r.nodes.get('#education .row > div').innerHTML.match(/education-item/g) || []).length, original.education.length);
});
test('new entries appear using the same design markup, without changing HTML', async () => {
  const data = structuredClone(original);
  const examples = JSON.parse(fs.readFileSync(path.join(root,'data/entry-examples.json'),'utf8'));
  for (const key of ['about','skillGroups','experience','education','projects']) data[key].push(examples[key]);
  const r = await render(data);
  assert.equal(r.ok, true);
  for (const [selector, phrase] of [
    ['#about .about-containers','New summary'], ['#skills .about-containers','New skill'],
    ['#experience .container .section-ending-padding','Company name'], ['#education .row > div','Institution name'],
    ['.portfolio-container','New project']]) assert.ok(r.nodes.get(selector).innerHTML.includes(phrase), selector);
});
test('invalid nested content preserves the fallback and identifies the field', async () => {
  const data = structuredClone(original);
  data.skillGroups[0].items = 'invalid';
  const r = await render(data);
  assert.equal(r.ok, false);
  assert.ok(String(r.errors[0][1]).includes('skillGroups[0].items'));
  assert.ok([...r.nodes.values()].every(n => n.innerHTML === 'fallback'));
});
test('text is escaped and unsafe URLs cannot be injected', async () => {
  const data = structuredClone(original);
  data.projects[0].name = '<script>alert(1)</script>';
  let r = await render(data);
  assert.equal(r.ok, true);
  assert.ok(r.nodes.get('.portfolio-container').innerHTML.includes('&lt;script&gt;'));
  data.projects[0].liveUrl = 'javascript:alert(1)';
  r = await render(data);
  assert.equal(r.ok, false);
  assert.ok([...r.nodes.values()].every(n => n.innerHTML === 'fallback'));
});
test('empty collections work and optional project buttons are omitted', async () => {
  const data = structuredClone(original);
  for (const key of ['about','skillGroups','experience','education']) data[key] = [];
  data.projects = [{name:'Offline project',description:'Local work',image:'',imageAlt:'',liveUrl:'',sourceUrl:''}];
  const r = await render(data);
  assert.equal(r.ok, true);
  assert.ok(!r.nodes.get('.portfolio-container').innerHTML.includes('<a '));
});


test('project cards are balanced siblings rather than nested cards', async () => {
  const result = await render(structuredClone(original));
  const html = result.nodes.get('.portfolio-container').innerHTML;
  let depth = 0;
  let cards = 0;
  for (const [tag] of html.matchAll(/<\/?div\b[^>]*>/g)) {
    if (tag.startsWith('</')) {
      depth--;
      assert(depth >= 0, 'unexpected closing div');
    } else {
      if (/class="[^"]*\bportfolio-item\b/.test(tag)) {
        assert.equal(depth, 0, 'project card is nested inside another card');
        cards++;
      }
      depth++;
    }
  }
  assert.equal(depth, 0, 'project markup has unclosed containers');
  assert.equal(cards, original.projects.length);
});


test('HTTP and network failures preserve the classic fallback', async () => {
  for (const fetch of [async () => ({ok: false, status: 503}), async () => { throw new Error('Network unavailable'); }]) {
    const result = await render(structuredClone(original), {fetch});
    assert.equal(result.ok, false);
    assert.equal(result.nodes.size, 2);
    assert.equal(result.errors.length, 1);
  }
});
test('community entries render from data and keep proposal status honest', async () => {
 const data=structuredClone(original);
 data.community.speaking.events.push({...data.community.speaking.events[0],id:'new-talk',title:'Additional community talk'});
 const r=await render(data);
 assert.equal(r.ok,true);
 assert(r.nodes.get('#speaking .community-inner').innerHTML.includes('Additional community talk'));
 const source=r.nodes.get('#open-source .community-inner').innerHTML;
 assert(source.includes('Open pull request')); assert(!source.includes('Puppeteer')); assert(!source.includes('backport')); assert(source.includes('Developer writing')); assert(source.includes('Written by me')); assert(source.includes('My work featured by Collabora'));
 data.community.speaking.events[0].photos[0].src='javascript:alert(1)';
 assert.equal((await render(data)).ok,false);
 data.community.speaking.events[0].photos[0].src='/assets/media/community/cool-days-2025-1.jpeg';
 data.community.openSource.featured[0].stars=499;
 assert.equal((await render(data)).ok,false);
});

test('both portfolios share community content and publish every media file', () => {
 const three=JSON.parse(fs.readFileSync(path.join(root,'sites/portfolio-3d/public/data/portfolio.json'),'utf8'));
 assert.deepEqual(original.community,three.community);
 for(const event of original.community.speaking.events) for(const src of [...event.photos.map(p=>p.src),event.clip].filter(Boolean)) {
  assert(fs.existsSync(path.join(root,src.slice(1))),src);
  assert(fs.existsSync(path.join(root,'sites/portfolio-3d/public',src.slice(1))),src);
 }
 assert(original.experience.some(e=>e.company==='Collabora Online'&&e.role==='Associate Software Engineer'&&e.period==='March 2025 - Present'));
 assert(!original.experience.some(e=>e.company.includes('Tark')&&e.period.includes('Present')));
});
