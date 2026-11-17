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
    assert.doesNotMatch(html, /<script|https?:\/\//i);
  });
  test(`${page}: all local asset, page, and fragment links resolve`, () => {
    const html = read(page);
    for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const target = match[1];
      if (target.startsWith('mailto:')) continue;
      assert.ok(!target.startsWith('/'), `Must be relative: ${target}`);
      const [path, fragment] = target.split('#');
      const file = path ? resolve(root, dirname(page), path) : resolve(root, page);
      assert.ok(existsSync(file), `Missing destination: ${target}`);
      if (fragment) assert.ok(readFileSync(file, 'utf8').includes(`id="${fragment}"`));
    }
  });
}

test('empty metadata does not create invented store links or a sitemap', () => {
  assert.equal(metadata.storeUrl, null);
  assert.equal(metadata.siteUrl, null);
  assert.equal(existsSync(resolve(root, 'sitemap.xml')), false);
  assert.doesNotMatch(read('index.html'), /play\.google|apps\.apple|Get it on Google Play/);
  assert.equal(read('robots.txt'), 'User-agent: *\nAllow: /\n');
});
