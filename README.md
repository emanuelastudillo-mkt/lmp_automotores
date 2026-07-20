# LMP Autos Web v1.16 - Descuento y cuotas

## Alcance

La función se agregó exclusivamente dentro de Stock interno. El catálogo público no muestra ni utiliza descuentos internos.

## Descuento por vehículo

Cada mini tarjeta incorpora un campo:

```text
Descuento
```

El descuento se ingresa como importe en pesos y se conserva localmente en la computadora de la agencia.

El sistema calcula:

```text
Valor final = precio de lista - descuento
Capital financiado = valor final - anticipo del cliente
```

Las cuotas de 12, 18 y 24 meses se recalculan inmediatamente.

## Persistencia

Los descuentos quedan guardados por vehículo en `localStorage`, junto con:

- anticipos personalizados;
- notas;
- prioridades;
- ficha del cliente;
- selección de vehículos.

No se modifica Google Sheets.

## Presupuestos

Los presupuestos individuales y múltiples muestran de forma estandarizada:

- precio de lista;
- descuento aplicado;
- valor final con descuento;
- anticipo considerado;
- saldo a financiar;
- cuotas recalculadas.

Para un presupuesto individual también puede modificarse el descuento desde el cuadro previo a imprimir.

## Comparación y resumen

El descuento también se aplica en:

- comparación interna;
- resumen para copiar por WhatsApp;
- presupuesto individual;
- presupuesto múltiple.

## Seguridad de cálculo

- El descuento nunca puede superar el precio total.
- El valor final nunca puede ser negativo.
- El anticipo se limita al valor final con descuento.
- Las cuotas se calculan sobre el saldo real restante.

## Validación

- JavaScript validado con `node --check`.
- PDF con descuento validado en una página A4.
- Render de control generado a 150 DPI.

## Versión

```text
lmpautos V1.16
```
