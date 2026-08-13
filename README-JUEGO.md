# Tu vida sobre ruedas — v0.4

Incremental del prototipo privado de LMP Autos en `/juego/`, construido sobre v0.3.

## Corrección principal

- Se corrige el bloqueo del evento **Divorcio** cuando el jugador elige entregar el auto.
- Si después de perder el vehículo no alcanza el dinero para comprar otro, el mercado forzado ofrece **“Pasar 1 año y ahorrar”**.
- Cada año sin auto genera el ingreso anual normal del juego (USD 100–500).
- Mientras no hay vehículo no se cobran gastos mensuales de uso.
- El jugador puede repetir la espera año por año, revisando el mercado actualizado en cada período, hasta comprar otro auto o llegar a 2026.
- Al comprar nuevamente, la trayectoria retoma el flujo normal de eventos.

## Base incluida

Este ZIP incluye los tres archivos de datos/código necesarios para ejecutarse de forma independiente:

```text
juego/index.html
juego/data/autos.json
juego/data/eventos.json
README-JUEGO.md
```

`autos.json` corresponde a la base vigente de v0.2, ya que v0.3 era incremental y no lo incluía.
