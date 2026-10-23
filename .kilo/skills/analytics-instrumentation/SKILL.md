---
name: analytics-instrumentation
description: Diseñar, implementar o depurar medición técnica de eventos/conversiones, GA4/GTM, dataLayer, SPA, formularios, e-commerce o consentimiento cuando el scope requiere instrumentación real. No activar para SEO general, cualquier CTA/web, performance ni discusión de KPI sin implementación.
---

# analytics-instrumentation

## Trigger y ownership

Actívala cuando el trabajo incluya implementación o debugging de event tracking, GA4/GTM/dataLayer, conversion measurement, ecommerce tracking, consentimiento aplicado a tags o un measurement plan técnico. No por la mera presencia de analytics en un proyecto, por cualquier CTA o porque se hable de objetivos/KPIs. Jefe de proyecto coordina; **Desarrollador es owner técnico** de instrumentación/product behavior. Contenido/SEO puede definir outcome e intención; no implementa tags. Maquetador interviene en el evento/UI solo si su implementación visual requiere exponer el comportamiento acordado; no es dueño del measurement plan. Arquitecto solo ante arquitectura real server-side, warehouse, multi-property/identity/pipeline. No crees property/container ni toques producción sin autorización.

Usa la cadena `business question/outcome → event → trigger → parameters → destination → verification`. Si no existe pregunta o decisión que el dato vaya a informar, no amplíes tracking. Aclara source-of-truth (GTM, tag/plugin, código, server event) y preserva la taxonomía/integración Existing; no combines fuentes que ya disparan los mismos eventos.

## Event contract

Cada evento aprobado define según necesidad: nombre semántico, condición/trigger, parámetros required/optional, fuente/contexto de identidad permitido, destino, estado key-event/conversion y deduplication. Nombres como `lead_submitted`, `quote_requested`, `product_viewed`, `checkout_started` o `purchase_completed` son ejemplos, no convención universal. Evita `click_1`, selector CSS frágil, event explosion o disparar cada click por comodidad. No cambies nombres/payload consumers Existing sin scope y compatibilidad.

Cuando exista Data Layer/event bus, prefiere evento semántico emitido por app/CMS a una inferencia sobre clases o copy. Documenta qué componente/backend lo emite y cuándo se considera verdad. Distingue interacción iniciada de resultado confirmado: un click al botón no es conversión si validación, petición o creación del lead/pedido todavía puede fallar.

## SPA, formularios y e-commerce

En SPA/client routing verifica route/history changes, page/screen tracking, title/location y pageviews duplicados; la instalación base no garantiza seguimiento correcto de cada navegación.

Para forms, modela viewed/started/validation error/submitted/accepted/lead created solo si esas etapas responden preguntas reales. Una conversión usa éxito confirmado por backend/CRM cuando esté disponible, no un click ni un submit que termina en error. No mandes raw form body, respuestas libres o campos sensibles.

Si WooCommerce/ecommerce está en scope, coordina `woocommerce` y reutiliza la integración/schema vigente. Identidad de producto, quantity, value/currency, transaction/order ID, replay/deduplication y refunds se verifican según objetivo; no envíes PII prohibida ni implementes un ecommerce schema manual por duplicado. No agregues server-side tracking, Measurement Protocol, Conversion API o sGTM por moda; si se requieren, define identity/dedup, autenticación/secret, retries, consentimiento y scope de forma explícita.

## Consentimiento, privacidad e integridad

Respeta mecanismo y configuración de consentimiento existentes: default state, tag/event gating, update/revoke y region si el proyecto los implementa. No inventes banner, configuración legal ni autorización; ante gate legal/privacy material, informa a Jefe de proyecto para decisión humana. Minimiza datos y nunca envíes passwords, tokens, payment data, raw form submissions ni email/teléfono/nombre u otra PII que la política/vendor no permita. IDs/identity siguen la política del proyecto. No expongas secrets ni autentiques tags del lado del browser con credenciales.

No retires una integración Existing para arreglar duplicados sin rastrear su owner. Busca double GA/GTM + direct tag, plugin + custom code, SPA pageview duplicado, evento client/server, purchase replay y retries; resuelve en la fuente del evento, manteniendo dedupe y flujo de negocio.

## Debugging, evidencia y source-grounding

Verifica la ruta completa `user action → event source/emission → payload → client/tag → destination/debug evidence`. Comprueba fires exactly when intended y no cuando no corresponde, parámetros, duplicados, consent gate, SPA state, error handling y ausencia de PII. Un evento visible en dataLayer/console demuestra emisión en esa capa, no recepción/procesamiento en GA/otro destino. Prefiere debug/preview, test property, sandbox o mock; producción solo con autorización.

GA4, GTM, vendor schemas, consent APIs y UI cambian. Si naming/reserved params, syntax, consentimiento o ecommerce schema depende de capability/version actual, detecta el producto/configuración y usa `source-grounded-development` con documentación primaria. No copies detalles volátiles al Core ni asumas que el vendor admite un dato. Coordina `api-integration` para una API externa real; `security-review` ante PII, secretos o endpoint sensible; `performance-review` solo si el tag causa bottleneck medible. `technical-seo` no posee instrumentation.

Informa event contract implementado, fuente, destino, consent behavior, evidencia por capa, duplicación detectada, pruebas y límites. Detén al cubrir acceptance; no exijas reporting UI de producción ni inventes propiedad de medición.
