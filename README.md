# LMP Autos Web v1.27 — Stock JSON + sincronización

Esta versión agrega una copia estática del Google Sheets dentro de la propia web.

## Arquitectura

```text
Google Sheets
      ↓
scripts/actualizar-stock.mjs
      ↓
data/stock.json
      ↓
lmpautos.com
```

La página carga en este orden:

```text
1. data/stock.json     → primera carga rápida
2. Google Sheets      → actualización en vivo
3. caché del navegador → último respaldo local
```

Si `stock.json` todavía está vacío, la web continúa funcionando como antes y consulta Google Sheets.

---

# PASO 1 — Subir esta versión al repositorio

Del ZIP copiar al repositorio:

```text
index.html
data/stock.json
scripts/actualizar-stock.mjs
.github/workflows/actualizar-stock.yml
```

`README.md` es solamente documentación y no es obligatorio publicarlo.

La estructura final del repositorio debe quedar aproximadamente:

```text
/
├── .github/
│   └── workflows/
│       └── actualizar-stock.yml
├── data/
│   └── stock.json
├── scripts/
│   └── actualizar-stock.mjs
├── img/
├── index.html
├── metricas.html
├── cuotas.html
└── ...
```

Hacer un commit normal con esos archivos.

---

# PASO 2 — Ejecutar la primera sincronización manual

En GitHub:

```text
Actions
→ Actualizar stock desde Google Sheets
→ Run workflow
→ Run workflow
```

La acción:

1. descarga el CSV público;
2. valida las columnas;
3. genera `data/stock.json`;
4. compara los datos con la versión anterior;
5. hace commit únicamente si el stock cambió;
6. GitHub Pages publica la nueva copia.

Después del primer run, abrir:

```text
data/stock.json
```

Debe aparecer algo similar a:

```json
{
  "schemaVersion": 1,
  "generatedAt": "2026-08-07T02:00:00.000Z",
  "source": "Google Sheets CSV publicado",
  "rowCount": 25,
  "contentHash": "...",
  "rows": [
    {
      "ID": "A001",
      "Marca": "...",
      "Modelo": "..."
    }
  ]
}
```

---

# PASO 3 — Probar la web

Abrir:

```text
https://lmpautos.com/
```

La web debería mostrar el catálogo inmediatamente desde `data/stock.json`.

En segundo plano vuelve a consultar Google Sheets.

En Stock interno, el indicador de actualización puede mostrar:

```text
Base web: 06/08, 23:20
```

y después, cuando Sheets responde:

```text
Google Sheets JSONP + respaldo CSV publicado: 06/08, 23:21
```

---

# PASO 4 — Uso manual cotidiano

Cada vez que se quiera forzar una copia nueva:

```text
GitHub
→ Actions
→ Actualizar stock desde Google Sheets
→ Run workflow
```

No hace falta modificar `index.html`.

No hace falta descargar la web.

No hace falta editar el JSON manualmente.

---

# PASO 5 — Actualización automática

El workflow ya incluye:

```yaml
schedule:
  - cron: "20 */6 * * *"
```

GitHub intentará sincronizar aproximadamente cada seis horas.

También se puede seguir ejecutando manualmente en cualquier momento.

---

# Qué ocurre si no cambió nada

El script calcula un hash del contenido.

Si Google Sheets no cambió:

```text
Sin cambios
```

y no genera un commit nuevo.

Esto evita commits innecesarios cada seis horas.

---

# Qué ocurre si Google Sheets falla

La web conserva tres niveles de respaldo:

1. `data/stock.json`;
2. Google Sheets en vivo;
3. caché local del navegador.

Si Sheets no responde pero existe `stock.json`, el catálogo continúa visible.

---

# Ejecutar el script manualmente en una computadora

Requisito:

```text
Node.js 20 o superior
```

Desde la carpeta del repositorio:

```bash
node scripts/actualizar-stock.mjs
```

Eso actualiza:

```text
data/stock.json
```

Para publicarlo después hay que hacer:

```bash
git add data/stock.json
git commit -m "Actualizar stock"
git push
```

La opción de GitHub Actions evita tener que hacer estos pasos en la computadora de la agencia.

---

# Seguridad

No se guardan:

- contraseñas;
- tokens;
- credenciales de Google.

El script utiliza el CSV público que ya consume la web.

---

# Archivos

## `scripts/actualizar-stock.mjs`

Descarga y valida Google Sheets, genera el JSON y evita reescribirlo cuando no hubo cambios.

## `data/stock.json`

Copia estática del stock.

## `.github/workflows/actualizar-stock.yml`

Permite:

- ejecución manual;
- ejecución automática cada seis horas;
- commit automático cuando cambian los datos.

## `index.html`

Carga primero `stock.json` y luego actualiza desde Google Sheets.

---

# Versión

```text
lmpautos V1.27
```
