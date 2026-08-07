import { createHash } from 'node:crypto';
import {
  mkdir,
  readFile,
  writeFile,
  rm,
  readdir,
  unlink
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const CSV_URL =
  process.env.STOCK_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR97O_aQlCskpibTlj1UEomToyCeUl8seOUB3DoNihqoXAAfGbO-8DtUj_WG9XZJvYRWJ_PdGcEBKcH/pub?gid=0&single=true&output=csv';

const SITE_URL = 'https://lmpautos.com';
const DEALER_NAME = 'LMP Autos';
const DEALER_PHONE = '+54 9 11 3262-7744';

const IMAGE_WIDTH = 1400;
const IMAGE_QUALITY = 80;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const stockPath = path.join(repoRoot, 'data', 'stock.json');
const imageStatePath = path.join(repoRoot, 'data', 'image-sync.json');
const indexPath = path.join(repoRoot, 'index.html');
const sitemapPath = path.join(repoRoot, 'sitemap.xml');
const robotsPath = path.join(repoRoot, 'robots.txt');
const vehiclesDir = path.join(repoRoot, 'vehiculos');
const imagesDir = path.join(repoRoot, 'img', 'vehiculos');
const imageManifestPath = path.join(imagesDir, 'manifest.json');

let currentImageManifest = {};

function clean(value) {
  return (value ?? '').toString().trim();
}

function normalize(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

function normalizedHeader(value) {
  return normalize(value)
    .replace(/[^A-Z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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

function vehicleId(row) {
  const firstValue = Object.values(row || {})[0];
  const raw = rowValue(row, 'ID', ' ') || clean(firstValue);

  return raw
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-zA-Z0-9_-]/g, '');
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
    rowValue(row, 'Modelo') &&
    vehicleId(row)
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

  const real = number < 1000 ? number * 1000 : number;

  return `${new Intl.NumberFormat('es-AR').format(real)} km`;
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
  return /drive\.google\.com\/(?:drive\/u\/\d+\/)?folders\//i.test(clean(url)) ||
    /\/folders\//i.test(clean(url));
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

function isDirectImageReference(url) {
  const input = clean(url);

  if (!input || isDriveFolderUrl(input)) return false;
  if (driveFileId(input)) return true;

  return /^https?:\/\//i.test(input);
}

function photoSources(row) {
  const numbered = [];

  for (const [key, value] of Object.entries(row || {})) {
    const url = clean(value);
    if (!url || !isDirectImageReference(url)) continue;

    const header = normalizedHeader(key);
    const match = header.match(/^(?:FOTO|IMAGEN)\s*(\d+)(?:\s|$)/);

    if (!match) continue;

    numbered.push({
      order: Number(match[1]) || 999,
      url
    });
  }

  numbered.sort((a, b) => a.order - b.order);

  const unique = [];
  const seen = new Set();

  for (const item of numbered) {
    const key = sourceKey(item.url);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  if (!unique.length) {
    const fallback = rowValue(
      row,
      'Link de fotos/videos',
      'Link de fotos y videos',
      'Link fotos/videos'
    );

    if (isDirectImageReference(fallback)) {
      unique.push({ order: 1, url: fallback });
    }
  }

  return unique;
}

function sourceKey(url) {
  const id = driveFileId(url);

  if (id) return `drive:${id}`;

  const input = clean(url);
  if (!input) return '';

  return `url:${createHash('sha256').update(input).digest('hex').slice(0, 24)}`;
}

function imageDownloadCandidates(url) {
  const input = clean(url);
  const id = driveFileId(input);

  if (!id) return [input];

  return [
    `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w2000`,
    `https://lh3.googleusercontent.com/d/${id}=w2000`,
    `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`,
    `https://drive.usercontent.google.com/download?id=${encodeURIComponent(id)}&export=download&confirm=t`
  ];
}

async function downloadImageBuffer(url) {
  const candidates = imageDownloadCandidates(url);
  const errors = [];

  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(25000),
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; LMPAutosImageSync/1.0)',
          'accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });

      if (!response.ok) {
        errors.push(`${response.status} ${candidate}`);
        continue;
      }

      const contentType = clean(response.headers.get('content-type')).toLowerCase();

      if (contentType.includes('text/html')) {
        errors.push(`HTML en ${candidate}`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      if (buffer.length < 512) {
        errors.push(`archivo demasiado pequeño en ${candidate}`);
        continue;
      }

      try {
        const metadata = await sharp(buffer, { failOn: 'none' }).metadata();

        if (!metadata.width || !metadata.height) {
          errors.push(`imagen inválida en ${candidate}`);
          continue;
        }
      } catch {
        errors.push(`formato no reconocido en ${candidate}`);
        continue;
      }

      return buffer;
    } catch (error) {
      errors.push(`${error.message} en ${candidate}`);
    }
  }

  throw new Error(errors.join(' | ') || 'No se pudo descargar la imagen.');
}

async function toOptimizedWebp(buffer) {
  return sharp(buffer, { failOn: 'none' })
    .rotate()
    .resize({
      width: IMAGE_WIDTH,
      height: IMAGE_WIDTH,
      fit: 'inside',
      withoutEnlargement: true
    })
    .webp({
      quality: IMAGE_QUALITY,
      effort: 4,
      smartSubsample: true
    })
    .toBuffer();
}

async function writeBufferIfChanged(filePath, buffer) {
  if (existsSync(filePath)) {
    const current = await readFile(filePath);

    if (current.equals(buffer)) {
      return false;
    }
  }

  await writeFile(filePath, buffer);
  return true;
}

async function readJson(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;

  try {
    return JSON.parse(await readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function writeJsonIfChanged(filePath, value) {
  const next = stableJson(value);

  if (existsSync(filePath)) {
    const current = await readFile(filePath, 'utf8');
    if (current === next) return false;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, next, 'utf8');
  return true;
}

function generatedTargetName(id, source, index, manualCover) {
  if (manualCover) {
    // Con portada manual:
    // Foto 1 corresponde a A123.webp y no se pisa.
    // Foto 2 -> A123-1.webp; Foto 3 -> A123-2.webp...
    const logicalOrder = Math.max(1, Number(source.order) || (index + 1));

    if (logicalOrder === 1) {
      return '';
    }

    return `${id}-${logicalOrder - 1}.webp`;
  }

  // Sin portada manual: la primera foto disponible se convierte en portada.
  if (index === 0) return `${id}.webp`;

  return `${id}-${index}.webp`;
}

async function syncVehicleImages(row, previousVehicleState, report) {
  const id = vehicleId(row);
  if (!id) return { items: [] };

  const previousItems = Array.isArray(previousVehicleState?.items)
    ? previousVehicleState.items
    : [];

  const previousByFile = new Map(
    previousItems.map(item => [clean(item.file), item])
  );

  const previousGeneratedFiles = new Set(
    previousItems.map(item => clean(item.file)).filter(Boolean)
  );

  const coverName = `${id}.webp`;
  const coverPath = path.join(imagesDir, coverName);
  const manualCover =
    existsSync(coverPath) &&
    !previousGeneratedFiles.has(coverName);

  const sources = photoSources(row);
  const desired = [];

  for (let index = 0; index < sources.length; index += 1) {
    const source = sources[index];

    if (manualCover && Number(source.order) === 1) {
      report.manualCovers += 1;
      continue;
    }

    const file = generatedTargetName(id, source, index, manualCover);
    if (!file) continue;

    desired.push({
      file,
      source: sourceKey(source.url),
      url: source.url,
      logicalOrder: source.order
    });
  }

  const nextItems = [];

  for (const item of desired) {
    const filePath = path.join(imagesDir, item.file);
    const previous = previousByFile.get(item.file);

    if (
      previous &&
      previous.source === item.source &&
      existsSync(filePath)
    ) {
      nextItems.push(previous);
      report.unchanged += 1;
      continue;
    }

    try {
      const input = await downloadImageBuffer(item.url);
      const output = await toOptimizedWebp(input);
      const written = await writeBufferIfChanged(filePath, output);

      nextItems.push({
        file: item.file,
        source: item.source,
        logicalOrder: item.logicalOrder
      });

      if (written) report.downloaded += 1;
      else report.unchanged += 1;
    } catch (error) {
      report.errors.push(`${id} · ${item.file}: ${error.message}`);

      // Si había una versión anterior, conservarla y reintentar en el próximo workflow.
      if (previous && existsSync(filePath)) {
        nextItems.push(previous);
      }
    }
  }

  const nextFiles = new Set(nextItems.map(item => item.file));

  for (const previous of previousItems) {
    const file = clean(previous.file);

    if (!file || nextFiles.has(file)) continue;

    const filePath = path.join(imagesDir, file);

    if (existsSync(filePath)) {
      await unlink(filePath);
      report.deleted += 1;
    }
  }

  return {
    manualCover,
    items: nextItems
  };
}

async function syncImages(rows) {
  await mkdir(imagesDir, { recursive: true });

  const previousState = await readJson(
    imageStatePath,
    { schemaVersion: 1, vehicles: {} }
  );

  const nextVehicles = {};
  const report = {
    downloaded: 0,
    unchanged: 0,
    deleted: 0,
    manualCovers: 0,
    foldersOnly: 0,
    errors: []
  };

  const allRowsById = new Map(
    rows.map(row => [vehicleId(row), row]).filter(([id]) => id)
  );

  for (const row of rows) {
    const id = vehicleId(row);
    if (!id) continue;

    const previousVehicleState = previousState.vehicles?.[id] || { items: [] };

    if (!isPublicVehicle(row)) {
      // El original continúa en Drive; se limpian solamente archivos generados por la automatización.
      for (const previous of previousVehicleState.items || []) {
        const filePath = path.join(imagesDir, clean(previous.file));

        if (clean(previous.file) && existsSync(filePath)) {
          await unlink(filePath);
          report.deleted += 1;
        }
      }

      continue;
    }

    const folderLink = rowValue(
      row,
      'Link de fotos/videos',
      'Link de fotos y videos',
      'Link fotos/videos'
    );

    if (isDriveFolderUrl(folderLink) && !photoSources(row).length) {
      report.foldersOnly += 1;
    }

    nextVehicles[id] = await syncVehicleImages(
      row,
      previousVehicleState,
      report
    );
  }

  // Limpiar imágenes generadas de IDs que ya ni siquiera están en la hoja.
  for (const [id, previousVehicleState] of Object.entries(previousState.vehicles || {})) {
    if (allRowsById.has(id)) continue;

    for (const previous of previousVehicleState.items || []) {
      const filePath = path.join(imagesDir, clean(previous.file));

      if (clean(previous.file) && existsSync(filePath)) {
        await unlink(filePath);
        report.deleted += 1;
      }
    }
  }

  await writeJsonIfChanged(imageStatePath, {
    schemaVersion: 1,
    vehicles: nextVehicles
  });

  currentImageManifest = await buildImageManifest(rows);
  await writeJsonIfChanged(imageManifestPath, currentImageManifest);

  return report;
}

async function buildImageManifest(rows) {
  await mkdir(imagesDir, { recursive: true });

  const entries = {};
  const hashParts = [];

  for (const row of rows) {
    const id = vehicleId(row);
    if (!id) continue;

    let files = [];

    try {
      files = (await readdir(imagesDir))
        .filter(file =>
          file === `${id}.webp` ||
          new RegExp(`^${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d+\\.webp$`, 'i').test(file)
        );
    } catch {
      files = [];
    }

    files.sort((a, b) => {
      if (a === `${id}.webp`) return -1;
      if (b === `${id}.webp`) return 1;

      const aNumber = Number((a.match(/-(\d+)\.webp$/i) || [])[1]) || 9999;
      const bNumber = Number((b.match(/-(\d+)\.webp$/i) || [])[1]) || 9999;

      return aNumber - bNumber;
    });

    if (!files.length) continue;

    entries[id] = files;

    for (const file of files) {
      const buffer = await readFile(path.join(imagesDir, file));
      const digest = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
      hashParts.push(`${file}:${digest}`);
    }
  }

  const version = createHash('sha256')
    .update(hashParts.sort().join('|'))
    .digest('hex')
    .slice(0, 12);

  return {
    _version: version || 'empty',
    ...entries
  };
}

function localVehicleImages(row) {
  const id = vehicleId(row);
  const files = Array.isArray(currentImageManifest?.[id])
    ? currentImageManifest[id]
    : [];

  const version = clean(currentImageManifest?._version) || '1';

  return files.map(file =>
    `${SITE_URL}/img/vehiculos/${encodeURIComponent(file)}?v=${encodeURIComponent(version)}`
  );
}

function remoteVehicleImage(row) {
  const candidates = photoSources(row);

  for (const candidate of candidates) {
    const id = driveFileId(candidate.url);

    if (id) {
      return `https://drive.google.com/thumbnail?id=${encodeURIComponent(id)}&sz=w1200`;
    }

    if (/^https?:\/\//i.test(candidate.url) && !isDriveFolderUrl(candidate.url)) {
      return candidate.url;
    }
  }

  return '';
}

function vehicleImages(row) {
  const local = localVehicleImages(row);

  if (local.length) return local;

  const remote = remoteVehicleImage(row);
  return remote ? [remote] : [];
}

function vehicleImage(row) {
  return vehicleImages(row)[0] || '';
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
  const id = vehicleId(row);
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
  const images = vehicleImages(row);

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
          value: km < 1000 ? km * 1000 : km,
          unitCode: 'KMT'
        }
      : undefined,
    image: images.length ? images : undefined,
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
  const images = vehicleImages(row);
  const image = images[0] || '';
  const slug = vehicleSlug(row);
  const url = `${SITE_URL}/vehiculos/${slug}/`;
  const appUrl = `${SITE_URL}/?vehiculo=${encodeURIComponent(slug)}`;
  const title = `${marca} ${modelo}${anio ? ` ${anio}` : ''} usado | LMP Autos`;
  const description = vehicleDescription(row);

  const imageMarkup = image
    ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(`${marca} ${modelo}${anio ? ` ${anio}` : ''}`)}" referrerpolicy="no-referrer">`
    : `<div class="image-empty">Fotos disponibles en la ficha completa</div>`;

  const galleryMarkup = images.length > 1
    ? `<div class="seo-gallery">${images.slice(1, 6).map((src, index) =>
        `<img src="${escapeHtml(src)}" alt="${escapeHtml(`${marca} ${modelo} foto ${index + 2}`)}" loading="lazy" referrerpolicy="no-referrer">`
      ).join('')}</div>`
    : '';

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
    .seo-gallery{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;margin-top:8px}
    .seo-gallery img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:8px}
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
      .seo-gallery{grid-template-columns:repeat(3,minmax(0,1fr))}
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
    <div>
      <div class="media">${imageMarkup}</div>
      ${galleryMarkup}
    </div>

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
      'user-agent': 'LMP-Autos-Stock-Sync/3.0',
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

  const imageReport = await syncImages(rows);

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

  console.log(
    `Imágenes: ${imageReport.downloaded} nuevas/actualizadas · ` +
    `${imageReport.unchanged} sin cambios · ` +
    `${imageReport.deleted} eliminadas.`
  );

  if (imageReport.foldersOnly) {
    console.log(
      `Aviso: ${imageReport.foldersOnly} vehículo(s) tienen solamente una carpeta de Drive. ` +
      `Para copiarlos automáticamente se necesitan enlaces individuales en columnas Foto 1, Foto 2, Foto 3...`
    );
  }

  if (imageReport.errors.length) {
    console.warn(`Advertencias de imágenes (${imageReport.errors.length}):`);
    imageReport.errors.forEach(message => console.warn(`- ${message}`));
  }

  console.log(`Vehículos públicos pre-renderizados: ${publicRows.length}.`);
  console.log(`Sitemap actualizado: ${publicRows.length + 2} URLs.`);
  console.log(`Manifest de imágenes: ${clean(currentImageManifest._version) || 'sin versión'}.`);
  console.log(`Hash de stock: ${contentHash.slice(0, 12)}`);
}

main().catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
