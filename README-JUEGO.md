# Tu vida sobre ruedas — v0.41

Base: v0.40.

## Línea histórica argentina

Se agregan **7 nuevos eventos cronológicos argentinos**, además del Corralito de 2001 ya existente.

### Eventos

- 1975 — Rodrigazo.
- 1989 — Hiperinflación.
- 1991 — Convertibilidad.
- 2001 — Corralito (existente).
- 2002 — Fin de la Convertibilidad y devaluación.
- 2011 — Cepo cambiario y restricciones que afectaron la importación de autopartes.
- 2020 — Pandemia y fuerte reducción de movilidad.
- 2023 — Faltantes de nafta y gasoil.

### Funcionamiento

Los eventos históricos no compiten como eventos aleatorios normales.

Cada uno tiene:
- `historicalArgentina: true`
- `historicalYear: YYYY`

El motor:
1. detecta si el avance rápido va a saltar por encima de un año histórico;
2. detiene la trayectoria exactamente en ese año;
3. muestra el evento antes de seguir avanzando;
4. lo registra en `careerFlags`;
5. impide que vuelva a ocurrir en esa trayectoria.

Si una carrera empieza después de un hecho histórico, ese evento no aparece retroactivamente.

### Consecuencias

Los eventos están adaptados a la lógica automotriz del juego:
- combustible;
- precio y disponibilidad de repuestos;
- originalidad;
- mantenimiento;
- alternativas nacionales/importadas;
- inactividad del vehículo;
- gasto y conservación.

El resumen final ahora cuenta cuántos hitos de la historia argentina atravesó el jugador.

---

# Tu vida sobre ruedas — v0.40

Base: v0.39.

## Paleta semántica para iconos SVG

Los SVG dejan de ser monocromáticos y pasan a usar color según su significado.

### Colores principales

- Fuegos / popularidad: rojo.
- Estrellas / prestigio / premios: amarillo dorado.
- Dinero / ventas / crecimiento: verde.
- Caídas / advertencias / picadas: rojo.
- Mecánica / herramientas: ámbar.
- Performance: celeste.
- Vehículos: azul.
- Mercado: azul intenso.
- Colección: violeta.
- Combustible: naranja.
- Batería: verde.
- Electricidad: amarillo.
- Granizo: celeste.
- Herencias / llaves: dorado.
- Documentación / búsquedas: gris técnico.
- Personas / comunidad: azul violáceo.

### Implementación

`uiIcon()` ahora agrega automáticamente una clase semántica:

`icon-<nombre>`

Ejemplo:

`icon-flame`
`icon-star`
`icon-wallet`
`icon-warning`

Esto permite que el mismo icono mantenga el mismo color en:
- estadísticas;
- garage;
- eventos;
- botones;
- mercado;
- colección;
- resultados.

Los iconos siguen usando SVG vectorial y `currentColor`; sólo se añade una capa cromática consistente.

---

# Tu vida sobre ruedas — v0.39

Base: v0.38.

## Corrección mobile: garage vs. eventos

Se elimina el solapamiento entre:

- Colección;
- Vender;
- Mercado;

y el bloque de eventos.

La causa era un `max-height` fijo en el garage mobile mientras el contenido real podía superar esa altura.

Cambios:
- el garage calcula su altura real;
- el timeline empieza siempre debajo del garage;
- los tres botones tienen una fila propia y estable;
- se eliminan del layout mobile líneas secundarias que duplicaban información y ocupaban altura;
- el acceso colapsado a la colección queda contenido dentro del área del garage;
- el drawer abierto de colección sigue funcionando como overlay de pantalla completa.

## Animaciones de variación

Se agrega un sistema de animaciones para cambios de valores.

Se animan:
- dinero;
- año;
- fans;
- cantidad de autos;
- valor del vehículo;
- gasto mensual;
- Estado;
- Originalidad;
- Performance.

Comportamiento:
- aumentos: pulso ascendente y delta temporal;
- caídas: pulso descendente y delta temporal;
- el delta desaparece automáticamente;
- las barras de Estado / Originalidad / Performance animan desde el valor anterior al nuevo;
- funciona tanto en desktop como en mobile.

