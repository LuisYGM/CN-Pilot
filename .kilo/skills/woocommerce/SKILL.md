---
name: woocommerce
description: Desarrollo y revisión de WooCommerce: productos, carrito, checkout, pedidos, clientes, emails, HPOS, hooks, endpoints y extensiones. Úsala cuando una feature dependa de WooCommerce.
---

# woocommerce

1. Identifica versión/capacidades relevantes.
2. Usa APIs/CRUD de WooCommerce cuando existan.
3. Considera HPOS.
4. No dependas de tablas/postmeta internos si existe API soportada.
5. Valida estados de pedido y pagos.
6. Evita acciones duplicadas por hooks repetibles.
7. Revisa permisos para información de pedidos.
8. Prueba invitado/autenticado cuando aplique.
9. Cambios de checkout/pagos tienen riesgo elevado.
