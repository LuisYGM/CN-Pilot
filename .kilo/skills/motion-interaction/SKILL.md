---
name: motion-interaction
description: Seleccionar, implementar y verificar motion e interacciones frontend desde CSS/native Web APIs hasta GSAP. Úsala para secuencias coordinadas, scroll interaction u otra complejidad que afecte fidelidad/mantenibilidad; no para hover o UI simple.
---

# motion-interaction

Opera BF-049 en una tarea frontend concreta. **Use the smallest capable tool**: native first, specialized when justified, install on demand, remove when no longer needed. Que GSAP o una librería esté disponible no es razón suficiente para adoptarla.

## Activación y selección

Actívala cuando motion/interaction sea parte material de la intención visual o comportamiento, supere una interacción nativa rutinaria, use timelines/scroll coordinado, presente lifecycle/performance/accessibility risk o requiera capability especializada. Para hover, focus, toggle o transición simple, CSS/HTML existente normalmente basta.

1. Define el intent antes del tooling: elemento, propósito, trigger, lifecycle, estados/secuencia, character/timing, scope, responsive, reduced-motion y comportamiento sin JS cuando sea razonable.
2. Inspecciona stack, motion system actual, arquitectura Existing, references BF-048 y autoridad/fidelity de motion. Conserva un sistema Existing que funcione; no migres para preferir GSAP. Una referencia Approved/Strict rige su scope; una imagen estática no autoriza inventar motion y presentarlo como parte de la referencia. Declara cualquier motion nuevo como inferred/proposed.
3. Elige la capability mínima con base en complejidad, mantenibilidad, fidelidad, performance, accesibilidad, browser support, duración, responsive y scope. Compara alternativas solo si pueden cambiar la implementación.

## Motion ladder

- **CSS:** hover/focus, opacity/transforms, transiciones simples, state changes, reveals pequeños y keyframes. No agregues JavaScript si CSS resuelve el caso claramente. Mantén un estado visible por defecto cuando sea esencial.
- **Native HTML + JS/TS/Web APIs:** semantic controls para accordion/tabs/menu/toggles; `IntersectionObserver` para reveals/reacciones acotadas; `Web Animations API` para uso pequeño; behavior coordinado de poco lifecycle y scroll-awareness modesta. No construyas una engine artesanal con setTimeout chains, múltiples scroll listeners, bookkeeping manual de timelines, observers duplicados o constants dispersas.
- **GSAP:** primera capability especializada a considerar cuando una interacción compleja exceda razonablemente native, por complejidad, fidelidad o mantenibilidad: timelines coordinadas, multi-stage sequences, scroll storytelling, scrub/pin, hero choreography, SVG/text sequencing, stagger complejo, media/estados coordinados. Ningún trigger obliga a GSAP; compara complejidad real y solución existente. Un hover, fade-in, menu, tooltip, accordion o ordinary reveal no lo justifica automáticamente.

Con GSAP, organiza las fases relacionadas en una timeline con nombres/labels solo cuando ayuden a entenderla y una única ownership/lifecycle clara. Usa ScrollTrigger solo para behavior vinculado a scroll que lo necesite; crea triggers por elementos/zonas, conserva el scroll nativo y orden normal de creación según el DOM, evita llamadas pesadas por frame y usa markers solo para desarrollo. Pin/scrub/snapping requieren una razón UX y verificación de layout, scroll, responsive y reduced-motion. **Scroll animation no implica smooth scrolling**: no instales Lenis/ScrollSmoother ni hijackees la entrada por estética.

## Integración GSAP version-sensitive

Antes de una integración real, detecta stack, package manager, versión/configuración, loading pattern y si GSAP ya existe. Revisa la documentación oficial vigente y la compatibilidad pertinente; no uses snippets antiguos de memoria ni fijes versión/package/API en Core. Instala GSAP y plugins únicamente en el Product/Design fixture que los necesite, conserva manifest/lockfile nativos, registra/importa solo plugins usados y sigue code-splitting/tree-shaking del proyecto. No añadas dependency, CDN, script o `node_modules` al template CN Pilot.

- Static HTML/CSS/JS: carga local/deployada en el entry point adecuado, con inicialización idempotente y cleanup de listeners/instances; un CDN no es la ruta por default.
- Vite/webpack/build moderno: package/import normal en ese Product, sin añadir herramientas de build que no necesite.
- React: si la interacción GSAP es material y la integración oficial vigente lo recomienda, evalúa `@gsap/react`/`useGSAP` como ayuda React-specific; scopea al subtree y protege callbacks posteriores/event-created animations con `contextSafe` o el context API correspondiente. Limpia listeners manuales y considera Strict Mode/SSR/client boundaries del proyecto.
- Vue/Svelte/otros frameworks: liga creation/revert y listeners al lifecycle vigente del framework; no adoptes una wrapper sin necesidad.
- WordPress: encola/localiza runtime en la arquitectura activa y versiona assets adecuadamente; Bricks/Elementor mantienen su modelo editable, no se convierten en React. No dupliques scripts por template/elemento.