## Sistema de iconos SVG propio

Se elimina la dependencia visual de emojis para la interfaz principal y se incorpora un sprite SVG vectorial diseñado para el juego.

Criterio:
- trazo monolineal consistente;
- esquinas y terminales redondeados;
- `currentColor`, compatible con estados, botones y temas;
- iconos escalables sin pérdida de definición;
- misma familia gráfica en desktop y mobile.

Incluye iconos propios para:
- vehículo;
- colección;
- venta;
- mercado;
- dinero;
- calendario;
- fans;
- estrellas;
- performance;
- mecánica;
- reparación;
- picadas;
- advertencias;
- premios;
- cámara;
- ruta;
- batería;
- electricidad;
- combustible;
- piezas;
- herencias;
- granizo;
- tendencias positivas y negativas;
- y otras acciones de eventos.

Los eventos antiguos pueden seguir almacenando emojis internamente en `eventos.json`, pero la interfaz los traduce automáticamente a los nuevos SVG al renderizar. Esto mantiene compatibilidad con toda la base existente sin tener que duplicar la lógica de eventos.

---

# Tu vida sobre ruedas — v0.38

Base: v0.37.

## Mercado mobile 3 × 2

En pantallas móviles:

- el mercado muestra **3 vehículos por fila**;
- hasta **6 vehículos quedan distribuidos en 2 filas**;
- las seis opciones están diseñadas para entrar dentro de una sola pantalla;
- las tarjetas pasan a formato vertical compacto;
- cada tarjeta conserva:
  - imagen del vehículo;
  - marca;
  - modelo;
  - año/tipo;
  - Estado / Originalidad / Performance;
  - precio;
  - botón Comprar.
- Las imágenes siguen usando `object-fit: contain`, por lo que **no se recortan**.
- En pantallas de hasta 360 px se aplica una compactación adicional de tipografía, espacios e imagen.

La versión desktop no cambia.

---

# Tu vida sobre ruedas — v0.37

Base: v0.36.

## El último auto pasa a la colección final

- Al finalizar la partida, si todavía tenés un vehículo activo:
  - se guarda automáticamente en **Mi colección**;
  - conserva Estado, Originalidad, Performance, reparaciones, fans, inversiones y valor;
  - aparece dentro de **Tu colección final**;
  - suma al valor total de la colección.
- El valor teórico final ya no cuenta el auto activo por separado, evitando duplicarlo.
- El resumen muestra cuál fue tu **último auto** y cuánto valía al cerrar la trayectoria.
- El título final `Purista` sigue evaluando correctamente el último vehículo aunque ya haya sido movido a la colección.

---

# Tu vida sobre ruedas — v0.36

Base: v0.35.

## Mercado reducido y rotativo por turno

### Cantidad de vehículos

Tanto **0 km** como **Usados** muestran ahora solamente:

- 4, 5 o 6 vehículos por turno;
- si en un año existen menos de 4 modelos 0 km disponibles, se muestran todos los disponibles.

Se elimina la lista extensa de 0 km y el stock de 12–28 usados de versiones anteriores.

### Rotación

El mercado utiliza como identificador de turno:

`año actual + decisiones resueltas`

Por lo tanto:

- abrir y cerrar el mercado dentro del mismo turno **no cambia las ofertas**;
- cambiar entre pestañas 0 km / Usados tampoco cambia las ofertas;
- al llegar a un nuevo turno se generan nuevos vehículos;
- si el año cambia, también se renueva el mercado.

### Menos repetición

- El juego recuerda qué modelos aparecieron en el turno anterior.
- Si hay suficientes modelos disponibles, la siguiente rotación evita completamente repetirlos.
- En años con muy pocos 0 km puede ser necesario repetir algún modelo.
- Los usados continúan generándose como unidades individuales con:
  - año propio;
  - Estado;
  - Originalidad;
  - Performance;
  - precio;
  - perfil de conservación.

### Compra

Una unidad comprada desaparece de la lista del turno actual, tanto en 0 km como en usados.

