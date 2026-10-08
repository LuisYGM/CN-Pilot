---
description: Prepara especificación UX/UI de una página o feature antes de maquetar.
agent: dev-lead
---

# Design

1. Infiere si se necesita fidelidad `Structural`, `Visual` o `Implementation reference` sin pedir al usuario estas etiquetas.
2. Evalúa de forma ligera objetivo, público, contenido, posicionamiento, plataforma/punto de entrega, identidad, assets, restricciones y referencias.
3. Pregunta únicamente por ausencias materiales. Las decisiones de composición, jerarquía, spacing, grids, tipografía, componentes y microinteracciones corresponden al diseñador.
4. Delega a `ui-ux-designer` y permite investigación externa de referencias cuando aporte valor; guarda el análisis útil en `design/references/` sin copiar diseños.
5. Usa `ui-design-system` si hace falta.
6. Guarda diseños de páginas en `design/pages/` y referencias visuales en `design/references/`.
7. Si el especialista no puede escribir la ruta canónica, reporta el fallo de permisos y no reubiques el artefacto.
8. Documenta dirección visual, layout, componentes, responsive, estados, interacciones y assets sin cambiar identidad aprobada sin autorización.
9. No presentes un wireframe estructural como diseño final ni rebajes silenciosamente la fidelidad solicitada.
10. Para interfaces web, especifica prototipo high-fidelity en HTML/CSS/JS en `design/pages/` por defecto; imagen/render solo si el usuario lo solicita. Permite assets visuales reales y una dirección única resuelta salvo que exista una decisión material abierta.
