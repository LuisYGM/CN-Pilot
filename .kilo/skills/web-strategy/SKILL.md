---
name: web-strategy
description: Definir decisiones estratégicas abiertas de oferta, audiencia, conversión, arquitectura de información y URLs para sitios nuevos o cambios significativos; no usar para metadata aislada ni páginas ya decididas.
---

# web-strategy

## Activación y responsabilidad

Úsala principalmente desde `content-seo` cuando el encargo requiera decidir qué información necesita la web, para quién, con qué objetivo y en qué tipos de página o URLs. `dev-lead` coordina el alcance; `architect` recibe únicamente consecuencias estructurales o técnicas. Esta skill no sustituye la redacción de `content-seo`, las decisiones técnicas de `architect` ni la aprobación de decisiones comerciales por el usuario.

Aplica a sitios nuevos de varias páginas, cambios importantes de oferta o conversión, nueva arquitectura de información, rediseños significativos, replanteamientos de navegación, expansión editorial/SEO y reorganización de URLs. No se activa por erratas, mantenimiento técnico, cambios localizados, una página cuyo objetivo y contenido ya están aprobados ni SEO técnico o metadata sin decisiones estratégicas abiertas. Una landing pequeña con brief suficiente puede pasar directamente a contenido: no fuerces una consultoría.

## Profundidad proporcional

Elige explícitamente el alcance de trabajo según las decisiones y el riesgo, no por la plataforma:

- **LIGHT:** landing, microsite pequeño, página individual u oferta/arquitectura ya decididas. Resume `audience`, `objective`, `conversion`, `search intent`, `page structure` y dirección de tema/keyword directamente en el artefacto de contenido. No crees `project-artifacts/content/strategy/` por rutina.
- **STANDARD:** greenfield de varias páginas, web corporativa nueva, varias URLs SEO, arquitectura/navegación abierta o nueva estructura editorial. Cuando facilite aprobación y handoff, crea un pack selectivo bajo `project-artifacts/content/strategy/`.
- **MIGRATION:** rediseño de sitio publicado, migración, consolidación o cambio significativo de arquitectura/URLs. Empieza por el estado actual y su evidencia antes de proponer destino. Usa `existing-site-audit` como baseline de solo lectura si el estado afectado no está claro; no dupliques su discovery.

`STANDARD` y `MIGRATION` pueden resolverse en la sesión si no se necesita un entregable reutilizable. El pack no es requisito para toda Strategy ni para landings. No bloquees por falta de datos SEO: avanza con hipótesis marcadas y `SEARCH EVIDENCE: UNVERIFIED` cuando corresponda.

## Descubrimiento proporcional

Empieza por objetivo y scope del encargo y por las fuentes vigentes; consulta solo lo que pueda alterar la decisión siguiente. Según aplique, considera oferta y claims confirmados, públicos prioritarios, problemas/necesidades, diferenciación demostrable, conversión principal, restricciones operativas/editoriales, contenido y URLs existentes. Usa analytics o datos de búsqueda solo si están disponibles y su consulta está autorizada; su ausencia no prueba que una URL carezca de valor.

No conviertas esos inputs en un cuestionario obligatorio. Distingue `confirmed` (evidencia o aprobación suficiente), `pending` (requiere validación), `assumption` (hipótesis de trabajo explícita) y `unavailable` (fuente no accesible). Pregunta solo por un vacío material que pueda cambiar oferta, conversión o estructura; no presentes precios, resultados, capacidades ni claims no confirmados como hechos. Si una decisión depende de un dato ausente, deja pendiente esa decisión y avanza en lo independiente.

## Procedimiento

El flujo es iterativo, no una puerta de fases rígida: `DISCOVER → SYNTHESIZE → SEARCH/INTENT MAP → INFORMATION ARCHITECTURE → URL OWNERSHIP → CONTENT PLAN → HUMAN DECISIONS → HANDOFF`. Puede volver entre temas, páginas y URLs cuando evidencia nueva cambie la recomendación.

