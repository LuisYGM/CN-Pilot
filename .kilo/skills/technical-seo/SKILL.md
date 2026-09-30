---
name: technical-seo
description: Revisar SEO técnico de un sitio: indexación, canonical, robots, sitemap, status codes, schema, headings, metadata y enlazado. Úsala para auditorías técnicas o cambios que afecten rastreo/indexación.
---

# technical-seo

Revisa según alcance: status codes, index/noindex, canonical, robots, sitemap, redirects, headings, metadata, schema, enlaces, facetas/paginación y rendimiento relevante.

Si existe un plugin SEO activo y expone capabilities de análisis, usa sus checks y recomendaciones como QA operativo: inspect current SEO → define target keyword → write authorized metadata → run plugin analysis → inspect failed checks → improve allowed fields → re-run analysis → report remaining checks. Prioriza la puntuación práctica más alta sin keyword stuffing ni deterioro de contenido o UX. Un score no es una métrica absoluta.

Protege el copy aprobado: metadata optimization no equivale a editorial rewrite. Trata con cautela slug de página publicada, schema destructivo e indexación; confirma index/noindex, follow/nofollow y canonical según scope. Si se activa un plugin, módulo o integración durante la sesión, reconecta MCP y repite Discovery antes de declarar que una capability SEO no existe.

No hagas cambios masivos de URLs sin plan de migración.

## Capa WordPress (solo con stack confirmado)

Antes de implementar, identifica el plugin SEO activo y qué emite realmente WordPress Core, el plugin, tema/builder y cualquier código custom. Asigna un solo responsable por cada función afectada: title/meta y social, robots, canonical, sitemap, schema, redirects, páginas de archivo, taxonomías, paginación y URLs multidioma cuando existan. Prefiere capability/configuración segura del plugin responsable, luego API/filtros públicos y WordPress Core; código custom únicamente si hay necesidad demostrada y no duplica la salida. No supongas plugins, endpoints ni meta keys a partir de nombres conocidos.

En cambios autorizados, lee recurso y configuración actual, conserva valores ajenos y prueba una muestra de tipos de URL y excepciones realmente afectadas. `configured != emitted correctly`: verifica según scope HTML head, canonical, robots/indexabilidad, JSON-LD sin duplicados ni datos inventados, sitemap, códigos HTTP y destinos de redirección, páginas de archivo/taxonomías/paginación o alternates multidioma. Comprueba que el resultado servido no sea una versión obsoleta de caché cuando importe. Una URL publicada, redirección o cambio de indexación exige plan y autorización proporcionales; no quites `noindex` por rutina. Mantén el análisis antes/después del plugin (BF-020) como QA adicional cuando esté disponible, no como sustituto de la salida real ni de la estrategia de `web-strategy`.
