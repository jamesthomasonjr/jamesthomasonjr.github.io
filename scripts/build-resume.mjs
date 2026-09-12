#!/usr/bin/env node
/**
 * Publishes the canonical résumé into the site output from a checkout of
 * jamesthomasonjr/resume.
 *
 *   node scripts/build-resume.mjs --resume-dir ../resume --out _site
 *
 * The résumé repository stays the single source of truth: this script renders
 * nothing of its own. It loads the résumé app that `npm run build` produced
 * there, lets that app resolve and render the requested document with its own
 * theme, and snapshots the result as a standalone static page. The PDF is the
 * one `npm run export` already wrote in that checkout, copied into place.
 *
 * Expects the résumé checkout to have been prepared first:
 *
 *   npm ci
 *   npx playwright install --with-deps chromium
 *   npm run build
 *   npm run export -- --resume base --format pdf --out out
 *
 * Produces:
 *
 *   <out>/resume/index.html   the rendered document, no app chrome, indexable
 *   <out>/resume.pdf          the exported PDF
 *
 * Only the requested document is published. The built app bundles every
 * document under `data/`, tailored overlays included, so the bundle itself is
 * never copied into the site — only the markup of the one document rendered.
 */
import { createReadStream, existsSync, readdirSync, readFileSync } from 'node:fs';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    'resume-dir': { type: 'string' },
    out: { type: 'string', default: '_site' },
    resume: { type: 'string', default: 'base' },
    theme: { type: 'string' },
    'site-url': { type: 'string', default: 'https://jamesthomasonjr.com' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help || !values['resume-dir']) {
  console.log(
    [
      'Usage: node scripts/build-resume.mjs --resume-dir <path> [options]',
      '',
      '      --resume-dir <path>  Checkout of jamesthomasonjr/resume, already built',
      '      --out <dir>          Site output directory. Default: _site',
      '      --resume <id>        Document to publish. Default: base',
      '      --theme <id>         Theme id. Default: the document\'s own meta.theme',
      '      --site-url <url>     Origin used for the canonical link',
    ].join('\n'),
  );
  process.exit(values.help ? 0 : 1);
}

const resumeDir = resolve(values['resume-dir']);
const outDir = resolve(values.out);
const resumeId = values.resume;
const siteUrl = values['site-url'].replace(/\/$/, '');

function fail(message, hint) {
  console.error(`build-resume: ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

const distDir = join(resumeDir, 'dist');
if (!existsSync(join(distDir, 'index.html'))) {
  fail(`No built résumé app at ${distDir}`, 'Run `npm ci && npm run build` in the résumé checkout first.');
}

// The app chrome's stylesheet (`src/styles/base.css`) is the only CSS Vite
// emits; the theme's own CSS is injected at runtime and read from the DOM.
const cssAssets = readdirSync(join(distDir, 'assets'))
  .filter((name) => name.endsWith('.css'))
  .map((name) => readFileSync(join(distDir, 'assets', name), 'utf8'));
if (cssAssets.length === 0) fail(`No stylesheet in ${join(distDir, 'assets')}`);

const exportDir = join(resumeDir, 'out');
const pdfs = existsSync(exportDir)
  ? readdirSync(exportDir).filter((name) => name.startsWith(`${resumeId}-`) && name.endsWith('.pdf'))
  : [];
if (pdfs.length !== 1) {
  fail(
    `Expected exactly one ${resumeId}-<theme>.pdf in ${exportDir}, found ${pdfs.length}`,
    `Run \`npm run export -- --resume ${resumeId} --format pdf --out out\` in the résumé checkout.`,
  );
}

// Playwright belongs to the résumé checkout, not to this site.
const requireFromResume = createRequire(join(resumeDir, 'package.json'));
let chromium;
try {
  ({ chromium } = requireFromResume('playwright'));
} catch (error) {
  fail(`Could not load playwright from ${resumeDir}: ${error.message}`, 'Run `npm ci` in the résumé checkout.');
}

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

