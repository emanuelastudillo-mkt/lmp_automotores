import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CSV_URL =
  process.env.STOCK_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR97O_aQlCskpibTlj1UEomToyCeUl8seOUB3DoNihqoXAAfGbO-8DtUj_WG9XZJvYRWJ_PdGcEBKcH/pub?gid=0&single=true&output=csv';

const SITE_URL = 'https://lmpautos.com';
const DEALER_NAME = 'LMP Autos';
const DEALER_PHONE = '+54 9 11 3262-7744';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const stockPath = path.join(repoRoot, 'data', 'stock.json');
const indexPath = path.join(repoRoot, 'index.html');
const sitemapPath = path.join(repoRoot, 'sitemap.xml');
const robotsPath = path.join(repoRoot, 'robots.txt');
const vehiclesDir = path.join(repoRoot, 'vehiculos');

function clean(value) {
  return (value ?? '').toString().trim();
}

function normalize(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function slugify(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeXml(value) {
  return escapeHtml(value);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const current = text[i];
    const next = text[i + 1];

    if (current === '"') {
      if (quoted && next === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (current === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((current === '\n' || current === '\r') && !quoted) {
      if (current === '\r' && next === '\n') i += 1;

      row.push(cell);

      if (row.some(value => clean(value) !== '')) {
        rows.push(row);
      }

      row = [];
      cell = '';
    } else {
      cell += current;
    }
  }

  if (cell.length || row.length) {
    row.push(cell);

    if (row.some(value => clean(value) !== '')) {
      rows.push(row);
    }
  }

  if (!rows.length) {
    throw new Error('El CSV está vacío.');
  }

  const headers = rows
    .shift()
    .map((header, index) => clean(header) || (index === 0 ? 'ID' : `col_${index}`));

  return rows.map(values =>
    Object.fromEntries(
      headers.map((header, index) => [header, clean(values[index])])
    )
  );
}

function findHeader(headers, expected) {
  const wanted = normalize(expected);
  return headers.find(header => normalize(header) === wanted);
}

function rowValue(row, ...names) {
  const entries = Object.entries(row);

  for (const name of names) {
    const target = normalize(name);

    for (const [key, value] of entries) {
      if (normalize(key) === target && clean(value)) {
        return clean(value);
      }
    }
  }

  return '';
}

function validateRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No se encontraron filas de stock.');
  }

  const headers = Object.keys(rows[0] || {});
  const required = ['Marca', 'Modelo', 'Estado actual del auto'];
  const missing = required.filter(name => !findHeader(headers, name));

  if (missing.length) {
    throw new Error(`Faltan columnas requeridas: ${missing.join(', ')}`);
  }

  const usableRows = rows.filter(row =>
    rowValue(row, 'Marca') &&
    rowValue(row, 'Modelo')
  );

  if (!usableRows.length) {
    throw new Error('El CSV no contiene vehículos utilizables.');
  }

  return usableRows;
}

function isPublicVehicle(row) {
  const status = normalize(rowValue(row, 'Estado actual del auto'));

  return Boolean(
    rowValue(row, 'Marca') &&
    rowValue(row, 'Modelo') &&
    status &&
    status !== 'VENDIDO' &&
    status !== 'DE BAJA'
  );
}

function vehicleSlug(row) {
  return slugify([
    rowValue(row, 'Marca'),
    rowValue(row, 'Modelo'),
    rowValue(row, 'Año', 'Ano')
  ].filter(Boolean).join(' '));
}

function numericValue(value) {
  const text = clean(value)
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '');

  if (!text) return 0;

  const normalized = text.includes(',') && text.includes('.')
    ? text.replace(/\./g, '').replace(',', '.')
    : text.replace(',', '.');

  const number = Number(normalized);
  return Number.isFinite(number) ? Math.round(number) : 0;
}

function formatArs(value) {
  const number = numericValue(value);

  if (!number) return '';

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(number);
}

function formatKm(value) {
  const number = numericValue(value);

  if (!number) return '';

  return `${new Intl.NumberFormat('es-AR').format(number)} km`;
}

function scoreValue(value) {
  const match = clean(value).replace(',', '.').match(/-?\d+(?:\.\d+)?/);

  if (!match) return 0;

  const number = Number(match[0]);
  return Number.isFinite(number)
    ? Math.max(0, Math.min(100, Math.round(number)))
    : 0;
}

function scoreFromRow(row, metric) {
  const token = normalize(metric);

  for (const [key, value] of Object.entries(row)) {
    const header = normalize(key)
      .replace(/[^A-Z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (header.split(' ').includes(token)) {
      const score = scoreValue(value);
      if (score > 0) return score;
    }
  }

  return 0;
}

function vehicleScores(row) {
  const scores = {
    rendimiento: scoreFromRow(row, 'RENDIMIENTO'),
    confort: scoreFromRow(row, 'CONFORT'),
    economia: scoreFromRow(row, 'ECONOMIA'),
    espacio: scoreFromRow(row, 'ESPACIO'),
    seguridad: scoreFromRow(row, 'SEGURIDAD')
  };

  const explicitGeneral =
    scoreFromRow(row, 'GENERAL') ||
    scoreValue(rowValue(
      row,
      'Calificación General',
      'Calificacion General',
      'Puntaje General',
      'Score General'
    ));

  const values = Object.values(scores).filter(value => value > 0);
  const calculatedGeneral = values.length
    ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
    : 0;

  return {
    ...scores,
    general: explicitGeneral || calculatedGeneral
  };
}

function isDriveFolderUrl(url) {
  return /drive\.google\.com\/(?:drive\/u\/\d+\/)?folders\//i.test(clean(url));
}

function driveFileId(url) {
  const input = clean(url);

  if (!input || isDriveFolderUrl(input)) return '';

  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) return input;

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]{20,})/i,
    /[?&]id=([a-zA-Z0-9_-]{20,})/i,
    /\/d\/([a-zA-Z0-9_-]{20,})/i
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  return '';
}

