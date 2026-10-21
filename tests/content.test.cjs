const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/js/content.js'), 'utf8');
const original = JSON.parse(fs.readFileSync(path.join(root, 'data/portfolio.json'), 'utf8'));
async function render(data) {
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
  const context = {window: {}, document, URL, fetch: async () => ({ok:true, json:async () => data}), console: {error: (...args) => errors.push(args)}};
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
