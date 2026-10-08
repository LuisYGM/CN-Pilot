---
name: deploy-wordpress
description: Preparar y ejecutar despliegues WordPress con método definido, alcance verificable, QA y rollback; la publicación requiere autorización explícita.
---

# deploy-wordpress

## Aplicación y superficies

Activa esta skill solo para un despliegue WordPress dentro del alcance y con método real definido. No configura canales ni ejecuta producción por disponer de acceso; preparar preflight es distinto de autorizar publicación. Si `existing-site-audit` ya documentó entorno, stack o método, reutiliza esa evidencia. Otros stacks conservan sus propios métodos y puntos de entrega.

Pregunta para cada intervención: **qué se publica, dónde, por qué canal, qué superficies persistentes toca, cómo se demuestra el éxito y qué puede recuperarse**. Distingue archivos, base de datos, uploads, options, post/meta content, builder data, configuración de plugins, caché/CDN y estado de integraciones externas. Un deploy de archivos no equivale a sincronización de datos; restaurar archivos no revierte DB, options o recursos del builder. La sincronización de desarrollo o un watcher tampoco equivalen a deployment ni autorizan publicar en producción.

## Preflight y manifiesto

1. Identifica destino/entorno y autorización efectiva, unidad y propietario de cada recurso, método disponible y riesgos de datos vivos. Si existe Git, inspecciona rama, estado y checkpoint para rastrear qué fuente se publicará; un commit o push no son deploy y BF-017 sigue `main → work → verify → local commit → manual push`. Sin Git, verifica fuentes directamente.
2. Define un manifiesto proporcional, incluso en la sesión si el deploy es pequeño: origen, destino, incluidos/excluidos, recursos a borrar, cambios de datos/migraciones, acciones de caché, pruebas y recuperación por superficie. Confirma configuración, compatibilidad, secretos y archivos locales excluidos; no publiques raíz del repositorio, `.git`, worktrees, builds ajenos ni credenciales. No borres recursos remotos fuera del alcance aprobado.
3. Verifica **lo que el canal realmente consume**: origen/destino, globs, contexto de trabajo, auto-upload/watchers, política de borrado y expansión de artefactos. Hosting tooling, SFTP/FTPS, SSH/rsync, CI/CD o transferencia manual son alternativas, ninguna universal. Prefiere transporte seguro; no configures un canal por rutina ni uses FTP plano como opción por defecto. El preflight valida exactamente el alcance que se ejecutará; si cambia el manifiesto, método o destino, revalida antes de publicar.
4. Prepara snapshot/backup proporcional al riesgo. Confirma existencia, fecha, integridad o evidencia de restauración disponible y **qué superficie cubre**; instalar un plugin de backup no acredita una restauración viable. Una revisión de builder o valor anterior puede bastar para una mutación pequeña; cambios de DB/datos vivos requieren un plan propio. Identifica de antemano pasos reversibles y cualquier cambio que exija forward recovery. Producción requiere autorización explícita y rollback proporcionado.

Si un preflight/deploy guard es lógica custom del proyecto y su `PASS/FAIL` autoriza publicar, aplica BF-039 para demostrar KNOWN-GOOD → PASS y KNOWN-BAD → FAIL por la causa prevista con fixture/entorno seguro antes de confiar en él. No crees un guard por rutina ni self-testees tooling estándar del hosting/proveedor; esto no autoriza deploy.

## Ejecución y verificación

5. Publica únicamente las unidades y operaciones aprobadas; registra enviados, omitidos, borrados, migraciones y errores. No sincronices DB/uploads por inferencia ni amplíes el origen al fallar. Para recursos con revisions/digests, aplica BF-019: writes secuenciales por recurso, relectura y verificación antes del siguiente; ante timeout o conflicto, determina primero qué persistió, sin blind retry.
6. Verifica estado remoto/persistido y runtime **según superficie cambiada**: recursos/archivos y versión servida, URLs y respuestas HTTP, admin, logs, consola, navegación, formularios, email, auth, integraciones o WooCommerce si están afectados. Si tocaste formularios, SMTP, webhook o CRM, prueba el flujo productivo de manera segura y autorizada: HTTP 200 no acredita envío o recepción. BF-021 separa este Production QA del prototipo visual.
7. Si afectó metadata, redirects, robots, canonical, sitemap, slug o templates SEO, verifica la salida pública real (head, status, destino, indexabilidad, schema) sin quitar `noindex` fuera de alcance. Invalida caché solo cuando haga falta: plugin, object cache, servidor, CDN o browser pueden servir estados diferentes. Prefiere invalidación acotada; no hagas flush global preventivo. Usa `performance-review` solo si hay síntoma/impacto medible y `security-review` cuando el riesgo de secretos, permisos, datos o exposición lo justifique.

## Fallos y cierre

Ante fallo: detén el lote → inspecciona estado realmente publicado y superficies afectadas → decide rollback o recuperación autorizada → verifica el estado recuperado. No continúes publicando para «arreglarlo al final» ni reintentes sin releer. Explica qué revierte cada mecanismo (archivos, DB, builder revision, configuración o integración externa) y qué **no** revierte; no declares rollback completo si queda una superficie sin restaurar. Reporta manifiesto y destino ejecutados, evidencias del post-deploy, errores, estado final y límites de recuperación. Actualiza `STATE.md` solo ante un checkpoint operativo material.