function vehicleImage(row) {
  const candidates = [
    rowValue(row, 'Foto 1', 'Foto1', 'Imagen 1', 'Imagen1'),
    rowValue(row, 'Link de fotos/videos')
  ].filter(Boolean);

  for (const candidate of candidates) {
    const id = driveFileId(candidate);

    if (id) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
    }

    if (/^https?:\/\//i.test(candidate) && !isDriveFolderUrl(candidate)) {
      return candidate;
    }
  }

  return '';
}

function statusLabel(row) {
  const status = normalize(rowValue(row, 'Estado actual del auto'));

  const labels = {
    DISPONIBLE: 'Disponible',
    RESERVADO: 'Reservado',
    PREPARANDO: 'Preparando',
    'CON DESCUENTO': 'Con descuento',
    DESCUENTO: 'Con descuento',
    PROMO: 'Promoción',
    PROMOCION: 'Promoción'
  };

  return labels[status] || clean(rowValue(row, 'Estado actual del auto'));
}

function staticCard(row) {
  const marca = rowValue(row, 'Marca');
  const modelo = rowValue(row, 'Modelo');
  const anio = rowValue(row, 'Año', 'Ano');
  const km = formatKm(rowValue(row, 'Kilometraje'));
  const price = formatArs(rowValue(row, 'Cotizacion al día', 'Cotizacion al dia'));
  const advance = formatArs(rowValue(row, 'Anticipo MINIMO', 'Anticipo mínimo'));
  const image = vehicleImage(row);
  const slug = vehicleSlug(row);
  const title = `${marca} ${modelo}${anio ? ` ${anio}` : ''}`;

  const imageMarkup = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(`${title} usado en LMP Autos`)}" loading="lazy" referrerpolicy="no-referrer">`
    : `<div class="photo-empty">Fotos próximamente</div>`;

  return `<article class="vehicle seo-static-card">
    <div class="photo">
      ${imageMarkup}
      <div class="badge-stack"><span class="badge">${escapeHtml(statusLabel(row))}</span></div>
    </div>
    <div class="body">
      <div class="make">${escapeHtml(marca)}</div>
      <h3>${escapeHtml(modelo)}</h3>
      <div class="meta">
        ${anio ? `<span>${escapeHtml(anio)}</span>` : ''}
        ${km ? `<span>${escapeHtml(km)}</span>` : ''}
      </div>
      <div class="price-stack">
        ${price ? `<div class="price-box ars"><div class="price-label">Valor total en pesos</div><div class="price seo-price">${escapeHtml(price)}</div></div>` : ''}
      </div>
      ${advance ? `<div class="advance">Anticipo desde <strong>${escapeHtml(advance)}</strong></div>` : ''}
      <div class="card-actions">
        <a class="detail-btn" href="./vehiculos/${escapeHtml(slug)}/">Ver vehículo</a>
      </div>
    </div>
  </article>`;
}

