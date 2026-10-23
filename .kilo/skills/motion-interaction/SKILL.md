---
name: motion-interaction
description: Seleccionar, implementar y verificar motion e interacciones frontend desde CSS/native Web APIs hasta GSAP. Úsala para secuencias coordinadas, scroll interaction u otra complejidad que afecte fidelidad/mantenibilidad; no para hover o UI simple.
---

# motion-interaction

Opera BF-049 en una tarea frontend concreta. **Use the smallest capable tool that faithfully implements the already-defined experience**: native first si basta, specialized cuando el intent lo requiera, install on demand dentro del Product autorizado, remove cuando ya no se necesite. No rebajes choreography/scroll/behavior aprobados para evitar una dependency. Que GSAP o una librería esté disponible no es razón suficiente para adoptarla.

## Activación y selección

En una implementación material de Public Web abierta, la motion del BF-068 es parte del acceptance aunque la persona no diga «anima»; activa esta skill si el intent aprobado requiere choreography/scroll/interaction no trivial o lifecycle/performance/accessibility riesgo. Para microinteracción o transición trivial usa CSS/HTML existente sin cargar esta skill por asociación.

1. Define el intent antes del tooling: elemento, propósito, trigger, lifecycle, estados/secuencia, character/timing, scope, responsive, reduced-motion y comportamiento sin JS cuando sea razonable. Para public web Greenfield/material, `creative-web-experience` considera motion direction por default; aquí se decide implementación, no se reabre ambición.
2. Inspecciona stack, motion system actual, arquitectura Existing, references BF-048 y autoridad/fidelity de motion. Conserva un sistema Existing que funcione; no migres para preferir GSAP. Una referencia Approved/Strict rige su scope; una imagen estática no autoriza inventar motion y presentarlo como parte de la referencia. Declara cualquier motion nuevo como inferred/proposed.
3. Elige la capability mínima con base en complejidad, mantenibilidad, fidelidad, performance, accesibilidad, browser support, duración, responsive y scope. Compara alternativas solo si pueden cambiar la implementación.

## Personality e intención visual

Deriva, si está abierta, personality de brand signals: sobriedad, energía, precisión, editorialidad, organicidad, lujo, tecnología, juego o ritmo. Traduce a motion character/tokens (easing, tempo/duration family, distance, scale, stagger, overshoot/bounce, sequencing, scroll coupling) sin presets ni valores universales. Cadena: **brand signals → motion character → tokens → capability técnica**. Para Public Web abierta esta personalidad y el motion floor son obligatorios; intensidad sutil/minimal no equivale a `NONE`.

Motion character se decide en la dirección pública; `NONE/static` solo por opt-out explícito, Approved/Strict incompatible o constraint material confirmado y resuelto por Jefe. **Signature/memorable motion moment** se requiere en la Flagship abierta: specific al concepto y reconocible, no necesariamente espectacular ni una cuota de efectos. Evita el mismo `opacity + translateY + stagger` como lenguaje completo. Conserva **calm zones** en forms, pricing/checkout, comparación, lectura densa, decisiones críticas y legal/compliance: el resto de la página no queda por ello estático. `creative-web-experience` define intent/gate; esta skill implementa fielmente.

Un opt-out del usuario se aplica solo a los behavior/scope expresados: static/sin animación, únicamente microinteracciones o sin scroll motion tienen alcances distintos; no persuadas ni amplíes la preferencia. “No GSAP” restringe el mecanismo, no la experiencia: usa capability alternativa capaz o escala incompatibilidad real a Jefe.

## Public Web Motion System (BF-068)

Para public web Greenfield/rediseño material con dirección abierta, Motion System forma parte obligatoria del language desde Concept; `static/NONE` solo por opt-out explícito, authority incompatible o constraint material resuelto por Jefe. La Flagship ejecuta hero/page choreography intencional, al menos una progresión scroll-linked material que continúa después del Hero, behavior diferenciado para las secciones principales, microinteracciones y un memorable moment ligado al concepto. No aceptes fades genéricos repetidos ni motion solo en Hero. Busca deliberadamente cómo contar con el contenido/layout; “cuando el contenido lo permita” no elimina la obligación. No todo se anima ni existe una quota de efectos.

