---
name: maintenance-operations
description: Coordinar lifecycle operativo de proyectos existentes: mantenimiento planificado, cambios materiales de producción, incidentes, recuperación y cierre; no activar para microcambios localizados conocidos ni sustituir skills de diagnóstico/deploy.
---

# maintenance-operations

## Activación y ownership

Dev Lead coordina cuando la solicitud es un incidente, mantenimiento planificado/actualización, recuperación, degradación operativa o cambio material en un sistema vivo. No se activa solo porque el proyecto sea Existing o esté publicado: copy/CSS/localized fix conocido sigue `DIRECT`. El equipo no necesita una plataforma de monitoring ni automatización para operar. Dev Lead gobierna lifecycle, entorno, riesgo y handoff; Developer, Frontend, Content u otro owner implementa según la superficie.

Esta capability conecta `OPERATE → OBSERVE → TRIAGE → CHANGE SAFELY → VERIFY → RECOVER → LEARN`. No sustituye:

- `existing-site-audit`: baseline read-only focalizado cuando estado, stack o fuente vigente desconocidos condicionan la intervención. No se repite para cada mantenimiento.
- `systematic-debugging`: reproduce, observa, acota y prueba la causa de un síntoma. Operations preserva contexto, clasifica impacto, contiene de forma autorizada y coordina diagnóstico/recuperación; no duplica ese análisis.
- `deploy-wordpress` u otro procedimiento de stack: publicación, manifiesto y ejecución de deploy. Operations decide proporcionalidad de staging, ventana, recovery y observación; no constituye deploy genérico.
- Skills especialistas: `security-review`, `performance-review`, `technical-seo`, `webapp-testing`, `database-migrations`, `api-integration`, `automation-integrations`, etc. Actívalas solo ante su superficie real.

## Clasificación y estado

Clasifica conceptualmente como `ROUTINE CHANGE`, `PLANNED MAINTENANCE`, `INCIDENT`, `SECURITY INCIDENT`, `PERFORMANCE DEGRADATION`, `RECOVERY/RESTORE` o `PREVENTIVE MAINTENANCE`. El nombre no impone plantilla ni ceremonia. Estima severidad solo si ayuda: LOW localizado/reversible; MEDIUM cambio productivo/dependencia/datos limitados con recovery claro; HIGH disponibilidad, auth, pagos, datos críticos o cambio amplio; CRITICAL caída esencial, corrupción/pérdida activa, compromiso plausible o daño continuado. Ajusta a impacto, alcance, urgencia y evidencia; no uses P1/P2 de forma automática.

La continuidad procede del estado actual, fuentes de verdad, cambios manuales, contexto del proyecto y evidence disponible; Git no representa necesariamente todo CMS/hosting/SaaS. `existing-site-audit` solo llena vacíos materiales. Confirma ambiente (local/test/staging/production), superficie, owner y alcance; no asumas accesos, herramientas, monitorización, backup ni control.

## Preflight proporcional

Para una tarea rutinaria clara, conserva el fast path y verifica el resultado directo sin checklist, backup completo ni staging. Para cambio material define lo mínimo útil: qué cambia/no cambia, target/environment, fuente vigente/dependencias, autorización, riesgo/side effects, test afectado y recovery path. En producción comprueba esos elementos según impacto, además de ventana si downtime, lock, paso irreversible o riesgo de usuario lo justifica. El staging es herramienta, no obligación; si no existe, adapta el rollout y escala solo tradeoffs de riesgo materiales. La autorización para corregir no implica publicar: si producción no está inequívocamente en scope, no despliegues; si está autorizado explícitamente, no pidas reconfirmación conceptual, conserva preflight.

Para updates de Core/plugins/themes/packages/SDKs exige que el scope nombre esos componentes; “todos los plugins” no incluye core/theme/packages. Determina motivo y evidencia actual de security/support/compatibilidad cuando afecten decisión; usa `source-grounded-development` para advisories/versiones/soporte/procedimientos time-sensitive. Revisa constraints y affected flows, staging/backup apropiados, tests por superficie y recovery. Antigüedad sola no exige update. Un update fallido se detiene: inspecciona estado realmente persistido/parcial (archivos, schema/datos y runtime) antes de cualquier reintento.

Un backup solo cuenta para un riesgo si se conoce superficie cubierta, fecha/consistencia, ubicación/accesibilidad, mecanismo de restore y superficies/datos excluidos. Existencia no prueba restaurabilidad. No se requiere full backup para texto. No ejecutes restores reales sin autorización, target/scope, impacto de pérdida de datos y recovery path claros.

## Incidentes y evidencia

Ante incidente real, en orden proporcional:

