# Tu vida sobre ruedas · v0.54

Vehículo actual siempre visible durante los eventos, 8 de octubre de 2026.

- Ficha compacta fija al desplazarse por la partida, con foto, marca, modelo y año del vehículo en uso.
- Estado, originalidad y performance visibles con su valor sobre 100 y una barra para cada indicador.
- Estrellas del vehículo y fuegos de popularidad junto a la cantidad de fans de ese auto. Si todavía no tiene fans, se muestra el fuego vacío y “0 fans”.
- Los eventos de colección, ofertas y herencias conservan su propia foto y nombre, separados de la ficha del vehículo en uso.
- La ficha se actualiza después de las decisiones, daños ya ocurridos, cambios de auto, avance de año y recarga de partida. Indica “Averiado” o “Sin vehículo en uso” cuando corresponde.
- Adaptada a celular y escritorio, con posición ajustada al encabezado y al menú para mantener visibles la situación y las opciones.

Verificado en navegador a 320, 390, 768, 1440 y 1920 px: indicadores y escalas de fans, desplazamiento, cambios de tamaño, colección, daño por granizo, cambio de vehículo, avería, ausencia de auto, dos unidades del mismo modelo, nombres largos y recarga. También pasan las 20 regresiones funcionales existentes. La ficha no modifica el estado de la partida al renderizarse.

Actualización incremental de v0.53: copiar los archivos `juego/` del ZIP sobre la instalación existente y conservar el resto. Se mantienen catálogo, reglas, partidas guardadas, encabezado y pie institucional. La web principal no incorpora accesos al juego.
