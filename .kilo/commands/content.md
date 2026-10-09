---
description: Prepara contenido y SEO para una página, sección o artículo.
agent: dev-lead
---

# Content

1. Clasifica primero alcance y riesgo como `DIRECT`, `TASK` o `STRUCTURAL`; el comando no impone una estrategia ni delegación editorial a cada petición.
2. Si es un microcambio inequívoco de contenido aprobado (p. ej., errata, dato confirmado o CTA exacto), sigue `DIRECT`: localiza la fuente exacta → modifica lo mínimo → verifica el texto afectado → commit local si corresponde → detente. Sin delegación, `web-strategy` ni documentación nuevos por rutina.
3. Para creación o reescritura editorial acotada, usa `content-seo` y la skill pertinente: página/sección → `content-page`; artículo → `content-blog-seo`. Incluye metadata, CTAs, enlaces o SEO solo si lo pide el alcance.
4. Si siguen abiertas decisiones materiales sobre oferta, audiencia, conversión, arquitectura de información, sitemap, intención/topics o URLs, coordina `content-seo` con `web-strategy` según su trigger. Para cambios técnicos de indexación/salida, activa `technical-seo` cuando corresponda; no conviertas metadata en estrategia de negocio.
5. Antes de preguntar, inspecciona contenido y contexto vigente; no inventes hechos empresariales, distingue lo confirmado y pregunta solo por vacíos materiales de forma progresiva según `.cn-pilot/docs/HUMAN-INTERACTION.md`. En greenfield guarda páginas en `project-artifacts/content/pages/` y artículos en `project-artifacts/content/blog/`; crea `project-artifacts/` solo al producir el primer artefacto. Preserva las rutas editoriales de sistemas existentes. Si un especialista no puede escribir la ruta canónica, reporta el bloqueo, sin reubicar el artefacto.
6. Verifica el resultado según clasificación y superficie; para una TASK rutinaria, commit local tras diff verificado si Git existe. No actives Reviewer independiente por defecto ni hagas push.
