---
description: Despliega a staging usando el método documentado, con manifiesto y smoke test.
agent: dev-lead
---

# Deploy Staging

1. Requiere staging y método de deploy documentado.
2. Ejecuta preflight si no existe uno reciente.
3. Presenta el manifiesto y respeta prompts de permisos.
4. Despliega solo lo previsto.
5. Ejecuta smoke tests.
6. Aplica rollback si falla.
7. Actualiza `STATE.md` si cambia materialmente.
8. No despliegues a producción.
