---
name: wordpress
description: Desarrollo y mantenimiento de WordPress usando APIs nativas, hooks, filters, CPT, taxonomías, WP_Query, REST, AJAX, opciones, roles y buenas prácticas. Úsala cuando la tarea afecte WordPress Core APIs o estructura de un sitio WordPress.
---

# wordpress

1. No modificar WordPress Core.
2. Inspeccionar tema, child theme, mu-plugins y plugins implicados.
3. Preferir hooks/filters y APIs oficiales.
4. Verificar contexto, capabilities y nonces.
5. Sanitizar entradas y escapar salidas.
6. Evitar queries innecesarias y lógica costosa en hooks globales.
7. No asumir que un builder controla toda la fuente de verdad.
8. Antes de cambios en DB/options, identificar rollback.
9. Verificar logs/errores apropiados al entorno.
