---
name: performance-review
description: Diagnosticar rendimiento web medible y, cuando el stack sea WordPress/WooCommerce, revisar también queries, autoloaded options, object cache, cron y HTTP API. Úsala ante síntomas medibles, regresiones o una solicitud de optimización; no para cualquier cambio frontend.
license: GPL-2.0-or-later (conocimiento adaptado de wp-performance, WordPress Contributors; upstream snapshot, commit unknown)
---

# performance-review

## Web general

Mide antes de optimizar cuando sea posible y repite la misma medición después: queries/hooks, assets innecesarios, CSS/JS bloqueante, imágenes, fuentes, caché, terceros, payload, loading strategy, rendering y Core Web Vitals. Usa evidencia del mismo entorno, URL/route, estado de usuario y datos; no sacrifiques mantenibilidad por microoptimizaciones sin evidencia.

## Especialización WordPress/WooCommerce

Activa esta sección solo cuando el stack confirmado sea WordPress/WooCommerce. Investiga según el bottleneck: slow queries/N+1/meta queries, plugin/theme overhead, autoloaded options, object cache/transients, WP-Cron y llamadas externas mediante HTTP API. Query Monitor, `wp profile`, `wp doctor`, WP-CLI, Server-Timing y APM son herramientas opcionales: `tool available != tool required`; usa solo las disponibles, seguras y útiles para evidencia.

Procedimiento proporcional: confirma entorno y alcance, captura baseline, identifica una categoría dominante, cambia lo mínimo y repite la medición. En producción no instales plugins, habilites `SAVEQUERIES`, ejecutes load tests ni hagas flush de caché sin autorización; no ejecutes acciones destructivas o costosas solo para diagnosticar. Si no hay WP-CLI, no conviertas su ausencia en bloqueo ni inventes resultados.

No sacrifiques mantenibilidad por microoptimizaciones sin evidencia.
