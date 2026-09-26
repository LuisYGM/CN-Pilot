---
description: Ejecuta preflight antes de un despliegue y prepara manifiesto, riesgos, pruebas y rollback.
agent: dev-lead
---

# Pre Deploy

1. Identifica entorno destino.
2. Si es producción, exige aprobación antes del despliegue.
3. Comprueba rama, status y checkpoint.
4. Ejecuta pruebas proporcionales.
5. Revisa secretos/archivos excluidos.
6. Prepara manifiesto con `templates/deploy-manifest.md`.
7. Define backup/checkpoint.
8. Define smoke tests.
9. Define rollback.
10. No despliegues todavía.
