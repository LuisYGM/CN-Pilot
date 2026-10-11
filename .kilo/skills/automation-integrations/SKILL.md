---
name: automation-integrations
description: Diseñar, implementar o recuperar automatizaciones técnicas programadas, asíncronas, event-driven, multi-step o entre sistemas; no la actives para lógica síncrona ordinaria ni por la palabra «workflow» sin orquestación real.
---

# automation-integrations

## Alcance y frontera

Esta capability coordina el ciclo operativo **trigger → orchestration → state → actions → retry → observability → recovery**: jobs recurrentes, cron/schedulers, queues/workers, ETL/sync, webhooks encadenados, SaaS/CRM/email/CMS, GitHub Actions, AI y aprobaciones humanas.

- `api-integration` define cómo comunicarse correctamente con un sistema externo: contrato, auth, HTTP, paginación, rate limits, firma webhook y semántica de retry del proveedor. Esta skill define cuándo y cómo coordinar pasos, estado, tiempo, fallos y recuperación. Activa ambas si se necesitan ambas; no copies su checklist HTTP.
- Backend normal sigue siendo backend: `validate → save → response` síncrono sin ejecución diferida, recurrencia, coordinación, dependencia externa ni proceso durable no es automation. Documentar un workflow humano tampoco lo es.
- Deployment controla preparación/publicación autorizada. GitHub Actions puede implementarlo si la tarea pertenece al lifecycle del repo; configurar automation no autoriza deploy ni trigger automático.
- En WordPress reutiliza `wordpress`/`woocommerce` cuando el stack/features lo requieren; evalúa scheduler existente, WP-Cron, cron de hosting/sistema y Action Scheduler solo con evidencia del stack y necesidad. No presupongas shell/cron, tráfico suficiente ni sistema de queue.

## Preflight y selección

1. Confirma objetivo/owner y si hay proceso automatizado material; identifica sistemas, impacto y entorno. Inspecciona primero código, scheduler/worker, integración, estado persistido, restricciones de hosting y convenciones existentes.
2. Especifica trigger: qué evento/horario/comando lo dispara, qué no, input/payload, precondiciones, semántica de duplicados y entorno. Para cron define timezone local explícita, calendario/DST si importa, ventana, retraso/missed-run/catch-up y reloj asumido; «cada 24h» no equivale a «diario a las 08:00». Resuelve timezone desde contexto o pregunta una vez si afecta materialmente.
3. Elige el mecanismo más simple fiable para el proyecto: comportamiento nativo del stack → scheduler ya disponible → queue/job system existente → jobs de plataforma/serverless → GitHub Actions solo para lifecycle del repo → plataforma de orquestación cuando sus conectores/visibilidad/ownership/iteración aporten valor real. Compara trigger/frecuencia/latencia/volumen, fiabilidad/orden/concurrencia/estado, datos/secretos, recuperación, operación/infraestructura/equipo, portabilidad/vendor lock-in y coste. No uses plataforma externa por defecto ni introduzcas infraestructura que el stack no tenga.
4. Define fuente de verdad por entidad/campo y dirección. Para sync A↔B acuerda ownership, resolución de conflictos, deletes, backfill, incremental/replay y drift. Sin autoridad clara con consecuencias materiales: `BLOCKED HUMAN`; evita eco/loop con origen, version/event ID o change detection.
5. Declara configuración aparte de la lógica: IDs/endpoints/mappings/schedule/environment/flags centralizados razonablemente; secretos solo en el mecanismo de environment/secret store autorizado, credenciales separadas por entorno cuando aplica. Minimiza payload y evalúa destino, retención y logs si sale PII, salud/finanzas o datos de clientes; no inventes compliance. Escala al owner decisiones de privacidad/jurisdicción material.

## Ejecución, estado y fiabilidad

