---
name: page-composition
description: Diseñar la macrocomposición y secuencia de páginas web visualmente importantes a partir de contenido, estrategia, UI Kit y assets. Activar para Home, landing, páginas corporativas/editoriales/services/portfolio/hospitality/inmobiliario o rediseño material; no para microcambios, metadata, composición Existing cerrada, aplicación SaaS/dashboard, réplica Strict definida o implementación frontend.
---

# page-composition

**Owner:** UI/UX Designer. Resuelve «¿cómo se convierte este contenido y sistema visual en una página excepcional?». No decide el design system (`ui-design-system`), no construye foundations (`ui-kit-construction`) ni implementa frontend (`frontend-builder`). Usa estrategia/contenido aprobados; no inventa negocio ni cambia su autoridad.

## Preflight

Reutiliza objetivo, audiencia, conversión/journey, copy, jerarquía editorial, UI Kit, referencias y assets disponibles. Identifica composición aprobada/Existing que deba preservarse y qué está abierto. Si una decisión estratégica material no está resuelta, eleva solo ese gap a Dev Lead; no uses composición para ocultarlo. Referencia Approved/Strict gobierna su scope. Nueva página no significa permiso para rehacer globals.

No activar para un CSS/copy change puntual, metadata, una página con composición cerrada que requiere cambio localizado, pantalla de aplicación (usa `application-ui`) o una referencia Strict completa sin libertad compositiva.

## Resolver la silueta de página

1. Define la prioridad visual y qué debe comprender/hacer la persona en el primer viewport; ordena después la página por su recorrido real, no por un inventario de componentes.
2. Agrupa contenido por propósito/relación y decide jerarquía entre secciones. Esboza una silueta/ritmo: anchuras, densidad, alineación, espacio, contraste y transiciones; permite variación intencional entre páginas de objetivos distintos.
3. Asigna media a su función: evidencia, atmósfera, producto, narrativa o comprensión. Coordina el placement/framing con `visual-art-direction` cuando la dirección de medios sea material; no sustituyas una imagen ausente con ornamento genérico.
4. Elige cada vez container restringido, full-bleed, grid editorial, split, asimetría, simetría o whitespace por contenido/identidad. Un statement, quote, cifra o media puede romper ritmo si tiene significado. El CTA/cierre se deriva del journey y no se repite mecánicamente.
5. Contrasta con UI Kit aprobado: reutiliza su gramática sin hacer que toda página tenga la misma silueta. No añadas card grids ni secciones solo para exhibir componentes.

## Evitar plantillas previsibles

No uses por default `hero → split text/image → three cards → section → CTA`. Antes de aceptar una fórmula, pregunta qué necesidad de contenido o conversión justifica cada sección y si dos regiones consecutivas tienen la misma densidad/composición sin motivo. Una fórmula puede ser correcta si el brief la sustenta.

Detecta y resuelve dentro de scope: composición intercambiable al cambiar copy/logo, todo centrado por comodidad, repetición de cards, headings grandes sin jerarquía, full-bleed sin contenido que lo amerite, whitespace vacío, densidad accidental o copy que gobierna mal el alto visual. No prohíbas cards, simetría, centrado, split layouts ni simplicidad; exige intención.

## Transformación responsive

Diseña tres estados conceptuales cuando el layout lo requiera: desktop → tablet → mobile. Mobile no es solo apilar desktop: prioriza orden/énfasis, reflow de grid, alineación, crop, solapes, ritmo y controles. Reordena o simplifica solo manteniendo contenido, journey y jerarquía; no escondas información necesaria. Deriva breakpoints de configuración/Existing y no añadas overrides si composición fluida ya resuelve.

## Check y stop

Antes de aprobar: prioridad visual clara; secuencia sigue el journey; estructura nace del copy/contenido; variación de ritmo intencional; assets aportan función; silueta reconoce el proyecto; mobile conserva jerarquía; no queda una sección genérica mejorable con assets/recursos disponibles. Si la respuesta es suficiente, detente: no abras loop de microajustes. Devuelve a Frontend la silueta, orden, anchos/relaciones clave, placement de media, variaciones responsive y constraints de la referencia en un handoff compacto, sin documento aparte salvo que sea un artefacto requerido.

**Fallo común:** retocar spacing local sin resolver la monotonía macro, añadir decoración para fingir composición o cambiar copy aprobado para hacer que el layout encaje. Si se requiere una concesión editorial, escálala; no la inventes.
