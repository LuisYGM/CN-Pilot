---
name: visual-parity-review
description: Comparar implementación con referencia aprobada, priorizando inspección directa de HTML/DOM/CSS o evidencia visual según su formato, y preparar un pase acotado de correcciones. Úsala solo con referencia designada como source of truth; no para cualquier tarea frontend ni como sustituto de Human Visual QA.
---

# visual-parity-review

## Trigger y responsabilidad

Activa esta skill solo si existe una referencia visual aprobada: HTML/CSS/JS aprobado, screenshot aprobado, diseño Figma aprobado, prototype aprobado u otra referencia explícitamente designada como source of truth. Su responsabilidad es `approved visual reference → implementation → inspect/representative evidence → compare → batch findings → correction pass → confirmation pass → Human Visual QA`.

No evalúa principalmente si una aplicación funciona en runtime; para eso usa `webapp-testing` cuando aporte valor. No sustituye Structural QA, Accessibility QA ni la revisión visual humana.

En APPROVED IMPLEMENTATION compara el primer candidato completo con la fuente aprobada en una ronda cohesionada, con los viewports/estados y evidencia necesaria; no reabre Creative Direction. La relectura estructural de cada safe write no exige otro pase visual completo. Agrupa findings y confirma áreas corregidas/regresiones pertinentes; amplía la ronda si cambió algo material o el riesgo lo exige, no por cada microajuste.

## Procedimiento

1. Confirma la referencia, el estado de la implementación, los viewports representativos y los breakpoints vigentes del proyecto. Si la referencia o la evidencia disponible no son suficientemente fiables, detente en `Technical QA complete; Visual QA pending`.
2. Elige evidencia por tipo de referencia. Si la referencia aprobada es HTML/CSS/JS, inspecciona directamente su estructura, estilos/tokens, medidas/relaciones y responsive; compara con el DOM, CSS/computed styles, dimensiones y estados del browser cuando estén disponibles. No conviertas automáticamente referencia e implementación a PNG para compararlas. Si la referencia original es screenshot, imagen o Figma, una captura representativa de la implementación puede ser necesaria para comparar. Captura también ante petición explícita o cuando una diferencia materialmente visual no pueda demostrarse con evidencia más directa; evita screenshots por rutina.
3. Compara relaciones visuales, no solo presencia de elementos:
   - composición general y alturas de secciones;
   - widths, max-width, ratios de grid, proporciones y whitespace;
   - spacing horizontal/vertical y ritmo visual;
   - tipografía: familia disponible, tamaño, peso, line-height y letter-spacing;
   - colores, backgrounds, borders y radii;
   - imágenes, aspect ratio, object-fit y prominencia;
   - botones, métricas/números, alineaciones y jerarquía;
   - responsive: orden, colapso, legibilidad, relaciones y comportamiento.
4. Agrupa hallazgos relacionados y clasifica cada diferencia como `equivalent`, `minor difference` o `visible difference remaining`. No produzcas scores numéricos artificiales.
5. Ejecuta una única pasada agrupada de correcciones sobre diferencias concretas y una única pasada de confirmación. No reconstruyas automáticamente toda la página ni inicies loops indefinidos.
6. Si solo quedan microajustes de bajo retorno, repórtalos separadamente, distingue cualquier diferencia importante y detente para Human Visual QA. No declares paridad visual final sin la revisión humana correspondiente.

## Evidencia y límites

Registra referencia, viewports/estados, método/evidencia (y capturas solo si se usaron), diferencias relevantes, correcciones aplicadas y pendientes. `equivalent` describe la comparación realizada, no una garantía de pixel-perfect. No afirmes browser QA si solo hubo inspección de árbol, CSS o fragmento de contenido.

Respeta contenido aprobado, design system, scope, layout-intent, BF-018 y BF-021. No uses esta skill para introducir CSS global, modificar recursos globales, reescribir copy o implementar funcionalidad productiva durante un prototipo.
