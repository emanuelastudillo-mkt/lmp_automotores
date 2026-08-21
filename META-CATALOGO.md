# Catálogo de vehículos para Meta

La web genera automáticamente un feed CSV compatible con Meta Commerce Manager:

```text
https://lmpautos.com/meta-catalog.csv
```

## Configuración en Meta

1. Elegir **Usar una URL u Hojas de cálculo de Google**.
2. Ingresar `https://lmpautos.com/meta-catalog.csv`.
3. Seleccionar una actualización automática diaria.
4. Elegir `ARS` como moneda predeterminada si Meta lo solicita.

## Actualización

El feed se reconstruye con el workflow `Actualizar stock, SEO e imágenes`, junto
con el catálogo de la web. Solo exporta vehículos públicos que tienen precio e
imagen. Los vendidos o dados de baja desaparecen del archivo automáticamente.

Las imágenes del catálogo se publican en JPEG dentro de `/img/meta/` para evitar
problemas de compatibilidad con Meta.
