import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildSoldEntries, restoreSoldPages } from '../scripts/preserve-sold-vehicle-pages.mjs';

const row = (id, model, status = 'VENDIDO', extra = {}) => ({
  '0': id, Marca: 'Chevrolet', Modelo: model, 'Año': '2019',
  'Estado actual del auto': status, ...extra,
});

test('solo restaura VENDIDO, incluidos vehículos sin página histórica', () => {
  const result = buildSoldEntries([
    row('A001', 'Prisma', ' vendido '),
    ...['DISPONIBLE', 'RESERVADO', 'PREPARANDO', 'CON DESCUENTO', 'DE BAJA', ''].map((status, i) => row(`A00${i + 2}`, `Modelo ${i}`, status)),
  ]);
  assert.equal(result.soldRecords, 1);
  assert.deepEqual(result.entries, [{ slug: 'chevrolet-prisma-2019', name: 'Chevrolet Prisma 2019', vehicleId: 'A001' }]);
});

test('conserva dos modelos distintos con un ID repetido y evita duplicar una URL', () => {
  const result = buildSoldEntries([
    row('A104', '207xr 1.4 // 3 puertas', 'VENDIDO', { Marca: 'Peugeot', 'Año': '2011' }),
    row('A104', 'Kwid 1.0 Intens', 'VENDIDO', { Marca: 'Renault', 'Año': '2018' }),
    row('A105', 'Kwid 1.0 Intens', 'VENDIDO', { Marca: 'Renault', 'Año': '2018' }),
  ]);
  assert.equal(result.soldRecords, 3);
  assert.deepEqual(result.entries.map(entry => entry.slug), ['peugeot-207xr-1-4-3-puertas-2011', 'renault-kwid-1-0-intens-2018']);
});

test('la dirección antigua del Onix muestra el nombre actual del Prisma A133', () => {
  const result = buildSoldEntries([row('A133', 'Prisma 1.4 LTZ')], [{ slug: 'chevrolet-onix-1-4-ltz-2019', vehicleId: 'A133' }]);
  assert.equal(result.entries.length, 2);
  assert.equal(result.entries.find(entry => entry.slug.includes('onix')).name, 'Chevrolet Prisma 1.4 LTZ 2019');
});

test('no usa un alias para un vehículo de baja, disponible o ausente de la hoja', () => {
  for (const status of ['DE BAJA', 'DISPONIBLE']) {
    const result = buildSoldEntries([row('A133', 'Prisma 1.4 LTZ', status)], [{ slug: 'chevrolet-onix-1-4-ltz-2019', vehicleId: 'A133' }]);
    assert.equal(result.entries.length, 0);
  }
  assert.equal(buildSoldEntries([row('A001', 'Otro', 'DISPONIBLE')], [{ slug: 'chevrolet-onix-1-4-ltz-2019', vehicleId: 'A133' }]).entries.length, 0);
});

test('impide marcar como vendida una dirección compartida con stock disponible', () => {
  assert.throws(() => buildSoldEntries([row('A001', 'Prisma'), row('A002', 'Prisma', 'DISPONIBLE')]), /también corresponde/);
  assert.throws(() => buildSoldEntries([row('A001', 'Prisma'), row('A002', 'Onix', 'DISPONIBLE')], [{ slug: 'chevrolet-onix-2019', vehicleId: 'A001' }]), /está en uso/);
});

test('rechaza datos incompletos y aliases ambiguos o rutas inseguras', () => {
  assert.throws(() => buildSoldEntries([]), /inválido/);
  assert.throws(() => buildSoldEntries([{ ID: 'A001', Marca: 'Fiat' }]), /Falta la columna/);
  assert.throws(() => buildSoldEntries([row('', 'Prisma')]), /sin ID/);
  assert.throws(() => buildSoldEntries([row('A001', 'Prisma')], [{ slug: '../otra-ruta', vehicleId: 'A001' }]), /inválida/);
  assert.throws(() => buildSoldEntries([row('A001', 'Prisma'), row('A001', 'Onix')], [{ slug: 'url-anterior', vehicleId: 'A001' }]), /ambiguo/);
});

test('restaura sin Git, reemplaza una ficha activa y es estable en la siguiente ejecución', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lmp-sold-test-'));
  fs.mkdirSync(path.join(root, 'data'));
  fs.writeFileSync(path.join(root, 'data', 'stock.json'), JSON.stringify({ rows: [row('A133', 'Prisma 1.4 LTZ'), row('A075', 'Onix Joy', 'DISPONIBLE'), row('A135', 'Cruze', 'DE BAJA')] }));
  fs.writeFileSync(path.join(root, 'data', 'sold-vehicles.json'), JSON.stringify([{ slug: 'chevrolet-onix-1-4-ltz-2019', vehicleId: 'A133' }]));
  const activeFile = path.join(root, 'vehiculos', 'chevrolet-prisma-1-4-ltz-2019', 'index.html');
  const availableFile = path.join(root, 'vehiculos', 'chevrolet-onix-joy-2019', 'index.html');
  for (const file of [activeFile, availableFile]) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, '<h1>Disponible</h1>');
  }
  assert.throws(() => restoreSoldPages(root, { check: true }), /Falta restaurar/);
  const result = restoreSoldPages(root);
  assert.equal(result.changed.length, 2);
  const html = fs.readFileSync(activeFile, 'utf8');
  assert.match(html, /content="noindex,follow"/);
  assert.match(html, /class="sold">VENDIDO/);
  assert.match(html, /Consultar uno similar/);
  assert.doesNotMatch(html, /<h1>Disponible/);
  assert.equal(fs.readFileSync(availableFile, 'utf8'), '<h1>Disponible</h1>');
  assert.equal(fs.existsSync(path.join(root, 'vehiculos', 'chevrolet-cruze-2019')), false);
  assert.equal(restoreSoldPages(root).changed.length, 0);
  assert.equal(restoreSoldPages(root, { check: true }).changed.length, 0);
  // Conservar los fixtures: no eliminar archivos del equipo del usuario.
});

test('un stock inválido produce un error visible en lugar de dar éxito sin restaurar', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lmp-sold-invalid-'));
  assert.throws(() => restoreSoldPages(root), /ENOENT/);
  fs.mkdirSync(path.join(root, 'data'));
  fs.writeFileSync(path.join(root, 'data', 'stock.json'), '{');
  assert.throws(() => restoreSoldPages(root), SyntaxError);
});
