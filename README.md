# LMP Autos Web v1.28 — SEO + pre-render del catálogo

## Qué corrige de la auditoría

### 1. Catálogo visible en el HTML inicial

El workflow ya no genera solamente `data/stock.json`.

Cada sincronización también inserta una copia estática y visible del stock dentro de:

- Vehículos recomendados.
- Catálogo completo.

Esos vehículos existen en el HTML que recibe un buscador antes de ejecutar JavaScript.

Cuando JavaScript carga, las tarjetas estáticas son reemplazadas por las tarjetas interactivas normales.

### 2. Páginas estáticas por vehículo

Por cada vehículo público se genera:

```text
/vehiculos/marca-modelo-anio/index.html
```

Ejemplo:

```text
/vehiculos/ford-focus-2-0-se-plus-2016/
```

Cada página incluye:

- H1 propio.
- title único.
- meta description única.
- canonical.
- Open Graph.
- Twitter Card.
- fotografía cuando está disponible.
- especificaciones.
- precio.
- anticipo.
- Perfil del vehículo.
- CTA a la ficha completa.
- CTA de WhatsApp.
- Schema `Vehicle`.

Los vehículos vendidos o `de baja` no generan páginas públicas.

### 3. Home optimizada

Nuevo title:

```text
Autos usados en Lomas del Mirador | LMP Autos
```

Nueva meta description:

```text
Encontrá autos usados en Lomas del Mirador, Zona Oeste. Financiación, cuotas fijas, permutas y atención personalizada en LMP Autos, Av. Mosconi 799.
```

También se agregó un H1 público:

```text
Autos usados en Lomas del Mirador
```

El H1 de Stock interno se convirtió en H2 y todo ese sector tiene `data-nosnippet`.

### 4. SEO local

La home incluye JSON-LD `AutoDealer` con:

- LMP Autos.
- Av. Mosconi 799.
- Lomas del Mirador.
- Buenos Aires.
- teléfono.
- web.
- Google Maps.
- Instagram.
- zona atendida.

No se agregaron horarios porque no están definidos en la información actual del proyecto.

### 5. Open Graph

La home y las páginas de vehículos incluyen:

- `og:title`.
- `og:description`.
- `og:url`.
- `og:image`.
- Twitter Card.

Esto mejora la información disponible al compartir enlaces en WhatsApp y redes sociales.

### 6. robots.txt

Incluido:

```text
User-agent: *
Allow: /
Disallow: /*?stock=interno
Disallow: /metricas.html

Sitemap: https://lmpautos.com/sitemap.xml
```

### 7. sitemap.xml

El sitemap se vuelve a generar cada vez que cambia el stock.

Incluye:

- home;
- financiación;
- cada vehículo público.

No incluye:

- Stock interno;
- métricas;
- vendidos;
- vehículos de baja.

## Funcionamiento del workflow

Cada seis horas o al ejecutar manualmente:

```text
Google Sheets
      ↓
data/stock.json
      ↓
index.html pre-renderizado
      ↓
/vehiculos/<slug>/
      ↓
sitemap.xml
```

## Importante después de instalar V1.28

Ejecutar una vez:

```text
GitHub
→ Actions
→ Actualizar stock y SEO desde Google Sheets
→ Run workflow
```

Ese primer run genera las páginas reales de todos los vehículos.

## GitHub Actions actualizado

Para eliminar el warning de Node 20:

```text
actions/checkout@v6
actions/setup-node@v6
Node.js 24
```

## Validación

Se probó el script con un CSV simulado y se verificó:

- generación de `stock.json`;
- inserción del stock en el HTML inicial;
- exclusión de vehículos de baja;
- creación de páginas individuales;
- generación de sitemap;
- generación de robots.txt;
- estabilidad cuando el stock no cambia;
- JavaScript principal con `node --check`;
- script de sincronización con `node --check`.

## Versión

```text
lmpautos V1.28
```
