# LMP Autos Web v1.13 — PDF de una página

## Presupuesto adaptado a una página A4

Se compactó el diseño completo:

- márgenes reducidos;
- encabezado más compacto;
- información técnica en cuatro columnas;
- valores en una sola fila de hasta cuatro bloques;
- cuotas más compactas;
- sección de calificaciones reducida;
- indicadores y aclaraciones con menor altura;
- control de cortes mediante `break-inside: avoid`.

## Puntaje general

El puntaje utiliza un contenedor interno centrado con Flexbox:

```css
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
```

Esto corrige el desplazamiento vertical dentro del círculo.

## Validación

Se generó un presupuesto de prueba con nombre largo, cuatro valores comerciales, tres planes de cuotas y cinco calificaciones.

Resultado:

```text
Pages: 1
```

## Versión

```text
lmpautos V1.13
```

## Validación técnica

- JavaScript validado con `node --check`.
- PDF de muestra generado con WeasyPrint.
- Cantidad de páginas comprobada con `pdfinfo`.
- Render visual generado a 150 DPI.