- Distingue event-driven, scheduled, queued/async, data sync, multi-step orchestration y human-in-the-loop. Para procesamiento diferido define enqueue/acceptance y cómo se identifica el run/job; para batch/backfill define tamaño de lote, checkpoint/resume, progreso, rate limits, dedup y fallo parcial.
- Toda ejecución tiene un run/trigger ID correlacionable, resultado y límites de acción. Si la recurrencia/eventos pueden solaparse, elige explícitamente overlap, skip, serialize/lock, partition o queue; atiende duración frente a intervalo, orden y carrera. Usa locking solo si evita un conflicto real y con vencimiento/liberación segura conforme al stack.
- Haz safe-to-retry: event/job ID estable, clave idempotente o dedup persistente en el boundary del efecto; registra processed/transition de modo consistente. No uses una ventana corta de tiempo como identidad durable. Define replay y coordina claves/semántica externa con `api-integration`.
- En procesos materiales modela estados suficientes (`received`, `validated`, `queued`, `processing`, `partial`, `completed`, `failed`, `dead-lettered`, `cancelled`, `waiting_approval`, según aplique), historial/resultado por paso y checkpoint recuperable. No uses un booleano que oculte estado parcial ni impongas state machine a un cron trivial.
- Separa TRANSIENT (reintento acotado con backoff+jitter; respeta ventana/señal del proveedor), PERMANENT (falla accionable, no retry: auth/config inválida, validación, recurso inexistente) y UNKNOWN (reconciliar estado antes de repetir). Evita retry storms e intentos infinitos. Comportamiento HTTP detallado pertenece a `api-integration`.
- Ante fallo parcial, reanuda desde el paso/boundary no confirmado; conserva pasos completados, no reinicies ciegamente efectos. Define compensación solo si existe una acción inversa válida; no prometas transacción distribuida entre SaaS. Tras agotar intentos, para trabajo crítico registra fallo/DLQ/manual review y alerta; un cron trivial no necesita DLQ. Nunca descartes silenciosamente trabajo crítico.
- Observabilidad proporcional: run ID, trigger, inicio/fin, resultado, duración, paso/attempt que falla, correlation ID y última ejecución correcta/fallida cuando ayude a operar. Redacta secretos, PII y payloads; alerta en agotamiento, bloqueo persistente o incumplimiento material, no por cada retry.
- HUMAN approval es estado/pausa deliberada, no retry. Reanuda solo tras decisión autorizada; contenido generado por AI valida schema, entradas/salidas, confianza/revisión humana según impacto, fallos y coste. No automatices decisiones humanas críticas por disponibilidad del modelo.

## Seguridad, efectos y verificación

Evalúa trust boundaries, privilegios unattended, tokens scoped/least privilege, firma/origen/replay del trigger y separación de entornos. No hardcodees secretos; considera impacto de rotación y evita credenciales prod en test. Carga `security-review` solo ante superficie sensible/expuesta/privilegiada real, no por automatización abstracta.

Los efectos externos respetan BF-053: LOCAL/TEST dentro del scope; SANDBOX según autorización/riesgo; PRODUCTION EXTERNAL requiere scope y autorización claros. Email real, cambios CRM/CMS, cobro, deploy y borrados no se ejecutan como prueba no autorizada. Define fixture, mock, sandbox, test mode, test recipient o dry-run realmente soportado; no inventes flags. No configures MCP, cuentas, vendor, workflow ni credenciales por rutina.

Prueba trigger válido e inválido, precondiciones, duplicado/replay, orden/concurrencia, timezone/catch-up cuando aplique, éxito, error permanente/transitorio, retries agotados, timeout/resultado incierto, estado parcial/reanudación, alerta y ausencia de secretos en logs. Usa test aislado; evidencia que un paso completado no repite efectos y que recuperación funciona. Para sync/backfill verifica conteo/progreso/invariantes y conflicto/drift acorde al riesgo. No llames servicios reales/producción sin scope.

Toda automatización material identifica owner técnico/operativo que recibe fallos, mantiene credentials/mappings y valida producción. Versiona su definición cuando sea soportado y útil; en plataformas visuales sin versionado práctico documenta el cambio proporcionalmente. Registra solo para workflows materiales: propósito, trigger, sistemas/fuente de verdad, pasos críticos, retry/fallo/recuperación, ubicación conceptual de credentials, owner y rollback/compensación. No documentes cada tarea trivial.

## Providers, source grounding y límites

Elige código nativo para lógica central/control/testability/performance; scheduler para recurrencia sencilla; queue para async durable/throughput/retries; GitHub Actions para eventos/mantenimiento del repositorio; n8n/Make/Zapier/equivalente para SaaS multi-system cuando conectores, edición visual y ownership superen sus costes/riesgos. Son opciones, no identidad del sistema ni preferencia universal. Una visualización no hace fiable un workflow.

Ante feature/sintaxis/concurrencia/retry/retención/planes/capabilities/hosting version-sensitive que pueda cambiar la implementación, usa `source-grounded-development`: detecta el runtime/config local, formula la cuestión material, consulta documentación primaria oficial actual de la versión y prueba su aplicación. En n8n, cuando se use, verifica trigger/ejecución/credentials/error workflow/retries/retención/queue-mode según aplique; en Make/Zapier, scenario/trigger/mapping/scheduling/error/task-plan cuando sean relevantes. En GitHub Actions, comprueba trigger, permission, secret/environment, concurrency/cancel/queue, artifacts y dispatch cuando apliquen. No congeles settings/versiones ni asumas features disponibles en todo plan. Cron/hosting y WordPress scheduling también requieren verificar capability real local. No instales/configures vendors ni crees workflows durante una consulta de capability.

Evita: plataforma para todo; polling sin razón cuando exista evento fiable; fire-and-forget crítico; retries infinitos; falta de dedup; fallo parcial silencioso; credenciales hardcoded; test real en producción; source of truth ambiguo; loops bidireccionales; workflow monolítico irrecuperable; solapamiento de cron ignorado.

Mantén un solo owner técnico (`developer` por defecto); `architect` solo ante decisión estructural material. Colabora con `api-integration`, `wordpress`, `woocommerce`, `database-migrations`, `deploy-wordpress`, `security-review` y `source-grounded-development` únicamente si sus responsabilidades/triggers aplican; no las actives en bloque.
