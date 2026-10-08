---
description: Ejecuta preflight antes de un despliegue y prepara manifiesto, riesgos, pruebas y rollback.
agent: dev-lead
---

# Pre Deploy

1. Confirma destino, alcance y método real; no configures deployment porque exista producción.
2. Para WordPress usa el preflight de `deploy-wordpress`; para otro stack conserva su procedimiento correspondiente. Reutiliza un baseline vigente de `existing-site-audit` si aplica.
3. Verifica que manifiesto, origen/destino, superficies, exclusiones y borrados coinciden con lo que publicaría el método. `.blueprint/templates/deploy-manifest.md` es opcional; un plan explícito acotado puede bastar.
4. Comprueba Git si existe, secretos, compatibilidad, pruebas previas, backup/rollback por superficie y verificación posterior proporcional.
5. Indica bloqueos y autorización pendiente, especialmente en producción. No despliegues todavía.
