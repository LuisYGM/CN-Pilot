---
name: accessibility-review
description: Revisar accesibilidad específica de UI y frontend: semántica, teclado, foco, formularios, nombres accesibles, contraste, movimiento y responsive. Úsala para requisitos a11y, WCAG, ARIA o interacción accesible; no para cualquier tarea frontend.
---

# accessibility-review

## Alcance y criterios aplicables

Usa WCAG 2.2 AA como referencia práctica cuando aplique, sin convertir cada cambio menor en una auditoría completa. Comprueba según scope: semantic HTML, landmarks, jerarquía de headings, nombres y descripciones accesibles, teclado, foco perceptible/orden/gestión/restauración, labels e instrucciones, errores recuperables, alt, contraste y señales que no dependan solo del color, botones/enlaces, dialogs/modals, menús, reduced motion, zoom/reflow, adaptación de viewport y targets táctiles/pointer.

Cuando la superficie los haga aplicables, incluye los criterios afectados de WCAG 2.2: foco no totalmente ocultado por sticky headers, banners, overlays o dialogs (**Focus Not Obscured**); **Redundant Entry** en procesos multi-step sin pedir de nuevo información ya disponible; **Accessible Authentication**, evitando puzzles/pruebas cognitivas innecesarios si existe un método accesible, y permitiendo mecanismos como paste/password managers cuando correspondan; alternativas de pointer para acciones de arrastre; propósito/autocomplete de inputs; identificación y recuperación de errores; y orientación/reflow sin perder función. Verifica navegación por teclado, orden y retorno del foco en cambios complejos solo cuando esa interacción esté en scope.

Cuando el Header persistente esté en scope, comprueba que no oculte el foco ni destinos de anchors (offset apropiado) y que la navegación siga accesible en mobile. Hover no sustituye `:focus-visible`; feedback equivalente de teclado debe ser perceptible. Hover no es el único canal de acción o información, y reduced motion conserva affordance/estado aunque reduzca transformaciones.

No trates la lista anterior como checklist global: delimita `scope/risk → criterios aplicables → evidencia proporcional`. No audites auth ni todos los formularios solo por existir una UI.

Prefiere HTML nativo antes que ARIA. Usa ARIA solo cuando el comportamiento nativo no resuelva la necesidad; ARIA no crea por sí sola comportamiento de teclado, foco ni presentación. Para `<dialog>` o modales verifica nombre accesible, foco inicial, fondo inerte/no disponible, cierre visible, Escape cuando corresponda y retorno lógico del foco. Para formularios conserva valores recuperables, asocia ayuda/errores cuando aporte valor y no dependas de color para comunicar estados.

## Evidencia proporcional

`automated scan != accessibility conformance`. Un scan puede aportar evidencia acotada —atributos faltantes, relaciones de labels, roles inválidos o algunos contrastes—, pero no demuestra comprensión de alt, orden de foco, contrato completo de un widget, recuperación de errores ni experiencia con lector de pantalla. Cuando el scope y las herramientas lo permitan, combina automated evidence + browser/accessibility-tree inspection + keyboard/manual evidence; registra navegador, estado, herramienta, alcance y resultados, incluidos bloqueados o no aplicables. No declares conformidad WCAG desde una única herramienta automática.

En responsive/input accessibility verifica zoom y reflow, textos que no se recortan, targets y alternativas a drag cuando correspondan, pointer/touch y reduced motion. Selecciona navegador/AT según audiencia y riesgo, no una matriz universal obligatoria.

Si hay WCAG contractual, documenta nivel y alcance.
