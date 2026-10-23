---
name: ui-kit-construction
description: Construir o ampliar materialmente un UI Kit web, sus foundations, tokens globales y primitives. Obligatoria al crear foundations/design system visual Greenfield o al añadir/cambiar tokens globales de color, tipografía o spacing; no usar para cambios locales de Product ni para consumir un Kit aprobado sin modificarlo.
---

# ui-kit-construction

Fuente de verdad operativa para crear un UI Kit desde cero y ampliar materialmente uno existente. Diseñador UI/UX carga esta skill siempre que aplica; no depende de que la persona mencione «UI Kit». Se usa junto con `ui-design-system` cuando también se resuelve Creative Direction. No aplica a un color puntual de Product, copy, microcambios frontend que reutilizan un sistema aprobado ni páginas que solo consumen el Kit.

## Alcance y relación con el sistema visual

`ui-design-system` conserva Creative Direction, grounding, autoridad de referencias, diversidad y continuidad Existing. Esta skill convierte esas decisiones en foundations, tokens, specimens y componentes concretos. No toma decisiones de marca en abstracto ni crea un look universal. La dirección aprobada, referencias Approved/Strict y restricciones existentes gobiernan dentro de su alcance. Si una referencia exige un valor contrario al estándar técnico de esta skill, preserva la autoridad visual en el scope afectado y registra brevemente la excepción; Existing por sí solo no es excepción para tokens nuevos.

Para public web Greenfield/rediseño material con dirección aún abierta, activa esta construcción solo después de la Visual Synthesis de `creative-web-experience`; no generes un Kit separado para cada Concept Study ni lo uses para decidir divergence. En app UI, Kit standalone, Existing y Approved/Strict respeta el sistema/fast path vigente. Esta regla solo fija el momento/autoridad del Kit; no amplía sus foundations, primitives, motion, media ni iconografía.

UI Kit es un sistema visual navegable/evaluable, no una Home/landing completa. Presenta identidad/logo como specimen `Brand / Identity` y, cuando aplique a public web, Header/Mobile Header/Footer como specimens del sistema; no añadas un Hero de marketing, CTA de negocio ficticio, testimonios inventados ni copy comercial solo para llenar el Kit. Usa texto neutral comparable y navegación confirmada/provisional como marca el contrato UI Kit 2.0. Mantén el kit compacto y sin widgets hipotéticos. En Greenfield ubícalo bajo `artefactos/diseno/ui-kit/`, con archivos shared solo cuando cada uno tenga función real; crea rutas cuando aparezca el artefacto. Conserva fuentes/rutas Existing. El kit y sus fuentes no son runtime de producto; producto implementa sus tokens/componentes dentro de sus rutas nativas.

## UI Kit 2.0 para Public Web

Cuando el trigger sea public web Greenfield/rediseño material con nueva dirección, el Kit aprobado/evaluable incluye los specimens siguientes solo en la medida en que existan o apliquen al proyecto. Esto completa el sistema de diseño; no crea un catálogo enterprise ni define una gramática DOM/CSS de Product.

- **Header + Mobile Header:** muestra la identidad/logo, navegación real/confirmada o IA provisional explícitamente reconocible fuera del canvas, CTAs solo si existen, estados relevantes y su relación con el hero. La adaptación mobile es un diseño usable coherente, no solo ocultar links tras un hamburger genérico. En public web, diseña ambos como navegación persistente desde el Kit/Flagship; el specimen puede ser estático si declara ese contrato.
- **Footer:** representa el cierre visual y navegación/datos confirmados que el proyecto necesite. No inventes contacto, horarios, redes, certificaciones, legal ni claims para completar el specimen.
- **Media:** declara treatment/crop/ratio y estados pertinentes de los assets que de verdad se usarán. No presentes un slot vacío, caja gris o placeholder en un specimen high-fidelity: todo medio intencional se resuelve con asset final autorizado o la dirección elimina/sustituye el slot conscientemente. Si Flagship depende de un medio material aún sin resolver, no la declares final ni aprobada; continúa lo independiente y escala el gap.
- **Icon family:** indica una sola familia primaria de iconos funcionales y muestra solo ejemplos que Product use. Lucide es el default general; Phosphor puede aportar expresividad/pesos distintos; Simple Icons se reserva a logos/marcas cuando proceda. No mezcles packs ni instales dependencies solo para que el Kit las muestre; custom SVG sigue permitido para artwork/identidad, no para reinventar controles comunes sin una necesidad real.
- **Motion System:** una síntesis breve de personalidad, timing/easing intent, entrance del hero/página, scroll progression cuando el contenido lo permita, microinteracciones, adaptación mobile, calm zones y reduced motion. El Kit demuestra solo specimens materiales elegidos para la Flagship; no fuerza engine ni animación por componente.

