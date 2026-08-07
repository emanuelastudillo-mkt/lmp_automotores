# LMP Autos Web v1.29 — Sincronización automática de imágenes

Esta versión amplía el workflow de stock/SEO para copiar también las fotografías públicas de Google Drive al repositorio.

## Convención de nombres

Se mantiene una sola carpeta:

```text
img/vehiculos/
```

Ejemplo:

```text
A123.webp
A123-1.webp
A123-2.webp
A123-3.webp
A124.webp
A124-1.webp
```

Regla:

```text
A123.webp    = portada
A123-1.webp  = foto 2
A123-2.webp  = foto 3
A123-3.webp  = foto 4
```

## Qué ocurre con las portadas que ya existen

Las portadas actuales como:

```text
img/vehiculos/A123.webp
```

se consideran portadas manuales y NO se sobrescriben.

Si en Google Sheets existen:

```text
Foto 1
Foto 2
Foto 3
Foto 4
```

y `A123.webp` ya existe, la automatización interpreta:

```text
Foto 1 → ya representada por A123.webp
Foto 2 → A123-1.webp
Foto 3 → A123-2.webp
Foto 4 → A123-3.webp
```

Esto permite mantener las portadas actuales y automatizar el resto de la galería.

## Vehículos sin portada local

Si todavía no existe:

```text
A123.webp
```

la primera imagen disponible del Sheets se convierte automáticamente en la portada.

Las siguientes se nombran:

```text
A123-1.webp
A123-2.webp
...
```

## Columnas reconocidas

La automatización ya no está limitada a cuatro fotos.

Reconoce automáticamente:

```text
Foto 1
Foto1
Foto 2
Foto2
Foto 3
...
Foto 10
Imagen 1
Imagen1
Imagen 2
...
```

Puede seguir creciendo sin modificar el código.

## Google Drive

Los enlaces de archivos individuales de Drive son descargados automáticamente.

El workflow prueba varias direcciones de Google Drive antes de considerar que una imagen falló.

Las imágenes deben ser accesibles públicamente mediante el enlace compartido.

### Importante sobre carpetas

Esta primera versión NO recorre automáticamente el contenido de una carpeta de Drive.

Si una unidad solamente tiene:

```text
Link de fotos/videos = enlace a una carpeta
```

la carpeta continúa funcionando como enlace administrativo, pero sus archivos no se copian a GitHub.

Para esta automatización deben existir enlaces individuales en:

```text
Foto 1
Foto 2
Foto 3
...
```

No hace falta agregar columnas nuevas si esas columnas ya existen.

## Optimización automática

Cada foto descargada se procesa antes de guardarse:

```text
Formato: WebP
Ancho máximo: 1400 px
Calidad: 80
Rotación EXIF: automática
```

No se agrandan imágenes pequeñas.

Esto reduce considerablemente el peso frente a subir los originales directamente.

## Manifest de imágenes

El workflow genera automáticamente:

```text
img/vehiculos/manifest.json
```

Ejemplo:

```json
{
  "_version": "c2c248fa01af",
  "A123": [
    "A123.webp",
    "A123-1.webp",
    "A123-2.webp",
    "A123-3.webp"
  ]
}
```

La web utiliza este archivo para conocer exactamente qué fotos existen.

No prueba archivos inexistentes uno por uno.

## Galería en la web

La ficha del vehículo utiliza primero las fotos locales:

```text
/img/vehiculos/A123.webp
/img/vehiculos/A123-1.webp
/img/vehiculos/A123-2.webp
```

Si una foto todavía no fue sincronizada, las imágenes de Drive continúan funcionando como respaldo.

## SEO

Las páginas estáticas de vehículos generadas por el workflow utilizan las imágenes locales cuando existen.

El Schema `Vehicle` incluye también la lista de fotografías disponibles.

Las páginas SEO muestran hasta cinco miniaturas adicionales debajo de la imagen principal.

## Control de cambios

Se genera:

```text
data/image-sync.json
```

Este archivo recuerda qué imagen de Drive corresponde a cada archivo local.

Por eso, cada seis horas:

- si el enlace no cambió y la foto ya existe, no vuelve a descargarla;
- si una foto cambia, actualiza solamente esa foto;
- si se agrega `Foto 5`, crea solamente la nueva imagen;
- si se elimina una foto del Sheets, elimina solamente la copia generada correspondiente.

Las portadas manuales nunca son eliminadas por este mecanismo.

## Vehículos vendidos o de baja

Para vehículos `VENDIDO` o `DE BAJA`:

- dejan de generarse páginas públicas;
- las imágenes creadas automáticamente pueden eliminarse del sitio;
- una portada manual existente se conserva;
- los originales permanecen en Google Drive.

## Workflow

El mismo workflow realiza ahora:

```text
Google Sheets
      ↓
data/stock.json
      ↓
descarga fotos de Drive
      ↓
convierte a WebP
      ↓
img/vehiculos/
      ↓
manifest.json
      ↓
index.html SEO
      ↓
páginas /vehiculos/
      ↓
sitemap.xml
```

## Primera ejecución

Después de subir esta versión:

```text
GitHub
→ Actions
→ Actualizar stock, SEO e imágenes
→ Run workflow
```

La primera ejecución puede tardar más porque debe copiar las fotografías que todavía no están en GitHub.

Las siguientes serán mucho más rápidas.

## Qué mirar en el resultado del workflow

Al finalizar aparece algo similar a:

```text
Imágenes: 18 nuevas/actualizadas · 24 sin cambios · 0 eliminadas.
```

Si una unidad solo posee una carpeta Drive:

```text
Aviso: 1 vehículo(s) tienen solamente una carpeta de Drive.
```

Si una imagen individual no puede descargarse se muestra una advertencia indicando ID y archivo.

El workflow no cancela todo el stock porque falle una única fotografía.

## Archivos nuevos o modificados

```text
index.html
scripts/actualizar-stock.mjs
.github/workflows/actualizar-stock.yml
data/image-sync.json
```

El workflow creará automáticamente:

```text
img/vehiculos/manifest.json
img/vehiculos/A123-1.webp
img/vehiculos/A123-2.webp
...
```

## Instalación

Subir al repositorio:

```text
index.html
scripts/actualizar-stock.mjs
.github/workflows/actualizar-stock.yml
data/image-sync.json
```

No es necesario tocar las imágenes existentes en `img/vehiculos/`.

Después ejecutar manualmente el workflow una vez.

## Versión

```text
lmpautos V1.29
```
