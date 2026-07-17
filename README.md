# LMP Autos Web v1.10 — Catálogo interno

## Vista agregada

Se incorporó un modo de chequeo interno de stock sin:

- fotografías;
- botones de consulta;
- botones de favoritos;
- botones de comparación;
- acciones comerciales.

## Acceso

Al lado de la versión visible se agregó el enlace:

```text
catálogo
```

El enlace abre:

```text
?stock=interno
```

## Información mostrada

La tabla incluye:

- ID;
- marca y modelo;
- año;
- kilometraje;
- estado comercial;
- combustible;
- transmisión;
- precio final;
- anticipo;
- porcentaje de anticipo;
- máximo financiable;
- posibilidad de permuta;
- existencia de portada local;
- existencia de enlace de Drive;
- calificación general.

## Orden

Los vehículos se ordenan por ID numérico descendente para facilitar la revisión de los últimos ingresos.

## Alcance

La lista utiliza los vehículos activos del sitio:

- Disponible.
- Reservado.
- Preparando.
- Solo de Contado.

Los vehículos marcados como vendidos continúan excluidos por la lógica actual del catálogo.

## Versión

```text
lmpautos V1.10
```

## Validación

- JavaScript validado con `node --check`.
- Confirmada la vista sin imágenes ni botones.
- Confirmado el enlace inferior junto a la versión.
