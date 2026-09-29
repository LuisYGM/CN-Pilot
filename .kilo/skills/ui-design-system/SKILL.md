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
