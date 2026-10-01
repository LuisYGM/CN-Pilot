# Diagnóstico por capas de indexabilidad y rendering

Selecciona las capas relacionadas con el síntoma; no todas aplican a cada URL. Parte de la URL real y su arquitectura aprobada, no de una supuesta configuración del CMS. Distingue causa confirmada de hipótesis.

| Capa | Qué contrastar cuando corresponda |
| --- | --- |
| Petición/respuesta HTTP | URL solicitada y final, status, cadena de redirects, content type, cabeceras relevantes, disponibilidad y errores. Contrasta posibles soft errors con cuerpo, respuesta y evidencia del buscador; un HTML correcto no neutraliza un HTTP contradictorio. |
| Descubrimiento | Enlaces internos rastreables, sitemap XML, referencias a URL final y estados huérfanos. Que una URL exista no prueba que el buscador la haya descubierto. |
| Permiso de rastreo | Robots, recursos bloqueados, autenticación y bloqueos de servidor/CDN cuando haya indicios. Robots controla acceso de rastreo; no es equivalente a noindex ni seguridad. |
| HTML inicial | Contenido, enlaces y metadata recibidos sin interacción; conserva evidencia de entorno/estado. |
| DOM renderizado | Solo si JavaScript importa: compara contenido, enlaces, rutas directas y señales con HTML inicial; registra discrepancias y dependencia de interacción. Un navegador propio no reproduce necesariamente la vista procesada por Google. |
| Directivas de indexación | Meta robots y X-Robots-Tag emitidos, contradicciones y acceso necesario para leerlos. No bloquees rastreo esperando que el buscador lea un noindex oculto por el bloqueo. |
| Señales canonical | Canonical emitida, redirects, enlaces internos, sitemap y canonical seleccionada si existen datos. Distingue preferencia declarada y selección observada. |
| Acceso interno a estados | Facetas, parámetros, paginación y rutas persistentes: enlaces HTML, destinos rotos, cadenas o estados solo alcanzables tras interacción. |
| Indexación observada | Inspección de URL, informes o evidencia disponible, con fecha y límites. La prueba en directo, el sitemap enviado o una búsqueda aislada no certifican por sí solos el estado indexado actual. |

**Puede renderizar ≠ puede rastrear; puede rastrear ≠ puede indexar; indexable ≠ indexada.** El DOM observado hoy no prueba que Google indexara ese mismo estado. Disponibilidad, descubrimiento, indexación y rendimiento orgánico son cuestiones distintas.

## Facetas, parámetros y paginación

Strategy decide qué estados merecen intención y ownership independientes. SEO técnico comprueba su descubrimiento, rastreo, canonicalización e indexación respecto a esa decisión. No bloquees todos los parámetros, no apliques noindex universal a facetas ni consolides toda paginación en la primera página por receta.

Comprueba URL estable y enlaces hacia estados útiles; infinite scroll o botones no sustituyen automáticamente rutas rastreables. Identifica variantes redundantes sin perder filtros necesarios para usuarios. Si hace falta cambiar arquitectura aprobada, entrega evidencia y propuesta a Strategy antes de implementarla.

## Diagnóstico y cierre

Cruza fuentes solo cuando estén disponibles/autorizadas: respuestas, HTML, DOM, crawl, inspección de URL o logs. No presumas frecuencia de rastreo ni crawler verificado a partir de user-agent únicamente. Escala cambios de firewall/servidor y protección al responsable del stack; no cambies infraestructura para probar una hipótesis.

Entrega URL/clase, capa que falla, evidencia, alternativas, cambio propuesto y criterio de comprobación. Para cambios autorizados, verifica respuesta servida, señales afectadas y casos de regresión; revisa caché si puede explicar diferencias. Preserva copy/URLs aprobados y no retires noindex preventivo fuera del alcance.