---

# Tu vida sobre ruedas — v0.35

Base: v0.34.

## Ajuste de frecuencia de divorcio

- Se reduce la aparición del evento **Divorcio** en un **60%**.
- Cuando el divorcio cumple todas sus condiciones normales de elegibilidad, ahora sólo entra al pool de selección en el **40%** de esas ocasiones.
- No se modifican:
  - sus consecuencias;
  - sus decisiones;
  - el máximo de divorcios;
  - la antigüedad mínima de trayectoria requerida;
  - la regla especial de herencia del suegro.

El objetivo es que siga siendo un evento importante, pero bastante menos repetitivo entre partidas.

---

# Tu vida sobre ruedas — v0.34

Base: v0.33.

## Corrección crítica de compra/venta

Se corrigió una regresión introducida en v0.33:

- `vehicleActionsLocked()` estaba bloqueando las acciones cuando existía **cualquier evento pendiente**.
- Como cada turno normal genera un `pendingEvent`, el garage quedaba casi permanentemente con:
  - `Acción disponible después de continuar`;
  - compra/mercado bloqueados;
  - venta bloqueada;
  - intercambio con colección bloqueado.

### Nuevo comportamiento

Las acciones del garage sólo quedan bloqueadas cuando realmente corresponde:

- durante un **divorcio sin resolver**;
- mientras existe una **pantalla de resultado pendiente** que todavía requiere pulsar Continuar.

Durante eventos normales y exclusivos ahora se puede volver a:

- vender el vehículo actual;
- abrir el mercado;
- comprar otro vehículo;
- guardar el actual en colección;
- usar/intercambiar un auto de la colección;
- vender autos de la colección.

---

# Tu vida sobre ruedas — v0.33

Base: v0.32.

## 260 eventos exclusivos de vehículo

Se agregan **2 eventos exclusivos para cada uno de los 130 vehículos** de la base.

Total del juego:
- 130 vehículos;
- 327 eventos;
- 260 eventos exclusivos de modelo/submodelo;
- 67 eventos generales, históricos, familiares, de colección o especiales.

### Dos tipos de evento por vehículo

Cada auto recibe:

1. **Evento técnico/mecánico**
   - se construye a partir de la mecánica, tecnología y particularidades del vehículo;
   - puede involucrar turbo, carburación, inyección, transmisión 4x4, techo retráctil, electrónica, batería, motor trasero, diésel, mantenimiento de superdeportivos, etc.;
   - utiliza además el `eventoCanonico` específico de cada auto para que el texto y el contexto no sean intercambiables entre modelos.

2. **Evento de identidad/uso**
   - refleja cómo se vive ese vehículo;
   - puede ser encuentro de coleccionistas, pieza original difícil de conseguir, jornada deportiva, salida 4x4, trabajo pesado, evento de lujo, club del modelo, viaje largo, exposición de una rareza, etc.

### Exclusividad real

Los eventos incorporan `vehicleId`.

Esto significa que:
- el Falcon Sprint no usa eventos del Falcon base;
- el Gol GTI G1 no usa los del Gol G1 común;
- el Bora 1.8T no usa los del Bora estándar;
- cada versión y submodelo mantiene sus propios eventos.

### Control de repetición

- Cada evento exclusivo puede ocurrir **una sola vez por trayectoria**.
- El juego registra los eventos ya vistos en `careerFlags`.
- Cuando todavía quedan eventos exclusivos sin ver para el auto actual, existe una probabilidad controlada de priorizarlos.
- Una vez vistos, vuelven a dominar los eventos generales.
- Los eventos exclusivos no se agregan indiscriminadamente al pool normal, evitando que tapen divorcios, granizo, herencias, choques, colección y otros sistemas.

### Resultado final

El resumen final muestra cuántos **eventos exclusivos** de vehículo viviste durante la trayectoria.
La historia final también menciona si conociste en profundidad varios modelos diferentes.

---

# Tu vida sobre ruedas — v0.32

Base: v0.31.

## Nuevos sistemas y eventos

### Granizo

