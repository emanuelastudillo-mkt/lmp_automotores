#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function clean(value) {
  return String(value ?? '').trim();
}

function normalize(value) {
  return clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
}

function rowValue(row, header) {
  const key = Object.keys(row).find(key => normalize(key) === normalize(header));
  return key === undefined ? '' : clean(row[key]);
}

function vehicleName(row) {
  return ['Marca', 'Modelo', 'Año'].map(header => rowValue(row, header)).filter(Boolean).join(' ');
}

function vehicleId(row) {
  return (rowValue(row, 'ID') || clean(Object.values(row)[0]))
    .replace(/\.[a-z0-9]+$/i, '').replace(/[^a-zA-Z0-9_-]/g, '');
}

function vehicleSlug(row) {
  return normalize(vehicleName(row)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// El estado de la hoja es la autoridad. Una URL desaparecida, por sí sola,
// no confirma una venta: también puede ser un vehículo DE BAJA o renombrado.
export function buildSoldEntries(rows, aliases = []) {
  if (!Array.isArray(rows) || !rows.length || !Array.isArray(aliases)) {
    throw new Error('Stock o registro de direcciones vendidas inválido.');
  }
  if (!Object.keys(rows[0]).some(key => normalize(key) === 'ESTADO ACTUAL DEL AUTO')) {
    throw new Error('Falta la columna Estado actual del auto en data/stock.json.');
  }
  const soldRows = rows.filter(row => normalize(rowValue(row, 'Estado actual del auto')) === 'VENDIDO');
  const protectedSlugs = new Set(rows.filter(row => !soldRows.includes(row)).map(vehicleSlug));
  const entries = new Map();
  for (const row of soldRows) {
    const slug = vehicleSlug(row);
    if (!vehicleId(row) || !rowValue(row, 'Marca') || !rowValue(row, 'Modelo')) {
      throw new Error('Hay un vehículo VENDIDO sin ID, marca o modelo.');
    }
    if (protectedSlugs.has(slug)) {
      throw new Error(`La dirección ${slug} también corresponde a un vehículo no vendido.`);
    }
    // No agrupar por ID: la planilla puede reutilizar un ID en dos filas.
    entries.set(slug, { slug, name: vehicleName(row), vehicleId: vehicleId(row) });
  }
  for (const alias of aliases) {
    const slug = clean(alias.slug);
    if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Dirección histórica inválida.');
    if (entries.has(slug)) continue;
    if (!clean(alias.vehicleId)) throw new Error(`Falta el ID del vehículo para ${slug}.`);
    const matches = rows.filter(row => vehicleId(row) === clean(alias.vehicleId));
    // Si el ID deja de estar vendido o deja de existir, no atribuirle una venta.
    if (!matches.length || matches.some(row => !soldRows.includes(row))) continue;
    if (matches.length !== 1) throw new Error(`ID ambiguo para la dirección histórica ${slug}.`);
    if (protectedSlugs.has(slug)) throw new Error(`La dirección histórica ${slug} está en uso.`);
    entries.set(slug, { slug, name: vehicleName(matches[0]), vehicleId: vehicleId(matches[0]) });
  }
  return { soldRecords: soldRows.length, entries: [...entries.values()].sort((a, b) => a.slug.localeCompare(b.slug)) };
}

function soldPage({ slug, name, vehicleId }) {
  const canonical = `https://lmpautos.com/vehiculos/${slug}/`;
  const whatsappText = encodeURIComponent(`Hola, vi que el ${name} ya fue vendido. ¿Tienen alguna unidad similar disponible?`);
  const whatsapp = `https://wa.me/5491132627744?text=${whatsappText}`;
  const safeName = esc(name);
  const recovered = `<!-- sold-from-stock:${esc(vehicleId)} -->`;

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

export function restoreSoldPages(root = process.cwd(), { check = false } = {}) {
  // El actualizador escribe esta copia de Sheets antes de llamar al restaurador.
  // Un JSON ausente o inválido debe detener el workflow, no simular una restauración exitosa.
  const stock = JSON.parse(fs.readFileSync(path.join(root, 'data', 'stock.json'), 'utf8'));
  const aliasesFile = path.join(root, 'data', 'sold-vehicles.json');
  const aliases = fs.existsSync(aliasesFile) ? JSON.parse(fs.readFileSync(aliasesFile, 'utf8')) : [];
  const result = buildSoldEntries(stock.rows, aliases);
  const changed = [];
  for (const entry of result.entries) {
    const file = path.join(root, 'vehiculos', entry.slug, 'index.html');
    const html = soldPage(entry);
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
    if (current === html) continue;
    if (check) throw new Error(`Falta restaurar o actualizar /vehiculos/${entry.slug}/`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html, 'utf8');
    changed.push(entry.slug);
  }
  return { ...result, changed };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const result = restoreSoldPages(process.cwd(), { check: process.argv.includes('--check') });
    console.log(`Vendidos en Sheets: ${result.soldRecords}. URLs conservadas: ${result.entries.length}. Restauradas/actualizadas: ${result.changed.length}.`);
  } catch (error) {
    console.error(`ERROR al conservar vendidos: ${error.message}`);
    process.exitCode = 1;
  }
}
