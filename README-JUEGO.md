# LMP · Tu vida sobre ruedas — v0.47

## Instalación incremental

Este paquete actualiza una instalación v0.46 con sus 230 vehículos y fotos ya agregados. Descomprimí el ZIP y copiá `juego` sobre la carpeta `juego` de tu web, reemplazando los archivos incluidos. Conservá los demás archivos. `README-JUEGO.md` es la guía y puede copiarse en la raíz del proyecto.

Abrí el juego por HTTP/HTTPS. Para conservar partidas, logros y museos usá el mismo sitio/origen y navegador. Abrir una carpeta por file:// no equivale al sitio donde jugabas. Antes de instalar, exportá tu partida desde la versión anterior. La actualización no requiere reiniciar ni borrar datos.

## Cambios

- Interfaz legible y adaptable, navegación Partida / Garaje / Hitos / Historia / Legado.
- Mercado con fotos completas y opciones de compra legibles; sus ofertas mantienen la rotación del juego.
- Álbum visual con año de modelo, cada unidad por separado, fotos, fechas reales de adquisición y venta, búsqueda y filtros.
- Ficha del vehículo y cronología vinculada a sus decisiones cuando el registro identifica la unidad. Las partidas anteriores conservan sus textos; no se inventan vínculos o años ausentes.
- Historia en capítulos basada en los hechos registrados de tu trayectoria.
- Cierre con museo final, perfil, dinero disponible separado del patrimonio, colección y próximas metas.
- Antes de empezar otra trayectoria finalizada se guarda el recuerdo local. Si falla el guardado, la partida se conserva y se puede exportar el recuerdo.
- Exportación/importación de recuerdos JSON independiente de la partida activa. Un recuerdo se consulta como museo y no avanza el juego.
- Los 31 logros siguen guardados aparte y se conservan entre partidas. Se pueden elegir hasta tres metas.
- Animación anual breve, omitible y respetuosa de la preferencia de movimiento reducido. Mercado con foco de teclado, Escape en apertura voluntaria y retorno de foco.

## Datos y compatibilidad

No se modificaron catálogo, IDs, nombres numerados de fotos, precios ni reglas de logros. Las fotos existentes se muestran completas, sin pintarlas. No se agregan autos ni se permite continuar después del cierre.

Guardado activo: `lmp_car_life_v02`. Logros: `lmp_car_life_achievements_v1`. Museos: `lmp_car_life_legacies_v1`. Metas: `lmp_car_life_goals_v1`. Todo se conserva en este navegador y origen. Exportá partidas y recuerdos si querés trasladarlos o antes de limpiar datos del navegador. El archivo de partida no incluye automáticamente los museos exportados aparte.

Los valores son aproximaciones del juego, no cotizaciones de mercado. Una fecha o año de modelo ausente en un guardado antiguo se muestra como sin registrar.

## Verificaciones de esta entrega

- 20 regresiones del motor y 15 comprobaciones de legados, compatibilidad, identidad, consulta sin avanzar, importación inválida, registro corrupto y fallo de cuota.
- Compra y reactivación de los 100 vehículos agregados en v0.46; 60 variantes con sus eventos de modelo base.
- 120 trayectorias completas, en seis años de inicio y dos ritmos, sin errores.
- Cinco vistas en 360, 390, 768 y 1280 px, más el cierre en esos cuatro tamaños: fotos completas, controles de al menos 44 px y sin recortes horizontales.
- En navegador: exportar/importar recuerdo; guardar museo y empezar otra trayectoria; recargar y volver a consultarlo; ficha del auto vendido con fecha 2010; meta persistente; Escape y retorno de foco del mercado.
- Catálogo, IDs, nombres de archivos, eventos, reglas de los 31 logros y 230 fotos de 500 × 500 idénticos a v0.46.
- ZIP comprobado por CRC y coincidencia exacta con los archivos de la versión completa.

Las capturas y partidas usadas para las pruebas son ejemplos controlados, no partidas personales. La comprobación se realizó en el navegador de Codex; no se verificaron todos los navegadores o dispositivos físicos. Si ves la interfaz anterior después de instalar, forzá la recarga del navegador (Ctrl+F5).
