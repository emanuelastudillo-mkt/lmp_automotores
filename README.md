# LMP Autos Web v1.11 — Catálogo interno con mini tarjetas

## Error corregido

La versión 1.10 utilizaba una función inexistente:

```javascript
titleCase()
```

Esto interrumpía la carga con:

```text
titleCase is not defined
```

La función fue reemplazada por `internalStatusText()`, que convierte los estados conocidos a textos legibles sin depender de una función externa.

## Nuevo diseño del catálogo interno

La tabla fue reemplazada por mini tarjetas similares a las tarjetas comerciales actuales.

Cada tarjeta incluye:

- ID interno;
- etiquetas de estado;
- marca y modelo;
- año;
- kilometraje;
- transmisión;
- combustible;
- precio en dólares;
- precio en pesos;
- anticipo o condición de contado;
- cuota estimada;
- financiación;
- permuta;
- estado comercial;
- calificación general;
- disponibilidad de foto local;
- disponibilidad de foto de Drive.

## Elementos excluidos

La vista interna no muestra:

- fotografías;
- botón Ver vehículo;
- botón Consultar;
- Instagram;
- favoritos;
- comparación;
- otras acciones comerciales.

## Diseño responsive

- 4 columnas en desktop amplio.
- 3 columnas en resoluciones intermedias.
- 2 columnas en tablets.
- 1 columna en mobile.

## Acceso

Continúa disponible desde el enlace inferior:

```text
catálogo
```

o mediante:

```text
?stock=interno
```

## Versión

```text
lmpautos V1.11
```

## Validación

- JavaScript validado con `node --check`.
- Confirmada la eliminación de `titleCase()`.
- Confirmada la eliminación de la tabla anterior.
- Confirmada la ausencia de fotos y botones de acción.