function idNumber(row) {
  const id = rowValue(row, 'ID', ' ');
  const match = clean(id).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function publicRowsSorted(rows) {
  return rows
    .filter(isPublicVehicle)
    .sort((a, b) => {
      const available =
        (normalize(rowValue(a, 'Estado actual del auto')) === 'DISPONIBLE' ? 0 : 1) -
        (normalize(rowValue(b, 'Estado actual del auto')) === 'DISPONIBLE' ? 0 : 1);

      if (available) return available;

      const yearDiff =
        numericValue(rowValue(b, 'Año', 'Ano')) -
        numericValue(rowValue(a, 'Año', 'Ano'));

      if (yearDiff) return yearDiff;

      return idNumber(b) - idNumber(a);
    });
}

function replaceMarkedContent(html, startMarker, endMarker, content) {
  const start = html.indexOf(startMarker);
  const end = html.indexOf(endMarker);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`No se encontraron marcadores ${startMarker} / ${endMarker}`);
  }

  const contentStart = start + startMarker.length;

  return (
    html.slice(0, contentStart) +
    '\n' +
    content.trim() +
    '\n' +
    html.slice(end)
  );
}

async function updateIndexPrerender(rows) {
  const publicRows = publicRowsSorted(rows);
  const featuredRows = publicRows.slice(0, 6);

  const featuredHtml = featuredRows.length
    ? featuredRows.map(staticCard).join('\n')
    : '<div class="empty">No hay vehículos publicados.</div>';

  const catalogHtml = publicRows.length
    ? publicRows.map(staticCard).join('\n')
    : '<div class="empty">No hay vehículos publicados.</div>';

  let html = await readFile(indexPath, 'utf8');

  html = replaceMarkedContent(
    html,
    '<!-- SEO_FEATURED_START -->',
    '<!-- SEO_FEATURED_END -->',
    featuredHtml
  );

  html = replaceMarkedContent(
    html,
    '<!-- SEO_CATALOG_START -->',
    '<!-- SEO_CATALOG_END -->',
    catalogHtml
  );

  await writeFile(indexPath, html, 'utf8');
}

function vehicleDescription(row) {
  const marca = rowValue(row, 'Marca');
  const modelo = rowValue(row, 'Modelo');
  const anio = rowValue(row, 'Año', 'Ano');
  const km = formatKm(rowValue(row, 'Kilometraje'));

  return [
    `${marca} ${modelo}${anio ? ` ${anio}` : ''} usado`,
    km ? `${km}` : '',
    'Consultá precio, financiación y permuta en LMP Autos, Lomas del Mirador.'
  ].filter(Boolean).join('. ');
}

function vehicleJsonLd(row, url) {
  const marca = rowValue(row, 'Marca');
  const modelo = rowValue(row, 'Modelo');
  const anio = rowValue(row, 'Año', 'Ano');
  const km = numericValue(rowValue(row, 'Kilometraje'));
  const price = numericValue(rowValue(row, 'Cotizacion al día', 'Cotizacion al dia'));
  const image = vehicleImage(row);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': `${url}#vehicle`,
    name: `${marca} ${modelo}${anio ? ` ${anio}` : ''}`,
    url,
    brand: {
      '@type': 'Brand',
      name: marca
    },
    model: modelo,
    vehicleModelDate: anio || undefined,
    fuelType: rowValue(row, 'Combustible') || undefined,
    vehicleTransmission: rowValue(row, 'Transmision', 'Transmisión') || undefined,
    color: rowValue(row, 'Color') || undefined,
    mileageFromOdometer: km
      ? {
          '@type': 'QuantitativeValue',
          value: km,
          unitCode: 'KMT'
        }
      : undefined,
    image: image || undefined,
    itemCondition: 'https://schema.org/UsedCondition',
    offers: price
      ? {
          '@type': 'Offer',
          priceCurrency: 'ARS',
          price,
          availability:
            normalize(rowValue(row, 'Estado actual del auto')) === 'DISPONIBLE'
              ? 'https://schema.org/InStock'
              : 'https://schema.org/LimitedAvailability',
          seller: {
            '@type': 'AutoDealer',
            '@id': `${SITE_URL}/#autodealer`,
            name: DEALER_NAME,
            telephone: DEALER_PHONE
          }
        }
      : undefined
  };

  return JSON.stringify(
    schema,
    (key, value) => value === undefined ? undefined : value,
    2
  ).replace(/</g, '\\u003c');
}