- Se agrega un evento especial de tormenta de granizo.
- El daño depende fuertemente de la antigüedad de la unidad:
  - autos de 30 años o más: impacto generalmente mínimo;
  - autos de 16 a 29 años: daño moderado;
  - autos de 8 a 15 años: daño fuerte;
  - autos de hasta 7 años: la chapa moderna y liviana puede sufrir un daño destructivo.
- El granizo afecta Estado, Originalidad y valor.
- El jugador puede:
  - reparar correctamente;
  - recurrir al mecánico amigo;
  - conservar el auto con las marcas.
- Las granizadas tienen una separación mínima de varios años para evitar repetición excesiva.

### Experiencia en picadas

- La habilidad en picadas ahora pertenece al jugador y se conserva al cambiar de auto.
- Cada picada disputada aumenta la experiencia.
- La probabilidad de ganar combina:
  - experiencia acumulada;
  - Performance;
  - Estado del vehículo.
- Un conductor muy experimentado con un auto de gran Performance puede acercarse a ser prácticamente invencible.
- La probabilidad nunca llega a 100%: siempre existe un riesgo mínimo.
- Los premios aumentan con la experiencia.
- La progresión se aplica a:
  - desafíos de semáforo;
  - picadas para conseguir dinero;
  - picadas con autos de la colección.
- Los desafíos de semáforo ahora también pueden generar dinero y seguidores.

### Mecánico amigo

- Se agrega experiencia persistente para el mecánico amigo.
- Cada vez que lo usás:
  - gana experiencia;
  - reduce progresivamente su probabilidad de fallar;
  - mejora el resultado de reparaciones exitosas;
  - puede cobrar proporcionalmente menos.
- La mejora usa una curva exponencial.
- Nunca se elimina completamente la posibilidad de que una reparación salga mal.
- Su nivel aparece en la ficha del auto y en el resumen final.

### Herencias familiares

Se agregan dos eventos especiales:

- Herencia de tu padre:
  - puede aparecer después de varios años de trayectoria;
  - deja un vehículo especial al saber que te gustan los autos.
- Herencia de tu suegro:
  - solo puede aparecer si nunca te divorciaste;
  - también deja un vehículo especial.

Los autos heredados priorizan modelos con alto potencial clásico y llegan con:
- año de unidad;
- Estado;
- Originalidad;
- Performance;
- valor estimado.

Podés:
- guardarlos directamente en la colección;
- vender la herencia y recibir efectivo.

### Final variable 2027–2031

- Cada nueva trayectoria recibe un año final aleatorio entre 2027 y 2031.
- Las partidas antiguas se migran automáticamente a este sistema.
- Los modelos que seguían vigentes en 2026 continúan disponibles como 0 km durante el epílogo extendido para no dejar vacío ese mercado.
- El final ahora utiliza el año real asignado a esa partida.

### Final más personalizado

El cierre ahora considera además:
- experiencia en picadas;
- uso y evolución del mecánico amigo;
- granizadas sufridas;
- herencias recibidas;
- exhibiciones;
- colección;
- dinero;
- cantidad de autos;
- originalidad;
- divorcios.

Se agregan títulos finales como:
- Leyenda de la noche;
- Socio honorario del taller;
- Figura de las exhibiciones;
- Guardián del legado;
- Curador de un garage serio;
- Magnate del garage.

---

# Tu vida sobre ruedas — v0.31

Base: v0.30.

## Garage y colección intercambiables

- Comprar otro vehículo **ya no vende automáticamente** el auto actual.
- Si ya tenés un auto y comprás otro:
  - el actual pasa directamente a **Mi colección**;
  - no recibís dinero por él;
  - el nuevo vehículo pasa a ser el auto de uso.
- Por este cambio, el valor del auto actual ya no se suma al poder de compra del mercado:
  - para comprar otro auto necesitás tener el efectivo disponible;
  - si querés usar el valor del auto actual, primero debés venderlo explícitamente.
- Cada auto de la colección ahora tiene:
  - **Usar / intercambiar**;
  - **Vender**.
