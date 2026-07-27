# LMP Autos Web v1.23 — Ocultar vehículos de baja

## Cambio

Los vehículos cuyo campo:

```text
Estado actual del auto
```

tenga el valor:

```text
de baja
```

quedan ocultos del sitio público.

La comparación no distingue mayúsculas, minúsculas ni acentos. Por ejemplo, se reconocen igual:

```text
de baja
DE BAJA
De Baja
```

## Lugares donde se ocultan

- Catálogo completo.
- Resultados filtrados.
- Favoritos públicos.
- Popup de destacados.
- Vehículos similares.
- Comparador público.
- Acceso mediante enlace directo a la ficha.

También se evita que una marca, transmisión o combustible aparezca en los filtros cuando solo pertenece a vehículos de baja.

## Stock interno

Las unidades con estado `de baja` continúan visibles dentro de Stock interno para consulta administrativa.

No se modifica ni elimina información de Google Sheets.

## Validación

- JavaScript validado con `node --check`.
- Probados estados `DE BAJA`, `de baja`, `VENDIDO`, `DISPONIBLE` y `RESERVADO`.

## Versión

```text
lmpautos V1.23
```
