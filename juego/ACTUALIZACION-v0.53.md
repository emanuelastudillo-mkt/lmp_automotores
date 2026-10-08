# Tu vida sobre ruedas · v0.53

Interfaz de decisiones y contexto de vehículos, 8 de octubre de 2026.

- La situación, las opciones y el resultado ocupan el centro de la partida. La economía ampliada, la ficha del auto y los últimos sucesos quedan en paneles desplegables.
- Cada paso distingue entre una decisión pendiente y una decisión resuelta. Año y dinero disponible acompañan la situación.
- Ofertas, picadas y encuentros de colección muestran una foto pequeña, nombre, año y procedencia del vehículo involucrado. También se aplica a herencias, regalos y ofertas de amigos.
- El resultado conserva la identidad y foto del vehículo aunque se haya vendido o ya no esté en uso; esa información se guarda con la partida.
- El botón de continuación explica el siguiente paso: avanzar a un año, seguir en el mismo año, revisar un auto averiado, continuar sin vehículo o cerrar la trayectoria.
- El paso del tiempo se explica en un aviso dentro de la historia. La pantalla enfoca la decisión o el resultado, con soporte para teclado.
- Avisos de logros compactos: corregida la combinación de posiciones superior e inferior que podía estirarlos sobre gran parte de la pantalla.

Se mantienen las reglas económicas, el catálogo, los eventos y las decisiones ya existentes. La web principal no incorpora accesos al juego.

Verificación: 20 regresiones funcionales, 12 comprobaciones de identidad y continuación, y pruebas de navegador en 320, 390, 768, 1440 y 1920 px. Se comprueban autos de colección distintos al activo, unidades del mismo modelo con años diferentes, ventas, herencias, ofertas de amigos e inspecciones, autos averiados, recarga de resultados, mercado sin auto y cierre de trayectoria.

El ZIP es una actualización incremental de v0.52. Copiar sus archivos `juego/` sobre la instalación existente y conservar el resto.
