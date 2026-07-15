# LMP Autos Web v1.01 — Ajustes popup

## Archivos incluidos
- `index.html`
- `README.md`

## Cambios funcionales
- `% de anticipo < 100`: muestra **Financiación**.
- `% de anticipo >= 100`: muestra **Solo de Contado**.
- `% de anticipo` vacío o inválido: no muestra ninguna de esas etiquetas.
- Vehículos anteriores a 2010: no muestran **Tomamos permuta**.
- Vehículos desde 2010: muestran **Tomamos permuta**.
- Año vacío o inválido: no se informa permuta.

## Popup destacado
### Desktop
- Conserva **Lomas del Mirador · Av. Mosconi 799**.
- Usa el mismo gráfico radar de rendimiento que la ficha.
- Mantiene precio, condición, Ver ficha y RESERVALO.

### Mobile
- Popup e imagen tienen exactamente el mismo ancho.
- Imagen máxima de 450×360 px, adaptable.
- `object-fit: contain`: la foto no se recorta.
- Solo muestra imagen, precio, anticipo cuando corresponde y RESERVALO.

## Limpieza realizada
- Se consolidaron múltiples parches CSS del popup en un bloque único.
- Se eliminó el gráfico de barras anterior del popup.
- Se retiró la variable `specs` del popup: se calculaba pero no se usaba.
- Se eliminaron estilos de `featured-popup-kicker` y `featured-popup-specs`.
- Se centralizó la lógica comercial en helpers reutilizables.

## Contradicciones corregidas
1. La financiación podía inferirse por `Anticipo MINIMO` aunque `% de anticipo` estuviera vacío.
2. La tarjeta mostraba financiación para cualquier vehículo no contado.
3. Los vehículos sin año válido podían mostrar permuta.
4. Había reglas mobile incompatibles con alturas entre 105 px y 360 px.
5. Coexistían dos gráficos del popup: barras y radar.

## Rendimiento y optimización
- Reducción aproximada del archivo: **8.3 KB**.
- Menos reglas CSS evaluadas.
- Menos sobrescrituras y menos `!important`.
- Menos cálculos al renderizar el popup.
- Lógica de etiquetas centralizada.

## Código posiblemente obsoleto no eliminado
La revisión estática detectó clases sin referencias actuales:
- `hero`
- `hero-card`
- `hero-copy`
- `hero-grid`
- `banner-track`
- `detail-benefits`
- `detail-info`
- `detail-links`
- `detail-price`

No se eliminaron porque podrían pertenecer a vistas futuras o componentes temporalmente desactivados.

## Validación
- JavaScript validado con `node --check`.
- Verificada la lógica de contado, financiación y permuta.
- Verificada la presencia del radar.
- Verificada la eliminación del gráfico anterior y del cálculo `specs` del popup.