Para public web nueva el movimiento forma parte del lenguaje visual por defecto; la persona puede pedir una experiencia estática y esa preferencia prevalece. El baseline se traduce a comportamiento concreto en Flagship; marcar solo una lista de tokens sin motion observable no basta si el carácter depende de motion. Motion de un diseño no obliga a añadir una dependencia al Kit o Product.

## Foundations y tokens

Deriva los valores específicos (familias, weights, escala, ratios, rangos, densidad, color, ritmo y geometría) de la dirección y autoridad visual; no impongas escalas universales. Utiliza nombres semánticos, una fuente de verdad en la fase, tokens reutilizables reales e identifiers claros. Incluye los roles/colores intencionales del sistema sin inventar swatches solo para completar una matriz. Cuando se defina nueva palette, presenta Brand Palette y System Palette; considera background, surface, text, muted, border, primary, secondary, success, warning, error, info y focus según el proyecto.

### Root y base tipográfica — estándar obligatorio

Todo UI Kit nuevo generado por CN usa en su documento raíz:

```css
html {
  font-size: 100%;
}
```

Esto conserva `1rem = 16px`; no se permite `14px`, `62.5%` ni otra técnica que cambie artificialmente la equivalencia. El texto base usa token real, por ejemplo `body { font-size: var(--text-body); }`, y `--text-body` tiene mínimo de 16px. No asignes tamaño inferior a 16px al root ni al body/base global.

Roles específicos menores a 16px sí se permiten con intención semántica/visual (eyebrow, caption, metadata, helper/legal text, badge, anotación técnica o label compacto justificado). No uses texto menor como body general, para hacer caber layout ni porque la fuente se perciba grande. La familia, sector, framework y estilo no alteran el estándar root/body.

### Tokens de font-size: fluidez según intención

Prefiere `clamp()` cuando el tamaño debe escalar con viewport/layout: en especial display, headings y roles de texto que la dirección visual haga fluidos. No es obligatorio para todo token tipográfico. Un valor fijo puede ser correcto si su intención permanece constante (p. ej. labels/control internals o un rol compacto aprobado). Conserva body/root legibles y no reduzcas el texto base para hacer caber layout. Si usas `clamp()`, aplica el contrato de endpoints en px de abajo y `MIN < MAX` con fluidez real; no uses clamps cosméticos constantes como `clamp(16px, 16px, 16px)`.

### Tokens de spacing: fluidez según escala

Prefiere spacing fluido cuando el valor crece/decrece con viewport o composición, particularmente section spacing, layout gutters y macro gaps. No exijas `clamp()` para cada token reusable. Los valores fijos son adecuados para spacing interno de controls, icon gaps, separación junto a borders u otros valores de componente/dimensiones cuya intención sea constante. Deriva escala y propósito; no cambies tokens Existing/Approved ni inventes fluidez cosmética para completar una regla. Si usas `clamp()`, sus endpoints siguen el contrato de px y `MIN < MAX`.

### Contrato global de clamp

Todo clamp nuevo de CN usa `clamp(<min-px>, <fluid-expression>, <max-px>)`: primer y tercer argumento en px. La expresión fluida puede usar `vw`, `calc()` y otras unidades justificadas. Min/max deben ser px para tipografía y spacing; `MIN < MAX` para tokens fluidos, salvo razón técnica excepcional explícita. No uses rem/em como endpoints. Otras propiedades CSS y tokens técnicos (border/outline width, radius, shadow, opacity, z-index, durations, transforms, etc.) no tienen obligación de clamp.

### Line-height, font loading y values

Line-height puede ser unitless (p. ej. heading/body) si mantiene legibilidad; no requiere clamp. Si se selecciona fuente no-system, cárgala realmente en el Kit, con fallback deliberado y solo weights usados. El specimen debe renderizar esa fuente, no una sustitución silenciosa. Product debe poder cargar la misma familia/weights en sus propios recursos runtime; valida el mecanismo del stack sin hacer que Product dependa de Project Artifacts.

## Specimens y presentación de tokens

Todo token reusable presentado enseña visualmente role/nombre, identifier exacto usado en CSS/código y valor real. Usa tratamiento discreto (por ejemplo monospace/code), legible y sin degradar el Kit. El identifier y valor se cotejan con la declaration efectiva; no muestres alias descriptivo como si fuese la variable.

Incluye según alcance:

- Brand/System palette con swatch, role, identifier y color real;
- escala tipográfica: display si existe, H1–H6, body y variantes globales relevantes; headings con texto igual para comparar cuando sirva;
- cada specimen con role, render real, identifier, clamp exacto y line-height cuando aporte;
- escala de spacing real con medida visual proporcional, nombre, identifier y clamp; incluye tokens especiales como `--space-section`/`--layout-gutter` cuando existan;
- max-width/container, gutter, borders/widths, radii, shadows y otros tokens reusables que el Kit exponga.

No inventes valores mostrados: cada valor coincide con el token real. No exijas DevTools al usuario para identificar qué variable aplicar.

## Primitives y estados

