---
name: web-strategy
description: Definir decisiones estratégicas abiertas de oferta, audiencia, conversión, arquitectura de información y URLs para sitios nuevos o cambios significativos; no usar para metadata aislada ni páginas ya decididas.
---

# web-strategy

## Activación y responsabilidad

Úsala principalmente desde `content-seo` cuando el encargo requiera decidir qué información necesita la web, para quién, con qué objetivo y en qué tipos de página o URLs. `dev-lead` coordina el alcance; `architect` recibe únicamente consecuencias estructurales o técnicas. Esta skill no sustituye la redacción de `content-seo`, las decisiones técnicas de `architect` ni la aprobación de decisiones comerciales por el usuario.

Aplica a sitios nuevos de varias páginas, cambios importantes de oferta o conversión, nueva arquitectura de información, rediseños significativos, replanteamientos de navegación, expansión editorial/SEO y reorganización de URLs. No se activa por erratas, mantenimiento técnico, cambios localizados, una página cuyo objetivo y contenido ya están aprobados ni SEO técnico o metadata sin decisiones estratégicas abiertas. Una landing pequeña con brief suficiente puede pasar directamente a contenido: no fuerces una consultoría.

## Descubrimiento proporcional

Empieza por objetivo y scope del encargo y por las fuentes vigentes; consulta solo lo que pueda alterar la decisión siguiente. Según aplique, considera oferta y claims confirmados, públicos prioritarios, problemas/necesidades, diferenciación demostrable, conversión principal, restricciones operativas/editoriales, contenido y URLs existentes. Usa analytics o datos de búsqueda solo si están disponibles y su consulta está autorizada; su ausencia no prueba que una URL carezca de valor.

No conviertas esos inputs en un cuestionario obligatorio. Distingue `confirmed` (evidencia o aprobación suficiente), `pending` (requiere validación), `assumption` (hipótesis de trabajo explícita) y `unavailable` (fuente no accesible). Pregunta solo por un vacío material que pueda cambiar oferta, conversión o estructura; no presentes precios, resultados, capacidades ni claims no confirmados como hechos. Si una decisión depende de un dato ausente, deja pendiente esa decisión y avanza en lo independiente.

## Procedimiento

1. Delimita oferta real, público y acción deseada; identifica qué dudas debe resolver la persona antes de actuar.
2. Relaciona necesidades y momentos de decisión con temas e intención de búsqueda cuando el SEO sea relevante. Contrasta relevancia y posible solapamiento entre páginas; no inventes volumen, tráfico o competitividad.
3. Propón tipos de página y organización de la información según objetivos y contenido, no una URL por keyword. Separa las URLs reales de los patrones de tipos de página.
4. Para cada página necesaria, conecta audiencia, propósito, intención, necesidades previas a conversión y CTA propuesto. Prioriza y señala dependencias y decisiones comerciales pendientes.
5. Si hay URLs publicadas afectadas, separa `inventory` (estado observado y cobertura), `proposed transition` (conservar, modificar, fusionar, retirar o redirigir con motivo) y `approved redirect/change` (decisión autorizada). La propuesta no ejecuta cambios de slug, redirecciones, indexación ni publicación; los cambios publicados requieren evaluación del impacto y aprobación.
6. Entrega a `architect` solo requisitos que impliquen modelo de datos, CPT, taxonomías, templates, rutas, integraciones o arquitectura. Una agrupación editorial o una keyword no crean automáticamente una entidad técnica.

El análisis del plugin SEO de BF-020 valida metadata y checks operativos, **no** sustituye estrategia de negocio ni intención de búsqueda. Protege el copy aprobado y trata las URLs publicadas conforme a su riesgo.

## Salida y fuentes de verdad

- **Landing pequeña:** basta un brief en la fuente editorial pertinente con audiencia, propuesta basada en hechos confirmados, intención si aplica, objetivo, conversión principal y estructura de contenido. No crear sitemap ni documento separado por rutina.
- **Sitio nuevo, rediseño o expansión:** cuando el alcance lo pida, producir un mapa legible de tipos de página y URLs con objetivo, audiencia, intención, necesidades previas a conversión, CTA, prioridad, dependencias y pendientes. El formato se adapta a los artefactos existentes; no se exige CSV ni un esquema universal.
- **Sitio publicado con transición:** inventario con cobertura y fuente, propuesta diferenciada y mapa de cambios/redirecciones solo tras aprobación. La ejecución y su QA pertenecen a la implementación autorizada, no a esta skill.

Distribuye hechos estables en `PROJECT.md`, alcance y criterios en `REQUIREMENTS.md`, estrategia editorial/mapa de contenido y copy en `content/`, consecuencias técnicas reales en `docs/architecture/` y decisiones importantes aprobadas en `DECISIONS.md`. No crees `STRATEGY.md` obligatorio ni registres cada keyword como decisión. Si el resultado es un entregable nuevo significativo, `dev-lead` mantiene `docs/ARTIFACTS.md` conforme a sus reglas; una respuesta acotada puede quedarse en la sesión.

## Comprobación de cierre

Comprueba que cada tipo de página propuesto responde a una necesidad real, que las afirmaciones tienen fuente o estado pendiente, que no hay canibalización evidente sin resolver y que ninguna recomendación de URL se presenta como redirección aprobada. Explica qué queda validado, qué depende del usuario y qué especialidad necesita actuar después; detente en el punto de entrega solicitado.
