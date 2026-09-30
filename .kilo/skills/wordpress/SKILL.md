---
name: wordpress
description: Desarrollo y mantenimiento de WordPress usando APIs nativas, hooks, filters, CPT, taxonomías, WP_Query, REST, AJAX, opciones, roles y buenas prácticas. Úsala cuando la tarea afecte WordPress Core APIs o estructura de un sitio WordPress.
---

# wordpress

## Alcance

Activa este procedimiento cuando la tarea afecte una implementación WordPress confirmada o sus APIs; no impone WordPress a otros perfiles. Aplica únicamente los pasos que correspondan al recurso, fase y riesgo. En una web heredada, reutiliza el baseline vigente de `existing-site-audit` y profundiza solo donde falte evidencia. No modifiques WordPress Core.

## Estado actual y fuente vigente

1. Identifica entorno (local, staging o producción), datos vivos y unidad afectada. Descubre selectivamente versiones WordPress/PHP, theme/child theme, builder, plugins, CPT, taxonomías, campos, templates, formularios, capas de caché, multidioma, plugin SEO, ecommerce e integraciones **solo si influyen en esta tarea**. No exijas MCP, WP-CLI ni una auditoría completa; reutiliza descubrimiento vigente.
2. Localiza el recurso real y quién lo gobierna: contenido de post, datos del builder, template o condición, componente/global style, option, term, custom field, configuración de plugin, archivo de tema o integración externa. Lee el estado actual y cambios manuales; no edites una representación derivada si hay una fuente activa más apropiada.
3. Compara estado previsto y existente. Decide `reuse`, `update`, `create` o `skip` por recurso; comprueba ownership, slugs y dependencias antes de crear CPT, taxonomía, campo, template u option. No dupliques estructura ni sobrescribas valores ajenos porque la especificación enumere el recurso.

## Canal y mutación proporcional

4. Escoge el canal más seguro que **resuelva la operación concreta**: capability especializada del plugin/builder si existe y está verificada → API nativa WordPress o interfaz genérica segura → alternativa low-level solo si es necesaria, soportada y autorizada. En ausencia de MCP usa APIs oficiales, hooks/filters y herramientas del proyecto disponibles; no saltes por defecto a Execute PHP, SQL directo, manipulación de datos serializados o hacks de filesystem. Si cambia una integración, refresca Discovery conforme a BF-019; una capability de lectura no autoriza escribir.
5. Delimita campos, recursos, entorno y autorización de escritura. Para cambios de riesgo define recuperación proporcional: revisión, valor anterior, export, snapshot, Git, backup o rollback nativo según la superficie. Un cambio trivial no requiere backup completo; una mutación sensible no prosigue sin reversión razonable y autorización. Protege secretos y activa `security-review` cuando haya auth/autorización, APIs/endpoints, datos sensibles, uploads, pagos, permisos, secretos, código ejecutable propio o integraciones expuestas. La presencia de un plugin o una edición ordinaria de su configuración no basta por sí sola.
6. Cambia la unidad mínima. En posts, terms, options y metadata: descubre schema y recurso → identifica ID/clave/campo exacto → decide crear/actualizar/omitir → preserva campos y valores fuera de alcance → escribe solo lo necesario → relee y verifica. En options compartidas y settings de plugin/builder conserva claves ajenas; en templates conserva condiciones y recursos globales no afectados. Usa validación, capabilities, nonces cuando correspondan, sanitización de entradas y escaping contextual de salidas. Evita queries innecesarias y lógica costosa en hooks globales.
7. Relee el estado **persistido** tras la mutación y verifica IDs, campos, condiciones, referencias y valores afectados. Si hay revisión/digest/version, respétalo y serializa escrituras al mismo recurso: `read → minimal write → reread → verify → next write`. Ante timeout, reset o conflicto, vuelve a leer para determinar qué persistió antes de continuar; nunca reintentes a ciegas. Comprueba runtime, logs y errores en el entorno apropiado cuando el cambio lo requiera; una respuesta de guardado no demuestra comportamiento correcto.

## Especialidades condicionales

- Builder detectado: `bricks`, `elementor` u otra skill apropiada resuelve schema, estructura y persistencia específicos. Para templates, identifica responsabilidad y condiciones, reutiliza globals, prueba contenido representativo y estados vacíos/límite cuando procedan, y verifica condiciones, render y editabilidad. Render correcto por sí solo no basta; si existe referencia aprobada, conserva BF-018 y `visual-parity-review`/Human Visual QA.
- Campos/datos: detecta el sistema real (nativo, ACF, JetEngine, Meta Box u otro), consulta schema y capabilities disponibles, preserva datos existentes y comprueba persistencia. Ninguno es requisito por defecto.
- Plugins propios: utiliza `wordpress-plugin`. WooCommerce: activa `woocommerce` solo cuando su dominio se vea afectado. SEO técnico: `technical-seo` cuando cambien indexación o salida SEO. Migraciones reales: `database-migrations`; no confundas deploy de código con migración persistente.
- Antes de añadir almacenamiento o infraestructura custom, compara APIs nativas, options, post/user/term meta, CPT, almacenamiento existente, WooCommerce CRUD si aplica, transients, custom tables y servicios externos según volumen, consultas, lifecycle, ownership, retención, relaciones, rendimiento y portabilidad. Mantén `PROVISIONAL` cualquier elección bloqueada por una incógnita material.

Informa recursos reutilizados, creados, modificados u omitidos, método, evidencia de persistencia y runtime, límites y cobertura real de rollback. No publiques ni despliegues por rutina.
