# LMP Autos Web v1.08 — Bloque simple y filtros

## Bloque “Comprar tu próximo auto puede ser más simple”

El problema se debía a un selector CSS global:

```css
.trust-grid
```

La nueva franja de indicadores estaba sobrescribiendo la grilla del bloque oscuro y la convertía en tres columnas. Como el bloque tiene cuatro tarjetas, la cuarta pasaba a una segunda fila.

### Corrección

- El selector quedó limitado a `.trust-strip .trust-grid`.
- El bloque oscuro utiliza cuatro columnas en desktop.
- Entre 561 y 980 px utiliza dos columnas.
- En pantallas de hasta 560 px utiliza una columna.
- Se agregaron controles para evitar desbordes de texto.

## Filtro eliminado

Se retiró completamente:

```text
Orden comercial
```

También se eliminaron:

- el elemento HTML;
- las lecturas JavaScript;
- el listener;
- el reset;
- las condiciones de orden asociadas.

El catálogo mantiene como orden predeterminado:

1. Nuevos ingresos.
2. Vehículos más consultados.

Los filtros de precio y año continúan funcionando.

## Versión

```text
lmpautos V1.08
```

## Validación

- JavaScript validado con `node --check`.
- Confirmado que no quedan referencias a `smartOrder`.
- Confirmado que el bloque usa cuatro columnas en desktop.
