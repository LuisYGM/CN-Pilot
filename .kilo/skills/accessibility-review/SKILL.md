---
name: accessibility-review
description: Revisar accesibilidad específica de UI y frontend: semántica, teclado, foco, formularios, nombres accesibles, contraste, movimiento y responsive. Úsala para requisitos a11y, WCAG, ARIA o interacción accesible; no para cualquier tarea frontend.
---

# accessibility-review

## Alcance

Usa WCAG 2.2 AA como referencia práctica cuando aplique, sin convertir cada cambio menor en una auditoría completa. Comprueba según scope: semantic HTML, landmarks, jerarquía de headings, nombres y descripciones accesibles, teclado, foco visible/orden/gestión y restauración, labels e instrucciones, errores recuperables, alt, contraste y señales que no dependan solo del color, botones/enlaces, dialogs/modals, menús, reduced motion, zoom/reflow, adaptación de viewport y targets táctiles/pointer.

Prefiere HTML nativo antes que ARIA. Usa ARIA solo cuando el comportamiento nativo no resuelva la necesidad; ARIA no crea por sí sola comportamiento de teclado, foco ni presentación. Para `<dialog>` o modales verifica nombre accesible, foco inicial, fondo inerte/no disponible, cierre visible, Escape cuando corresponda y retorno lógico del foco. Para formularios conserva valores recuperables, asocia ayuda/errores cuando aporte valor y no dependas de color para comunicar estados.

## Evidencia proporcional

`automated scan != accessibility conformance`. Un scan puede aportar evidencia acotada —atributos faltantes, relaciones de labels, roles inválidos o algunos contrastes—, pero no demuestra comprensión de alt, orden de foco, contrato completo de un widget, recuperación de errores ni experiencia con lector de pantalla. Cuando el scope y las herramientas lo permitan, combina automated evidence + browser/accessibility-tree inspection + keyboard/manual evidence; registra navegador, estado, herramienta, alcance y resultados, incluidos bloqueados o no aplicables. No declares conformidad WCAG desde una única herramienta automática.

En responsive/input accessibility verifica zoom y reflow, textos que no se recortan, targets y alternativas a drag cuando correspondan, pointer/touch y reduced motion. Selecciona navegador/AT según audiencia y riesgo, no una matriz universal obligatoria.

Si hay WCAG contractual, documenta nivel y alcance.
