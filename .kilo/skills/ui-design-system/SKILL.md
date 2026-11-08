---
name: ui-design-system
description: Crear o ampliar un design system para un proyecto web: tokens, tipografía, color, spacing, componentes, estados y reglas responsive. Úsala cuando se diseña desde cero o falta coherencia visual.
---

# ui-design-system

Deriva la dirección visual del objetivo, público, posicionamiento, contenido, identidad y fidelidad esperada. Para public web nueva/rediseño material, `creative-web-experience` posee ambición e intención creativa; esta skill define el sistema visual sin duplicar investigación ni aprobación. No uses tokens o componentes por costumbre ni conviertas azul, sans-serif, cards, radios y gradientes en solución universal.

En Greenfield con nueva dirección, define un sistema apropiado al proyecto, sin convertirlo en librería enterprise; en Existing hereda la fuente vigente. Cuando haya que crear foundations/UI Kit o modificar materialmente tokens globales/primitives, usa obligatoriamente `ui-kit-construction` como fuente operativa para el Kit. La decisión visual sigue siendo propia de esta skill.

## Design System como fuente de verdad

El Design System es el sistema visual propio de cada proyecto y la fuente de verdad de sus decisiones: identidad/principios, foundations/tokens, componentes y reglas de uso, solo hasta la profundidad que el proyecto necesite. Deriva los foundations pertinentes (p. ej., color semántico, tipografía/fluidez, spacing/dimensiones, grid/containers, borders/radius/sombras, responsive, iconografía/lenguaje gráfico y motion cuando corresponda); no completes categorías sin una necesidad real ni fijes valores genéricos.

El UI Kit forma parte de ese Design System: es su representación visual, navegable e interactiva, no un segundo catálogo ni una librería universal. Los specimens muestran tokens, componentes, variantes y estados realmente definidos por el sistema y consumen su fuente canónica; ningún identifier/valor compartido debe editarse en dos sistemas independientes. En Design-only, el Kit puede alojar esa fuente activa. Cuando Product exista, los tokens/componentes se expresan en el source nativo del stack y el Kit consume, deriva o verifica esos mismos datos mediante una única dirección de actualización. La traducción entre formatos debe tener un dueño y mapeo explícitos; no impongas generator, formato o ruta universal. Product nunca depende en runtime de `artefactos/`.

El contrato de autoridad y momento visual de BF-066/BF-048 se mantiene intacto: esta fuente define el sistema a partir de la dirección visual decidida, sin exigir una fase de Visual Synthesis o reiniciar Creative Direction. En Existing, Approved/Strict o páginas derivadas conserva el sistema vigente y solo lo extiende dentro del scope autorizado.

Usa `.cn-pilot/config/responsive.json` en proyectos nuevos y la configuración vigente en proyectos existentes. Los breakpoints no obligan a crear overrides.

No conviertas una landing sencilla en una librería empresarial.

## Autoridad del sistema y orden visual (BF-046/BF-066)

BF-046 conserva el UI Kit como autoridad/foundation y sus checks actuales. En public web Greenfield/rediseño material con dirección abierta, define primero la dirección visual y deriva foundations/Kit cuando el scope lo requiera; no construyas un Kit genérico para descubrir el lenguaje ni exijas una fase intermedia de conceptos/síntesis. El Kit se revisa internamente y se presenta con la propuesta final cuando aplique. Application UI, Kit standalone solicitado, Approved/Strict y Existing system-first conservan su orden/gates propios y fast paths; no se ejecuta Visual Pipeline público sin su trigger. `ui-kit-construction` rige la construcción técnica cuando su trigger aplica; esta skill conserva la autoridad de sistema. No generes componentes de dominio hipotéticos ni framework universal. Ningún approval amplía scope ni publica.

En el scope Public Web, combina la gramática/brand signals aprobados con el floor BF-068 del Header/Mobile Header/Footer, tratamiento de media, motion intent e icon family, sin convertirlos en presets ni modificar sus derechos/autoridad. La construcción técnica de specimens, motion y assets sigue en sus skills owner.

### Construcción del UI Kit

Los detalles de foundations, tokenización, specimens, primitives, estados e implementación visual pertenecen exclusivamente a `ui-kit-construction`. No copies su checklist aquí. Usa un Kit pequeño, neutral y no-domain-specific; sus decisiones se derivan del sistema visual, no se vuelven una Home ni un template universal.

## Expresión contextual y rigor del sistema

