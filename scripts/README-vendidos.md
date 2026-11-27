# Fichas de vehículos vendidos

`preserve-sold-vehicle-pages.mjs` toma el estado `VENDIDO` de `data/stock.json`,
la copia del Inventario de Google Sheets que escribe `actualizar-stock.mjs`.
No requiere Git ni infiere ventas a partir de páginas desaparecidas.

Cada fila vendida conserva la dirección calculada con marca, modelo y año.
Las páginas indican VENDIDO, usan `noindex,follow` y enlazan al catálogo actual.
No se incorporan a `sitemap.xml` ni al catálogo comercial de Meta.
Las filas con el mismo ID se procesan por separado; si dos filas generan la misma
dirección, se conserva una página. Una colisión con un vehículo no vendido
detiene el proceso antes de escribir.

`data/sold-vehicles.json` registra direcciones históricas vinculadas a un
`vehicleId` de la hoja. Solo se recuperan cuando ese ID sigue estando vendido.
El nombre mostrado siempre procede del Inventario actual. Por ejemplo,
`chevrolet-onix-1-4-ltz-2019` pertenece al A133, hoy Chevrolet Prisma 1.4 LTZ 2019.
No agregar aliases por parecido de nombres sin confirmar el vehículo.

Ambos workflows restauran y comprueban las fichas antes de guardar cambios.
El workflow dedicado prepara los archivos nuevos con `git add` antes de comprobar
si hay diferencias, para que una restauración nueva no pase inadvertida.

Comprobaciones:

```sh
node --test tests/preserve-sold-vehicle-pages.test.mjs
node scripts/preserve-sold-vehicle-pages.mjs
node scripts/preserve-sold-vehicle-pages.mjs --check
```

El último comando solo verifica: falla si falta una ficha o su contenido no
coincide con el estado actual de la hoja. Los JSON inválidos tampoco se silencian.