function scoreListMarkup(row) {
  const scores = vehicleScores(row);
  const entries = [
    ['Rendimiento', scores.rendimiento],
    ['Confort', scores.confort],
    ['Economía', scores.economia],
    ['Espacio', scores.espacio],
    ['Seguridad', scores.seguridad]
  ].filter(([, value]) => value > 0);

  if (!entries.length) return '';

  return `<section class="score-block">
    <h2>Perfil del vehículo</h2>
    ${scores.general ? `<p class="general-score">Calificación general: <strong>${scores.general}/100</strong></p>` : ''}
    <dl class="scores">
      ${entries.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${value}/100</dd></div>`).join('')}
    </dl>
  </section>`;
}

function vehiclePageHtml(row, generatedAt) {
  const marca = rowValue(row, 'Marca');
  const modelo = rowValue(row, 'Modelo');
  const anio = rowValue(row, 'Año', 'Ano');
  const km = formatKm(rowValue(row, 'Kilometraje'));
  const fuel = rowValue(row, 'Combustible');
  const transmission = rowValue(row, 'Transmision', 'Transmisión');
  const color = rowValue(row, 'Color');
  const price = formatArs(rowValue(row, 'Cotizacion al día', 'Cotizacion al dia'));
  const advance = formatArs(rowValue(row, 'Anticipo MINIMO', 'Anticipo mínimo'));
  const image = vehicleImage(row);
  const slug = vehicleSlug(row);
  const url = `${SITE_URL}/vehiculos/${slug}/`;
  const appUrl = `${SITE_URL}/?vehiculo=${encodeURIComponent(slug)}`;
  const title = `${marca} ${modelo}${anio ? ` ${anio}` : ''} usado | LMP Autos`;
  const description = vehicleDescription(row);

  const imageMarkup = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(`${marca} ${modelo}${anio ? ` ${anio}` : ''}`)}" referrerpolicy="no-referrer">`
    : `<div class="image-empty">Fotos disponibles en la ficha completa</div>`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${escapeHtml(url)}">

  <meta property="og:type" content="product">
  <meta property="og:locale" content="es_AR">
  <meta property="og:site_name" content="LMP Autos">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url)}">
  <meta property="og:image" content="${escapeHtml(image || `${SITE_URL}/banner-1.webp`)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image || `${SITE_URL}/banner-1.webp`)}">

  <script type="application/ld+json">
