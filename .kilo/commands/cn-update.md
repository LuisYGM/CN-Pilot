---
description: Actualiza manualmente archivos gestionados del CN Pilot Core.
agent: dev-lead
---

# Actualizar CN Pilot

Ejecuta solo por invocación explícita. Lee `.cn-pilot/docs/UPDATES.md` como contrato operativo.

1. Sigue el preflight determinista de root/filesystem de `.cn-pilot/docs/UPDATES.md`. No uses `Glob` para decidir existencia de paths literales. Root indeterminable es error; solo updater realmente ausente es legacy. Si existe updater pero manifest falta, baseline ausente requiere bootstrap; manifest inválido/unsafe es error bloqueante, no legacy.
2. Para instalación administrada ejecuta `node "<Git-root>/.cn-pilot/update/updater.mjs" update --target "<Git-root>"`. El updater exige working tree tracked limpio, ausencia de tarea activa, compatibilidad y manifest/hashes válidos; descarga `main` shallow y calcula el plan antes de escribir. Una tarea bloqueante se informa con status y razón; no la borres ni repares.
3. Si hay conflicto, task pendiente, dirty tree, runtime no compatible o hash inválido, detente sin aplicar. No hagas stash/reset/clean ni resuelvas conflictos por overwrite. Informa rutas y evidencia concreta.
4. Si el plan es seguro, el updater aplica solo managed files, ejecuta Core QA, crea el commit local con mensaje versionado y reporta versión, operaciones, QA, hash y `Push: not performed`. Ante cualquier fallo parcial, deja el estado/diff visible, no afirmes éxito y no hagas rollback destructivo.

No actualices en background, no auto-check, no cambies `origin`, no uses pull/merge, no copies el repositorio entero, no toques Project Owned/Product, no crees tags/releases ni hagas push.
