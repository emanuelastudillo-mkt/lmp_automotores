# Tu vida sobre ruedas — v0.2

Incremental del prototipo privado en `/juego/`.

## Cambios principales

- 20+ tipos de eventos.
- Todos los eventos con decisión muestran exactamente 2 opciones.
- Opciones con iconos y animaciones.
- Reparaciones cada vez más caras dentro del mismo vehículo.
- Las reparaciones incrementan el valor interno del auto.
- Se muestra valor actual del auto y venta estimada normal por separado.
- Un coleccionista puede pagar el valor completo solamente cuando el auto supera 40 años, está en muy buen estado y conserva alta originalidad.
- Choques, motor fundido, robo recuperado y granizo pueden provocar consecuencias antes de elegir.
- Choque sin cobertura: reconstruir o vender como chatarra.
- Divorcio: perder 50% del dinero o perder el auto.
- Ingreso anual aleatorio entre USD 100 y USD 500.
- Gasto mensual individual para cada uno de los 100 vehículos.
- El gasto mensual aumenta por mal estado, originalidad alta y performance baja.
- El gasto de uso se descuenta año por año durante los saltos temporales.
- Se mantiene acceso únicamente por `/juego/` y `noindex,nofollow,noarchive`.

## Archivos del incremental

```text
juego/index.html
juego/data/autos.json
juego/data/eventos.json
README-JUEGO.md
```

Los valores y costos siguen siendo parámetros de gameplay aproximados.