1. Delimita alcance y nivel (LIGHT/STANDARD/MIGRATION), objetivo, oferta real, público y acción deseada; identifica qué dudas debe resolver la persona antes de actuar.
2. Sintetiza solo la interpretación estratégica que gobierna decisiones web; `PROJECT.md` conserva los hechos del proyecto. Distingue `confirmed`, `assumption`, `pending` y `unavailable`.
3. Cuando el SEO importe, conecta problemas/necesidades con temas e intención. Registra evidencia como `confirmed`, `inferred`, `researched`, `client-provided`, `analytics`, `search-console`, `keyword-tool` o `unverified`; no presentes inferencias como mediciones ni inventes volumen, CPC, competencia, dificultad o demanda.
4. Agrupa variantes con intención compartida por tema/cluster y asigna ownership a página. Antes de proponer una página, revisa si existe otra dueña de esa intención: `KEEP OWNER`, `MERGE`, `REPOSITION` o `CREATE NEW PAGE`. Una keyword no crea una URL. Distingue `search intent` (qué busca la persona) de `business goal` (qué necesita el negocio); ambos deben justificarse cuando aplique.
5. Propón arquitectura y páginas por necesidad, utilidad y conversión, no por keyword. Pregunta: ¿merece esta página una intención independiente de búsqueda/conversión? Si no, intégrala en otra. Para cada página estratégica registra propósito, audiencia, intención, conversión primaria y relación/página padre sin duplicar campos.
6. Asigna URLs descriptivas, cortas cuando sea práctico, estables y sin stuffing, fechas o IDs arbitrarios. La jerarquía solo se usa si ayuda. En sitios publicados, preservar URLs es el default cuando el beneficio no justifica el cambio; cambiar una URL requiere análisis de transición y aprobación, nunca cambia slugs publicados automáticamente.
7. Convierte la arquitectura en necesidades de contenido (mensaje, puntos de apoyo, pruebas requeridas, CTA y dependencias), no redactes copy final automáticamente.
8. En MIGRATION, conserva cobertura y procedencia del baseline; propone decisiones `KEEP`, `IMPROVE`, `MERGE`, `REDIRECT`, `RETIRE` o `REVIEW`, mapping old→new y redirect plan solo donde haya cambio real y equivalencia de intención. Ausencia de métricas no equivale a cero. No ejecutes redirects ni sugieras chains o redirecciones masivas a Home.
9. Entrega a `architect` únicamente consecuencias técnicas reales: CPT, taxonomías, templates dinámicos, rutas, filtros/búsqueda, modelo de datos, integraciones o arquitectura multilingüe. Una entidad de contenido no implica CPT.

### Investigación y casos condicionados

Similitud semántica no demuestra intención compartida. Con research autorizado, la composición/formato de SERP puede informar clustering junto a necesidad y oferta; no es una regla matemática universal. Sin investigación conserva `inferred`/`unverified`, no aparentes demanda medida.

Dos páginas que mencionan la misma keyword no prueban canibalización. Contrasta intención/propósito duplicado, ownership competidor, señales internas contradictorias y, si hay datos, URLs de ranking inestables o comportamiento SERP. Según evidencia propone `KEEP`, `REPOSITION`, `MERGE`, `CONSOLIDATE` o `REVIEW`; no fusiona contenido ni reabre arquitectura aprobada automáticamente.

Strategy define relaciones, prioridad y topic ownership; Content incorpora enlaces relevantes y SEO técnico comprueba enlaces rastreables, estados huérfanos y destinos rotos. Facetas/estados con intención propia se deciden aquí, no por una receta técnica de noindex. No crea otro mapa obligatorio de enlaces.

Research autorizado (SERP, competidores, tendencias, Search Console, analytics o herramientas de keywords) es opcional, no supuesto. Registra fuente, cobertura, fecha/contexto cuando importe y confianza. Sin datos, puede proponerse arquitectura provisional por oferta, audiencia e intención con evidencia de búsqueda no verificada. Competidores informan expectativas/ patrones; no se copian su copy, diseño ni IA.

En multilingual distingue arquitectura de contenido y mecanismo de localización de URLs; no asumas prefijos `/es/` `/en/` ni traduzcas mecánicamente el keyword map. La intención puede variar por mercado/idioma. En local SEO evita páginas doorway `servicio × ciudad` sin utilidad y diferenciación reales. En ecommerce cubre categorías, producto, información y páginas comerciales de forma proporcional; no conviertas cada keyword en categoría ni sustituyas `woocommerce`. Decide blog/recursos solo si hay propósito y capacidad editorial, no por default.

