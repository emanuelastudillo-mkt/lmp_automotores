# LMP Autos Web v1.20 — Puntajes dinámicos desde Google Sheets

## Problema corregido

Los vehículos nuevos podían cargar correctamente:

- foto;
- nombre;
- precios;
- ficha completa;

pero quedar sin rombo de puntajes.

La causa era que la web aceptaba la primera respuesta válida de Google Sheets. En algunas cargas, la fuente JSONP devolvía las columnas nuevas con encabezados genéricos o diferentes, aunque el catálogo general sí se pudiera leer.

## Nuevo comportamiento

La página ahora consulta en paralelo:

1. Google Sheets mediante JSONP.
2. El CSV publicado.

Después:

- verifica cuál de las dos respuestas contiene más puntajes reconocibles;
- utiliza esa respuesta como fuente principal;
- combina la otra fuente para completar datos faltantes;
- genera el vehículo una sola vez;
- conserva el caché como último respaldo.

## Encabezados reconocidos

Ya no se exige que el encabezado sea idéntico. Se reconocen variantes como:

```text
Rendimiento
Puntaje Rendimiento
Puntaje
Rendimiento (1-100)
Rendimiento / 100
Score Rendimiento
```

La misma tolerancia se aplica a:

- Confort;
- Economía;
- Espacio;
- Seguridad;
- Calificación General.

## Formatos de puntaje admitidos

```text
72
72/100
72 pts
72%
72,0
```

La web toma correctamente el primer valor numérico.

## Respaldo por modelo

Los perfiles específicos agregados en versiones anteriores se mantienen como último recurso, pero los nuevos vehículos ya no necesitan una modificación manual del `index.html` cuando sus puntajes están cargados en la hoja.

## Actualización

Después de cargar un vehículo nuevo:

1. completar los cinco puntajes en Google Sheets;
2. esperar que la publicación refleje los cambios;
3. recargar la página o presionar `Actualizar ahora` en Stock interno.

## Validación

- JavaScript validado con `node --check`.
- Probados encabezados con saltos de línea, sufijos y símbolos.
- Probados valores `72/100`, `70 pts` y números simples.
- Probada combinación entre JSONP y CSV.

## Versión

```text
lmpautos V1.20
```
