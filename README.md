# LMP Autos Web v1.12 — Presupuesto PDF

## Catálogo interno

Se retiró la información:

- Foto local.
- Foto Drive.

Las mini tarjetas internas mantienen los datos comerciales y técnicos necesarios para revisar cada unidad.

## Botón PDF

Cada mini tarjeta incorpora un botón:

```text
PDF
```

El botón abre un presupuesto en una nueva ventana y activa el diálogo de impresión del navegador.

Desde allí se puede seleccionar:

```text
Guardar como PDF
```

## Formato del presupuesto

El documento está orientado a clientes y no incluye fotografías ni código interno.

Contiene:

- encabezado de LMP Autos;
- dirección, WhatsApp y sitio web;
- fecha de emisión;
- marca y modelo;
- año;
- kilometraje;
- color;
- transmisión;
- combustible;
- estado comercial;
- precio en pesos;
- valor publicado en dólares;
- valor de contado en dólares;
- anticipo mínimo o valor de contado;
- porcentaje de anticipo;
- máximo financiable;
- cuotas estimadas de 12, 18 y 24 meses;
- cinco calificaciones del vehículo;
- calificación general;
- indicadores de confianza;
- aclaraciones comerciales.

## Funcionamiento

El documento usa el sistema de impresión nativo del navegador y no requiere librerías externas.

Si la ventana emergente está bloqueada, el sitio muestra una advertencia.

## Medición

Se agregó el evento:

```text
print_vehicle_pdf
```

compatible con Meta Pixel y `dataLayer`.

## Versión

```text
lmpautos V1.12
```

## Validación

- JavaScript validado con `node --check`.
- Confirmada la eliminación de la información de fotografías.
- Confirmada la generación del presupuesto imprimible.
- Confirmado el botón PDF en todas las mini tarjetas internas.
