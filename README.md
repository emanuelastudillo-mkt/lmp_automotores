# LMP Autos Web v1.21 — Ordenar catálogo por puntajes

## Nuevo filtro

Dentro de `Ver catálogo completo` se agregó:

```text
Ordenar por puntaje
```

Permite ordenar por:

- Rendimiento.
- Confort.
- Economía.
- Espacio.
- Seguridad.
- Calificación General.

Cada criterio puede utilizarse de dos formas:

- mayor puntaje primero;
- menor puntaje primero.

## Comportamiento

El orden por puntaje es excluyente con:

- orden por precio;
- orden por año.

Al seleccionar uno, los otros se limpian automáticamente.

Los filtros de:

- marca;
- transmisión;
- combustible;
- favoritos;

continúan funcionando junto con el orden elegido.

## Vehículos sin puntajes

Los vehículos que no tengan un valor válido para el criterio seleccionado siempre aparecen al final, tanto en orden ascendente como descendente.

## Corrección adicional

Se corrigió la prioridad de ordenamiento para que la disponibilidad de imagen no anule el orden seleccionado por:

- precio;
- año;
- puntaje.

La imagen solo se utiliza como desempate.

## Validación

- JavaScript validado con `node --check`.
- Orden ascendente y descendente probado.
- Vehículos sin puntaje comprobados al final.

## Versión

```text
lmpautos V1.21
```
