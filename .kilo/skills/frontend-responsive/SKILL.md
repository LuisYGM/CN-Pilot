---
name: frontend-responsive
description: Implementar o revisar responsive, CSS Grid/Flexbox, tipografía fluida, breakpoints, imágenes, componentes y comportamiento móvil. Úsala para maquetación y problemas visuales responsive.
---

# frontend-responsive

1. Determina si el proyecto es nuevo o existente. En proyectos existentes, los breakpoints implementados son source of truth; no los reemplaces salvo solicitud o migración aprobada.
2. Para proyectos nuevos, lee `.cn-pilot/config/responsive.json` como fuente de verdad. No dupliques sus valores en otra configuración sin necesidad.
3. Construye la mayor parte del diseño en Base, sin media query, con estrategia `fluid-first`. Elige por intención: CSS Grid distribuye múltiples unidades en layouts bidimensionales; Flexbox resuelve flujos lineales sencillos. No cambies a Grid solo para cumplir una convención.
4. Prefiere cuando corresponda `clamp(min-px, fluid-vw, max-px)`, unidades relativas, `min()`, `max()`, `minmax()` y layouts intrínsecos. En proyectos existentes prevalece la convención vigente; `clamp()` es una preferencia, no un dogma.
5. Trata los breakpoints como overrides condicionales, no como fases. No añadas reglas si el diseño ya funciona.
6. Si utilizas media queries descendentes, genera sus `max-width` desde la configuración versionada.
7. Si el alcance incluye implementación directa en un builder configurable, mapea la convención al builder. Si termina en handoff manual, documenta la fuente de verdad para quien maquete después.
8. Conserva jerarquía, composición, proporciones, tipografía, spacing y comportamiento del diseño; no uses responsive como excusa para aplanar su intención visual.
9. Evita overflow horizontal y prueba textos largos, botones, formularios, estados, targets táctiles y foco visible.
10. Verifica únicamente los rangos y puntos de cambio relevantes para el componente.
11. Responsive QA también comprueba jerarquía, orden del contenido, spacing, tipografía, proporciones de imagen, colapso de Grid, tamaño de botones, legibilidad y ritmo visual; no confundas ausencia de overflow con fidelidad responsive.