// ES modules do not load over file://, so the built app is served for the
// snapshot rather than opened from disk.
const server = createServer((request, response) => {
  const path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
  const file = resolve(distDir, `.${path === '/' ? '/index.html' : path}`);
  if (!file.startsWith(distDir) || !existsSync(file)) {
    response.writeHead(404).end('Not found');
    return;
  }
  response.writeHead(200, { 'Content-Type': CONTENT_TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
const origin = `http://127.0.0.1:${server.address().port}`;

let browser;
try {
  // CHROMIUM_PATH points at a browser the machine already has, the same way
  // the résumé repository's own exporter uses it.
  browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );
  const page = await browser.newPage();

  const url = new URL(origin);
  url.searchParams.set('resume', resumeId);
  if (values.theme) url.searchParams.set('theme', values.theme);

  await page.goto(url.href, { waitUntil: 'load' });
  await page.waitForSelector('html[data-resume-ready="true"]', { timeout: 15_000 });
  await page.evaluate(() => document.fonts.ready);

  const rendered = await page.evaluate(() => ({
    // `.sheet` is the rendered document; the toolbar around it — which lists
    // every variant — is deliberately left behind.
    sheet: document.querySelector('.sheet')?.outerHTML ?? '',
    themeCss: document.querySelector('#theme-style')?.textContent ?? '',
    title: document.title,
    name: document.querySelector('.resume__name')?.textContent?.trim() ?? '',
    label: document.querySelector('.resume__label')?.textContent?.trim() ?? '',
    summary: document.querySelector('.resume__summary')?.textContent?.trim() ?? '',
    selectedResume: document.querySelector('#resume-select')?.value ?? '',
  }));

  if (!rendered.sheet) fail('The résumé app rendered no document');
  if (rendered.selectedResume !== resumeId) {
    fail(`The app rendered "${rendered.selectedResume}", not "${resumeId}"`);
  }

  const description = rendered.summary || [rendered.name, rendered.label].filter(Boolean).join(' — ');
  const html = renderPage(rendered, description);

  await mkdir(join(outDir, 'resume'), { recursive: true });
  await writeFile(join(outDir, 'resume', 'index.html'), html);
  await copyFile(join(exportDir, pdfs[0]), join(outDir, 'resume.pdf'));

  console.log(`Wrote ${join(outDir, 'resume', 'index.html')} (${resumeId})`);
  console.log(`Wrote ${join(outDir, 'resume.pdf')} (from ${pdfs[0]})`);
} finally {
  await browser?.close();
  server.close();
}

function escapeAttribute(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderPage(rendered, description) {
  const canonical = `${siteUrl}/resume/`;
  const pdfUrl = '/resume.pdf';
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeAttribute(rendered.title)}</title>
    <meta name="description" content="${escapeAttribute(description)}" />
    <!-- The résumé app marks itself noindex; this published copy is the canonical one. -->
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content="${escapeAttribute(rendered.title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:url" content="${canonical}" />
    <style>
${cssAssets.join('\n')}
${rendered.themeCss}
/* Published-page chrome. Screen only — print is the document alone. */
.resume-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1rem 0;
  font-size: 0.9rem;
}
.resume-actions a {
  color: inherit;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--chrome-border);
  border-radius: 6px;
  text-decoration: none;
}
.resume-actions a:hover,
.resume-actions a:focus-visible {
  border-color: currentColor;
}
.resume-actions a[download] {
  font-weight: 600;
}
@media print {
  .resume-actions {
    display: none;
  }
}
    </style>
  </head>
  <body>
    <nav class="resume-actions" aria-label="Résumé actions">
      <a href="${pdfUrl}" download>Download PDF</a>
      <a href="/">jamesthomasonjr.com</a>
    </nav>
    ${rendered.sheet}
  </body>
</html>
`;
}
