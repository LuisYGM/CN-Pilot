---
name: security-review
description: Revisar seguridad basada en riesgo para authentication/authorization, APIs, uploads, formularios con datos reales, WordPress backend, WooCommerce, webhooks, persistencia sensible, secretos o integraciones externas. No la uses para copy, CSS trivial o frontend sin superficie sensible.
---

# security-review

## Activación proporcional

`security review != universal mandatory audit` y `security review != security theater`. Estima cualitativamente `low`, `medium` o `high` solo cuando ayude a decidir profundidad, según datos, superficie expuesta, privilegios, autenticación, integraciones, endpoint, capacidad de escritura, entorno e impacto. Un cambio de CSS/texto o interacción frontend simple normalmente no activa esta skill; un formulario real requiere revisión ligera; REST/AJAX custom, auth, pagos, uploads, persistencia, plugins, webhooks o WooCommerce requieren revisión focalizada o profunda.

No audites infraestructura imaginaria: BF-021 permite formularios, login, búsqueda o checkout visuales con mock/local state en prototipos sin Production Security QA para backend inexistente. Una integración real o petición explícita de funcionalidad productiva cambia el scope.

## Procedimiento

1. Identifica assets, actores, entry points, trust boundaries y abuse cases plausibles; usa threat modeling ligero solo para cambios de riesgo alto.
2. Revisa controles existentes y limita la comprobación a la superficie afectada. Distingue `confirmed issue`, `likely risk` y `hardening recommendation`.
3. Para cada finding relevante reporta `issue → evidence → impact → recommended fix`; considera exploitability, impact, privileges, exposure y data sensitivity. Prioriza critical/high/medium/low solo si ayuda a decidir.
4. No hagas cambios destructivos, de arquitectura amplia o fuera de scope automáticamente. Correcciones locales, reversibles y autorizadas pueden aplicarse; los hallazgos críticos fuera de scope se reportan.

## Validación de entradas y salidas

Revisa según corresponda:

- validación de tipo, estructura, rangos, longitud, normalización y allowlists;
- sanitización donde sea apropiada, sin tratarla como sustituto de validación;
- escaping contextual en HTML, atributos, URLs, CSS, JavaScript y respuestas;
- HTML/rich text controlado y diferencias entre stored, reflected y DOM XSS;
- inyección DOM, `innerHTML`, `eval`, ejecución dinámica de scripts y URLs peligrosas.

## Identidad, permisos y request integrity

`authentication = who are you?`; `authorization = are you allowed to do this?`. Comprueba roles, capabilities, ownership, least privilege, acceso directo a objetos, escalación, acciones admin y verificaciones server-side. Ocultar UI no es autorización.

Para acciones con cambio de estado revisa CSRF, nonces/tokens cuando correspondan, validación de origen/contexto, replay e idempotency solo cuando aporten valor. No asumas que un nonce sustituye autorización ni exijas idempotency en operaciones donde no aplica.

## Datos, base de datos y archivos

Cuando exista DB revisa prepared statements/queries parametrizadas, concatenación insegura, permisos excesivos, exposición sensible y operaciones destructivas. No asumas que ORM/CMS APIs eliminan todo riesgo.

Para uploads revisa MIME/type y extensión, tamaño, nombre, path traversal, overwrite, ejecución, ubicación, accesibilidad pública y controles de malware cuando sean relevantes; nunca confíes solo en la extensión. Para datos personales considera minimización, transporte, almacenamiento, acceso, logs y retención dentro del scope técnico, sin convertir la skill en asesoría legal.

## APIs, webhooks y secretos

En APIs revisa auth, authorization, rate limiting cuando el riesgo lo justifique, validación, filtrado de respuestas, errores, CORS, paginación/abuso, campos sensibles, retries y secretos. En webhooks revisa firmas, secretos compartidos, timestamp/replay, fuente cuando sea viable, idempotency, entregas duplicadas, retries y logs redactados.

Nunca pongas API keys, tokens, passwords, application passwords, private keys o credenciales en Git, frontend, logs, screenshots o documentación. Prefiere environment/config secret stores y ejemplos redactados. Si detectas un secreto expuesto, reporta también necesidad de revoke, rotate y replace; eliminarlo del archivo no basta.

## WordPress y WooCommerce

Activa esta sección solo cuando el stack lo confirme. Revisa según scope `current_user_can()`, nonces, `sanitize_*`, `esc_*`, `wp_kses*`, `$wpdb->prepare()`, `permission_callback`, validation/sanitize callbacks, AJAX `auth/nopriv`, safe redirects, remote requests, options/meta writes, settings permissions, media/uploads y file access. Prefiere APIs WordPress seguras.

En WooCommerce revisa ownership de pedidos, datos de clientes, manipulación de precios/totales, carrito/sesión, checkout, callbacks de pago, webhooks, transiciones de estado, admin actions, cupones, descuentos y uploads. Los precios y totales enviados por frontend nunca son fuente autoritativa. En pagos exige verificación server-side, firma de webhook, idempotency, amount/currency validation, mapping de orden, estados y redacción de logs; no almacenes tarjetas salvo arquitectura explícitamente diseñada/certificada.

Un endpoint REST custom sin `permission_callback` adecuada es un finding relevante. En AJAX distingue authenticated/nopriv, nonce, capabilities, validación, sanitización, escaping y exposición.

## Producción, dependencias y errores

Si el scope es deploy/production, revisa según stack debug/verbose errors, source maps o backups expuestos, directory listing, HTTPS, cookies, headers, admin exposure y servicios innecesarios. No impongas headers incompatibles sin entender la aplicación.

Revisa dependencias abandonadas o vulnerables solo con evidencia, duplicación y update posture sin recomendar `update everything` automáticamente. Diferencia error user-facing de diagnóstico interno: no filtres stack traces, tokens, headers de autorización, pagos, PII ni detalles internos innecesarios, pero conserva evidencia segura para diagnóstico.

## MCP y fallbacks

`tool can perform action != action is authorized`. Una capability capaz de editar usuarios, permisos, configuración, PHP, archivos o settings globales no amplía scope. Mantén BF-019: `specialized capability → safe generic capability → low-level fallback only when justified`; no caigas automáticamente a raw SQL, Execute PHP, shell, filesystem o metadata directa cuando exista una API segura y específica.

No requiere scanners, SaaS, Burp Suite, OWASP ZAP, SAST ni vulnerability database API. Pueden utilizarse si están disponibles y autorizados, pero no son dependencias del Blueprint.