Calidad no equivale a moderación. Deriva jerarquía, tipografía, escala, color/intensidad, densidad, spacing y composición de la identidad, el contenido, el objetivo, el uso, el sistema aprobado y las condiciones responsive; ninguno tiene que ser contenido, simétrico, de baja intensidad o convencional. Display typography extrema, paletas intensas, densidad rica, capas, full-bleed, asimetría, overlapping, grids irregulares o tratamiento editorial son opciones válidas cuando expresan la dirección y siguen siendo legibles/usables; la moderación tampoco es un objetivo obligatorio.

Define un sistema con criterios verificables —roles/tokens coherentes, contraste y foco accesibles, estados pertinentes, jerarquía entendible para su contenido, responsive funcional y fidelidad a referencias Approved/Strict o continuidad Existing— en sus fuentes canónicas. El Diseñador responde por su criterio y entrega; la persona valora si la dirección estética le satisface. No conviertas preferencias de estilo (intensidad, escala, densidad, simetría, cards, gradientes o motion) en defectos por sí solas ni abras ciclos automáticos para puntuar o refinar creatividad. Corrige omisiones objetivas del sistema dentro del autocontrol profesional y escala conflictos de autoridad/scope según el Core.

## Creative Direction proporcional

Activa esta profundidad cuando existan decisiones visuales significativas; una sección pequeña o un ajuste localizado puede usar solo el sistema vigente. En public web abierto, `creative-web-experience` define research y dirección; convierte esa intención en reglas visuales. La comparación de conceptos o síntesis solo ocurre cuando sirve al encargo, no como aprobación intermedia. No adelantes tokens/Kit a decisiones de marca aún no tomadas ni agregues variantes conceptuales por rutina.

1. **Consume autoridad e intención existentes.** Usa la tesis/brand grammar de `creative-web-experience` como dirección, no la reabras desde la skill de sistema. Sigue el registry BF-048 (`authority`, `fidelity`, `scope`, `preserve`, `may adapt`): Approved/Strict prevalece; referencias Inspiration/Directional informan, no conceden derechos ni sustituyen identidad aprobada. No repitas scouting.
2. **Traduce la dirección a reglas de sistema.** Mapea sus rasgos a roles semánticos de color, tipografía, escala/ritmo, geometría, medios, componentes y estados. Elige qué debe ser global y reusable frente a un tratamiento local de página. Los tokens explican una relación visual; no fuerces valores/roles para completar una matriz. Anti-reglas describen solo incoherencias específicas de este proyecto, no prohíben universalmente cards, gradientes, asimetría, motion o escala display.
3. **Cierra tipografía como sistema.** La familia elegida en el proceso creativo recibe roles reales (display, headings, body, labels/datos u otros que existan). Prueba la jerarquía con texto real/provisional del proyecto, no una lista de tamaños desligada del contenido; define relaciones de escala, line-height, weights y fluidez responsive. No inventes otra búsqueda de familias si `creative-web-experience` ya verificó selección y licencia; informa limitaciones sin declarar verificado lo pendiente.
4. **Preserva color y marca en uso.** Deriva palette/roles y contrastes del sistema aprobado y la dirección elegida. El color puede ser expresivo o discreto; no introduzcas contraste/roles solo para demostrar variedad. En Existing conserva tokens/familia de imágenes/ilustración y tratamiento salvo cambio de scope.
5. **Especifica componentes por semántica.** Cada componente/variant corresponde a una acción o contenido real, y su jerarquía/forma/estados visibles se conectan con la gramática visual. El UI Kit muestra solo lo que el proyecto usará; no inventes un catálogo de componentes para que parezca completo.
6. **Delega la especificidad de medios/motion.** `.cn-pilot/NUCLEO.md` conserva provenance/rights; `visual-art-direction` elige assets/tratamiento/crop; `motion-interaction` define secuencias/estados ejecutables. Esta skill conserva sus roles/valores en el sistema, no repite scouting, storyboard ni su detalle técnico.
7. **Representa el alcance correcto.** `page-composition` consume el sistema para componer la página; el Kit es parte del mismo sistema y solo se construye cuando lo requiere el scope. Design-only conserva artefactos; Product implementa valores en source nativo después de la aprobación humana aplicable. Existing, Approved/Strict, Application UI y páginas derivadas mantienen sus fast paths.

## Expresión distintiva mantenible

Un sistema expresivo conserva los rasgos que distinguen la dirección (jerarquía, escala, densidad, paleta, tipografía, media y forma de los componentes) sin convertir cada valor local en token global. La variedad no es un objetivo aparte: el sistema ofrece coherencia mientras `page-composition` adapta la silueta al contenido de cada página. Comprueba que los roles y specimens realmente renderizan la intención, son accesibles/responsive y se pueden implementar en el stack; no reabras Creative Direction ni crees un ciclo de puntuación estética.
