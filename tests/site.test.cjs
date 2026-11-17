const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve, dirname } = require('node:path');
const root = resolve(__dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const pages = ['index.html', 'policies.html', 'terms.html', '404.html'];
const metadata = JSON.parse(read('site.json'));

test('saved metadata matches the task source without losing fields or description', () => {
  const task = read('.code12/TASK.md');
  const source = JSON.parse(task.match(/```json\s*([\s\S]*?)```/)[1]);
  assert.deepEqual(metadata, source);
});

test('app-ads.txt matches the configured block exactly', () => {
  const task = read('.code12/TASK.md');
  const configured = task.match(/## app-ads\.txt[^\n]*\n```text\n([\s\S]*?)```/)[1];
  assert.equal(read('app-ads.txt'), configured);
});

for (const page of pages) {
  test(`${page}: static page metadata, navigation, branding, and contact`, () => {
    const html = read(page);
    assert.match(html, /<!doctype html>/i);
    assert.match(html, /<html lang="en">/);
    for (const field of ['viewport', 'description']) assert.match(html, new RegExp(`<meta name="${field}" content="[^"]+"`));
    for (const field of ['title', 'description']) assert.match(html, new RegExp(`<meta property="og:${field}" content="[^"]+"`));
    assert.equal((html.match(/<h1(?:\s[^>]*)?>/g) || []).length, 1);
    assert.match(html, /<main id="main"/);
    assert.match(html, /<title>[^<]*Health Care[^<]*<\/title>/);
    assert.ok(html.includes(`mailto:${metadata.contactEmail}`));
    assert.ok(html.includes(`© 2026 ${metadata.companyName}`));
    const footer = html.match(/<footer>([\s\S]*?)<\/footer>/)[1];
    for (const destination of pages.slice(0, 3)) assert.ok(footer.includes(`href="${destination}"`));
    assert.doesNotMatch(html, /code12|lorem|todo|placeholder|AI Health|App891|firebase|admob/i);
    assert.doesNotMatch(html, /<script/i);
    const absolute = [...html.matchAll(/https?:\/\/[^"\s<]+/gi)].map(m => m[0]);
    for (const url of absolute) assert.ok(url.startsWith(`${metadata.siteUrl}/`), `Unexpected external URL: ${url}`);
  });
  test(`${page}: all local asset, page, and fragment links resolve`, () => {
    const html = read(page);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith('mailto:') || target.startsWith(`${metadata.siteUrl}/`)) continue;
      assert.ok(!target.startsWith('/'), `Must be relative: ${target}`);
      const [path, fragment] = target.split('#');
      const file = path ? resolve(root, dirname(page), path) : resolve(root, page);
      assert.ok(existsSync(file), `Missing destination: ${target}`);
      if (fragment) assert.ok(readFileSync(file, 'utf8').includes(`id="${fragment}"`));
    }
  });
}

test('empty storeUrl does not create invented store links', () => {
  assert.equal(metadata.storeUrl, null);
  assert.doesNotMatch(read('index.html'), /play\.google|apps\.apple|Get it on Google Play/);
});

test('siteUrl drives sitemap, robots Sitemap line, and canonical URLs', () => {
  const base = metadata.siteUrl;
  assert.equal(base, 'https://myhealthcare-web.vercel.app');
  assert.equal(read('robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  assert.deepEqual(locs, [`${base}/`, `${base}/policies.html`, `${base}/terms.html`]);
  const expected = { 'index.html': `${base}/`, 'policies.html': `${base}/policies.html`, 'terms.html': `${base}/terms.html` };
  for (const [page, url] of Object.entries(expected)) {
    const html = read(page);
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`), `${page} canonical`);
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`), `${page} og:url`);
  }
  assert.doesNotMatch(read('404.html'), /rel="canonical"/);
});

test('feature illustrations are local, decorative, and sized', () => {
  const html = read('index.html');
  const imgs = [...html.matchAll(/<img class="card-art"[^>]*>/g)].map(m => m[0]);
  assert.equal(imgs.length, 4);
  for (const img of imgs) {
    assert.match(img, /src="assets\/img\/[a-z]+\.svg"/);
    assert.match(img, /alt=""/);
    assert.match(img, /width="64" height="64"/);
    assert.match(img, /loading="lazy"/);
  }
});
