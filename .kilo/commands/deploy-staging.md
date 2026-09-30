---
description: Despliega a staging usando el método documentado, con manifiesto y smoke test.
agent: dev-lead
---

# Deploy Staging

1. Requiere staging, método definido y autorización para publicar el alcance solicitado; no presupongas proveedor ni stack.
2. Ejecuta `/pre-deploy` si no existe un preflight vigente del **mismo** manifiesto, método y destino. En WordPress sigue `deploy-wordpress`; en otros stacks aplica su procedimiento.
3. Publica solo las superficies autorizadas; verifica recursos persistidos y smoke tests afectados, no solo que la transferencia terminó.
4. Ante fallo, detén, relee el estado efectivo y aplica recuperación proporcional; reporta superficies no cubiertas.
5. Actualiza `STATE.md` solo si cambia materialmente. No despliegues a producción.
