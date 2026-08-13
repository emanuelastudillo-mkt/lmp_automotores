# Tu vida sobre ruedas — v0.21

Base: v0.20.

## Cambios v0.21

- Los choques graves ahora pueden originarse por el deterioro mecánico del vehículo.
- **Estado bajo** aumenta el riesgo por falta de mantenimiento, desgaste de componentes, frenos, suspensión, cubiertas y fallas generales.
- **Performance baja** aumenta el riesgo cuando una mecánica castigada es exigida por encima de lo que puede soportar.
- El riesgo crece especialmente con Estado menor a 30 y/o Performance muy baja.
- Los vehículos antiguos suman un pequeño riesgo adicional solamente cuando ya presentan deterioro.
- El evento de choque deja de aparecer como un evento dramático completamente aleatorio: su aparición está ligada a estas condiciones mecánicas.
- Cuando el choque es provocado por deterioro, el juego explica la causa concreta en el evento y en el historial.

---

# Tu vida sobre ruedas — v0.20

Base: v0.19.

## Cambios v0.20

- Selector inicial simplificado a únicamente:
  - **Rápida**
  - **Lenta**
- Se eliminaron de la pantalla inicial las explicaciones técnicas de cada ritmo.
- Nueva lógica de motor fundido:
  - un auto debe tener al menos **5 años de antigüedad** para poder sufrir esta falla;
  - el riesgo depende principalmente de su **Estado**;
  - por debajo de 30 el riesgo aumenta de forma marcada;
  - entre 30 y 60 todavía existe una posibilidad menor;
  - con buen estado el riesgo es muy bajo;
  - autos de 20 y 35+ años reciben un pequeño incremento adicional de riesgo.
- El evento `motor-fundido` ya no entra como un evento dramático genérico: ahora aparece mediante esta lógica de riesgo ligada al vehículo.

---

# Tu vida sobre ruedas — v0.19

Base: v0.18.

## Cambios v0.19

- La colección ahora participa activamente en la trayectoria.
- Los autos coleccionados pueden sumar seguidores con el paso de los años.
- Nuevos eventos exclusivos de colección:
  - encuentros/exhibiciones que pueden sumar fans;
  - provocaciones para sacar un auto guardado a una picada ilegal;
  - ofertas espontáneas de compradores por un vehículo específico.
- Las picadas con autos de colección cuentan dentro de las estadísticas de picadas ilegales y pueden provocar pérdida de valor/estado.
- Cada auto dentro de la colección puede venderse manualmente.
- Las ofertas externas pueden aceptarse o rechazarse.
- Cada unidad coleccionada recibe un identificador propio para soportar varias unidades del mismo modelo.
- La colección sigue apreciándose y generando gastos mínimos como en v0.18.

---

# Tu vida sobre ruedas — v0.18

Base: v0.17.

## Cambios v0.18

- Se elimina de la interfaz información interna de balance/progresión:
  - ya no aparece `Divorcio 1/3`;
  - ya no aparece `Estatus 2/5`;
  - los resultados de divorcio tampoco muestran el contador máximo.
- El estatus sigue representándose visualmente mediante ⭐ y la popularidad mediante 🔥.
- Se corrigió la selección inicial de vehículos:
  - se eliminó la antigua silueta decorativa que aparecía detrás de la imagen real;
  - ahora se muestra únicamente la imagen cuadrada del vehículo;
  - si la imagen no existe, recién entonces aparece el ícono de respaldo.

---

# Tu vida sobre ruedas — v0.17

Base: v0.16.

## Cambios v0.17

- Nueva elección de ritmo al iniciar la trayectoria:
  - **Rápido**: mantiene exactamente el sistema actual de saltos entre eventos.
  - **Lento**: el calendario avanza **1 año por vez**.
- El ritmo elegido queda guardado en la partida.
- Las partidas anteriores se interpretan automáticamente como modo Rápido.
- El ritmo elegido se muestra también al comenzar y al finalizar la trayectoria.

---

# Tu vida sobre ruedas — v0.16

Base: v0.15.

