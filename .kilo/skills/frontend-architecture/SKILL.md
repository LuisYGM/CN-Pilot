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

Una `section` normalmente agrupa región, fondo y spacing exterior/contextual; un `container` define el ancho útil y centra cuando corresponde; una `column`/`block` relaciona contenido, media y acciones con Grid/Flex según el layout. Cuando Column/Block agrupa hijos relacionados, `gap` es el mecanismo normal/preferido para spacing interno repetible si el layout lo permite. Margins siguen siendo válidos para flow editorial, componente específico, colapso intencional o spacing contextual. Es una guía de responsabilidades, no una jerarquía DOM o un set de clases obligatorio. Una sección lineal puede no necesitar `.column`; una composición rica puede necesitar siblings, grids, full-bleed, sticky, overlap, collage, gallery, rail, timeline u otra estructura con función propia.

No fijes `max-width` universal (1400px incluido), un Container por cada hijo ni wrappers extra para ajustarte a un diagrama. Container variants se justifican cuando expresan anchos/layouts reutilizables. Cada wrapper debe tener responsabilidad real; evita `div soup` y profundidad innecesaria.

## Semántica y estructura

Elige elementos nativos por significado: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`, listas, `form`, `button` y `a` cuando representen su función. Mantén la jerarquía de headings por estructura del documento, no por apariencia CSS; `button` es una acción y `a` navega. Prefiere semántica nativa antes de ARIA y no sacrifiques teclado/editabilidad por conseguir el mismo dibujo. Un `div` es válido si expresa agrupación/layout real.

Elige Grid para distribuir unidades bidimensionales y Flex para flujos lineales cuando corresponda. Un background full-bleed puede coexistir con contenido dentro de un container; el ancho del fondo no obliga a expandir texto/controles. Sticky, overlap, absolutes y layouts interactivos son válidos cuando expresan la Flagship, no reemplazos automáticos de un layout simple.

## Fuente de estilos compartida y de página

En Greenfield con CSS propio, identifica una fuente compartida para foundations, tokens y primitives que realmente se reutilizan; los estilos específicos de página consumen esa fuente y solo contienen composición, modules o estados propios. La fuente compartida sigue el mecanismo nativo del stack (globals, theme, tokens, styles entry, utility system o equivalente); **no se exige llamarla `system.css` ni crear otro build/dependency**. No dupliques palette, typography, buttons o componentes shared en cada página, ni promociones cualquier valor local a token.

Mantén CSS fuente legible, indentado y agrupado por responsabilidades. La minificación, si existe, es output del pipeline existente, no source manual. Usa selectors estables con naming por función; evita profundidad accidental y patch piles donde cada base/override/fix agrega otra cascada sobre la misma responsabilidad: ante correcciones acumuladas, revisa la causa y consolida. `!important` es excepcional en Greenfield propio, no está prohibido universalmente y puede ser válido para integrar third-party/builders, utility systems deliberados o helpers de accesibilidad; no lo uses para tapar una cascade propia mal resuelta. No cambies la apariencia ni el behavior aprobados al consolidar. Es una guía: no migres frameworks/Existing ni cambies convenciones de builders fuera del scope.

## Estrategia de media frontend

Para media representacional/de contenido en Greenfield, nuevas implementaciones y rebuilds materiales, prefiere `<img>`/`<picture>` o el primitive semántico optimizado equivalente del stack. Aplica a fotografía, producto, persona, proyecto, lugar, ilustración editorial y hero media; colocar una imagen detrás del texto no la convierte por sí solo en decoración. `background-image` sigue siendo válido principalmente para textura, patrón, ornamentación, ambient/background genuino o media sin significado semántico propio. Si el contenido visual funciona como fondo, una imagen real posicionada y recortada con `object-fit`/`object-position` puede conservar mejor semántica, responsive, loading y sizing; la estructura concreta depende del layout.

Usa `<picture>` cuando aporte art direction por breakpoint, format/source alternativo, crop/source distinto o una selección que `srcset` no resuelve suficientemente; no lo generes por rutina ni inventes variantes/rutas. Considera `srcset`, `sizes`, variants optimizadas/crops y source selection cuando el stack y los archivos reales los soporten. La media crítica del primer viewport/LCP no debe recibir lazy indiscriminado; elige solo los recursos adecuados al contexto. Lazy below-the-fold es válido cuando conviene, sin ignorar necesidades de interacción/framework/prefetch. Para dimensiones previsibles, usa `width`/`height`, `aspect-ratio` o equivalente nativo para reservar espacio sin deformar. Media informativa requiere alt contextual útil; media decorativa como `<img>` usa `alt=""`; nombres de logos/productos/personas dependen del contexto y de datos confirmados. Nunca rellenes alt con keywords.

Preserva asset, crop, framing, ratio, overlay, placement, art direction, video/poster y comportamiento responsive aprobados; no reemplaces un asset ni cambies a background por comodidad si pierde semántica, loading o source responsive. Existing conserva su arquitectura y convenciones cuando el scope no incluye refactor; no migra backgrounds en masa. En APPROVED/STRICT la autoridad de la referencia prevalece, incluyendo markup/background motivado materialmente. Application UI aplica semántica/performance razonable sin imponer art direction de marketing. Adapta tags/primitives a HTML/CSS, frameworks, WordPress o builder vigentes sin añadir CDN, paquete o build plugin por esta política.

## Fidelidad de implementación

La Flagship/UI Kit visualmente aprobado y las referencias BF-048 dentro de authority/scope son la fuente de verdad. Maquetador implementa el resultado, no lo rediseña. Puede cambiar Grid/Flex, DOM, class naming o primitives si mantiene materialmente composición, jerarquía, typography, media treatment, interacción, motion, estados, responsive y accesibilidad. Si una limitación técnica exige modificar un aspecto material, devuelve evidencia/opción a Jefe de proyecto/Designer antes de desviarte; no simplifiques collage, sticky, split, story, full-bleed o media por comodidad.

Un blocker técnico material no autoriza drift silencioso: intenta una traducción equivalente y documenta causa/evidencia. Si aun así altera apariencia, comportamiento o responsive aprobado, detén solo la parte afectada y escala a Jefe de proyecto para resolver la dependencia/approval antes de implementar una alternativa material.

Approved/Strict conserva authority/fidelity; Existing conserva source architecture, clases/builder y globales. Application UI sigue su shell/datos/roles propios, no la composición de marketing. Para una página derivada, consume los globals/aprobados y no repite discovery. No crees Product ni alteres fuente sin scope/aprobación aplicable.

### Conversión aprobada y Technical Normalization Pass

Si HTML/CSS/JS u otro frontend está designado como Approved para el scope y su conversión a Product está autorizada, preserva composición y comportamiento visual como source of truth, **no el código literal**. La autoridad visual aprobada no congela DOM, class names ni organización técnica. Sin preferencia distinta, recomienda internamente una conversión optimizada que conserve materialmente apariencia, responsive, media, interacción y motion mientras mejora lo que el stack destino necesita. Si la persona pide conservar estructura/clases salvo lo imprescindible, usa conversión fiel. Mejoras visuales (layout, paleta, type, spacing, crop, breakpoint, motion/UX o composición) requieren scope/autorización explícitos; “optimizar/refactorizar/profesionalizar/convertir a WordPress” no bastan. Son criterios de implementación, no un selector/wizard para la persona.

Si el source muestra dirección visual completa pero no se conoce su authority, inspecciónalo primero y resume problemas técnicos/mejoras reales; recomienda qué preservar y qué normalizar, y pregunta solo si falta esa decisión material. No repreguntes si la persona ya declaró approval/strictness o la intención se infiere con claridad.

En conversión optimizada realiza una pasada técnica focalizada sobre el scope fuente/target: semántica/DOM, foundations/tokens, primitives/components, CSS/JS, breakpoints/responsive, assets/loading, accesibilidad técnica y adaptación al stack. Cambia solo lo que aporte mantenibilidad, reuse, semantics, carga o correctness demostrable. Limpia dead code/reglas con evidencia de que no participan en el resultado. No es permiso para un refactor general ni una fase nueva.

Extrae tokens globales solo para roles/foundations compartidos, usando los valores aprobados originales. Nombres semánticos deben describir la función reutilizable, no una página/sección; misma cifra CSS no implica mismo token. Valores locales/component-only siguen siendo válidos y no hace falta tokenizar cada literal. No impongas una escala/tokens default ni crees `:root` de variables sin significado.

La extracción técnica de tokens dentro de Product no obliga a volver a Creative Direction, crear un UI Kit retroactivo ni activar `ui-kit-construction` si no se va a crear/modificar ese artefacto.

Extrae un componente cuando exista un patrón real compartido de presentación o comportamiento; no component-per-wrapper. Mantén separados shared foundations/primitives de composición propia de página. Organiza archivos/source entries según el pipeline nativo del stack: no existe árbol de archivos, metodología CSS, archivo por página ni bundle universal obligatorio. Cada página/template consume globals necesarios y añade únicamente estilos/scripts específicos útiles; fragmentación vs bundle se decide por caching, payload y mantenimiento reales. No añadas preprocessor, framework ni build system solo para normalizar.

Valores, clases, estructura y breakpoints del frontend Approved son la fuente inicial. No los sustituyas automáticamente por tokens, clases o `.cn-pilot/config/responsive.json`; mapea la configuración del target solo cuando respete los puntos de cambio y el comportamiento efectivo. Media queries pueden consolidarse si el comportamiento se conserva. En WordPress usa arquitectura nativa theme/template parts/enqueue sin copiar el HTML monolítico como único template cuando separar shell/units reales mejore el mantenimiento, pero no conviertas todo contenido a fields/CPT ni crees UI Kit retrospectivo. En Existing no apliques la normalización Greenfield automáticamente.

## Diversidad compositiva

Respeta la composición derivada de `creative-web-experience` + `page-composition`. El contenido dirige el módulo: split y cards sirven cuando son claros, pero no uses `texto+imagen`, grids de 3 cards y CTA como respuesta por defecto para cada sección. Patrones disponibles (no checklist): full-width, editorial/asymmetry, overlapping media, gallery/rail, timeline, before-after, comparison, slider/carousel, tabs/accordion, product wall, interactive map, typography-led, sticky story o modules mixtos. No añadas sliders/tabs/accordions/interactive modules para parecer creativo; el propósito, UX y diseño aprobado determinan su uso.

La variedad conserva una identidad compartida: tokens, typography, media language, motion y ritmo se mantienen coherentes mientras cambia la composición cuando el contenido lo requiere. Un sitio minimalista puede repetir un patrón intencionalmente; una diversidad forzada no es un objetivo de calidad.

## Visual Consolidation Pass

Cuando una implementación material ya alcanza fidelity suficiente y antes del cierre, haz una sola pasada focalizada por los archivos tocados: consolida overrides duplicados/patch piles, stale media/crop/responsive rules, reglas duplicadas de imagen responsive, dead styles/scripts, motion/CSS obsoletos, selectors conflictivos o tokens repetidos creados por la tarea, **sin cambiar apariencia ni behavior aprobados**. Si una limpieza cambiaría resultado visible, pide decisión antes de hacerla. Reprueba solo superficies afectadas. No es permiso para refactor general, nueva arquitectura de build ni migración Existing; si el source ya es claro y coherente, omite la pasada.

## Verificación proporcional y fast paths

Consulta `frontend-responsive` cuando el scope modifique responsive y `accessibility-review` cuando la interacción/accesibilidad se vea afectada. QA comprueba el árbol real, semántica, responsabilidades Section/Container/Column/Block, naming/source de estilos, wrappers justificados, Grid/Flex por intención, responsividad relevante, y fidelity a la Flagship en scope. No exige una suite de browser, benchmark, viewport matrix ni migración completa cuando el cambio no los necesita.