- Al elegir un auto de la colección:
  - el auto actual se guarda automáticamente;
  - el seleccionado vuelve a ser el auto de uso;
  - no se compra ni se vende nada durante el intercambio.
- Si no tenés auto actual, podés elegir directamente **Usar este auto**.
- Al volver desde la colección se conservan:
  - año de la unidad;
  - Estado;
  - Originalidad;
  - Performance;
  - reparaciones;
  - inversiones;
  - daños de valor;
  - fans;
  - progreso de popularidad;
  - valor ganado mientras estuvo guardado.
- Las partidas anteriores migran automáticamente los datos que faltaban en unidades antiguas de colección.

---

# Tu vida sobre ruedas — v0.30

Base: v0.29.

## 10 vehículos y submodelos nuevos

Se amplía la base de 120 a 130 vehículos.

Numeración de imágenes:

121. Audi A4 B5
122. Audi TT Mk1
123. Chery QQ
124. Chery Tiggo
125. BAIC X25
126. Rolls-Royce Phantom VII
127. Alfa Romeo 145 Quadrifoglio
128. Subaru Impreza WRX STI
129. Mitsubishi Lancer Evolution IX
130. Chrysler PT Cruiser

Cada entrada incorpora:
- año inicial y final;
- precio base de gameplay;
- segmento;
- confiabilidad;
- economía;
- potencial clásico;
- gasto mensual;
- tags;
- evento canónico;
- `imageBase` compatible con la nueva numeración.

Las variantes específicas se mantienen como vehículos independientes de sus modelos base.

---

# Tu vida sobre ruedas — v0.29

Base: v0.28.

## 20 vehículos y submodelos nuevos

Se amplía la base de 100 a 120 vehículos.

Numeración de imágenes:

101. Volkswagen Amarok
102. Toyota Hilux
103. Jeep Wrangler
104. Mercedes-Benz 300 SL
105. Mercedes-Benz 190 E
106. Ferrari F40
107. Lamborghini Diablo
108. Porsche 911 Carrera 3.2
109. Tesla Model S
110. Ford Mustang GT
111. Renault 12
112. Ford Falcon Sprint
113. Chevrolet Chevy Serie 2
114. IKA Torino 380W
115. Volkswagen Gol GTI G1
116. Fiat Uno Turbo i.e.
117. Renault Clio Williams
118. Peugeot 206 CC
119. Volkswagen Bora 1.8T
120. Ford Focus II 2.0 Ghia

Cada entrada incorpora:
- año inicial y final;
- precio base de gameplay;
- segmento;
- confiabilidad;
- economía;
- potencial clásico;
- gasto mensual;
- tags;
- evento canónico;
- `imageBase` compatible con la nueva numeración.

Las variantes específicas se mantienen como vehículos independientes de sus modelos base.

---

# Tu vida sobre ruedas — v0.28

Base: v0.27.

## Popularidad que genera ingresos

- Los fans ahora pueden generar ingresos reales mientras el auto gana notoriedad.
- Desde el primer fueguito aparecen ingresos pequeños por:
  - fotos;
  - encuentros;
  - apariciones;
  - fanáticos que pagan por acercarse al auto.
- El ingreso aumenta con la cantidad de fueguitos y el nivel de estrellas.
- En la ficha del vehículo aparece una línea similar a `Gasto mensual`:
  - **Fans piden fotos y encuentros · +USD XXX/mes**
- Los ingresos recurrentes se cobran durante cada año que pasa y se suman a los ingresos totales.

### 5 estrellas + 3 fueguitos

- Al alcanzar simultáneamente **5⭐ + 3🔥**, el auto entra en un nivel especial de popularidad.
- Mantiene un ingreso recurrente superior por fans.
- Además puede recibir invitaciones a exhibiciones.
- Cada año existe una posibilidad de obtener un premio de:
  - USD 2.000;
  - USD 3.000;
  - USD 10.000.
- Los premios se registran en el historial.
- La pantalla final muestra:
  - cantidad de premios de exhibición;
  - dinero total ganado en exhibiciones.
- La historia final también menciona los premios obtenidos.

