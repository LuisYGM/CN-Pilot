---
name: page-composition
description: Diseñar la macrocomposición y secuencia de páginas web visualmente importantes a partir de contenido, estrategia, UI Kit y assets. Activar para Home, landing, páginas corporativas/editoriales/services/portfolio/hospitality/inmobiliario o rediseño material; no para microcambios, metadata, composición Existing cerrada, aplicación SaaS/dashboard, réplica Strict definida o implementación frontend.
---

# page-composition

**Owner:** Diseñador UI/UX. Resuelve «¿cómo se convierte este contenido y sistema visual en una página excepcional?». No decide el design system (`ui-design-system`), no construye foundations (`ui-kit-construction`) ni implementa frontend (`maquetador-frontend`). Usa estrategia/contenido aprobados; no inventa negocio ni cambia su autoridad.

## Preflight

Reutiliza objetivo, audiencia, conversión/journey, copy, jerarquía editorial, UI Kit, referencias y assets disponibles. Identifica composición aprobada/Existing que deba preservarse y qué está abierto. Si una decisión estratégica material no está resuelta, eleva solo ese gap a Jefe de proyecto; no uses composición para ocultarlo. Referencia Approved/Strict gobierna su scope. Nueva página no significa permiso para rehacer globals.

No activar para un CSS/copy change puntual, metadata, una página con composición cerrada que requiere cambio localizado, pantalla de aplicación (usa `application-ui`) o una referencia Strict completa sin libertad compositiva.

## Resolver la silueta de página

1. Define la prioridad visual y qué debe comprender/hacer la persona en el primer viewport; ordena después la página por su recorrido real, no por un inventario de componentes.
2. Agrupa contenido por propósito/relación y decide jerarquía entre secciones. Justifica función y composición de cada región material antes de elegir módulos. Esboza silueta/ritmo (anchuras, densidad, alineación, espacio, contraste, transiciones) y variación intencional. Considera, según contexto, editorial grids, controlled asymmetry, display type, capas, full-bleed/masked media, collage/mixed media, sticky/horizontal storytelling, scroll-linked media, grids irregulares, split-screen, typography sections, floating media, stacked panels, comparación interactiva, timelines, sistemas ilustrativos, macro-details, secuencias cinematográficas, media hover/focus, galerías, whitespace y progresión sticky. Es vocabulario, no checklist/templates; selecciona solo lo adecuado a contenido/marca/conversión/stack/uso/responsive.
3. Asigna media a su función: evidencia, atmósfera, producto, narrativa o comprensión. Coordina el placement/framing con `visual-art-direction` cuando la dirección de medios sea material; no sustituyas una imagen ausente con ornamento genérico.
4. Elige cada vez container restringido, full-bleed, grid editorial, split, asimetría, simetría o whitespace por contenido/identidad. Un statement, quote, cifra o media puede romper ritmo si tiene significado. El CTA/cierre se deriva del journey y no se repite mecánicamente.
5. Contrasta con UI Kit aprobado: reutiliza su gramática sin hacer que toda página tenga la misma silueta. No añadas card grids ni secciones solo para exhibir componentes. Detecta módulos repetidos por comodidad, varía ritmo intencionalmente y ubica un memorable moment cuando journey/contenido lo permitan; no es cuota ni espectáculo.

En public web abierto, `creative-web-experience` dirige los Concept Studies y Human Creative Review; esta skill recibe la Synthesis seleccionada para componer UNA Flagship completa usando el sistema ya derivado. Conserva por qué gana la silueta y qué alternativa macro se descartó, pero no repitas divergence ni conviertas los estudios en varias páginas completas. Páginas derivadas consumen la Flagship aprobada sin reabrir exploración si no hay novedad material.

## Evitar plantillas previsibles

No uses por default `hero → split text/image → three cards → section → CTA`. Antes de aceptar una fórmula, pregunta qué necesidad de contenido o conversión justifica cada sección y si dos regiones consecutivas tienen la misma densidad/composición sin motivo. Una fórmula puede ser correcta si el brief la sustenta.

Detecta y resuelve dentro de scope: composición intercambiable al cambiar copy/logo, todo centrado por comodidad, repetición de cards, headings grandes sin jerarquía, full-bleed sin contenido que lo amerite, whitespace vacío, densidad accidental o copy que gobierna mal el alto visual. No prohíbas cards, simetría, centrado, split layouts ni simplicidad; exige intención.

## Creatividad de módulos

Para cada grupo de contenido con peso real, decide qué forma lo comunica mejor en esta Flagship; no preguntes primero qué card component reutilizar. El repertorio incluye (solo si aplica): gallery/masonry, slider/carousel, rail de productos, grid de logos, tabs/accordion, timeline, before-after, comparison, interactive map/diagram, feature switcher, stats integradas, collage, media flotante, secciones tipográficas y secuencias sticky/horizontales. Cards y texto+imagen siguen siendo opciones válidas cuando resuelven el contenido. No añadas módulos, interacciones ni asimetría por cumplir una lista, y no conviertas diversidad en caos: conserva la gramática aprobada del sistema.

## Transformación responsive

Diseña tres estados conceptuales cuando el layout lo requiera: desktop → tablet → mobile. Mobile no es solo apilar desktop: prioriza orden/énfasis, reflow de grid, alineación, crop, solapes, ritmo y controles. Reordena o simplifica solo manteniendo contenido, journey y jerarquía; no escondas información necesaria. Deriva breakpoints de configuración/Existing y no añadas overrides si composición fluida ya resuelve.

## Check y stop

Cuando Greenfield/material rebuild implique traducir una Flagship aprobada a Product, el handoff no define el DOM final: Maquetador usa `frontend-architecture` para ownership Section/container/Block, sistema shared y estilos por página sin imponer wrappers. Conserva en runtime la variedad de ritmo, modules y transforms responsive de la composición aprobada; no reduzcas, por implementación cómoda, un slider/sticky/story/full-bleed a un patrón universal. Fast paths/derivadas sin cambios materiales no repiten ese contrato.

Antes de aprobar: prioridad visual clara; secuencia sigue el journey; estructura nace del copy/contenido; variación de ritmo intencional; assets aportan función; silueta reconoce el proyecto; mobile conserva jerarquía; no queda una sección genérica mejorable con assets/recursos disponibles. Si la respuesta es suficiente, detente: no abras loop de microajustes. Devuelve a Maquetador frontend la silueta, orden, anchos/relaciones clave, placement de media, variaciones responsive y constraints de la referencia en un handoff compacto, sin documento aparte salvo que sea un artefacto requerido.

**Fallo común:** retocar spacing local sin resolver la monotonía macro, añadir decoración para fingir composición o cambiar copy aprobado para hacer que el layout encaje. Si se requiere una concesión editorial, escálala; no la inventes.