${vehicleJsonLd(row, url)}
  </script>

  <style>
    *{box-sizing:border-box}
    body{margin:0;background:#f3f3ef;color:#171717;font-family:Arial,Helvetica,sans-serif}
    a{color:inherit}
    .shell{width:min(1040px,calc(100% - 32px));margin:auto}
    header{background:#111;color:#fff}
    header .shell{display:flex;align-items:center;justify-content:space-between;padding:16px 0}
    .brand{font-weight:950;text-decoration:none}
    .back{font-size:13px;color:#fff;text-decoration:none}
    main{padding:34px 0 50px}
    .vehicle-layout{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(320px,.9fr);gap:24px}
    .media{min-height:420px;border-radius:22px;overflow:hidden;background:#ddd}
    .media img{width:100%;height:100%;min-height:420px;object-fit:cover}
    .image-empty{min-height:420px;display:grid;place-items:center;color:#666}
    .panel{background:#fff;border:1px solid #ddd;border-radius:22px;padding:24px}
    .make{color:#bb1d23;font-size:12px;font-weight:900;text-transform:uppercase}
    h1{margin:5px 0 12px;font-size:clamp(30px,4vw,48px);line-height:1}
    .status{display:inline-block;padding:6px 9px;border-radius:999px;background:#111;color:#fff;font-size:11px;font-weight:900}
    .specs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}
    .spec{padding:11px;border-radius:12px;background:#f4f4f1}
    .spec span{display:block;color:#777;font-size:9px;text-transform:uppercase}
    .spec strong{display:block;margin-top:3px;font-size:13px}
    .price{margin-top:16px;padding:16px;border-radius:14px;background:#111;color:#fff}
    .price span{display:block;font-size:10px;text-transform:uppercase}
    .price strong{display:block;margin-top:4px;font-size:25px}
    .advance{margin-top:8px;padding:12px;border-radius:12px;background:#f0e8e8}
    .cta{display:block;margin-top:16px;padding:14px;border-radius:12px;background:#1fa855;color:#fff;text-align:center;text-decoration:none;font-weight:900}
    .secondary{display:block;margin-top:8px;padding:12px;border:1px solid #bbb;border-radius:12px;text-align:center;text-decoration:none;font-weight:850}
    .score-block{margin-top:24px;background:#fff;border:1px solid #ddd;border-radius:22px;padding:22px}
    .score-block h2{margin:0 0 10px}
    .general-score{margin:0 0 10px}
    .scores{margin:0}
    .scores div{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #eee}
    .scores dt,.scores dd{margin:0}
    footer{padding:24px 0;color:#666;font-size:12px}
    @media(max-width:760px){
      .vehicle-layout{grid-template-columns:1fr}
      .media,.media img,.image-empty{min-height:300px}
      .panel{padding:18px}
    }
  </style>
</head>
<body>
<header>
  <div class="shell">
    <a class="brand" href="${SITE_URL}/">LMP Autos</a>
    <a class="back" href="${SITE_URL}/">Ver todos los vehículos</a>
  </div>
</header>

<main class="shell">
  <div class="vehicle-layout">
    <div class="media">${imageMarkup}</div>

    <article class="panel">
      <div class="make">${escapeHtml(marca)}</div>
      <h1>${escapeHtml(modelo)}${anio ? ` ${escapeHtml(anio)}` : ''}</h1>
      <span class="status">${escapeHtml(statusLabel(row))}</span>

      <div class="specs">
        ${anio ? `<div class="spec"><span>Año</span><strong>${escapeHtml(anio)}</strong></div>` : ''}
        ${km ? `<div class="spec"><span>Kilometraje</span><strong>${escapeHtml(km)}</strong></div>` : ''}
        ${fuel ? `<div class="spec"><span>Combustible</span><strong>${escapeHtml(fuel)}</strong></div>` : ''}
        ${transmission ? `<div class="spec"><span>Transmisión</span><strong>${escapeHtml(transmission)}</strong></div>` : ''}
        ${color ? `<div class="spec"><span>Color</span><strong>${escapeHtml(color)}</strong></div>` : ''}
      </div>

      ${price ? `<div class="price"><span>Valor total en pesos</span><strong>${escapeHtml(price)}</strong></div>` : ''}
      ${advance ? `<div class="advance">Anticipo desde <strong>${escapeHtml(advance)}</strong></div>` : ''}

      <a class="cta" href="${escapeHtml(appUrl)}">Ver ficha completa y consultar</a>
      <a class="secondary" href="https://wa.me/5491132627744?text=${encodeURIComponent(`Hola, quiero consultar por ${marca} ${modelo}${anio ? ` ${anio}` : ''}.`)}">Consultar por WhatsApp</a>
    </article>
  </div>

  ${scoreListMarkup(row)}
</main>

<footer class="shell">
  LMP Autos · Av. Mosconi 799, Lomas del Mirador · WhatsApp 11 3262-7744
  ${generatedAt ? ` · Stock actualizado ${escapeHtml(new Date(generatedAt).toLocaleDateString('es-AR'))}` : ''}
</footer>
</body>
</html>`;
}

async function generateVehiclePages(rows, generatedAt) {
  await rm(vehiclesDir, { recursive: true, force: true });
  await mkdir(vehiclesDir, { recursive: true });

  const publicRows = publicRowsSorted(rows);

  for (const row of publicRows) {
    const slug = vehicleSlug(row);
    if (!slug) continue;

    const directory = path.join(vehiclesDir, slug);
    await mkdir(directory, { recursive: true });
    await writeFile(
      path.join(directory, 'index.html'),
      vehiclePageHtml(row, generatedAt),
      'utf8'
    );
  }

  return publicRows;
}

function sitemapXml(rows, generatedAt) {
  const lastmod = generatedAt
    ? new Date(generatedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  const staticUrls = [
    {
      loc: `${SITE_URL}/`,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${SITE_URL}/cuotas.html`,
      changefreq: 'monthly',
      priority: '0.7'
    }
  ];

  const vehicleUrls = rows.map(row => ({
    loc: `${SITE_URL}/vehiculos/${vehicleSlug(row)}/`,
    changefreq: 'daily',
    priority: '0.8'
  }));

  const items = [...staticUrls, ...vehicleUrls];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map(item => `  <url>
    <loc>${escapeXml(item.loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

async function writeRobots() {
  await writeFile(
    robotsPath,
    `User-agent: *
Allow: /
Disallow: /*?stock=interno
Disallow: /metricas.html

Sitemap: ${SITE_URL}/sitemap.xml
`,
    'utf8'
  );
}

async function loadCsvText() {
  const localFixture = process.env.STOCK_CSV_FILE;

  if (localFixture) {
    return readFile(path.resolve(localFixture), 'utf8');
  }

  const separator = CSV_URL.includes('?') ? '&' : '?';
  const url = `${CSV_URL}${separator}_=${Date.now()}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'user-agent': 'LMP-Autos-Stock-Sync/2.0',
      'accept': 'text/csv,text/plain;q=0.9,*/*;q=0.1'
    }
  });

  if (!response.ok) {
    throw new Error(`Google Sheets respondió HTTP ${response.status}`);
  }

  const text = await response.text();

  if (!text || !text.includes('Marca') || !text.includes('Modelo')) {
    throw new Error('La respuesta no parece ser el CSV de stock esperado.');
  }

  return text;
}

function hashRows(rows) {
  return createHash('sha256')
    .update(JSON.stringify(rows))
    .digest('hex');
}

async function readExistingStock() {
  if (!existsSync(stockPath)) return null;

  try {
    return JSON.parse(await readFile(stockPath, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  const csvText = await loadCsvText();
  const parsedRows = parseCSV(csvText);
  const rows = validateRows(parsedRows);
  const contentHash = hashRows(rows);
  const existing = await readExistingStock();

  const sameStock = Boolean(
    existing &&
    existing.contentHash === contentHash &&
    Array.isArray(existing.rows) &&
    existing.rows.length === rows.length
  );

  const generatedAt = sameStock && existing.generatedAt
    ? existing.generatedAt
    : new Date().toISOString();

  if (!sameStock) {
    const payload = {
      schemaVersion: 1,
      generatedAt,
      source: 'Google Sheets CSV publicado',
      rowCount: rows.length,
      contentHash,
      rows
    };

    await mkdir(path.dirname(stockPath), { recursive: true });
    await writeFile(
      stockPath,
      `${JSON.stringify(payload, null, 2)}\n`,
      'utf8'
    );
  }

  await updateIndexPrerender(rows);
  const publicRows = await generateVehiclePages(rows, generatedAt);
  await writeFile(
    sitemapPath,
    sitemapXml(publicRows, generatedAt),
    'utf8'
  );
  await writeRobots();

  if (sameStock) {
    console.log(`Stock sin cambios: ${rows.length} filas.`);
  } else {
    console.log(`Stock actualizado: ${rows.length} filas.`);
  }

  console.log(`Vehículos públicos pre-renderizados: ${publicRows.length}.`);
  console.log(`Sitemap actualizado: ${publicRows.length + 2} URLs.`);
  console.log(`Hash: ${contentHash.slice(0, 12)}`);
}

main().catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