## Cambios v0.16

- Todas las imágenes de vehículos se muestran siempre en formato **cuadrado 1:1**.
- Se usa `object-fit: contain`: el vehículo/imagen completa queda visible y **nunca se recorta**.
- El tamaño del contenedor puede ampliarse o reducirse según la sección, pero conserva siempre la proporción cuadrada.
- Aplicado a selección inicial, vehículo actual, mercado y colección final.
- Se mantienen JPG, JPEG, PNG y WEBP en `/juego/imagenes/`.

---

# Tu vida sobre ruedas — v0.15

Base: v0.14.

## Cambios v0.15

- Nueva opción **Guardar en mi colección**.
- Un vehículo coleccionado:
  - deja de ser el auto de uso diario;
  - no se vende ni genera dinero inmediato;
  - tiene gastos mínimos de guarda/mantenimiento;
  - prácticamente no se deteriora;
  - aumenta su valor año tras año;
  - la apreciación depende de antigüedad y potencial de clásico.
- La colección sigue generando gastos aunque el jugador esté un año sin auto de uso.
- Al finalizar se muestran:
  - cantidad de vehículos coleccionados;
  - valor total de la colección;
  - galería de la colección con valor individual, ⭐ y 🔥.
- El valor teórico final ahora incluye dinero + auto actual + colección.
- Soporte para imágenes reales en `/juego/imagenes/`.
- Convención de archivos: `1-Fiat 600.jpg`, `22-Renault Fuego.png`, etc.
- Se intentan automáticamente extensiones JPG, JPEG, PNG y WEBP.
- Se agregó `imageBase` a cada vehículo en `autos.json` para relacionar de forma estable cada auto con su imagen.

---

# Tu vida sobre ruedas — v0.14

Base: v0.13.

## Cambios v0.14

- Corregido el exploit del divorcio:
  - mientras el evento está pendiente, **Vender ahora** queda bloqueado;
  - también queda bloqueado el acceso voluntario al mercado/cambio de auto;
  - la función de venta tiene una protección adicional para impedir saltarse el evento por código.
- El divorcio conserva sus dos decisiones reales:
  - entregar el 50% del dinero y conservar el auto;
  - entregar el auto y conservar el dinero.
- El evento de divorcio ahora usa títulos y textos irónicos aleatorios, entre ellos:
  - “Tu mamá tenía razón”;
  - “Tus amigos te avisaron”;
  - “Todos se dieron cuenta antes que vos”;
  - “Ese auto atrajo muchas malas influencias para tu matrimonio”.
- La variante elegida queda fija mientras el evento esté abierto.

---

# Tu vida sobre ruedas — v0.13

Base: v0.12.

## Cambios v0.13

- El cierre de trayectoria ahora muestra:
  - cantidad de divorcios;
  - cantidad de choques;
  - cantidad de picadas ilegales.
- Se incorpora **“Tu historia”**, una breve narración generada según lo ocurrido realmente durante la partida.
- La descripción considera cantidad de autos, mejor estatus ⭐, popularidad 🔥, picadas, choques, divorcios y situación económica final.
- Se mantienen las estrellas y fueguitos máximos de cada vehículo en el garaje histórico.

---

# Tu vida sobre ruedas — v0.12

Base: v0.11.

## Cambios v0.12

- Máximo de **3 divorcios por carrera**.
- Se agrega el evento histórico **Corralito 2001**:
  - sólo puede aparecer en 2001;
  - se dispara una sola vez;
  - provoca una pérdida aleatoria de entre **50% y 80% del dinero disponible**.
- Se agregan eventos premium caros de mejora fuerte:
  - restauración integral;
  - preparación de motor profesional;
  - reconstrucción de chasis y suspensión;
  - detailing de concurso;
  - proyecto extremo de performance.
- Estas mejoras pueden subir mucho Estado, Originalidad o Performance, pero exigen inversiones equivalentes a una porción importante del valor del vehículo.
- Se mantienen ⭐, 🔥, cadenas de eventos y pantalla de resultado previa al avance temporal.

---

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
