# Checks SEO de transición dentro del deploy existente

Esta referencia aporta requisitos y verificación SEO; no administra lanzamiento, aprobaciones, rollback ni otro lifecycle. Reutiliza `existing-site-audit` para baseline y `web-strategy` MIGRATION para decisiones/mapping. Deployment conserva método, alcance, ejecución y recuperación; `database-migrations` solo entra si hay transformación persistente real.

## Antes de publicar

- Identifica superficies cambiadas y URLs/plantillas prioritarias del mapa aprobado; conserva procedencia y limitaciones del inventario. No exige métricas inexistentes.
- Describe comportamiento esperado OLD → NEW: conservar, redirect equivalente o retirada autorizada, status y destino final. El mapa de Strategy no ejecuta reglas.
- Contrasta staging/destino con baseline cuando sea viable: contenido/plantilla, respuesta, redirects/cadenas, canonical, robots/directivas, enlaces internos, sitemap XML, hreflang y schema. Selecciona checks por cambios reales, no una lista universal.
- Comprueba URLs finales y excepciones (parámetros, errores, idiomas, recursos) si están afectadas. No exige cambiar URLs solo por rediseñar.
- Entrega bloqueos, evidencia, límites y criterio de aceptación al preflight vigente. No quites autenticación/noindex de staging como parte del diagnóstico.

## Handoff y resultado servido

`technical-seo` especifica comportamiento SEO esperado → deploy ejecuta la transición autorizada → SEO técnico valida respuestas/señales públicas. Usa la misma autorización y recuperación del procedimiento vigente; un requisito nuevo fuera del alcance debe escalarse, no aprobarse por inferencia. Un commit o despliegue reportado no prueban la salida servida.

Comprueba después las URLs antiguas y nuevas afectadas: respuesta real, destino y saltos, canonical/indexabilidad, directivas, referencias internas y sitemap; añade idioma, schema y paridad de plantillas cuando cambien. Investiga caché si sirve el estado previo. Un 301 que termina en destino irrelevante no es éxito SEO.

## Seguimiento y recuperación

Con datos autorizados disponibles, contrasta crawl, errores, indexación, Search Console, Analytics y páginas prioritarias contra baseline usando [contrato de medición](search-data.md). Define ventana/cadencia por fuente, riesgo y actividad del sitio; no impongas porcentajes ni periodos universales. Variaciones inmediatas no demuestran pérdida permanente ni garantizan recuperación.

Ante bloqueo de producción, destino erróneo o regresión grave, registra evidencia y escala al responsable del deploy para su procedimiento de recuperación; no inicies un rollback SEO separado. Después verifica superficies recuperadas y límites reales. Revalida controles afectados y regresiones pertinentes, no toda la auditoría por defecto.
