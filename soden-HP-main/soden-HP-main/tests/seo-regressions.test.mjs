import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/s1598/Downloads/soden-HP-main/soden-HP-main';
const distRoot = path.join(root, 'dist');
const canonicalOrigin = 'https://soudenkougyou.com';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readDist(relativePath) {
  return fs.readFileSync(path.join(distRoot, relativePath), 'utf8');
}

function listPrerenderedHtmlFiles() {
  return fs.readdirSync(distRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `${entry.name}/index.html`)
    .filter((relativePath) => fs.existsSync(path.join(distRoot, relativePath)));
}

function run() {
  const indexHtml = read('index.html');
  const vercelConfig = JSON.parse(read('vercel.json'));

  assert.ok(
    !indexHtml.includes('構造化データ (JSON-LD) - WebSite（Google検索ボックス対応）'),
    'index.html should not contain the outdated static WebSite JSON-LD comment'
  );
  assert.ok(
    !indexHtml.includes('構造化データ (JSON-LD) - BreadcrumbList（パンくずリスト）'),
    'index.html should not contain the outdated static BreadcrumbList JSON-LD comment'
  );
  assert.ok(
    !indexHtml.includes('"@type": "BreadcrumbList"'),
    'index.html should not contain a static BreadcrumbList definition'
  );
  assert.match(
    indexHtml,
    /<link rel="icon" type="image\/png" sizes="32x32" href="\/favicon-32\.png" \/>/,
    'index.html should define a dedicated 32x32 browser favicon asset'
  );
  assert.match(
    indexHtml,
    /<link rel="icon" type="image\/png" sizes="16x16" href="\/favicon-16\.png" \/>/,
    'index.html should define a dedicated 16x16 browser favicon asset'
  );

  const routes = read('src/app.routes.ts');
  const sitemap = read('public/sitemap.xml');

  assert.ok(
    sitemap.includes('<loc>https://soudenkougyou.com/contact</loc>'),
    'test assumes /contact is published in the sitemap'
  );
  assert.match(
    routes,
    /path:\s*'contact'/,
    'app.routes.ts should define the /contact route'
  );
  assert.equal(
    vercelConfig.trailingSlash,
    false,
    'vercel.json should canonicalize trailing slash URLs to slashless routes'
  );
  assert.ok(
    !Array.isArray(vercelConfig.rewrites),
    'vercel.json should not use a catch-all SPA rewrite that overrides prerendered route HTML'
  );

  assert.ok(
    !sitemap.includes('https://www.soudenkougyou.com'),
    'sitemap.xml should not publish www URLs'
  );
  assert.ok(
    !sitemap.includes('http://soudenkougyou.com'),
    'sitemap.xml should not publish http URLs'
  );
  assert.ok(
    !sitemap.includes('/index.html'),
    'sitemap.xml should not publish index.html URLs'
  );

  const prerenderedHtmlFiles = listPrerenderedHtmlFiles();
  assert.ok(
    prerenderedHtmlFiles.length > 0,
    'dist should contain prerendered route HTML files'
  );

  for (const relativePath of prerenderedHtmlFiles) {
    const html = readDist(relativePath);
    const routePath = `/${relativePath.replace(/\/index\.html$/, '')}`;
    const expectedCanonical = routePath === '/'
      ? `${canonicalOrigin}/`
      : `${canonicalOrigin}${routePath}`;

    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="${expectedCanonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
      `${relativePath} should publish its canonical URL`
    );
    assert.doesNotMatch(
      html,
      /https:\/\/www\.soudenkougyou\.com|http:\/\/soudenkougyou\.com|http:\/\/www\.soudenkougyou\.com/,
      `${relativePath} should not reference redirecting host or protocol variants`
    );
    assert.doesNotMatch(
      html,
      /href="\/[^"]*\/index\.html"/,
      `${relativePath} should not link to index.html URLs`
    );
  }

  console.log('SEO regression checks passed');
}

run();
