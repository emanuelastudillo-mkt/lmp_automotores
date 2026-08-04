# LMP Autos Web v1.25 — Imágenes de Drive y orden de filtros

## Problemas detectados

### Imágenes de los últimos vehículos

Las tarjetas de `Ver todos` intentaban cargar siempre una portada local, aunque esa portada no existiera.

Después utilizaban una única dirección transformada de Google Drive. Si ese formato no respondía, la tarjeta quedaba sin imagen.

Además, un enlace a una carpeta de Drive podía confundirse con el identificador de una imagen.

### Orden de los filtros

Cuando una imagen agotaba todos sus intentos de carga, la tarjeta se movía al final de la grilla mediante JavaScript.

Ese movimiento ocurría después de ordenar el catálogo y alteraba visualmente los resultados por:

- precio;
- año;
- rendimiento;
- confort;
- economía;
- espacio;
- seguridad;
- calificación general.

## Correcciones

### Carga de imágenes

- La portada local solo se intenta cuando fue validada previamente.
- Los enlaces de archivos de Google Drive generan tres alternativas:
  1. miniatura de Drive;
  2. servidor `lh3.googleusercontent.com`;
  3. enlace `uc?export=view`.
- Si una alternativa falla, se prueba la siguiente.
- Se reconocen variantes de encabezados como `Foto 1`, `Foto1`, `Imagen 1` e `Imagen1`.
- Si `Link de fotos/videos` contiene un archivo individual de Drive, también puede utilizarse como imagen.
- Los enlaces a carpetas continúan funcionando como acceso a la carpeta, pero no se intentan mostrar como fotografía.
- Una carga correcta limpia el estado interno de error de la imagen.

### Ordenamiento

Las tarjetas ya no se mueven cuando falla una imagen.

El orden seleccionado queda separado de la disponibilidad de fotografías:

- precio;
- año;
- puntajes;
- filtros por marca;
- transmisión;
- combustible;
- favoritos.

Los vehículos sin precio o sin puntaje quedan al final del criterio correspondiente.

Los empates se resuelven de forma estable por:

1. año;
2. número de ID;
3. marca y modelo.

## Validación

- JavaScript completo validado con `node --check`.
- Probados enlaces de archivo y carpeta de Google Drive.
- Confirmadas tres alternativas por archivo de Drive.
- Probado orden ascendente por precio.
- Probado orden descendente por año.
- Probado orden descendente por puntaje.
- Confirmado que una imagen fallida no reubica su tarjeta.

## Versión

```text
lmpautos V1.25
```