---

# Tu vida sobre ruedas — v0.27

Base: v0.26.

## Nuevo sistema de mercado

### Mercado 0 km

- Nueva pestaña **0 km**.
- Solo aparecen modelos que, según la base `desde/hasta`, estaban efectivamente en producción durante el año de la partida.
- Las unidades entran con:
  - Estado 100;
  - Originalidad 100;
  - Performance de fábrica 50;
  - año de unidad igual al año actual.
- El precio 0 km parte del valor base del modelo con una pequeña reducción cuando el modelo lleva varios años en producción.

### Mercado de usados

- Nueva pestaña **Usados**.
- Incluye autos de distintas épocas y segmentos, sin el límite anterior de 18 años.
- Cada publicación representa una unidad individual con:
  - año propio;
  - Estado propio;
  - Originalidad propia;
  - Performance propia;
  - precio propio.
- Se generan cuatro perfiles de unidades:
  - Para levantar;
  - Uso normal;
  - Muy cuidado;
  - Modificado.
- El precio del usado considera antigüedad, Estado, Originalidad, Performance y variación de mercado.
- Al comprarlo, el vehículo conserva exactamente los valores publicados.
- La antigüedad de eventos, desgaste, choques y motor fundido ahora usa el **año real de la unidad comprada**, no solamente el año de lanzamiento del modelo.
- El stock de usados queda fijo durante cada año de la partida; cerrar y volver a abrir el mercado no vuelve a generar ofertas distintas.
- Al avanzar de año se genera un nuevo stock.
- Una unidad usada comprada se elimina de ese stock.

### Interfaz

- Ambas secciones se manejan con pestañas dentro del mismo mercado.
- Cada usado muestra Estado, Originalidad y Performance antes de comprar.
- Se mantiene el diseño mobile full-screen de v0.26.

---

# Tu vida sobre ruedas — v0.26

Base: v0.25.

## Rediseño mobile-first

- Adaptación específica para teléfonos usando `100dvh` y safe areas.
- La pantalla principal de juego queda contenida dentro del viewport móvil.
- Estadísticas reducidas a una banda compacta.
- Garage convertido en una ficha horizontal resumida:
  - foto;
  - modelo;
  - estrellas/fans;
  - Estado, Originalidad y Performance;
  - accesos rápidos a Colección, Vender y Mercado.
- Detalles secundarios del garage se ocultan en móvil para priorizar el panorama de juego.
- La colección se convirtió en un panel desplegable; al abrirse en móvil funciona como overlay y no empuja el evento fuera de pantalla.
- El evento usa todo el espacio vertical restante.
- Las decisiones quedan **sticky en la parte inferior del evento**, por lo que permanecen visibles mientras se lee el contenido.
- Las decisiones se compactaron en una grilla de dos columnas para reducir scroll.
- El historial de eventos se oculta durante el gameplay móvil para recuperar espacio.
- Mercado rediseñado como navegador full-screen:
  - vehículos en filas compactas;
  - imagen, datos, precio y botón visibles en una sola fila;
  - lista vertical desplazable.
- Selección inicial de autos convertida en carrusel horizontal.
- Reset trasladado a la zona superior en móvil para no interferir con las decisiones.
- Pantalla final y formularios adaptados a pantallas pequeñas.
- Se agregó soporte explícito de `viewport-fit=cover`.

---

# Tu vida sobre ruedas — v0.25

Base: v0.24.

## Auditoría general de eventos y estados

Se revisaron los 64 eventos, sus decisiones, probabilidades, flags, eventos especiales, colección, mercado, guardado/carga y transiciones de año.

### Correcciones principales

- Restaurado el riesgo de choque por **Estado** y **Performance** bajos.
- Los choques mecánicos ya no aparecen como un evento dramático completamente aleatorio.
- Restaurada y completada la **deuda real**:
  - gastos inevitables y consecuencias de riesgo pueden dejar saldo negativo;
  - el saldo negativo se muestra en rojo;
  - decisiones sin costo siguen disponibles aunque exista deuda;
  - una reparación impaga de una picada ahora genera deuda real.
