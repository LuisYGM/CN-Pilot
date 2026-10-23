---
name: frontend-architecture
description: Definir e implementar arquitectura semántica y mantenible de HTML/CSS para frontend nuevo o reestructuras materiales, preservando stack y fidelidad visual aprobada.
---

# Arquitectura frontend adaptable

**Owner:** Maquetador frontend. Define cómo construir y mantener la interfaz; no sustituye Creative Direction, composición, UI Kit ni aprobación visual. Actívala para frontend custom nuevo o una reestructura material. Microcambios y Existing con arquitectura vigente reutilizan su estructura, salvo scope/migración expresos.

## Gramática conceptual

Como punto de partida, considera:

```text
section / región semántica y visual
→ container / ancho útil
  → column o layout block / agrupación lógica
    → contenido, widgets o acciones
```

Una `section` normalmente agrupa región, fondo y spacing exterior; un `container` define el ancho útil y centra cuando corresponde; una `column`/`block` relaciona contenido, media y acciones con Grid/Flex según el layout. Es una guía de responsabilidades, no una jerarquía DOM o un set de clases obligatorio. Una sección lineal puede no necesitar `.column`; una composición rica puede necesitar siblings, grids, full-bleed, sticky, overlap, collage, gallery, rail, timeline u otra estructura con función propia.

No fijes `max-width` universal (1400px incluido), un Container por cada hijo ni wrappers extra para ajustarte a un diagrama. Container variants se justifican cuando expresan anchos/layouts reutilizables. Cada wrapper debe tener responsabilidad real; evita `div soup` y profundidad innecesaria.

## Semántica y estructura

Elige elementos nativos por significado: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, listas, `form`, `button` y `a` cuando representen su función. Mantén la jerarquía de headings por estructura del documento, no por apariencia CSS; `button` es una acción y `a` navega. Prefiere semántica nativa antes de ARIA y no sacrifiques teclado/editabilidad por conseguir el mismo dibujo. Un `div` es válido si expresa agrupación/layout real.

Elige Grid para distribuir unidades bidimensionales y Flex para flujos lineales cuando corresponda. Un background full-bleed puede coexistir con contenido dentro de un container; el ancho del fondo no obliga a expandir texto/controles. Sticky, overlap, absolutes y layouts interactivos son válidos cuando expresan la Flagship, no reemplazos automáticos de un layout simple.

## Fuente de estilos compartida y de página

En Greenfield con CSS propio, identifica una fuente compartida para foundations, tokens y primitives que realmente se reutilizan; los estilos específicos de página consumen esa fuente y solo contienen composición, modules o estados propios. La fuente compartida sigue el mecanismo nativo del stack (globals, theme, tokens, styles entry, utility system o equivalente); **no se exige llamarla `system.css` ni crear otro build/dependency**. No dupliques palette, typography, buttons o componentes shared en cada página, ni promociones cualquier valor local a token.

Mantén CSS fuente legible, indentado y agrupado por responsabilidades. La minificación, si existe, es output del pipeline existente, no source manual. Usa selectors estables con naming por función; evita profundidad accidental, cascadas de `final-fixes`, y `!important` para resolver una arquitectura contradictoria. Es una guía: no migres frameworks/Existing ni cambies convenciones de builders fuera del scope.

Esta skill **no** define un contrato global de `<img>/<picture>` ni la estrategia de CSS backgrounds/loading: conserva la implementación vigente del proyecto; no adelantes Frontend Media/Fidelity futuros.

## Fidelidad de implementación

La Flagship/UI Kit visualmente aprobado y las referencias BF-048 dentro de authority/scope son la fuente de verdad. Maquetador implementa el resultado, no lo rediseña. Puede cambiar Grid/Flex, DOM, class naming o primitives si mantiene materialmente composición, jerarquía, typography, media treatment, interacción, motion, estados, responsive y accesibilidad. Si una limitación técnica exige modificar un aspecto material, devuelve evidencia/opción a Jefe de proyecto/Designer antes de desviarte; no simplifiques collage, sticky, split, story, full-bleed o media por comodidad.

Un blocker técnico material no autoriza drift silencioso: intenta una traducción equivalente y documenta causa/evidencia. Si aun así altera apariencia, comportamiento o responsive aprobado, detén solo la parte afectada y escala a Jefe de proyecto para resolver la dependencia/approval antes de implementar una alternativa material.

Approved/Strict conserva authority/fidelity; Existing conserva source architecture, clases/builder y globales. Application UI sigue su shell/datos/roles propios, no la composición de marketing. Para una página derivada, consume los globals/aprobados y no repite discovery. No crees Product ni alteres fuente sin scope/aprobación aplicable.

## Diversidad compositiva

Respeta la composición derivada de `creative-web-experience` + `page-composition`. El contenido dirige el módulo: split y cards sirven cuando son claros, pero no uses `texto+imagen`, grids de 3 cards y CTA como respuesta por defecto para cada sección. Patrones disponibles (no checklist): full-width, editorial/asymmetry, overlapping media, gallery/rail, timeline, before-after, comparison, slider/carousel, tabs/accordion, product wall, interactive map, typography-led, sticky story o modules mixtos. No añadas sliders/tabs/accordions/interactive modules para parecer creativo; el propósito, UX y diseño aprobado determinan su uso.

La variedad conserva una identidad compartida: tokens, typography, media language, motion y ritmo se mantienen coherentes mientras cambia la composición cuando el contenido lo requiere. Un sitio minimalista puede repetir un patrón intencionalmente; una diversidad forzada no es un objetivo de calidad.

## Visual Consolidation Pass

Cuando una implementación material ya alcanza fidelity suficiente y antes del cierre, haz una sola pasada focalizada por los archivos tocados: consolida overrides duplicados/patch piles, dead styles/scripts, selectors conflictivos o valores repetidos creados por la tarea, **sin cambiar apariencia ni behavior aprobados**. Si una limpieza cambiaría resultado visible, pide decisión antes de hacerla. Reprueba solo superficies afectadas. No es permiso para refactor general, nueva arquitectura de build ni migración Existing; si el source ya es claro y coherente, omite la pasada.

## Verificación proporcional y fast paths

Consulta `frontend-responsive` cuando el scope modifique responsive y `accessibility-review` cuando la interacción/accesibilidad se vea afectada. QA comprueba el árbol real, semántica, responsabilidades Section/Container/Column/Block, naming/source de estilos, wrappers justificados, Grid/Flex por intención, responsividad relevante, y fidelity a la Flagship en scope. No exige una suite de browser, benchmark, viewport matrix ni migración completa cuando el cambio no los necesita.