El UI Kit define el carácter/intent, timing/easing family, states, section/scroll behavior principal, calm zones y reduced-motion strategy; Flagship lo ejecuta salvo excepción. Primero define experiencia, luego escoge la herramienta menor capaz de implementarla fielmente. CSS/native son correctos si bastan; GSAP/otra capability se usa si intent complejo (timeline/pin/scrub/multi-stage/kinetic/SVG/media) lo requiere. No uses screenshots como evidencia de motion ni copies `fade-up + stagger` como idioma de marca. Esta skill gobierna implementación, lifecycle y QA real.

## Motion ladder

- **CSS:** hover/focus, opacity/transforms, transiciones simples, state changes, reveals pequeños y keyframes. No agregues JavaScript si CSS resuelve el caso claramente. Mantén un estado visible por defecto cuando sea esencial.
- **Native HTML + JS/TS/Web APIs:** semantic controls para accordion/tabs/menu/toggles; `IntersectionObserver` para reveals/reacciones acotadas; `Web Animations API` para uso pequeño; behavior coordinado de poco lifecycle y scroll-awareness modesta. No construyas una engine artesanal con setTimeout chains, múltiples scroll listeners, bookkeeping manual de timelines, observers duplicados o constants dispersas.
- **View Transitions API:** considera transiciones entre vistas/rutas o cambios de estado con continuidad visual cuando el router/browser target lo soporte y progressive enhancement/fallbacks sean adecuados. No la añadas para un hover ni como dependencia universal; compatibilidad y estado de la API se verifican si afectan acceptance.
- **CSS Scroll-Driven Animations:** puede resolver declarativamente un vínculo sencillo entre scroll y progreso/estado visual si el browser target y la intención lo permiten. No reemplaza automáticamente GSAP/native orchestration para choreography compleja, timelines multi-element, pin/scrub sofisticado, integración de estados ni requisitos de soporte incompatibles.
- **GSAP:** primera capability especializada a considerar cuando una interacción compleja exceda razonablemente native, por complejidad, fidelidad o mantenibilidad: timelines coordinadas, multi-stage sequences, scroll storytelling, scrub/pin, hero choreography, SVG/text sequencing, stagger complejo, media/estados coordinados. Ningún trigger obliga a GSAP; compara complejidad real y solución existente. Un hover, fade-in, menu, tooltip, accordion o ordinary reveal no lo justifica automáticamente.

View Transitions y Scroll-Driven Animations dependen del browser/stack target: si soporte, integración, lifecycle o API vigente cambia materialmente la decisión, consulta `source-grounded-development` con fuente primaria y evalúa progressive enhancement/fallback. No fijes una tabla volátil de compatibilidad en esta skill.

Con GSAP, organiza las fases relacionadas en una timeline con nombres/labels solo cuando ayuden a entenderla y una única ownership/lifecycle clara. Usa ScrollTrigger solo para behavior vinculado a scroll que lo necesite; crea triggers por elementos/zonas, conserva el scroll nativo y orden normal de creación según el DOM, evita llamadas pesadas por frame y usa markers solo para desarrollo. Pin/scrub/snapping requieren una razón UX y verificación de layout, scroll, responsive y reduced-motion. **Scroll animation no implica smooth scrolling**: no instales Lenis/ScrollSmoother ni hijackees la entrada por estética.

## Integración GSAP version-sensitive

