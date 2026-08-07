import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CSV_URL =
  process.env.STOCK_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vR97O_aQlCskpibTlj1UEomToyCeUl8seOUB3DoNihqoXAAfGbO-8DtUj_WG9XZJvYRWJ_PdGcEBKcH/pub?gid=0&single=true&output=csv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'data', 'stock.json');

function clean(value) {
  return (value ?? '').toString().trim();
}

function normalize(value) {
  return clean(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
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
    clean(row[findHeader(headers, 'Marca')]) &&
    clean(row[findHeader(headers, 'Modelo')])
  );

  if (!usableRows.length) {
    throw new Error('El CSV no contiene vehículos utilizables.');
  }

  return usableRows;
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
      'user-agent': 'LMP-Autos-Stock-Sync/1.0',
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
  if (!existsSync(outputPath)) return null;

  try {
    return JSON.parse(await readFile(outputPath, 'utf8'));
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

  if (
    existing &&
    existing.contentHash === contentHash &&
    Array.isArray(existing.rows) &&
    existing.rows.length === rows.length
  ) {
    console.log(`Sin cambios. ${rows.length} vehículos/filas continúan vigentes.`);
    return;
  }

  const payload = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: 'Google Sheets CSV publicado',
    rowCount: rows.length,
    contentHash,
    rows
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    outputPath,
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8'
  );

  console.log(`Stock actualizado: ${rows.length} filas.`);
  console.log(`Archivo: ${path.relative(repoRoot, outputPath)}`);
  console.log(`Hash: ${contentHash.slice(0, 12)}`);
}

main().catch(error => {
  console.error(`ERROR: ${error.message}`);
  process.exitCode = 1;
});
