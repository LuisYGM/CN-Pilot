---
description: Consulta la versión instalada y actualizaciones estables de CN Pilot.
agent: dev-lead
---

# Estado de CN Pilot

Ejecuta solo por invocación explícita. Es read-only respecto al proyecto: puede obtener la distribución estable `main` mediante Git y usa/limpia únicamente su temporal dentro de `.cn-pilot/runtime/`.

1. Si existe `.cn-pilot/update/updater.mjs`, ejecuta `node .cn-pilot/update/updater.mjs status` desde el root Git del proyecto.
2. Si no existe, la instalación es legacy: no escribas ni intentes bootstrap aquí; informa que requiere el procedimiento manual de `.cn-pilot/docs/UPDATES.md` usando el bootstrap portable del master.
3. Resume salida humana; ante error, informa código/causa y detente. No conviertas un error de red, manifest o compatibilidad en “up to date”.

No modifica archivos framework, manifest, versión, Product, Project Context ni recursos; no hace commit, cambia remotes ni contacta el upstream salvo esta invocación.
