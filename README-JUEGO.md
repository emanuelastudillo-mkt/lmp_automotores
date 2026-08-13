# Tu vida sobre ruedas — v0.3

Incremental del prototipo privado en `/juego/`.

## Duración de la partida

- Año mínimo de inicio: 1960.
- Año máximo de inicio: 2008.
- Final obligatorio: 2026.
- Cada partida contiene entre 18 y 30 eventos.
- El calendario de eventos se genera al comenzar la trayectoria.
- El último evento siempre ocurre en 2026.
- Si comenzás en 2008, hay exactamente 18 años disponibles y por eso el juego genera un evento por año: 2009, 2010, ... 2026.
- Para inicios más antiguos, los 18–30 eventos se distribuyen a lo largo de toda la trayectoria.

La interfaz muestra el progreso:

```text
Eventos 7/24
```

## Reparaciones

Se aumentaron especialmente las reparaciones grandes.

Las reparaciones siguen encareciéndose dentro del mismo vehículo mediante el multiplicador acumulativo.

Además, algunas reparaciones grandes tienen un piso relacionado con el valor actual del vehículo, evitando que reconstruir un auto caro resulte artificialmente barato.

Ejemplos:

- reconstrucción después de choque: base alta + mínimo aproximado del 38% del valor del auto;
- reconstrucción de motor fundido: base alta + mínimo aproximado del 30%;
- restauración de carrocería: reparación grande;
- suspensión completa, embrague, interior, frenos y recuperación después de robo: costos aumentados.

## Archivos del incremental

```text
juego/index.html
juego/data/eventos.json
README-JUEGO.md
```

`autos.json` no necesita reemplazarse en esta versión.

## SEO

`/juego/` continúa con:

```html
<meta name="robots" content="noindex,nofollow,noarchive">
```

No se modifica ninguna página pública de LMP Autos.
