# LMP Autos Web v1.14 — Presupuestos múltiples

## PDFs estandarizados

Todos los vehículos utilizan exactamente los mismos bloques, aunque falte información:

1. Encabezado de LMP Autos.
2. Identificación del vehículo.
3. Información del vehículo.
4. Valores.
5. Condiciones comerciales.
6. Alternativas de financiación.
7. Perfil y calificaciones.
8. Indicadores de confianza.
9. Aclaraciones comerciales.

Los datos faltantes se muestran como:

```text
—
```

Los vehículos sin financiación mantienen las tres tarjetas de 12, 18 y 24 cuotas, indicando:

```text
No disponible
```

Las cinco calificaciones siempre aparecen. Cuando un puntaje no está informado se muestra `—`.

## Presupuesto de varios vehículos

El catálogo interno permite:

- seleccionar vehículos individualmente;
- seleccionar todos;
- limpiar la selección;
- imprimir todos los seleccionados dentro del mismo documento.

Cada vehículo ocupa una página A4 independiente dentro del mismo PDF. El encabezado indica:

```text
Opción 1 de 3
Opción 2 de 3
Opción 3 de 3
```

El botón PDF individual continúa disponible.

## Validación

Se generó un documento de prueba con:

- un vehículo financiable;
- un vehículo solo de contado;
- datos completos y datos faltantes;
- bloques idénticos en ambos casos.

Resultado comprobado:

```text
Pages: 2
```

## Versión

```text
lmpautos V1.14
```

## Validación técnica

- JavaScript validado con `node --check`.
- PDF múltiple generado con WeasyPrint.
- Cantidad de páginas comprobada con `pdfinfo`.
- Dos páginas renderizadas para control visual.
