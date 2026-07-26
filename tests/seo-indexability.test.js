const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const canonicalUrl = "https://mila-game-center.vercel.app/";

function matches(pattern, source = html) {
  return [...source.matchAll(pattern)];
}

function metaContent(attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<meta\\s+${attribute}="${escapedValue}"\\s+content="([^"]+)"\\s*/?>`, "i"));
  return match?.[1];
}

test("one natural title, description, robots directive and canonical are present", () => {
  const titles = matches(/<title>([^<]+)<\/title>/gi);
  assert.equal(titles.length, 1);
  assert.equal(titles[0][1], "Mila Oyun Merkezi | Çocuklar İçin Eğitici Oyunlar");

  assert.equal(matches(/<meta\s+name="description"\s+content="[^"]+"\s*\/?>/gi).length, 1);
  assert.match(metaContent("name", "description"), /çocuklar/i);
  assert.equal(metaContent("name", "robots"), "index, follow, max-image-preview:large");
  assert.equal(matches(/<link\s+rel="canonical"\s+href="[^"]+"\s*\/?>/gi).length, 1);
  assert.match(html, new RegExp(`<link rel="canonical" href="${canonicalUrl}"`));
  assert.doesNotMatch(html, /noindex/i);
});

test("Open Graph and Twitter cards use one consistent absolute social image", () => {
  assert.equal(metaContent("property", "og:type"), "website");
  assert.equal(metaContent("property", "og:locale"), "tr_TR");
  assert.equal(metaContent("property", "og:site_name"), "Mila Oyun Merkezi");
  assert.ok(metaContent("property", "og:title"));
  assert.ok(metaContent("property", "og:description"));
  assert.equal(metaContent("property", "og:url"), canonicalUrl);
  assert.equal(metaContent("property", "og:image"), `${canonicalUrl}og-image.png`);
  assert.ok(metaContent("property", "og:image:alt"));
  assert.equal(metaContent("name", "twitter:card"), "summary_large_image");
  assert.ok(metaContent("name", "twitter:title"));
  assert.ok(metaContent("name", "twitter:description"));
  assert.equal(metaContent("name", "twitter:image"), `${canonicalUrl}og-image.png`);
  assert.doesNotMatch(html, /twitter:site/);
});

test("JSON-LD is valid, factual WebApplication data", () => {
  const blocks = matches(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  assert.equal(blocks.length, 1);
  const data = JSON.parse(blocks[0][1]);
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@type"], "WebApplication");
  assert.equal(data.name, "Mila Oyun Merkezi");
  assert.equal(data.url, canonicalUrl);
  assert.equal(data.applicationCategory, "EducationalApplication");
  assert.equal(data.inLanguage, "tr");
  assert.equal(data.isAccessibleForFree, true);
  assert.deepEqual([data.audience.suggestedMinAge, data.audience.suggestedMaxAge], [4, 7]);
  assert.equal(data.aggregateRating, undefined);
  assert.equal(data.review, undefined);
});

test("robots and single-page sitemap are root-accessible static files", () => {
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Allow: \/$/m);
  assert.match(robots, new RegExp(`^Sitemap: ${canonicalUrl}sitemap\\.xml$`, "m"));
  assert.match(sitemap, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.equal(matches(/<url>/g, sitemap).length, 1);
  assert.match(sitemap, new RegExp(`<loc>${canonicalUrl}</loc>`));
  assert.doesNotMatch(sitemap, /#|localhost|vercel\.app/i);
  assert.doesNotMatch(robots, /Disallow:/i);
});

test("social image and favicon exist and every local SEO asset reference resolves", () => {
  const socialImage = fs.readFileSync(path.join(root, "og-image.png"));
  assert.equal(socialImage.subarray(1, 4).toString("ascii"), "PNG");
  assert.equal(socialImage.readUInt32BE(16), 1200);
  assert.equal(socialImage.readUInt32BE(20), 630);
  assert.ok(socialImage.length < 1_500_000);
  assert.ok(fs.existsSync(path.join(root, "favicon.svg")));
  assert.match(html, /<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"\s*\/>/);
});

test("initial HTML has Turkish semantics and useful visible Home content", () => {
  assert.match(html, /<html lang="tr">/);
  const headings = matches(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  assert.equal(headings.length, 1);
  assert.match(headings[0][1], /Mila[\s\S]*Oyun Merkezi/);
  assert.match(html, /<h2 id="home-about-title">Mila Oyun Merkezi Nedir\?<\/h2>/);
  assert.match(html, /çocukların sayıları, renkleri, şekilleri/);
  assert.match(html, /sosyal medya veya video platformuna ihtiyaç duymadan/);
});

test("deployment placeholder is explicit and no local or preview URL leaks into SEO", () => {
  const seoSources = `${html}\n${robots}\n${sitemap}`;
  assert.match(html, /SEO_PRODUCTION_URL_PLACEHOLDER/);
  assert.doesNotMatch(seoSources, /localhost|127\.0\.0\.1|\.vercel\.app/i);
  assert.equal(matches(/mila-game-center\.vercel.app/g, seoSources).length, 8);
});
