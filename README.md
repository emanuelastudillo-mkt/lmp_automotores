# LMP Autos Web v1.31 — Ajustes SEO según auditoría

Esta versión toma como guía la auditoría SEO del 7 de agosto de 2026 y refuerza los puntos señalados.

## Home

### Title

```text
Autos Usados en Lomas del Mirador | LMP Autos
```

### Meta description

```text
Autos usados en Lomas del Mirador con financiación, cuotas fijas y permutas. Más de 10 años de experiencia. Visitanos en Av. Mosconi 799, Zona Oeste.
```

La descripción tiene 149 caracteres y utiliza la keyword principal de forma natural.

### H1

```text
Autos usados en Lomas del Mirador
```

Se mantiene como único H1 público de la home.

## Contenido indexable

Además del catálogo pre-renderizado, se agregó un bloque visible con contenido local sobre:

- autos usados;
- Zona Oeste;
- financiación;
- cuotas fijas;
- permutas;
- gestión con DNI;
- más de 10 años de experiencia;
- Av. Mosconi 799.

Incluye un enlace interno a `cuotas.html`.

## Stock interno

`Stock interno` continúa fuera de la jerarquía H1.

La URL `?stock=interno` aplica dinámicamente:

```text
noindex,nofollow,noarchive
```

y el enlace del footer usa `rel="nofollow"`.

## Open Graph y redes

La home contiene:

- og:title;
- og:description;
- og:url;
- og:image;
- og:image:alt;
- Twitter Card;
- twitter:image:alt.

Las fichas individuales también generan sus propios metadatos sociales.

## Datos estructurados

La home usa un `@graph` con:

- `AutoDealer`;
- `WebSite`.

Incluye dirección, teléfono, área atendida, Instagram, Maps y contacto comercial.

No se inventaron horarios porque no están definidos en la información disponible.

## URLs de vehículos

Cada auto público continúa teniendo una URL propia:

```text
/vehiculos/marca-modelo-anio/
```

Se reforzaron con:

- title local;
- meta description local;
- canonical;
- hreflang `es-AR`;
- Open Graph;
- Schema `Vehicle`;
- Schema `BreadcrumbList`;
- breadcrumbs visibles;
- imágenes locales;
- alt descriptivos.

Ejemplo de title:

```text
Ford Focus 2.0 SE Plus 2016 usado en Lomas del Mirador | LMP Autos
```

## Imágenes

Los alt de las imágenes principales ahora describen marca, modelo, año y ubicación.

Ejemplo:

```text
Ford Focus 2.0 SE Plus 2016 usado en Lomas del Mirador
```

Las miniaturas de las galerías también tienen alt individual.

## Sitemap

`sitemap.xml` incorpora el namespace de Google Images:

```text
xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
```

Cada ficha puede incluir las imágenes locales del vehículo dentro del sitemap.

Esto se actualiza automáticamente junto con el stock.

## robots.txt

```text
User-agent: *
Allow: /
Disallow: /metricas.html

Sitemap: https://lmpautos.com/sitemap.xml
```

La página de métricas continúa fuera del rastreo público.

## Sincronización automática

El workflow mantiene:

- Google Sheets → `stock.json`;
- sincronización de imágenes;
- pre-render del catálogo;
- páginas SEO individuales;
- sitemap;
- robots.

Se conserva Node.js 24 y GitHub Actions v6.

## Versión

```text
lmpautos V1.30
```


## Ajuste visual adicional

- Se corrigió la proporción visual de las portadas del catálogo a **1080x1350 (4:5)**.
- Las tarjetas de vehículos ahora usan `aspect-ratio: 4/5` en lugar de `3/4`.
- La imagen principal de cada tarjeta usa `object-fit: cover` para ocupar exactamente el recuadro y evitar franjas vacías arriba o abajo.
