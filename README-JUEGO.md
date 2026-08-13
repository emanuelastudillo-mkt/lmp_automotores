# Tu vida sobre ruedas — v0.7

Base: v0.6.

## Cambios v0.7

- El jugador comienza todas las partidas con **USD 5.000**, independientemente del año inicial.
- La ganancia anual probable aumenta en **USD 200**:
  - antes: USD 100–500 por año;
  - ahora: **USD 300–700 por año**.
- Se mantienen las mecánicas, eventos y correcciones incorporadas hasta v0.6.

---

# Tu vida sobre ruedas — v0.6

Base: v0.5.

## Cambios v0.6

- Se agregó la alternativa de reparación **“Tengo un amigo que lo hace más barato”**.
  - Puede aparecer en eventos con reparaciones y también en fallas especiales compatibles.
  - El costo suele ser aproximadamente 45%–65% de la alternativa económica de referencia.
  - Tiene riesgo real: un arreglo barato puede salir razonablemente bien o generar nuevas fallas, pérdida de estado, performance, valor y aumento de gastos futuros.
  - Si ni siquiera alcanza el dinero para el arreglo del amigo, la opción queda bloqueada y permanecen las alternativas negativas correspondientes.
- Se agregó un botón permanente en el garaje para **vender el auto en cualquier momento**.
  - La oferta de venta fluctúa entre años.
  - Puede ser una oferta baja, razonable o un buen momento para vender.
  - La oferta queda fija durante ese año para evitar repetir clics hasta obtener artificialmente un precio mejor.
  - Al cambiar de año se genera una nueva situación de mercado.
  - Al vender, el jugador conserva el dinero recibido y vuelve al mercado a buscar otro vehículo.
- El evento especial **“te quieren comprar el auto”** ahora tiene un piso obligatorio del **50% del valor actual del vehículo**.
  - La oferta queda fijada al generarse el evento y no cambia por recargar o volver a renderizar la pantalla.
- Se mantiene la lógica de v0.5: alternativas negativas cuando no alcanza el dinero, picadas ilegales y animación del paso de los años.
- Se mantiene la solución de v0.4 para continuar ahorrando sin auto después del divorcio.
- La cabecera del juego marca ahora **v0.6**.