1. Confirma síntoma e impacto observable, rutas/flows afectados y ambiente; registra timestamp/alcance sin datos personales innecesarios.
2. Preserva evidencia útil antes de acciones que la borrarían: error/log pertinente, versión/estado, cambio/deploy reciente, métricas/señal disponible y comportamiento. No limpies logs/cache por reflejo.
3. Detén cambios ajenos; si hay daño activo, evalúa containment estrecho, reversible, autorizado y comprobable. No inventes control ni uses producción como experimento.
4. Identifica last-known-good y cambios recientes aplicables (release, settings, migration, DNS/TLS, provider, credentials, job). Son hipótesis, no causalidad probada; nunca rollback ciego.
5. Enruta diagnóstico al especialista: `systematic-debugging` para causa, security/performance/SEO/API/database skills para su trigger. Ante proveedor externo distingue señal provider vs local, fallback y comunicación; no reescribas código sin evidencia.
6. Elige acción mínima informada: fix de causa; workaround temporal explícito; rollback de release/config; restore de snapshot; o forward recovery cuando rollback dañaría estado/datos. No son sinónimos. Stop si persisted state es incierto.
7. Verifica salida/ruta/flow/datos/versión realmente afectados y comunica estado, evidencia, riesgo residual y next action.

Una señal plausible de compromiso prioriza containment + evidence, luego `security-review`, alcance de acceso/credenciales y recovery autorizados; no borres masivamente archivos/usuarios antes de entender impacto. Si secreto se confirma expuesto, borrar archivo no basta: revocar/rotar/reemplazar y revisar sistemas/historial afectados sin leer ni reportar el valor.

## Operación segura y recuperación

- **Fix** corrige causa; **rollback** revierte una versión/cambio; **restore** recupera estado desde backup/snapshot/revision; **forward recovery** repara avanzando cuando rollback no es seguro; **workaround** mitiga temporalmente. Anota deuda/follow-up solo si material.
- Protege datos creados tras deploy. Revertir código no equivale a restaurar DB: no reviertas DB completa para corregir frontend si borraría pedidos/registros nuevos. Para schema/transformación persistente usa `database-migrations`.
- Cache no es diagnóstico universal. Identifica la capa (browser/application/object/server/CDN), invalida solo lo necesario y comprueba respuesta efectivamente servida; nunca flush global a ciegas.
- Config drift puede ser manual, generado, ambiental o peligroso; determina owner antes de alinear producción con repo. No sobrescribas estado vivo para igualarlo a Git por defecto.
- Health/availability usa señales existentes y discrimina DNS, TLS, red, server, aplicación, DB, dependencia, CDN/rate limit con evidencia. `.cn-pilot/qa/core-check.mjs` prueba Core, no salud de una aplicación.
- Monitoring SaaS, plugins, scanners, backup tooling e infraestructura no se instalan por esta skill. Usa señales existentes; recurrente → `automation-integrations` solo ante automatización realmente solicitada/necesaria.

## Verificación, observación y cierre

Comprueba la superficie cambiada con la evidencia más directa: contenido servido, rutas responsive afectadas, flujo form, integración/recepción, checkout sandbox, SEO público, medición repetida de rendimiento, estado de job/dependency o runtime. No ejecutes efectos productivos peligrosos sin autorización. Si update afecta solo un flujo delimitado, no pruebes todo el sitio. Observación posterior puede ser smoke inmediato, ventana acotada o lectura futura de métrica; no inventes espera universal ni prometas background work. Si queda seguimiento real, registra dueño, condición y próximo paso en el estado/artefacto existente.

Restore sobre producción requiere autorización y alcance explícitos por superficies, ventana de datos perdidos y procedimiento de recuperación. Verifica recurso recuperado, runtime, datos, versión y funcionalidad afectada; el mensaje “Completed” de la herramienta no es prueba. No ejecutes restore real durante análisis/probe.

Tras work material, comunica cambio/incidente, impacto, acción, evidencia, estado actual, riesgo residual y next action. Handoff solo incluye lo necesario: environment, current state/version, change, recovery path, riesgo y dependencia próxima. Postmortem blameless y root cause analysis son opcionales para incidentes materiales/recurrentes; distingue confirmado de inferido y documenta acciones concretas. Backlog puede clasificar NOW/LATER/ACCEPTED/NOT RELEVANT; no convierte findings en trabajo automático. Runbook se crea solo si procedimiento repetido/sensible al orden requiere continuidad entre operadores.

## Anti-patterns

No update-everything; no staging/maintenance window universal; no backup theatre ni claims de restore no probado; no rollback/DB restore/cache flush ciegos; no experimentar en producción; no cambios amplios durante incidente; no confundir correlación con causa; no monitor instalado por defecto; no hardening/SEO/performance/security audit sin trigger; no routine baseline completo; no checklist periódica sin evidencia, lifecycle o riesgo; no autodeploy, restore, destructive DB autonomy ni permisos amplios. La urgencia reduce ceremonia, no scope, autorización material, evidencia mínima, verificación o consciencia de recovery.
