---
name: frontend-responsive
description: Implementar o revisar responsive, CSS Grid/Flexbox, tipografía fluida, breakpoints, imágenes, componentes y comportamiento móvil. Úsala para maquetación y problemas visuales responsive.
---

# frontend-responsive

1. Determina si el proyecto es nuevo o existente. En proyectos existentes, los breakpoints implementados son source of truth; no los reemplaces salvo solicitud o migración aprobada.
2. Para proyectos nuevos, lee `.cn-pilot/config/responsive.json` como fuente de verdad. No dupliques sus valores en otra configuración sin necesidad.
3. Construye la mayor parte del diseño en Base, sin media query, con estrategia `fluid-first`. Elige por intención: CSS Grid distribuye múltiples unidades en layouts bidimensionales; Flexbox resuelve flujos lineales sencillos. No cambies a Grid solo para cumplir una convención.
4. Cuando CN use `clamp()` para fluidez, expresa sus límites mínimo y máximo en px (`clamp(20px, 3vw, 30px)` o `clamp(20px, calc(...), 30px)`). El valor fluido no tiene que ser `vw`; no todo necesita `clamp()`. `rem`, `em`, `%`, `vh`, `svh`, `dvh`, `ch` y `fr` siguen permitidos fuera de esos límites. Existing/Strict preserva su convención aprobada salvo migración explícita.
5. Trata los breakpoints como overrides condicionales, no como fases. No añadas reglas si el diseño ya funciona.
6. Si utilizas media queries descendentes, genera sus `max-width` desde la configuración versionada.
7. Si el alcance incluye implementación directa en un builder configurable, mapea la convención al builder. Si termina en handoff manual, documenta la fuente de verdad para quien maquete después.
8. Conserva jerarquía, composición, proporciones, énfasis, tipografía, spacing, media y carácter (BF-063); adapta la composición al viewport sin aplanar, centrar todo, homogeneizar secciones, reducir tipografía arbitrariamente ni reemplazar una composición rica por cards genéricas. Mobile no es excusa para ese rediseño. Si una transformación material es realmente necesaria para UX/función, sigue la intención definida por diseño y vuelve a Human Visual Review antes de considerar aprobada una apariencia materialmente distinta.
9. Evita overflow horizontal y prueba textos largos, botones, formularios, estados, targets táctiles y foco visible.
10. Verifica únicamente los rangos y puntos de cambio relevantes para el componente. Responsive QA usa el número mínimo: **máximo normal 3 viewports representativos por superficie afectada**, nunca tres por defecto ni una matriz universal. El tercero requiere breakpoint/layout/tablet behavior, finding o riesgo material. Si mobile y desktop evidencian el único cambio, detente; si responsive no está afectado, no uses browser viewport.
11. Responsive QA también comprueba jerarquía, orden del contenido, spacing, tipografía, proporciones de imagen, colapso de Grid, tamaño de botones, legibilidad y ritmo visual; no confundas ausencia de overflow con fidelidad responsive.
