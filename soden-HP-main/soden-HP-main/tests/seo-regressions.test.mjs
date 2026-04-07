import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'C:/Users/s1598/Downloads/soden-HP-main/soden-HP-main';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function run() {
  const indexHtml = read('index.html');

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

  console.log('SEO regression checks passed');
}

run();