El análisis del plugin SEO de BF-020 valida metadata y checks operativos, **no** sustituye estrategia de negocio ni intención de búsqueda. Protege el copy aprobado y trata las URLs publicadas conforme a su riesgo.

## Salida y fuentes de verdad

- **LIGHT:** integra audiencia, objetivo, conversión, intención/tema y estructura en el brief de contenido; no crea un pack.
- **STANDARD:** un pack reutilizable es opcional y selectivo en `project-artifacts/content/strategy/`. Los artefactos responden preguntas distintas y no son un esquema obligatorio:
  - `STRATEGY-BRIEF.md`: decisiones estratégicas que gobiernan arquitectura (objetivo, oferta, audiencias/necesidades, diferenciadores y pruebas disponibles, conversiones, oportunidad/prioridades, restricciones, supuestos y pendientes). No es auditoría empresarial ni duplica `PROJECT.md`.
  - `SITEMAP.md`: jerarquía de información propuesta, razón de cada página y relaciones; no es un inventario de URLs ni una lista de keywords.
  - `URL-MAP.csv`: matriz operacional de páginas/URLs, parent, propósito, audiencia, intención, business goal/conversión, tema, prioridad y estado. Incluye solo columnas útiles.
  - `KEYWORD-MAP.csv`: clusters tema + intención + ownership de página, variantes y evidencia/confianza/estado. No incluir métricas no disponibles ni multiplicar URLs por keywords.
  - `CONTENT-PLAN.md`: qué necesita comunicar cada página (objetivo, audiencia, intención, mensaje principal, apoyos, prueba requerida, CTAs, SEO topic, dependencias y estado), no copy definitivo.
- **MIGRATION:** puede añadir `CURRENT-URLS.csv` (estado existente, fuente/fecha/cobertura, propósito, métricas opcionales y decisión propuesta) y `REDIRECT-MAP.csv` solo si cambian URLs. Distingue inventario observado, propuesta, aprobación y ejecución en estados separados; la falta de métricas queda vacía o `unavailable`, nunca como cero. Los mapas son planificación; no ejecutan redirecciones.

Los templates en `.blueprint/templates/strategy/` son estructuras iniciales opcionales: elimina secciones/columnas sin valor. Estados `DRAFT`, `APPROVED` y `SUPERSEDED` se usan solo cuando hagan falta. No cambies silenciosamente sitemap, URL map o keyword ownership aprobados: presenta evidencia y cambio material, solicita aprobación y luego actualiza.

Tras aprobar Strategy, `content-page` y `content-blog-seo` pueden usar el pack para producir copy en `project-artifacts/content/pages/` y `project-artifacts/content/blog/`; no muevas copy final a `project-artifacts/content/strategy/`. Mantén BF-018: `Final Content → Creative Direction → Prototype`. `technical-seo` recibe solo implicaciones aprobadas de URL, canonical, redirects, indexación, sitemap, schema ownership, paginación e idiomas. Strategy no implementa SEO técnico. En proyectos existentes preserva el layout editorial/documental vigente.

Distribuye fuentes: `PROJECT.md` → facts about the project; `REQUIREMENTS.md` → scope and acceptance; `project-artifacts/content/strategy/` → approved editorial/search architecture when created; `project-artifacts/content/pages/` y `project-artifacts/content/blog/` → copy; `project-artifacts/docs/architecture/` → technical architecture. No crees un documento obligatorio adicional ni registres keywords individualmente en `DECISIONS.md`. Si aparece un entregable significativo, `dev-lead` mantiene `ARTIFACTS.md` conforme a sus reglas; una respuesta acotada puede quedarse en la sesión.

## Comprobación de cierre

Comprueba que cada tipo de página responde a una necesidad real, search intent y business goal están diferenciados, ownership/canibalización no quedan ambiguos, métricas y fuentes son honestas, URLs existentes se preservan salvo transición justificada, y recomendaciones no se presentan como aprobaciones/ejecuciones. Escala decisiones materiales (nueva IA, borrar/consolidar páginas, URL publicada, oferta/audiencia y supuestos de alto impacto); no pidas aprobar cada keyword secundaria. Reporta validado, pendientes, especialidad siguiente y detente en el punto solicitado.
