# LMP Autos Web v1.04 — Versión visible

## Cambio realizado

Se agregó un indicador de versión al final de la página:

```text
lmpautos V1.04
```

## Objetivo

Permite comprobar rápidamente qué versión está publicada y diferenciar:

- un error de implementación;
- una versión antigua en caché;
- un archivo nuevo que todavía no fue subido;
- una publicación que todavía no se actualizó.

## Diseño

- texto centrado;
- tamaño de 9 px;
- color gris suave;
- ubicado debajo de todo el contenido;
- visible tanto en desktop como en mobile.

## Marca interna

También se actualizó:

```html
<meta name="lmp-build" content="lmp-autos-web-v1.04-version-visible">
```

## Validación

- JavaScript validado con `node --check`.
- Verificada la presencia del indicador visual y de la marca interna.
