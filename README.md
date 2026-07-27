# LMP Autos Web v1.22 — Puntajes de mayor a menor

## Ajuste realizado

Dentro de `Ver catálogo completo`, el filtro `Ordenar por puntaje` conserva únicamente:

- Rendimiento.
- Confort.
- Economía.
- Espacio.
- Seguridad.
- Calificación general.

Todos los criterios ordenan automáticamente de mayor a menor.

Se eliminaron todas las opciones de menor a mayor para simplificar el selector.

## Comportamiento

- El vehículo con mayor puntaje aparece primero.
- Los vehículos sin puntaje permanecen al final.
- Continúa siendo excluyente con el orden por precio y por año.
- Marca, transmisión, combustible y favoritos siguen funcionando normalmente.

## Validación

- JavaScript validado con `node --check`.
- Confirmada la eliminación de todas las opciones ascendentes.

## Versión

```text
lmpautos V1.22
```
