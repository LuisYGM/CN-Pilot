---
description: Ejecuta preflight antes de un despliegue y prepara manifiesto, riesgos, pruebas y rollback.
agent: dev-lead
---

# Pre Deploy

1. Identifica entorno destino.
2. Confirma que deployment forma parte del alcance y que existe un método aprobado. La mera presencia de producción no autoriza crear ni activar un workflow.
3. Si es producción, exige aprobación antes del despliegue.
4. Comprueba rama, status y checkpoint.
5. Ejecuta pruebas proporcionales.
6. Revisa secretos/archivos excluidos.
7. Prepara manifiesto con `templates/deploy-manifest.md`.
8. Define backup/checkpoint.
9. Define smoke tests.
10. Define rollback.
11. No despliegues todavía.
