---
name: performance-review
description: Diagnosticar rendimiento web medible y, cuando el stack sea WordPress/WooCommerce, revisar también queries, autoloaded options, object cache, cron y HTTP API. Úsala ante síntomas medibles, regresiones o una solicitud de optimización; no para cualquier cambio frontend.
---

# performance-review

## Web general

Mide antes de optimizar cuando sea posible y repite la misma medición después: queries/hooks, assets innecesarios, CSS/JS bloqueante, imágenes, fuentes, caché, terceros, payload, loading strategy, rendering y Core Web Vitals. Usa evidencia del mismo entorno, URL/route, estado de usuario y datos; no sacrifiques mantenibilidad por microoptimizaciones sin evidencia.

Separa **datos de campo** (usuarios observados, agregación, muestra y ventana temporal) de **laboratorio** (condiciones controladas para diagnóstico). Lighthouse no reproduce necesariamente experiencia real; no persigas 100/100 ni concluyas regresión universal si CrUX permanece estable. Compara periodos y condiciones, considerando demora/agregación de campo y variabilidad de laboratorio. No exijas herramientas, score ni budget universal.

Diagnostica la métrica afectada con evidencia: LCP puede depender de TTFB/response, resource discovery, prioridad/descarga y render delay; INP de input delay, procesamiento y presentación; CLS de dimensiones/espacio no reservado, fonts, ads/widgets, contenido tardío/inserciones dinámicas o animación que desplaza layout. Waterfall, trazas y pruebas controladas contrastan causas: correlación o score aislado no basta.

## Modelo por capas

Elige la capa que concuerda con el síntoma, sin convertir estas categorías en auditoría completa:

- **Browser/network:** respuesta del document/server, waterfall, discovery/priority, recursos bloqueantes, cache/compression, third parties, fonts, imágenes/media, bundles JS y payload CSS.
- **Main thread/JS:** long tasks, parse/compile/execute, hydration/client rendering, handlers, sync work, repeated observers/listeners y layout thrashing.
- **Rendering:** style recalculation, layout, paint/compositing, efectos costosos, animaciones trabadas o DOM grande solo cuando evidencia causal lo justifique.
- **Server/backend:** query/serialization, N+1, rendering del template, API/external HTTP latency, cache miss, workers y comportamiento bajo concurrencia si forma parte del problema.

Procedimiento: `medir → localizar la categoría dominante → hipótesis falsable → cambio mínimo → repetir medición comparable`. Conserva URL/route, entorno/versión, device/network profile y estado de usuario/datos; separa field y lab. Si no existe evidencia suficiente, formula una hipótesis y la medición que falta en vez de prescribir optimización por receta. Performance es el owner de la medición/cambio cuando hay síntoma, regresión o request explícito; una web no activa la skill solo porque deba ser rápida.

## Especialización WordPress/WooCommerce

Activa esta sección solo cuando el stack confirmado sea WordPress/WooCommerce. Investiga según el bottleneck: slow queries/N+1/meta queries, plugin/theme overhead, autoloaded options, object cache/transients, WP-Cron y llamadas externas mediante HTTP API. Query Monitor, `wp profile`, `wp doctor`, WP-CLI, Server-Timing y APM son herramientas opcionales: `tool available != tool required`; usa solo las disponibles, seguras y útiles para evidencia.

Procedimiento proporcional: confirma entorno y alcance, captura baseline, identifica una categoría dominante, cambia lo mínimo y repite la medición. En producción no instales plugins, habilites `SAVEQUERIES`, ejecutes load tests ni hagas flush de caché sin autorización; no ejecutes acciones destructivas o costosas solo para diagnosticar. Si no hay WP-CLI, no conviertas su ausencia en bloqueo ni inventes resultados.

No sacrifiques mantenibilidad por microoptimizaciones sin evidencia.
