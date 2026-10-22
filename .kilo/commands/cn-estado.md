---
description: Consulta la versión instalada y actualizaciones estables de CN Pilot.
agent: jefe-proyecto
---

# Estado de CN Pilot

Ejecuta solo por invocación explícita. Es read-only respecto al proyecto: puede obtener la distribución estable `main` mediante Git y usa/limpia únicamente su temporal dentro de `.cn-pilot/runtime/`.

1. Sigue el preflight determinista de root/filesystem de `.cn-pilot/documentacion/ACTUALIZACIONES.md`. No uses `Glob` para decidir existencia de paths literales. Si no puede determinarse el Git root, informa el error y detente; si el updater falta realmente, informa `LEGACY` y remite al bootstrap manual.
2. Si el updater existe, ejecútalo como `node "<Git-root>/.cn-pilot/update/updater.mjs" status --target "<Git-root>"`. El status sigue permitido con una tarea activa/bloqueada; informa el estado y la razón diagnóstica sin mutar el checkpoint.
3. Si el updater existe pero falta el manifest, informa baseline manifest ausente; si es inválido/corrupto o unsafe, informa ese error concreto. No lo reduzcas a legacy ni repares. Resume salida humana; ante error de red/compatibilidad también detente y no afirmes “up to date”.

No modifica archivos framework, manifest, versión, Product, Project Context ni recursos; no hace commit, cambia remotes ni contacta el upstream salvo esta invocación.