Antes de una integración real, detecta stack, package manager, versión/configuración, loading pattern y si GSAP ya existe. Revisa documentación oficial vigente cuando los detalles version-sensitive sean materiales; no fijes versión/package/API en Core. Si el intent aprobado requiere dependency, instalarla técnicamente en el Product autorizado es decisión normal del owner: no pidas autorización duplicada por una dependencia reversible de implementación. Escala costo/licencia no aceptada, tracking/privacy, servicio externo o riesgo extraordinario. Instala GSAP/plugins solo en el Product/Design fixture scopeado, conserva manifest/lockfile, importa plugins usados y sigue code-splitting/tree-shaking. Nunca añadas dependency/CDN/script/node_modules a template CN Pilot.

- Static HTML/CSS/JS: carga local/deployada en el entry point adecuado, con inicialización idempotente y cleanup de listeners/instances; un CDN no es la ruta por default.
- Vite/webpack/build moderno: package/import normal en ese Product, sin añadir herramientas de build que no necesite.
- React: si la interacción GSAP es material y la integración oficial vigente lo recomienda, evalúa `@gsap/react`/`useGSAP` como ayuda React-specific; scopea al subtree y protege callbacks posteriores/event-created animations con `contextSafe` o el context API correspondiente. Limpia listeners manuales y considera Strict Mode/SSR/client boundaries del proyecto.
- Vue/Svelte/otros frameworks: liga creation/revert y listeners al lifecycle vigente del framework; no adoptes una wrapper sin necesidad.
- WordPress: encola/localiza runtime en la arquitectura activa y versiona assets adecuadamente; Bricks/Elementor mantienen su modelo editable, no se convierten en React. No dupliques scripts por template/elemento.

La fuente oficial actual de instalación/distribución e imports es <https://gsap.com/docs/v3/Installation/>; ScrollTrigger <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>; React <https://gsap.com/resources/React/>; licencia/availability <https://gsap.com/pricing/>. Estas páginas evolucionan: comprueba el estado actual cuando versión, package, plugin, framework integration o términos afecten la decisión. No registres en el Core un precio, versión o detalle que pueda quedar obsoleto.

## Reduced motion, accessibility y responsive

- Respeta `prefers-reduced-motion`: elimina/reduce desplazamiento, pin, scrub, parallax y secuencias decorativas según contexto; deja visible de inmediato el contenido, estado final y layout funcional. No inicialices `opacity: 0` de forma que el fallback quede invisible. En GSAP, `gsap.matchMedia()` puede crear/revertir setups por preferencia/breakpoint y recoge animations/ScrollTriggers creados en su handler; usa `revert()` al desmontar y elimina aparte listeners/side effects propios. No envuelvas MatchMedia en otro context si es redundante; revalida el patrón en la documentación oficial <https://gsap.com/docs/v3/GSAP/gsap.matchMedia/>.
- El propósito o información esencial no depende de observar animación. En marketing/static donde JS se usa principalmente para motion, contenido esencial queda visible si la animación no inicializa razonablemente; no significa que toda SPA deba funcionar sin JS. Conserva semántica, controles nativos, teclado/foco, tiempo razonable y acceso al contenido; motion no sustituye estados visibles ni confirmaciones. No uses flashing con riesgo de seizure.
- No diseñes acciones críticas solo con hover: soporta keyboard, focus, click/tap y pointer coarse según interacción. Respeta targets y navegación/anchors.
- Para controles interactivos, hover comunica cambio perceptible y usa transición CSS breve/natural cuando aplique; no requiere engine especializada ni un rango fijo universal. No uses `transition: all` por rutina ni permitas que hover cambie dimensiones/refluya contenido. El feedback no desaparece como affordance en touch y `prefers-reduced-motion` reduce movimiento material sin quitar el estado/indicio interactivo.
- No copies motion desktop ciegamente a mobile. Reduce distancia, duration/sequence, elimina pin/scrub pesado o cambia trigger si preserva intención y reference fidelity. Usa breakpoints vigentes en Existing/config en Greenfield.
- Si motion controla video/audio, verifica `preload`, poster/loading state, reglas muted/autoplay, `playsinline`, bandwidth/mobile, captions/transcript cuando apliquen y reduced motion. 3D/Canvas añade fallback y disposal/memory. Estas capacidades no autorizan recursos pesados solo por decoración.

