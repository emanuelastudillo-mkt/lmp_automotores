# LMP Autos Web v1.26 — Catálogo mobile en tres columnas

## Cambio

En pantallas de hasta 620 px, las grillas de:

- vehículos destacados;
- catálogo completo;

muestran tres vehículos por fila.

## Adaptación de las tarjetas

Para mantener la lectura dentro de una pantalla de teléfono, las tarjetas móviles muestran:

- fotografía vertical;
- marca;
- modelo en un máximo de dos líneas;
- año;
- precio en dólares;
- precio en pesos;
- anticipo;
- botón Ver vehículo;
- botón Consultar.

Dentro de la tarjeta mobile se ocultan:

- kilometraje;
- transmisión;
- combustible;
- cuota resumida;
- beneficios secundarios;
- enlace individual de Instagram.

Toda esa información continúa disponible al abrir la ficha del vehículo.

## Pantallas pequeñas

En dispositivos de hasta 360 px también se mantienen las tres columnas, reduciendo ligeramente espacios y tipografías.

## Escritorio y tablet

No se modificaron las distribuciones de escritorio y tablet.

## Validación

- JavaScript validado con `node --check`.
- Confirmada la regla de tres columnas para destacados y catálogo.
- Estilos limitados exclusivamente a pantallas de hasta 620 px.

## Versión

```text
lmpautos V1.26
```
