#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const VEHICLES_DIR = path.join(ROOT, 'vehiculos');
const MANUAL_FILE = path.join(ROOT, 'data', 'sold-vehicles.json');

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options,
  }).trim();
}

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function stripTags(value = '') {
  return String(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCaseSlug(slug) {
  const keepUpper = new Map([
    ['hdi', 'HDI'], ['tdi', 'TDI'], ['tsi', 'TSI'], ['dsg', 'DSG'],
    ['lt', 'LT'], ['xls', 'XLS'], ['gnc', 'GNC'], ['4x4', '4x4']
  ]);
  return slug.split('-').map(part => {
    if (keepUpper.has(part.toLowerCase())) return keepUpper.get(part.toLowerCase());
    if (/^\d+(?:\.\d+)?$/.test(part)) return part;
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join(' ');
}

function extractName(html, slug) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  if (h1) {
    const clean = stripTags(h1);
    if (clean && !/stock interno/i.test(clean)) return clean;
  }
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (title) {
    let clean = stripTags(title)
      .replace(/\s*\|\s*LMP Autos.*$/i, '')
      .replace(/\s+usado(?:s)?\s+en\s+Lomas del Mirador.*$/i, '')
      .trim();
    if (clean) return clean;
  }
  return titleCaseSlug(slug);
}

function normalizeName(name, slug) {
  const yearFromSlug = slug.match(/(?:^|-)(19|20)\d{2}(?:-|$)/)?.[0]?.replaceAll('-', '');
  if (yearFromSlug && !new RegExp(`\\b${yearFromSlug}\\b`).test(name)) {
    return `${name} ${yearFromSlug}`;
  }
  return name;
}

function getHistoricalPages() {
  let output = '';
  try {
    output = git(['log', '--all', '--format=', '--name-only', '--', 'vehiculos/*/index.html']);
  } catch {
    return [];
  }
  return [...new Set(output.split(/\r?\n/).map(x => x.trim()).filter(x => /^vehiculos\/[^/]+\/index\.html$/.test(x)))];
}

function latestExistingVersion(filePath) {
  let commits = '';
  try {
    commits = git(['log', '--all', '--diff-filter=AMR', '--format=%H', '--', filePath]);
  } catch {
    return null;
  }
  for (const commit of commits.split(/\r?\n/).filter(Boolean)) {
    try {
      const html = git(['show', `${commit}:${filePath}`]);
      if (html) return { commit, html };
    } catch {}
  }
  return null;
}

function soldPage({ slug, name, sourceCommit = '' }) {
  const canonical = `https://lmpautos.com/vehiculos/${slug}/`;
  const whatsappText = encodeURIComponent(`Hola, vi que el ${name} ya fue vendido. ¿Tienen alguna unidad similar disponible?`);
  const whatsapp = `https://wa.me/5491132627744?text=${whatsappText}`;
  const safeName = esc(name);
  const recovered = sourceCommit ? `<!-- recovered-from:${esc(sourceCommit)} -->` : '<!-- manual-sold-entry -->';

  return `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${safeName} vendido | LMP Autos</title>
  <meta name="description" content="El ${safeName} ya fue vendido. Consultá vehículos similares disponibles en LMP Autos, Lomas del Mirador.">
  <meta name="robots" content="noindex,follow">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${safeName} · Vendido | LMP Autos">
  <meta property="og:description" content="Esta unidad ya fue vendida. Consultá vehículos similares disponibles en LMP Autos.">
  <meta property="og:url" content="${canonical}">
  <meta name="theme-color" content="#080d12">
  <style>
    :root{--bg:#080d12;--panel:#101820;--panel2:#161f28;--text:#f5f7f8;--muted:#aab3ba;--red:#e5393a;--line:#26323c;--green:#20a66a}
    *{box-sizing:border-box}html,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    a{color:inherit}.wrap{width:min(100% - 32px,980px);margin:auto}.top{padding:24px 0;border-bottom:1px solid var(--line)}
    .brand{display:flex;align-items:center;justify-content:space-between;gap:18px}.logo{font-weight:900;letter-spacing:.14em;font-size:20px;text-decoration:none}.back{color:var(--muted);font-size:14px;text-decoration:none}
    main{padding:46px 0 64px}.card{background:linear-gradient(180deg,var(--panel),#0d141b);border:1px solid var(--line);border-radius:28px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.25)}
    .visual{position:relative;min-height:430px;display:grid;place-items:center;background:radial-gradient(circle at 50% 30%,#25323d 0,#111922 48%,#0c1218 100%);padding:36px}
    .sold{position:absolute;left:28px;top:28px;background:var(--red);color:#fff;border-radius:999px;padding:11px 18px;font-weight:900;letter-spacing:.06em;font-size:15px}
    .car{width:min(650px,92%);opacity:.42}.content{padding:34px}.eyebrow{color:var(--red);font-weight:900;font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}
    h1{font-size:clamp(34px,7vw,58px);line-height:1.03;letter-spacing:-.045em;margin:0 0 18px}.lead{font-size:20px;line-height:1.55;color:var(--muted);max-width:720px;margin:0}
    .notice{margin-top:30px;padding:22px;border-radius:20px;background:var(--panel2);border:1px solid var(--line)}.notice strong{display:block;font-size:20px;margin-bottom:6px}.notice span{color:var(--muted);line-height:1.5}
    .actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px}.btn{display:flex;align-items:center;justify-content:center;text-decoration:none;border-radius:16px;padding:17px 18px;font-weight:850;text-align:center;border:1px solid var(--line)}
    .btn.primary{background:var(--red);border-color:var(--red);color:#fff}.btn.secondary{background:#151e26}.trust{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.trust div{background:#0b1218;border:1px solid var(--line);border-radius:16px;padding:16px;color:var(--muted);font-size:14px}.trust b{display:block;color:var(--text);margin-bottom:3px}
    footer{border-top:1px solid var(--line);padding:24px 0 34px;color:var(--muted);font-size:13px}
    @media(max-width:640px){main{padding-top:24px}.visual{min-height:300px}.content{padding:25px 22px}.actions,.trust{grid-template-columns:1fr}.back{display:none}.sold{left:18px;top:18px}.lead{font-size:17px}}
  </style>
  <script type="application/ld+json">
  ${JSON.stringify({
    '@context':'https://schema.org',
    '@type':'Car',
    name,
    url: canonical,
    itemCondition:'https://schema.org/UsedCondition',
    seller:{'@type':'AutoDealer',name:'LMP Autos',telephone:'+54 9 11 3262-7744',address:{'@type':'PostalAddress',streetAddress:'Av. Mosconi 799',addressLocality:'Lomas del Mirador',addressRegion:'Buenos Aires',addressCountry:'AR'}}
  })}
  </script>
</head>
<body>
${recovered}
<header class="top"><div class="wrap brand"><a class="logo" href="/">L·M·P AUTOS</a><a class="back" href="/#catalogo">← Ver vehículos disponibles</a></div></header>
<main><div class="wrap"><article class="card">
  <div class="visual"><div class="sold">VENDIDO</div>
    <svg class="car" viewBox="0 0 900 330" role="img" aria-label="Vehículo vendido" xmlns="http://www.w3.org/2000/svg">
      <path d="M128 229h645c32 0 53-17 53-42 0-25-20-38-47-44l-112-23-86-72c-17-15-35-23-61-23H326c-28 0-48 9-67 30l-64 72-75 22c-33 10-49 28-49 49 0 18 18 31 57 31Z" fill="none" stroke="#d5dbe0" stroke-width="8" stroke-linejoin="round"/>
      <path d="M279 120h323l-76-62c-11-9-23-13-39-13H342c-19 0-31 5-43 18l-45 57Z" fill="#202b35" stroke="#d5dbe0" stroke-width="6"/>
      <circle cx="255" cy="230" r="48" fill="#0b1117" stroke="#d5dbe0" stroke-width="8"/><circle cx="255" cy="230" r="17" fill="#d5dbe0"/>
      <circle cx="690" cy="230" r="48" fill="#0b1117" stroke="#d5dbe0" stroke-width="8"/><circle cx="690" cy="230" r="17" fill="#d5dbe0"/>
      <path d="M109 182h84M748 182h65" stroke="#e5393a" stroke-width="10" stroke-linecap="round"/>
    </svg>
  </div>
  <div class="content"><div class="eyebrow">Vehículo vendido</div><h1>${safeName}</h1>
    <p class="lead">Esta unidad ya no está disponible. Conservamos esta página para que el enlace siga funcionando y puedas consultar alternativas similares del stock actual.</p>
    <div class="notice"><strong>¿Buscás algo parecido?</strong><span>Podemos mostrarte opciones disponibles según presupuesto, año, kilometraje y forma de pago.</span></div>
    <div class="actions"><a class="btn primary" href="${whatsapp}" rel="noopener">Consultar uno similar</a><a class="btn secondary" href="/#catalogo">Ver stock disponible</a></div>
    <div class="trust"><div><b>Financiación</b>Opciones según la unidad.</div><div><b>Permutas</b>Tomamos vehículos en parte de pago.</div><div><b>Agencia física</b>Av. Mosconi 799, Lomas del Mirador.</div></div>
  </div>
</article></div></main>
<footer><div class="wrap">LMP Autos · WhatsApp 11 3262-7744 · Av. Mosconi 799, Lomas del Mirador</div></footer>
</body></html>\n`;
}

function loadManualEntries() {
  if (!fs.existsSync(MANUAL_FILE)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(MANUAL_FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`No se pudo leer ${path.relative(ROOT, MANUAL_FILE)}: ${err.message}`);
    process.exitCode = 1;
    return [];
  }
}

function ensureGeneratedSoldPageNoindex(file, slug) {
  if (!fs.existsSync(file)) return false;

  const html = fs.readFileSync(file, 'utf8');
  const generatedByPreserver =
    html.includes('<!-- recovered-from:') ||
    html.includes('<!-- manual-sold-entry -->');

  if (!generatedByPreserver) return false;

  let next = html;
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(next)) {
    next = next.replace(
      /<meta\s+name=["']robots["'][^>]*>/i,
      '<meta name="robots" content="noindex,follow">'
    );
  } else {
    next = next.replace(
      /(<meta\s+name=["']description["'][^>]*>)/i,
      '$1\n  <meta name="robots" content="noindex,follow">'
    );
  }

  if (next === html) return false;
  fs.writeFileSync(file, next, 'utf8');
  console.log(`Ajustada a noindex: /vehiculos/${slug}/`);
  return true;
}

function ensureSoldPage({ slug, name, sourceCommit = '' }) {
  if (!/^[a-z0-9-]+$/.test(slug)) return false;
  const dir = path.join(VEHICLES_DIR, slug);
  const file = path.join(dir, 'index.html');
  if (fs.existsSync(file)) return ensureGeneratedSoldPageNoindex(file, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, soldPage({ slug, name, sourceCommit }), 'utf8');
  console.log(`Restaurada como VENDIDO: /vehiculos/${slug}/`);
  return true;
}

let restored = 0;

// 1) Recorre TODO el historial Git. Cualquier ficha que alguna vez existió y hoy falta
// vuelve a crearse como una página estática VENDIDO con la misma URL.
for (const historicalPath of getHistoricalPages()) {
  const absolute = path.join(ROOT, historicalPath);
  if (fs.existsSync(absolute)) continue;
  const version = latestExistingVersion(historicalPath);
  const slug = historicalPath.split('/')[1];
  const extracted = version ? extractName(version.html, slug) : titleCaseSlug(slug);
  const name = normalizeName(extracted, slug);
  if (ensureSoldPage({ slug, name, sourceCommit: version?.commit ?? '' })) restored++;
}

// 2) Entradas manuales para URLs antiguas que quizá no estén en el historial del repo.
for (const entry of loadManualEntries()) {
  const slug = String(entry?.slug ?? '').trim();
  if (!slug) continue;
  const name = String(entry?.name ?? '').trim() || titleCaseSlug(slug);
  if (ensureSoldPage({ slug, name })) restored++;
}

console.log(restored ? `Total restauradas: ${restored}` : 'No hay URLs vendidas pendientes de restaurar.');
