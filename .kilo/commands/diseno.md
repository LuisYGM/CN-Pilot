---
description: Define la dirección UX/UI y materializa el prototipo high-fidelity de páginas/interfaces web cuando corresponda, preservando la separación entre Design y Product.
agent: jefe-proyecto
---

# Design

1. Infiere si se necesita fidelidad `Structural`, `Visual` o `Implementation reference` sin pedir al usuario estas etiquetas. Una petición normal de diseñar una página de inicio/página visual se trata como `Visual` por defecto; no requiere que el usuario pida HTML o alta fidelidad con esos términos.
2. Inspecciona contexto y artefactos vigentes; evalúa de forma ligera objetivo, público, contenido, posicionamiento, plataforma/punto de entrega, identidad, assets, restricciones y referencias.
3. Pregunta únicamente por ausencias materiales, progresivamente y en lenguaje humano conforme a `.cn-pilot/documentacion/INTERACCION-HUMANA.md`. Las decisiones de composición, jerarquía, spacing, grids, tipografía, componentes y microinteracciones corresponden al diseñador; no repitas datos confirmados.
4. Delega a `disenador-ui-ux` y permite investigación externa de referencias cuando aporte valor; en greenfield guarda el análisis útil en `artefactos/diseno/referencias/` sin copiar diseños.
5. Usa `ui-design-system` si hace falta.
6. En greenfield guarda diseños de páginas en `artefactos/diseno/paginas/` y referencias visuales en `artefactos/diseno/referencias/`; crea las rutas solo cuando exista el primer artefacto. Preserva destinos existentes.
7. Si el especialista no puede escribir la ruta canónica, reporta el fallo de permisos y no reubiques el artefacto.
8. Documenta dirección visual, layout, componentes, responsive, estados, interacciones y assets sin cambiar identidad aprobada sin autorización. Para páginas/interfaces web de alta fidelidad, esa documentación Markdown es complementaria: no sustituye el prototipo evaluable.
9. No presentes un wireframe estructural como diseño final ni rebajes silenciosamente la fidelidad solicitada. Para scope visual/high-fidelity de una página web, el prototipo HTML de abajo es criterio de terminación: si hay solo `.md`, continúa la tarea con UI/UX en lugar de pedir reconfirmación.
10. Para interfaces web con alcance visual/high-fidelity, produce como entregable un prototipo web evaluable en HTML/CSS/JS responsive en `artefactos/diseno/paginas/` para greenfield. Markdown puede complementar, no sustituirlo. Imagen/render solo si la persona lo solicita. El prototipo es output de diseño, distinto de implementación en `producto/`; verlo/abrirlo como página real y responsive no cambia su ownership ni autoriza producción. Producto solo tras aprobación visual humana y solicitud/trigger de implementación. Permite assets visuales reales y una dirección única resuelta salvo que exista una decisión material abierta.