Incluye el baseline aplicable, no una librería enterprise: botones (primary/secondary y link action si procede), card neutral reusable, accordion, y specimen de formulario con text input, select, textarea, radio, checkbox y labels/instrucciones. No diseñes widgets de negocio sin use case confirmado.

Muestra los estados que correspondan por control: default, hover, focus-visible, active, disabled, loading, error, success, selected/expanded según función. Todo elemento realmente clickable comunica interacción con `cursor: pointer` en estado activo, hover perceptible y transición suave cuando aplique; usa propiedades explícitas, evita `transition: all` cuando pueda animar estados inesperados y evita layout shift. Disabled no simula acción ni feedback de activación. Preserva contraste, teclado, foco perceptible, tamaño táctil, reduced motion y robustez frente a copy real. Una extensión material existente aplica esta skill al nuevo token/component y no reconstruye el Kit entero.

### Focus de campos

En input, textarea, select y controles equivalentes, diseña un foco perceptible, contrastante y coherente con el sistema; no dependas de un cambio de color tenue. Borde, outline, box-shadow/ring o su combinación son soluciones válidas si el indicador es visible, no provoca layout shift innecesario y funciona con forced-colors/high-contrast. No elimines `outline` sin un reemplazo igual o más perceptible. Error/success conservan su prioridad y mensaje; disabled conserva su estado. Aplica la misma intención de foco a botones, enlaces y controles interactivos con su patrón apropiado. Esto define usabilidad, no una estética universal.

### Accordion: interacción y motion

El primitive base abre y cierra suavemente, con continuidad espacial, transición perceptible pero discreta, sin salto instantáneo. Objetivo orientativo: 280–400 ms con easing suave (`ease`, `ease-in-out` o equivalente); sin bounce, spring exagerado, overshoot ni duración cansada. La técnica es nativa/stack-compatible (p. ej. grid rows, altura medida o API existente), no prescribas una implementación si el stack ya resuelve bien apertura y cierre. No uses `display:none` como único mecanismo de visibilidad si impide transición.

Conserva control semántico, teclado, foco, estado ARIA cuando corresponda, comportamiento single-open y primer item abierto por defecto según baseline, además de contenido correctamente disponible. `prefers-reduced-motion` reduce o elimina movimiento sin alterar estado, interacción ni acceso al contenido; no elimines motion para todos los usuarios invocando accesibilidad.

## Responsive y precedencia

El Kit entero y sus specimens reflow correctamente, sin overflow material ni versión desktop meramente recortada. Los clamps permiten observar fluidez entre viewports; no añadas media queries donde fluidez/layout ya resuelvan. Usa `.cn-pilot/config/responsive.json` en Greenfield con mecanismo soportado; Existing conserva configuración/convención vigente. En Approved/Strict, la referencia manda dentro del scope; cualquier excepción técnica queda visible y breve.

## Pre-approval check obligatorio y local

Antes de Human Visual Approval, inspecciona las fuentes reales del Kit. Haz un único pase compacto y corrige en el mismo batch los incumplimientos; no traslades defectos básicos a Revisor/browser QA.

1. **Root:** existe `html { font-size: 100%; }`; no hay override que cambie la equivalencia `1rem = 16px`.
2. **Body:** body/base usa token real con mínimo de 16px; sub-16px solo en roles explícitos.
3. **Typography tokens:** los roles que deben escalar con viewport/layout muestran fluidez real; valores fijos tienen intención contextual. Si usan `clamp()`, min/max px, MIN < MAX.
4. **Spacing tokens:** scale/section/gutters y macro spacing son fluidos cuando la composición lo pide; tokens internos pueden ser fijos si la intención es constante. Si usan `clamp()`, min/max px, MIN < MAX.
5. **Labels:** cada token mostrado coincide exactamente con identifier/value declarado.
6. **Accordion:** apertura y cierre transicionan suavemente alrededor de 280–400ms/equivalente; sin bounce/overshoot; reduced-motion conserva estado/contenido.
7. **Focus:** campo/control tiene indicador perceptible y contraste suficiente sin layout shift; outline, border, ring o shadow se eligen por el sistema. No se elimina el indicador nativo sin reemplazo equivalente; forced-colors, error/success/disabled mantienen estados distinguibles.
8. **Font:** las fuentes/weights del specimen están realmente cargados con fallback deliberado.
9. **Responsive:** Kit/specimens reflow y no tienen overflow material en viewports representativos.

Si un criterio aplicable falla, corrige antes de aprobación. Existing conserva tokens/focus previos no tocados; toda extensión deriva decisiones de fluidez/foco del Kit y scope actual salvo authority Approved/Strict.

No se incluye un checker automático universal: la clasificación de tokens/roles y la correspondencia identifier↔specimen dependen del markup/CSS de cada Kit y una regex general produciría falsos positivos; este check determinista se hace contra las fuentes en el punto de construcción. No añadas framework de lint, dependencia, browser harness ni suite pesada por esta pauta.