- Corregido `moneyDisplay`, que estaba referenciado al final de la partida pero no existía.
- El **Corralito 2001** ya no puede ser salteado por un salto de años del modo rápido.
- El Corralito usa `careerFlags`, separado de los flags del auto.
- Las picadas del evento del semáforo ahora suman al contador de picadas ilegales.
- El evento del seguro después de un choque suma al contador de choques.
- Aceptar una oferta por un auto de colección cuenta como decisión.
- Las ventas de colección ahora vinculan el historial mediante un `collectionUid` exacto.
- Los eventos de colección pueden ocurrir aunque no tengas un auto de uso, especialmente al pasar un año sin vehículo.
- Se recuperan partidas con `pendingEvent` inexistente o con un auto eliminado de la base.
- `renderPendingEvent()` ahora tolera eventos guardados inválidos sin romper la partida.
- Las acciones del garage quedan bloqueadas mientras hay una pantalla de resultado pendiente, evitando arrastrar un resultado viejo a un auto nuevo.
- El botón Reset ahora realiza un reinicio completo con recarga.
- Las reparaciones con `minVehicleShare` respetan correctamente el costo mínimo relativo al valor del auto.
- Se quitaron de la interfaz algunos datos internos de balance, como multiplicadores de reparación y umbrales técnicos de ofertas.

### Validaciones de datos

- 64 eventos.
- 100 vehículos.
- Sin IDs de eventos duplicados.
- Sin IDs de vehículos duplicados.
- Todas las ramas de probabilidades de eventos suman 100%.
- Todos los tipos `special` presentes en JSON tienen implementación en el motor.
- Todos los flags requeridos por eventos tienen una vía válida para generarse.

---

# Tu vida sobre ruedas — v0.24

Base: v0.23.

## Correcciones v0.24

- Corregido el error de inicio `mechanicalReason is not defined`.
- El motivo mecánico de un choque ahora se define únicamente dentro del evento correspondiente.
- Corregido el flujo de divorcio:
  - entregar el 50% del dinero cierra correctamente el evento y programa el próximo avance;
  - entregar el vehículo también genera una pantalla de resultado y programa el próximo avance;
  - después de continuar, si no hay auto se abre el mercado normalmente.
- Se agregó recuperación automática para partidas antiguas que hayan quedado trabadas en un divorcio sin vehículo.
- Se agregó un botón **Reset** fijo, visible durante toda la partida.
- Si ocurre un error al iniciar, se conserva una pantalla de recuperación con botón **Reiniciar partida**, en lugar de reemplazar toda la interfaz.

---

# Tu vida sobre ruedas — v0.23

Base: v0.22.

## Cambios v0.23

- Al vender un vehículo de la colección, la unidad se elimina inmediatamente de `state.collection` y deja de aparecer en cualquier vista de colección activa o en la colección final.
- El registro histórico de haber poseído ese vehículo se conserva.
- Se agregó una imagen específica `imagenes/sin-vehiculo.svg`.
- Al vender, entregar o mandar a chatarra el auto actual, el garage se actualiza inmediatamente y muestra **Sin vehículo** antes de abrir el mercado.
- La pantalla sin auto también conserva visible la colección que todavía poseés.
- Se corrigió el flujo sin vehículo para evitar que debajo del mercado quedara renderizado el auto anterior o una colección desactualizada.

---

# Tu vida sobre ruedas — v0.22

Base: v0.21.

## Cambios v0.22

- El dinero ahora puede quedar por debajo de cero cuando los gastos anuales o el mantenimiento de la colección superan los fondos disponibles.
- Cuando existe deuda, el saldo se muestra como un número **negativo y rojo**.
- Ejemplo visual: `-USD 1.250`.
- La deuda reduce el poder de compra y no permite comprar vehículos mientras el saldo disponible sea insuficiente.
- Los ingresos futuros primero compensan automáticamente el saldo negativo.
- Se mantiene la lógica de impedir decisiones pagas que el jugador no puede afrontar; la deuda surge principalmente de gastos inevitables/recurrentes.

---

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
