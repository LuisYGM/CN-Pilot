---
name: visual-parity-review
description: Comparar una implementación con una referencia visual aprobada mediante capturas/renders representativos y preparar un pase acotado de correcciones. Úsala únicamente cuando exista una referencia designada como source of truth; no para cualquier tarea frontend ni como sustituto de Human Visual QA.
---

# visual-parity-review

## Trigger y responsabilidad

Activa esta skill solo si existe una referencia visual aprobada: HTML/CSS aprobado, screenshot aprobado, diseño Figma aprobado, prototype aprobado u otra referencia explícitamente designada como source of truth. Su responsabilidad es `approved visual reference → implementation → representative capture/render → compare → batch findings → correction pass → confirmation pass → Human Visual QA`.

No evalúa principalmente si una aplicación funciona en runtime; para eso usa `webapp-testing` cuando aporte valor. No sustituye Structural QA, Accessibility QA ni la revisión visual humana.

En APPROVED IMPLEMENTATION compara el primer candidato completo con la fuente aprobada en una ronda cohesionada, con los viewports/estados y capturas necesarios; no reabre Creative Direction. La relectura estructural de cada safe write no exige otro pase visual completo. Agrupa findings y confirma áreas corregidas/regresiones pertinentes; amplía la ronda si cambió algo material o el riesgo lo exige, no por cada microajuste.

## Procedimiento

1. Confirma la referencia, el estado de la implementación, los viewports representativos y los breakpoints vigentes del proyecto. Si la referencia o la captura no son suficientemente fiables, detente en `Technical QA complete; Visual QA pending`.
2. Captura o inspecciona la implementación en estados y viewports representativos. Usa browser tooling si está disponible; si no, trabaja con renders/screenshot existentes y declara el límite de evidencia.
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

Registra referencia, viewports/estados, capturas usadas, diferencias relevantes, correcciones aplicadas y pendientes. `equivalent` describe la comparación realizada, no una garantía de pixel-perfect. No afirmes browser QA si solo hubo inspección de árbol, render técnico o fragmento de contenido.

Respeta contenido aprobado, design system, scope, layout-intent, BF-018 y BF-021. No uses esta skill para introducir CSS global, modificar recursos globales, reescribir copy o implementar funcionalidad productiva durante un prototipo.
