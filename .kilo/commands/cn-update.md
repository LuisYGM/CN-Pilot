---
description: Actualiza manualmente archivos gestionados del CN Pilot Core.
agent: dev-lead
---

# Actualizar CN Pilot

Ejecuta solo por invocación explícita. Lee `.cn-pilot/docs/UPDATES.md` como contrato operativo.

1. Si falta `.cn-pilot/update/updater.mjs` o el baseline manifest, no intentes sobrescrituras legacy: detente e inicia `LEGACY BOOTSTRAP MODE` del documento. Presenta primero la lista de paths no clasificables; aplica solo tras revisión humana explícita, con `--approve-legacy` y `--preserve <path>` para las personalizaciones que deben conservarse.
2. Para instalación administrada ejecuta `node .cn-pilot/update/updater.mjs update` desde el root Git del proyecto. El updater exige working tree tracked limpio, ausencia de tarea activa, compatibilidad y manifest/hashes válidos; descarga `main` shallow y calcula el plan antes de escribir.
3. Si hay conflicto, task pendiente, dirty tree, runtime no compatible o hash inválido, detente sin aplicar. No hagas stash/reset/clean ni resuelvas conflictos por overwrite. Informa rutas y evidencia concreta.
4. Si el plan es seguro, el updater aplica solo managed files, ejecuta Core QA, crea el commit local con mensaje versionado y reporta versión, operaciones, QA, hash y `Push: not performed`. Ante cualquier fallo parcial, deja el estado/diff visible, no afirmes éxito y no hagas rollback destructivo.

No actualices en background, no auto-check, no cambies `origin`, no uses pull/merge, no copies el repositorio entero, no toques Project Owned/Product, no crees tags/releases ni hagas push.
