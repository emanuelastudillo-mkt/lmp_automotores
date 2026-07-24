# LMP Autos Web v1.19 — Popup de destacados compacto

## Cambio principal

Se redujo el panel del popup de vehículos destacados para que nunca supere la mitad de la pantalla.

### Escritorio

- Ancho máximo: `50vw`.
- Alto máximo: `50vh`.
- Distribución compacta en dos columnas.
- Contenido interno desplazable si fuera necesario.

### Tablets y celulares

- Alto máximo: `50dvh`.
- En teléfonos puede utilizar casi todo el ancho, pero mantiene como límite la mitad de la altura de la pantalla.
- Imagen e información se muestran lado a lado para evitar un popup vertical excesivo.

## Contenido simplificado

Para conservar legibilidad dentro del espacio reducido, el popup oculta:

- gráfico completo de puntajes;
- texto descriptivo secundario.

Mantiene:

- fotografía;
- etiqueta de destacado;
- precio;
- anticipo o condición de contado;
- ubicación en escritorio;
- acceso a la ficha;
- botón de reserva.

## Alcance

Solo se modificó el popup automático de vehículos destacados. No cambia:

- ficha del vehículo;
- catálogo;
- Stock interno;
- presupuestos PDF;
- gráficos de puntajes de las fichas.

## Validación

- JavaScript validado con `node --check`.
- Reglas finales con prioridad sobre los estilos responsive anteriores.

## Versión

```text
lmpautos V1.19
```
