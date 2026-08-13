# Tu vida sobre ruedas — v0.11

Base: v0.10.

## Cambios v0.11

- Biblioteca ampliada de **22 a 55 eventos**.
- Se agregan eventos de decisiones personales, mecánicas, mercado, viajes, familia, robos, clima, exposiciones, fama y coleccionismo.
- Algunos eventos ahora requieren determinado nivel de **⭐ estatus**, **🔥 popularidad** o antigüedad del vehículo.
- Se incorporan **cadenas de eventos persistentes por vehículo** mediante decisiones previas.
- Ejemplos de cadenas:
  - auto donante → pieza rara → restauración especial;
  - concurso de elegancia → interés de coleccionistas;
  - modelo que se vuelve clásico → auge de demanda;
  - foto viral / club de propietarios → mayor exposición.
- Se agregan resultados aleatorios internos a varias decisiones, siempre mostrados antes de avanzar el tiempo.
- Los eventos pueden modificar dinero, estado, originalidad, performance, valor, gastos, fans y futuras oportunidades.
- Las cadenas se reinician al cambiar de vehículo para evitar que decisiones de un auto afecten incorrectamente al siguiente.

---

# Tu vida sobre ruedas — v0.10

Base: v0.9.

## Cambios v0.10

- El estatus del vehículo ahora se representa visualmente con **1 a 5 estrellas (⭐)**.
- La popularidad/fans de cada auto se representa con **1 a 3 fueguitos (🔥)**.
- Cada vehículo acumula sus propios fans mientras está en posesión del jugador.
- El historial guarda el **máximo de estrellas y fueguitos alcanzado por cada auto**.
- Al finalizar la partida, cada vehículo del garaje histórico muestra sus estrellas y fueguitos máximos.
- Los fans globales siguen acumulándose entre distintos vehículos, pero se muestran visualmente mediante fueguitos.

---

# Tu vida sobre ruedas — v0.9

Base: v0.8.

## Cambios v0.9

- Se incorpora un **Estatus del auto**, calculado dinámicamente según originalidad, estado, valor relativo al mercado y antigüedad.
- Escalones de reconocimiento: **Uno más del montón**, **Con potencial**, **Muy bien parado**, **Diamante en bruto**, **La envidia del barrio** y **El tesoro de los coleccionistas**.
- El estatus se muestra permanentemente en el garaje.
- Los dos niveles superiores pueden generar **fans** al alcanzarse por primera vez con cada auto.
- Los fans quedan acumulados durante toda la partida aunque se cambie de vehículo.
- El total de fans aparece en las estadísticas y en el resultado final.
- Se mantiene el sistema de resultados previo al avance temporal de v0.8.

---

# Tu vida sobre ruedas — v0.8

Base: v0.7.

## Cambios v0.8

- Los eventos resueltos ahora muestran una pantalla intermedia de **Resultado** antes de que avance el tiempo.
- El botón **Continuar** es el que habilita el salto hacia el próximo evento/año.
- La picada ilegal ahora informa resultados concretos y variables: premio, bonus ocasional por apuesta de un primo, o averías específicas con costo de reparación.
- Si una avería de la picada supera el dinero disponible, se informa cuánto se pudo pagar y cuánto daño/costo quedó pendiente.
- Se corrigió el ahorro anual sin auto para usar también el rango vigente de **USD 300–700**.

---

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
