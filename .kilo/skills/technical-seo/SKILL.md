---
name: technical-seo
description: Revisar SEO técnico de un sitio: indexación, canonical, robots, sitemap, status codes, schema, headings, metadata y enlazado. Úsala para auditorías técnicas o cambios que afecten rastreo/indexación.
---

# technical-seo

Revisa según alcance: status codes, index/noindex, canonical, robots, sitemap, redirects, headings, metadata, schema, enlaces, facetas/paginación y rendimiento relevante.

## Selección de modo y alcance

- **FOCUSED:** URL, plantilla, síntoma o cambio delimitado. Comprueba únicamente las superficies pertinentes, diagnostica con evidencia y verifica lo afectado. Metadata puntual no activa auditoría formal; preserva DIRECT/TASK proporcional.
- **FORMAL:** auditoría técnica amplia, due diligence o evaluación pre/post-migración solicitada. Acuerda objetivo, superficies, muestra, datos disponibles, límites de acceso y periodo si importa. «Completa» siempre se refiere al alcance y muestra declarados, nunca a cobertura universal implícita.

## Trabajo y límites

1. Reutiliza baseline y arquitectura aprobados; no repitas discovery de `existing-site-audit` ni abras Strategy porque haya un hallazgo técnico.
2. Selecciona controles y referencias por tarea; recoge hechos observados separados de hipótesis y decisiones autorizadas. En FORMAL separa aplicabilidad de resultado y documenta cobertura, muestra y limitaciones.
3. Propón causa, cambio mínimo, dueño y criterio de verificación. Implementa solo dentro del alcance autorizado: Developer y skills del stack conservan implementación; WordPress no es requisito general.
4. Revalida controles afectados y regresiones relevantes; distingue cambio implementado de cambio verificado. Una auditoría propia no equivale a aprobación del Reviewer independiente.

Strategy conserva intención, ownership y arquitectura editorial/URLs. Esta skill comprueba comportamiento servido; no cambia ownership aprobado, copy ni slugs publicados por iniciativa propia. `performance-review` mantiene diagnóstico de rendimiento. Si datos SEO sugieren fricción en consulta → página → conversión, entrega a UI/UX evidencia, hipótesis y necesidad funcional; no prescribe composición ni rediseña.

## Referencias bajo demanda

Consulta solo las necesarias, no todo el directorio:

| Necesidad | Referencia |
| --- | --- |
| Auditoría FORMAL, cobertura, estados y hallazgos | [Método de auditoría](references/audit-method.md) |
| HTTP, descubrimiento, rastreo, HTML/DOM e indexación | [Indexabilidad y rendering](references/indexability-rendering.md) |
| Search Console, analítica, caídas y comparaciones | [Datos de búsqueda](references/search-data.md) |
| Schema, entidades, elegibilidad y generadores | [Datos estructurados](references/structured-data.md) |
| Idiomas/mercados, canonical y hreflang | [SEO internacional](references/international-seo.md) |
| Verificación de transición integrada al deploy | [Migraciones](references/migrations.md) |

Las herramientas, datos externos y validadores son opcionales; no inventes observaciones si faltan. Comprueba documentación oficial vigente durante la ejecución cuando elegibilidad, propiedades o comportamiento del buscador puedan cambiar. Los informes durables pueden guardarse en `docs/audits/<scope>/`; no crean memoria SEO ni otro lifecycle. Los templates en `templates/seo/` son opcionales y no una checklist universal.

Si existe un plugin SEO activo y expone capabilities de análisis, usa sus checks y recomendaciones como QA operativo: inspect current SEO → define target keyword → write authorized metadata → run plugin analysis → inspect failed checks → improve allowed fields → re-run analysis → report remaining checks. Prioriza la puntuación práctica más alta sin keyword stuffing ni deterioro de contenido o UX. Un score no es una métrica absoluta.

Protege el copy aprobado: metadata optimization no equivale a editorial rewrite. Trata con cautela slug de página publicada, schema destructivo e indexación; confirma index/noindex, follow/nofollow y canonical según scope. Si se activa un plugin, módulo o integración durante la sesión, reconecta MCP y repite Discovery antes de declarar que una capability SEO no existe.

No hagas cambios masivos de URLs sin plan de migración.

## Capa WordPress (solo con stack confirmado)

Antes de implementar, identifica el plugin SEO activo y qué emite realmente WordPress Core, el plugin, tema/builder y cualquier código custom. Asigna un solo responsable por cada función afectada: title/meta y social, robots, canonical, sitemap, schema, redirects, páginas de archivo, taxonomías, paginación y URLs multidioma cuando existan. Prefiere capability/configuración segura del plugin responsable, luego API/filtros públicos y WordPress Core; código custom únicamente si hay necesidad demostrada y no duplica la salida. No supongas plugins, endpoints ni meta keys a partir de nombres conocidos.

En cambios autorizados, lee recurso y configuración actual, conserva valores ajenos y prueba una muestra de tipos de URL y excepciones realmente afectadas. `configured != emitted correctly`: verifica según scope HTML head, canonical, robots/indexabilidad, JSON-LD sin duplicados ni datos inventados, sitemap, códigos HTTP y destinos de redirección, páginas de archivo/taxonomías/paginación o alternates multidioma. Comprueba que el resultado servido no sea una versión obsoleta de caché cuando importe. Una URL publicada, redirección o cambio de indexación exige plan y autorización proporcionales; no quites `noindex` por rutina. Mantén el análisis antes/después del plugin (BF-020) como QA adicional cuando esté disponible, no como sustituto de la salida real ni de la estrategia de `web-strategy`.
