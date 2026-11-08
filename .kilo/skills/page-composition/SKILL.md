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

1. Define qué debe comprender/hacer la persona al entrar y el orden real del recorrido; usa el contenido y el journey aprobado, no un inventario de componentes ni una secuencia de landing conocida.
2. Construye un mapa compacto por región: propósito/contenido; protagonista y jerarquía; relación texto-media; silueta/espacio/densidad; y relación de continuidad o contraste con la región anterior/siguiente. Ordena primero el sentido narrativo, luego el mecanismo visual. Puede ser una transición tipográfica, un full-bleed, una composición partida, galería, comparación, bloque sereno u otra respuesta; son opciones para resolver contenido concreto, no una librería de presets.
3. Decide placement y framing con `visual-art-direction` cuando los medios cambien materialmente la composición. Aclara qué debe comunicar el recurso y qué espacio/relación necesita con el texto; no cierres el layout dependiente antes de seleccionar el medio ni reemplaces un recurso ausente por ornamento genérico.
4. Elige container, full-bleed, grid, split, asimetría, simetría y whitespace por contenido/identidad. Un statement, quote o cifra puede romper ritmo si tiene significado. El CTA/cierre se deriva del journey y no se repite mecánicamente. Dos regiones pueden compartir composición si esa continuidad tiene función; si se repite por comodidad, reconsidera una de ellas sin añadir variedad forzada.
5. Consume el UI Kit aprobado sin hacer que toda página tenga la misma silueta; no añadas card grids/secciones solo para exhibir componentes. El Motion Floor aplicable pertenece al Core; esta skill coloca regiones, transiciones y calm zones en la narrativa y delega la coreografía/estados ejecutables a `motion-interaction`.

En public web abierto, `creative-web-experience` define la dirección; esta skill resuelve la experiencia completa pertinente al alcance con la gramática visual acordada. No crea una síntesis/aprobación intermedia ni una página por concepto. El movimiento debe acompañar las relaciones de la secuencia y las regiones diseñadas, no aplicar un reveal uniforme; la secuencia/trigger/estados reducidos se especifican en `motion-interaction`. Páginas derivadas consumen el comportamiento aprobado sin reinventar su lenguaje.

## Evitar plantillas previsibles

No uses por default `hero → split text/image → three cards → section → CTA`. Antes de aceptar una fórmula, pregunta qué necesidad de contenido o conversión justifica cada sección y si dos regiones consecutivas tienen la misma densidad/composición sin motivo. Una fórmula puede ser correcta si el brief la sustenta.

La numeración de secciones y los eyebrows/antetítulos son recursos opcionales, no scaffolding por posición. No marques 01/02 porque una región sea primera/segunda ni para simular una secuencia que el contenido no contiene; usa números cuando comunican pasos, cronología, ranking, capítulos o un sistema de índices de identidad. Un eyebrow debe aportar categoría, contexto, navegación editorial o una relación útil; no exijas uno por sección. Tampoco repitas la estructura `eyebrow → heading grande → párrafo` como fórmula universal: el heading puede ir solo, con introducción, lateral/superpuesto o integrado en el contenido según la semántica y el layout. La repetición puede ser correcta si la identidad/lectura la necesita. En Approved/Strict o Existing, conserva la numeración y etiquetas explícitas dentro de su authority/scope.

Detecta y resuelve dentro de scope: composición intercambiable al cambiar copy/logo, todo centrado por comodidad, repetición de cards, headings grandes sin jerarquía, full-bleed sin contenido que lo amerite, whitespace vacío, densidad accidental o copy que gobierna mal el alto visual. No prohíbas cards, simetría, centrado, split layouts ni simplicidad; exige intención.

## Creatividad de módulos

Para cada grupo de contenido con peso real, decide qué forma lo comunica mejor; no preguntes primero qué card component reutilizar. Una serie puede requerir cronología, comparación, galería o acciones; otras se leen mejor como texto/media simple. Las cards siguen siendo válidas cuando resuelven el contenido. No añadas módulos, interacciones ni asimetría por cumplir una lista y conserva la gramática aprobada del sistema.

## Transformación responsive

Diseña tres estados conceptuales cuando el layout lo requiera: desktop → tablet → mobile. Mobile no es solo apilar desktop: prioriza orden/énfasis, reflow de grid, alineación, crop, solapes, ritmo y controles. Reordena o simplifica solo manteniendo contenido, journey y jerarquía; no escondas información necesaria. Deriva breakpoints de configuración/Existing y no añadas overrides si composición fluida ya resuelve.

## Check y stop

Cuando Greenfield/material rebuild implique traducir una Flagship aprobada a Product, el handoff no define el DOM final: Maquetador usa `frontend-architecture` para ownership Section/container/Block, sistema shared y estilos por página sin imponer wrappers. Conserva en runtime la variedad de ritmo, modules y transforms responsive de la composición aprobada; no reduzcas, por implementación cómoda, un slider/sticky/story/full-bleed a un patrón universal. Fast paths/derivadas sin cambios materiales no repiten ese contrato.

Durante la composición, contrasta mapa y prototipo contra el journey y el contenido real: que cada región cumpla una función, los cambios de ritmo tengan motivo, los recursos pertenezcan a la escena y mobile mantenga la jerarquía. Es autocontrol del Diseñador dentro del trabajo, no una puntuación, checklist externo ni loop de QA estético. Devuelve a Maquetador la silueta/orden, relaciones espaciales, referencias concretas de media, transformaciones responsive materiales y decisiones abiertas/aprobadas; no adjuntes un documento aparte salvo que sea un artefacto requerido.

**Fallo común:** retocar spacing local sin resolver la monotonía macro, añadir decoración para fingir composición o cambiar copy aprobado para hacer que el layout encaje. Si se requiere una concesión editorial, escálala; no la inventes.