Cuando aplique, coordina `accessibility-review`, `frontend-responsive`, `performance-review` y `webapp-testing`; no los actives como paquete por un hover trivial. Una automatización no demuestra conformidad WCAG.

## Performance y lifecycle

Prioriza transform/opacity si encajan con el efecto. Agrupa lecturas/escrituras DOM, limita observers/listeners, y carga/inicializa fuera de viewport o solo cuando el estado/route lo requiera si eso reduce costo. Evita animar continuamente layout (`width`, `height`, `top`, `left`) cuando transform resuelva; evita `will-change` global/permanente, docenas de layers, duplicate timelines, reinitialization accidental, listeners globales pesados y memory leaks. Son criterios contextuales, no prohibiciones absolutas: justifica una excepción.

Scopea timelines/selectors a su componente/root. En cleanup revierte/killea timelines y triggers propios, desconecta observers, elimina listeners, restaura estados/inline styles temporales y destruye/dispose instancias apropiadas. En modals, route changes, AJAX navigation, SPA/remount y builders verifica que no queden múltiples instancias. No llames cleanup global que mate animaciones de otros componentes.

Smooth scroll es una capability distinta de animar algo en scroll; mantiene scroll nativo salvo intención explícita y evidencia de UX. Si se justifica un runtime extra, comprueba keyboard/anchors/history, touch, reduced motion, mobile scroll/performance y cleanup antes de aceptar.

## Design → Product y QA

Para Public Web abierta, Motion System forma parte del UI Kit incluso si su expresión es precisa/sutil: expón specimens proporcionales de character, timing/easing, choreography, scroll/section behavior, interaction, mobile y reduced-motion; no una galería artificial. El prototipo puede usar el engine necesario bajo `artefactos/diseno/`, no `producto/`. La entrega registra intent, trigger/states, secuencia aprobada, reference authority/fidelity/scope, responsive/reduced-motion y capability cuando sea material. Product traduce fielmente al stack.

QA focalizado para el behavior implementado:

- La selección native/specialized tiene una razón clara; no se agrega una dependency si native basta.
- Inicio, progreso, reversa/interrupción y estado final son coherentes; scroll/resto de navegación funciona.
- Reduced motion deja contenido visible, estado correcto y layout estable.
- Responsive/mobile/touch simplifican sin romper intención/reference scope; keyboard/focus/semantic behavior siguen usables.
- Lifecycle/remount/route cleanup no duplica ni deja observers, listeners, triggers o styles temporales.
- Consola, errores de runtime, layout/overflow, carga de recursos y performance observada son proporcionales; compara pruebas bajo condiciones comparables, sin umbral universal de FPS ni telemetría persistente.
- References Approved/Strict se comparan solo en scope y con la fidelity declarada; no uses imagen estática como prueba de comportamiento.
- Confirma que dependency/import/config/runtime no queda huérfano. Retírala al desaparecer la necesidad solo dentro del scope autorizado.

Cuando la capability deja de ser necesaria, elimina su dependency, imports, initializers, listeners, assets y config propios seguros. No hagas migraciones de motion Existing sin razón material, evaluación del impacto y scope aprobado.

## Anti-patterns

- GSAP para un hover, reveal ordinario o accordion nativo.
- Importar disponible library solo para «estar preparados».
- GSAP como smooth-scroll por defecto o hijacking de scroll.
- Motion genérico `fade-up + stagger + parallax` para todas las marcas.
- Diseño/hand-off que oculta información esencial si JavaScript/motion falla.
- Timeline, event listener, trigger, will-change o plugin duplicado sin ownership/cleanup.
- Suponer que haber implementado motion equivale a reducir-motion, responsive, performance o QA aprobados.
- Crear skills completas de Three.js, Rive, D3, maps, media u otra categoría hasta un caso real que lo justifique.