La fuente oficial actual de instalación/distribución e imports es <https://gsap.com/docs/v3/Installation/>; ScrollTrigger <https://gsap.com/docs/v3/Plugins/ScrollTrigger/>; React <https://gsap.com/resources/React/>; licencia/availability <https://gsap.com/pricing/>. Estas páginas evolucionan: comprueba el estado actual cuando versión, package, plugin, framework integration o términos afecten la decisión. No registres en el Core un precio, versión o detalle que pueda quedar obsoleto.

## Reduced motion, accessibility y responsive

- Respeta `prefers-reduced-motion`: elimina/reduce desplazamiento, pin, scrub, parallax y secuencias decorativas según contexto; deja visible de inmediato el contenido, estado final y layout funcional. No inicialices `opacity: 0` de forma que el fallback quede invisible. En GSAP, `gsap.matchMedia()` puede crear/revertir setups por preferencia/breakpoint y recoge animations/ScrollTriggers creados en su handler; usa `revert()` al desmontar y elimina aparte listeners/side effects propios. No envuelvas MatchMedia en otro context si es redundante; revalida el patrón en la documentación oficial <https://gsap.com/docs/v3/GSAP/gsap.matchMedia/>.
- El propósito o información esencial no depende de observar animación. Conserva semántica, controles nativos, teclado/foco, tiempo razonable y acceso al contenido; motion no sustituye estados visibles ni confirmaciones. No uses flashing con riesgo de seizure.
- No diseñes acciones críticas solo con hover: soporta keyboard, focus, click/tap y pointer coarse según interacción. Respeta targets y navegación/anchors.
- No copies motion desktop ciegamente a mobile. Reduce distancia, duration/sequence, elimina pin/scrub pesado o cambia trigger si preserva intención y reference fidelity. Usa breakpoints vigentes en Existing/config en Greenfield.
- Si motion controla video/audio, verifica `preload`, poster/loading state, reglas muted/autoplay, `playsinline`, bandwidth/mobile, captions/transcript cuando apliquen y reduced motion. 3D/Canvas añade fallback y disposal/memory. Estas capacidades no autorizan recursos pesados solo por decoración.

Cuando aplique, coordina `accessibility-review`, `frontend-responsive`, `performance-review` y `webapp-testing`; no los actives como paquete por un hover trivial. Una automatización no demuestra conformidad WCAG.

## Performance y lifecycle

Prioriza transform/opacity si encajan con el efecto. Agrupa lecturas/escrituras DOM, limita observers/listeners, y carga/inicializa fuera de viewport o solo cuando el estado/route lo requiera si eso reduce costo. Evita animar continuamente layout (`width`, `height`, `top`, `left`) cuando transform resuelva; evita `will-change` global/permanente, docenas de layers, duplicate timelines, reinitialization accidental, listeners globales pesados y memory leaks. Son criterios contextuales, no prohibiciones absolutas: justifica una excepción.

Scopea timelines/selectors a su componente/root. En cleanup revierte/killea timelines y triggers propios, desconecta observers, elimina listeners, restaura estados/inline styles temporales y destruye/dispose instancias apropiadas. En modals, route changes, AJAX navigation, SPA/remount y builders verifica que no queden múltiples instancias. No llames cleanup global que mate animaciones de otros componentes.

Smooth scroll es una capability distinta de animar algo en scroll; mantiene scroll nativo salvo intención explícita y evidencia de UX. Si se justifica un runtime extra, comprueba keyboard/anchors/history, touch, reduced motion, mobile scroll/performance y cleanup antes de aceptar.

## Design → Product y QA

Motion System solo entra en UI Kit si materialmente define la dirección; expón los specimens necesarios (character, duration/easing, reveal, hover, transition/scroll y reduced-motion según necesidad), no una galería artificial. El Design prototype puede usar el engine necesario para demostrar la interacción esencial y sigue bajo `project-artifacts/design/`, no `product/`. El handoff registra intent, trigger/states, secuencia aprobada, reference ID/authority/fidelity/scope, responsive/reduced-motion y capability seleccionada cuando sea material. Product traduce al stack y arquitectura vigentes.

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
