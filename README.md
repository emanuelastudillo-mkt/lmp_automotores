# LMP Autos Web v1.18 - Perfiles de últimos vehículos

## Corrección

Se corrigió la ausencia del rombo de Perfil del vehículo en los últimos ingresos.

El problema podía aparecer por dos causas:

1. Los puntajes de los últimos renglones llegaban vacíos desde Google Sheets.
2. El navegador recuperaba un caché creado por una versión anterior, sin los perfiles de respaldo.

## Perfiles incluidos

### Ford EcoSport 1.5 Freestyle 2017

- Rendimiento: 72
- Confort: 74
- Economía: 70
- Espacio: 75
- Seguridad: 78
- General: 74

### Renault Clio 1.2 Authentique 2011

- Rendimiento: 52
- Confort: 51
- Economía: 76
- Espacio: 56
- Seguridad: 35
- General: 54

### Peugeot Partner 1.6 Patagónica 2012

- Rendimiento: 63
- Confort: 65
- Economía: 87
- Espacio: 91
- Seguridad: 43
- General: 70

### Renault Sandero 1.6 Authentique 2017

- Rendimiento: 67
- Confort: 66
- Economía: 77
- Espacio: 80
- Seguridad: 52
- General: 68

## Mejoras técnicas

- Reconoce `1.5`, `1,5`, `1-5` y variantes similares.
- Reconoce modelos con o sin acentos.
- Completa solo los puntajes faltantes.
- Mantiene cualquier puntaje válido existente en Google Sheets.
- Repara automáticamente vehículos recuperados desde el caché local.
- Vuelve a validar el perfil antes de abrir una ficha, comparar o generar un PDF.

## Alcance

La corrección se aplica en:

- ficha pública;
- rombo de puntajes;
- barras laterales;
- calificación general;
- Stock interno;
- comparación;
- PDF individual;
- PDF múltiple.

## Validación

- JavaScript validado con `node --check`.
- Se probaron variantes con punto, coma y acentos.
- Se comprobó la reparación de vehículos cargados desde caché.

## Versión

```text
lmpautos V1.18
```
