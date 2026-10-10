---
name: woocommerce
description: Implementar o depurar comportamiento que depende de WooCommerce: productos/variaciones, carrito, checkout, pedidos, clientes, stock, emails, REST, webhooks o pagos. Úsala con WooCommerce confirmado y una operación de tienda real; la palabra “checkout” incidental no basta.
---

# woocommerce

## Preflight y fuente vigente

- Confirma versiones de WooCommerce, WordPress, PHP, extensiones relevantes, configuración de almacenamiento de órdenes (HPOS/legacy/compatibility), tipo de checkout activo (classic/blocks) y flujo de pedido/pago. Inspecciona el código, hooks, datos y convenciones existentes antes de cambiar; Existing prevalece.
- Para API, hook, compatibilidad o block checkout cuyo comportamiento pueda variar, verifica la documentación oficial de la versión/capabilities instaladas y prueba localmente. Fuentes de partida: [HPOS](https://developer.woocommerce.com/docs/features/high-performance-order-storage/) y [wc_get_orders/order queries](https://developer.woocommerce.com/docs/extensions/core-concepts/wc-get-orders/); contrasta la guía más específica del feature en cuestión. No fijes en esta skill firmas volátiles ni actualices stack por recomendación `latest`.
- Limita el alcance al feature. No configures impuestos, cupones, shipping, emails o pagos si no los requiere. Usa primero APIs WooCommerce/Core y extensiones ya presentes; no introduzcas dependencia o tablas custom por costumbre.

## Implementación por dominio

- **Orders/refunds:** usa `wc_get_order()`, `wc_get_orders()`/`WC_Order_Query`, CRUD del objeto (`get_`, `set_`, `update_meta_data()`, `save()`) y APIs de status. No asumas que una orden es `shop_order` en `wp_posts` ni leas/escribas su postmeta directamente. Si consultas metadata, confirma compatibilidad de query API con HPOS/versión; el acceso CRUD sigue preferido.
- **Products/variations/stock:** usa CRUD `WC_Product`/`WC_Product_Variation`, lookup APIs y operaciones de stock soportadas; respeta parent/variation, status, backorders y stock management configurado. No actualices stock con SQL/meta directa ni recalcules totals saltando taxes/discounts nativos.
- **Cart/checkout:** detecta classic shortcode vs Checkout Blocks y el punto extensible apropiado para ambos o declara alcance de compatibilidad. No asumas que un hook visual clásico corre en Blocks. Valida input, evita confiar en valores enviados por cliente y adjunta metadata solo al objeto de pedido vía APIs/hook soportado para ese flujo.
- **Lifecycle/hooks:** el orden de creación/pago/completado/refund y webhook puede disparar la misma acción más de una vez. Hooks deben ser acotados, registrar estado y tolerar repetición. Protege efectos externos con clave idempotente/registro persistente; revisa transiciones válidas antes de actuar y no supongas que “payment complete” equivale a fulfillment. Evita registrar hooks duplicados en bootstrap/múltiples instancias.
- **Payments/external callbacks:** no marques pagado por retorno del navegador; verifica callback/webhook autenticado conforme a gateway y estado del pedido, monto/moneda/ID esperados. Deduplica event/transaction ID, valida transición y separa respuesta al proveedor de efectos secundarios. Prueba staging/sandbox y eventos repetidos, fallidos, fuera de orden y timeout; nunca uses transacciones reales para QA.
- **Customers/data:** respeta guest vs usuario autenticado, ownership del pedido, capacidades/nonces en acciones autenticadas, privacidad/minimización y formatos de datos existentes. No expongas datos de cliente por ID adivinable o logs. Para endpoint REST usa permisos/schemas nativos; para datos sensibles activa `security-review` según riesgo.
- Usa APIs nativas para coupons/taxes/shipping/email si esos dominios están en scope; verifica configuración/reglas existentes y no recalcules a mano. Extensiones pueden alterar comportamiento: inspecciona compatibilidad y sus puntos de integración antes de tocarlo.

## Fallos, verificación y seguridad

- Maneja errores sin ocultarlos; conserva orden/pago en un estado recuperable, no dupliques cargos ni efectos de fulfillment ante timeout. Antes de reintentar una operación externa de resultado incierto, verifica estado/transacción con API autorizada; reintenta solo si es seguro e idempotente.
- Prueba versión/capability compatible, modo HPOS habilitado y legacy cuando la compatibilidad es requisito, guest/autenticado, estados de pedido relevantes, metadata persistida y visible en admin/API/frontend autorizados. Para checkout verifica el tipo de checkout requerido; pagos en sandbox con callback duplicado/replay y nunca cargo real. Fixtures no deben usar clientes/pedidos reales.
- Cubre persistencia tras reload/relectura del objeto (no solo callback), resultado final observable y que no haya duplicados/regresión de hooks. Si no existe staging/sandbox o el entorno carece de la extensión, informa esa limitación sin declarar esa ruta validada.
- `wordpress` aporta APIs/hooks generales cuando se necesite; `security-review` solo si auth, datos cliente, endpoints/webhooks/pagos exponen riesgo; `source-grounded-development` resuelve incertidumbre externa/versionada material. Dev Lead no activa toda la cadena por una tarea WooCommerce ordinaria. Cambios de pago/producción siguen sus gates de riesgo/autorización.
