# LMP Autos Web v1.24 — Revisión integral

## Alcance de la revisión

Se revisaron el sitio público, el catálogo completo, las fichas de vehículos, el comparador, los filtros, los rombos de puntajes, el popup de destacados y Stock interno.

La versión fue probada mediante navegación automatizada en Chromium con una respuesta simulada de Google Sheets que incluye vehículos financiables, unidades solo de contado, reservados, en preparación, una unidad de baja, fotografías locales y de Drive, puntajes completos e información faltante para activar alertas.

## Errores corregidos

### Copiar enlace

El botón `Copiar link` llamaba a una función inexistente:

```text
vehicleUrl is not defined
```

Se agregó la función correspondiente y se estandarizó la construcción de enlaces de vehículos.

### Comparador

El botón para abrir la comparación podía detenerse por una función inexistente:

```text
saveCompare is not defined
```

Se agregó persistencia de la selección en `sessionStorage` y se corrigieron agregar, quitar, limpiar y abrir la comparación.

### Ordenamiento del catálogo

La función que dibujaba las tarjetas volvía a ordenar los vehículos según la disponibilidad de imagen. Esto podía alterar el orden seleccionado por precio, año o puntajes. Ahora conserva exactamente el orden calculado por los filtros.

### Ventanas internas

Los eventos para cerrar ventanas al hacer clic fuera del contenido se agregaban nuevamente cada vez que se cambiaba entre Inicio y Vehículos. Se movieron a una inicialización única.

### Favoritos y unidades de baja

Los favoritos y comparaciones guardados se limpian automáticamente cuando un vehículo fue vendido, está de baja o dejó de ser visible en el catálogo público. Stock interno continúa mostrando esas unidades.

### Vehículos solo de contado

En la ficha pública ahora se muestra `Valor de contado` en lugar de `Anticipo mínimo` cuando el porcentaje de anticipo es del 100 %.

## Popup de destacados

### Mobile

El popup queda completamente desactivado en teléfonos, navegadores identificados como móviles y pantallas de hasta 767 px. También se cierra automáticamente si una ventana de escritorio se reduce hasta ese tamaño.

### Escritorio

Continúa limitado a un máximo de:

```text
50vw × 50vh
```

Se agregó:

- marca y modelo;
- estado actual;
- año;
- kilometraje;
- transmisión;
- combustible;
- valor total;
- anticipo o condición de contado;
- cuota estimada;
- financiación y permuta;
- calificación general;
- los cinco puntajes;
- ubicación;
- botones Ver ficha y Reservalo.

El gráfico radar completo permanece en la ficha del vehículo. El popup usa una versión compacta de los puntajes.

## Rombo de puntajes

Se abrió y verificó la ficha de cada vehículo público utilizado en la prueba. Para cada uno se comprobó la presencia de:

- sección Perfil del vehículo;
- polígono del rombo;
- cinco métricas;
- calificación general.

Los puntajes continúan tomándose dinámicamente desde Google Sheets.

## Pruebas de botones y funciones

### Sitio público de escritorio

Se probaron:

- navegación Inicio / Vehículos;
- popup destacado;
- cerrar popup;
- Ver ficha desde popup;
- filtros;
- orden por precio;
- orden por año;
- orden por puntajes;
- limpiar filtros;
- abrir y cerrar ficha;
- simulador de cuotas;
- cambio de anticipo;
- galería;
- foto siguiente;
- pantalla completa;
- favorito;
- copiar enlace;
- consulta por WhatsApp;
- comparar;
- abrir, cerrar y limpiar comparación.

### Mobile

Se comprobó:

- ausencia total del popup;
- apertura de filtros;
- aplicación de filtros;
- cierre del panel;
- catálogo reducido según el filtro.

### Stock interno

Se probaron:

- buscador;
- filtros rápidos;
- alertas;
- vista compacta y amplia;
- modo cliente;
- ficha del cliente;
- cierre del diálogo al tocar el fondo;
- anticipo personalizado;
- descuento;
- recálculo de valor final y cuotas;
- notas internas;
- prioridad de venta;
- selección múltiple;
- comparación interna;
- copiar resumen;
- presupuesto múltiple e individual;
- comprobante de reserva;
- limpiar selección;
- actualizar stock.

## Resultados técnicos

```text
JavaScript: node --check OK
IDs estáticos: 98
IDs duplicados: 0
Botones estáticos revisados: 48
Prueba pública de escritorio: OK
Prueba mobile: OK
Prueba Stock interno: OK
Errores JavaScript durante las pruebas: 0
```

Los presupuestos y comprobantes se probaron interceptando la ventana de impresión y verificando que el documento generado contuviera el contenido esperado.

## Versión

```text
lmpautos V1.24
```
