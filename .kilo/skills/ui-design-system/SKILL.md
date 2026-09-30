---
name: ui-design-system
description: Crear o ampliar un design system para un proyecto web: tokens, tipografía, color, spacing, componentes, estados y reglas responsive. Úsala cuando se diseña desde cero o falta coherencia visual.
---

# ui-design-system

Deriva la dirección visual del objetivo, público, posicionamiento, contenido, identidad y fidelidad esperada. No uses tokens o componentes por costumbre ni conviertas azul, sans-serif, cards, radios y gradientes en una solución universal.

Define solo lo necesario para el alcance: tipografía, colores, spacing, radios, sombras, containers, botones, forms, cards, navegación, estados, breakpoints y restricciones de accesibilidad. Explica la intención de las decisiones relevantes para que Frontend pueda preservarlas.

Usa `config/responsive.json` en proyectos nuevos y la configuración vigente en proyectos existentes. Los breakpoints no obligan a crear overrides.

No conviertas una landing sencilla en una librería empresarial.

## Disciplina visual

Construye jerarquía visual deliberada: una prioridad dominante, escala tipográfica razonable, spacing con ritmo y composición que no dependa de cards genéricas, gradientes o headings enormes. Usa color con función —acción, estado, contraste o agrupación— y evita saturar la interfaz sin propósito. Asimetría, contraste y tratamiento editorial son herramientas cuando sirven al contenido, no fórmulas universales.

En una crítica visual detecta anti-patterns concretos —jerarquía plana, densidad accidental, alineaciones inconsistentes, controles con estados incompletos, texto difícil de leer, responsive que aplana la composición— y propone correcciones acotadas. El refinamiento es bounded: una pasada agrupada y una confirmación suelen ser preferibles a loops indefinidos; preserva contenido aprobado y scope del proyecto.

## Creative Direction proporcional

Activa esta profundidad cuando existan decisiones visuales significativas; una sección pequeña o un ajuste localizado puede usar solo el sistema vigente. No convierte BF-018 en más fases: prepara el criterio dentro de `Creative Direction` antes del prototipo de alta fidelidad.

1. **Jerarquía de fuentes.** Distingue identidad aprobada (logo, tipografía, colores o restricciones normativas), convenciones compartidas vigentes, composición heredada que puede revisarse, preferencias orientativas e inspiración externa. Registra qué se conserva y qué está abierto, con evidencia o limitación de acceso; una pantalla antigua no es automáticamente marca, y una referencia externa no desplaza la identidad aprobada.
2. **Tesis visual.** Expresa brevemente el carácter que sirve al público, posicionamiento y contenido; traduce cada adjetivo importante en consecuencias comprobables de jerarquía, imagen, color, tipografía, ritmo, composición o componentes. Si «premium» o «moderno» no cambia ninguna decisión observable, no aporta dirección. Distingue restricciones de preferencias y decisiones propuestas de decisiones aprobadas.
3. **Referencias con criterio.** Si existen y aportan, identifica patrones relevantes y decide `adopt`, `adapt` o `discard` según identidad, contenido aprobado, UX, stack, accesibilidad, rendimiento y alcance. Extrae principios, no copies layout, assets, copy, motion ni recursos visuales ajenos. Si dos referencias se contradicen, elige el lenguaje que respalda la tesis en vez de mezclarlas sin criterio.
4. **Reglas y anti-reglas.** Define solo las que vuelven implementable la dirección: jerarquía, tratamiento de imagen, carácter del spacing, comportamiento tipográfico, grid, uso del color y carácter de componentes. Las anti-reglas identifican específicamente lo que volvería genérico o incoherente *este* proyecto; no prohíbas universalmente cards, gradientes, asimetría, motion ni tipografía grande.
5. **Ruta y autoridad.** Si hay varias direcciones plausibles que cambiarían materialmente el resultado, selecciona una ruta visual y explica sus tradeoffs; no generes tres variantes ni maquetas por obligación. Si el criterio ya es claro, avanza. Distingue design system global (Theme Styles, tokens, clases compartidas, biblioteca Figma, style guide) de composición local; no cambies recursos globales para satisfacer un detalle de página sin alcance y autorización.
6. **Prototipo y motion.** Durante exploración puede existir HTML/CSS provisional, sin convertirlo en autoridad paralela. Usa `design/` y el artefacto visual existente para comunicar decisiones; no crees `DESIGN.md`, otro contrato o CSS normativo duplicado. Tras aprobación humana, el High-Fidelity Prototype es la referencia visual vinculante para implementación; el contenido aprobado sigue siendo fuente editorial. Motion solo si tiene intención y beneficio UX concretos, con claridad de interacción, accesibilidad, rendimiento y `prefers-reduced-motion`; no requiere Motion System por defecto.

Antes de entregar, contrasta tesis y reglas con al menos la composición prioritaria y su responsive: ¿son visibles las decisiones, respeta identidad y copy, es viable en el stack, conserva editabilidad y evita dispositivos visuales inventados? Documenta adaptaciones técnicas relevantes sin sustituir `visual-parity-review`, `webapp-testing` ni Human Visual QA. Detén el refinamiento cuando queden microajustes de bajo retorno, pero no ignores una diferencia material.
