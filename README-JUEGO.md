# Tu vida sobre ruedas — v0.5

Versión incremental/completa del prototipo privado de LMP Autos, construida sobre v0.4.

## Cambios v0.5

- Las reparaciones y mejoras pagas ya no pueden ejecutarse si el jugador no tiene dinero suficiente.
- Se evita el efecto anterior en el que una decisión cara podía aplicarse y simplemente dejar el saldo en USD 0.
- Cuando una decisión necesaria no puede pagarse aparecen alternativas negativas:
  - **Postergar / no reparar:** empeora estado, performance, valor y gastos futuros.
  - **Picada ilegal por dinero:** sólo aparece cuando el auto puede circular. Tiene 46% de probabilidad de ganar dinero y 54% de perder; una derrota puede causar daños severos, pérdida de valor y mayores gastos futuros.
- En eventos de choque grave o motor fundido no se ofrece la picada ilegal porque el vehículo no está en condiciones de competir.
- Se conserva la salida de chatarra cuando corresponde.
- Se mantiene el arreglo v0.4 del divorcio: si se pierde el auto y no alcanza para otro, se puede pasar un año sin vehículo y ahorrar.
- Se agrega una animación visual lenta del paso de los años. Cada año aparece en pantalla antes de continuar con el siguiente evento.
- La cabecera del juego marca ahora **v0.5**.

## Archivos incluidos

```text
juego/index.html
juego/data/autos.json
juego/data/eventos.json
README-JUEGO.md
```
