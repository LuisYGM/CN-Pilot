---
description: Prepara contenido y SEO para una página, sección o artículo.
agent: dev-lead
---

# Content

1. Identifica objetivo, pieza y audiencia.
2. Lee marca/contenido existente.
3. Delega a `content-seo`.
4. Usa `content-page` o `content-blog-seo`.
5. Guarda páginas en `content/pages/` y artículos en `content/blog/`.
6. Si el especialista no puede escribir la ruta canónica, reporta el fallo de permisos; no guardes el artefacto en `docs/` ni en otra carpeta.
7. No inventes claims o datos.
8. Para una TASK rutinaria de bajo riesgo, realiza una verificación básica e inspecciona los archivos. Si Git existe, revisa el diff y crea el commit local automático; sin Git finaliza correctamente sin commit. No actives Reviewer independiente por defecto.
9. Devuelve contenido listo para diseño/implementación y nunca hagas push automático.
