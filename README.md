# LMP Autos Web v1.15 — Herramientas para la agencia

## Mejoras incorporadas sin modificar la hoja

### Atención y búsqueda
- Buscador instantáneo por marca, modelo, año, combustible, transmisión, precios, anticipo y estado.
- Filtros rápidos por disponibilidad, financiación, contado, permuta, estado, prioridad y rangos de precio.
- Filtro automático mediante la ficha del cliente.
- Modo cliente para ocultar identificadores, notas, estados internos y controles administrativos.
- Vista compacta y vista amplia.

### Ficha del cliente
Se pueden guardar localmente:
- nombre;
- teléfono;
- asesor;
- presupuesto máximo;
- anticipo habitual;
- transmisión y combustible buscados;
- vehículo entregado;
- valor estimado de permuta;
- vigencia;
- observaciones.

Los datos se incorporan a los presupuestos sin modificar Google Sheets.

### Financiación personalizada
Cada tarjeta permite ingresar el anticipo del cliente y recalcular:
- 12 cuotas;
- 18 cuotas;
- 24 cuotas.

El anticipo se conserva localmente por vehículo.

### Presupuestos
- PDF individual o múltiple.
- Datos del cliente incluidos.
- Anticipo personalizado.
- Bloques estandarizados.
- Un vehículo por página A4.
- Comparación de hasta tres vehículos.
- Copia de resumen para WhatsApp.

### Control interno
- Alertas automáticas de datos faltantes o inconsistentes.
- Filtros por tipo de alerta.
- Notas internas por vehículo.
- Prioridad de venta local.
- Fecha y hora de actualización.
- Botón Actualizar ahora.

### Reserva preliminar
Cada tarjeta incluye un botón para imprimir un comprobante preliminar con:
- cliente;
- teléfono;
- vendedor;
- seña;
- vigencia;
- observaciones.

La reserva no modifica automáticamente el estado en la hoja.

### Continuidad operativa
- Caché local del último stock válido.
- Si Google Sheets falla, se muestra el último stock guardado.
- Persistencia local de:
  - búsqueda;
  - filtros;
  - vista;
  - modo cliente;
  - ficha del cliente;
  - selección;
  - notas;
  - prioridades;
  - anticipos;
  - posición de desplazamiento.

### Atajos de teclado
- `/`: enfocar buscador.
- `Esc`: limpiar búsqueda.
- `M`: activar o desactivar modo cliente.
- `C`: comparar seleccionados.
- `P`: preparar presupuesto.
- `R`: actualizar stock.

## Funciones no agregadas

No se agregó el indicador de días en stock porque requiere una fecha de ingreso en la hoja.

## Validación
- JavaScript validado con `node --check`.
- PDF de muestra generado en una página A4.
- Render de control creado a 150 DPI.
- Caché, búsqueda, filtros y herramientas se ejecutan sin nuevas columnas.

## Versión

```text
lmpautos V1.15
```
