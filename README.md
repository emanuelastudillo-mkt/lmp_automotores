# LMP Autos Web v1.03 — Validación de portadas y enlaces de Drive

## Errores corregidos

### A119 aparecía en inicio sin portada local

La validación anterior utilizaba un objeto `Image()` y podía aceptar una respuesta almacenada en caché.

La nueva validación:

1. solicita `img/vehiculos/ID.webp` con `fetch`;
2. utiliza `cache: no-store`;
3. verifica que la respuesta HTTP sea correcta;
4. verifica que `Content-Type` sea realmente una imagen;
5. decodifica el archivo y comprueba que tenga ancho y alto válidos.

También se agregó una versión en la URL:

```text
img/vehiculos/A119.webp?v103
```

Esto evita reutilizar una portada antigua almacenada por el navegador o el CDN.

Si `A119.webp` no existe realmente, el A119 ya no puede aparecer en la pantalla de inicio ni en el popup destacado.

### El enlace Foto 1 no se visualizaba

Se amplió la detección de enlaces de Google Drive y ahora se convierten a:

```text
https://lh3.googleusercontent.com/d/ID=w1600
```

Se aceptan enlaces con estas formas:

- `/file/d/ID/view`
- `?id=ID`
- `/d/ID`
- enlaces que contengan directamente un ID largo de Drive

## Comportamiento actual

### Pantalla de inicio

Solo muestra vehículos con una imagen local válida:

```text
img/vehiculos/ID.webp
```

No utiliza Foto 1 como reemplazo en inicio.

### Catálogo completo

1. intenta cargar la portada local;
2. si falla, utiliza Foto 1 de Drive.

### Ficha del vehículo

Utiliza los enlaces Foto 1 a Foto 4. Si una imagen no puede cargarse, muestra “Imagen no disponible” en lugar del ícono roto.

## Observación sobre permisos de Drive

El archivo de Drive debe tener acceso:

```text
Cualquier persona con el enlace
```

Si el archivo está restringido, Google no permite mostrarlo desde la web aunque el enlace esté correctamente cargado en la planilla.

## Validación

- JavaScript validado con `node --check`.
- Validación HTTP y de tipo MIME para portadas locales.
- Comprobación real de dimensiones de imagen.
- Caché de portada desactivada durante la verificación.
