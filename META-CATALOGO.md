# Catálogo automotor para Meta

La web genera automáticamente un feed CSV para un catálogo de tipo **Vehículos**
en Meta Commerce Manager:

```text
https://lmpautos.com/meta-catalog.csv
```

## Configuración en Meta

1. Elegir **Usar una URL u Hojas de cálculo de Google**.
2. Ingresar `https://lmpautos.com/meta-catalog.csv`.
3. Seleccionar una actualización automática diaria.
4. Elegir `ARS` como moneda predeterminada si Meta lo solicita.

No se debe cargar este archivo en un catálogo de tipo "Productos". Sus columnas
corresponden al esquema automotor de Meta.

## Actualización

El feed se reconstruye con el workflow `Actualizar stock, SEO e imágenes`, junto
con el catálogo de la web. Solo exporta vehículos públicos que tienen precio,
imagen, marca, modelo, año y kilometraje. Los vendidos o dados de baja desaparecen
del archivo automáticamente.

Las imágenes del catálogo se publican en JPEG dentro de `/img/meta/` para evitar
problemas de compatibilidad con Meta.

El feed incluye los campos obligatorios `vehicle_id`, `url`, `make`, `model`,
`year`, `mileage.value`, `mileage.unit`, `image[0].url`, `body_style`,
`state_of_vehicle` y `address`. Los valores enumerados usan el formato admitido
por Meta, por ejemplo `AVAILABLE`, `USED` y `GOOD`.

## Coincidencia con el píxel

El píxel `1026614216645178` envía el mismo identificador `Axxx` utilizado en la
columna `vehicle_id`. Se registran estos eventos estándar:

- `ViewContent` al abrir una ficha;
- `Search` al usar filtros u ordenamientos del catálogo;
- `AddToWishlist` al guardar un vehículo en favoritos;
- `Lead` al iniciar una consulta de WhatsApp por una unidad.

Los eventos incluyen `content_ids`, `content_type: vehicle`, nombre, precio y
moneda. No se envían eventos de catálogo para unidades incompletas que todavía no
formen parte del feed, evitando coincidencias fallidas.
