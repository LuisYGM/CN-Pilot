---
name: ui-kit-construction
description: Construir o ampliar materialmente un UI Kit web, sus foundations, tokens globales y primitives. Obligatoria al crear foundations/design system visual Greenfield o al añadir/cambiar tokens globales de color, tipografía o spacing; no usar para cambios locales de Product ni para consumir un Kit aprobado sin modificarlo.
---

# ui-kit-construction

Fuente de verdad operativa para crear un UI Kit desde cero y ampliar materialmente uno existente. Diseñador carga esta skill siempre que aplica; no depende de que la persona mencione «UI Kit». Se usa junto con `ui-design-system` cuando también se resuelve Creative Direction. No aplica a un color puntual de Product, copy, microcambios frontend que reutilizan un sistema aprobado ni páginas que solo consumen el Kit.

## Alcance y relación con el sistema visual

`ui-design-system` conserva Creative Direction, grounding, autoridad de referencias, diversidad y continuidad Existing. Esta skill convierte esas decisiones en foundations, tokens, specimens y componentes concretos. No toma decisiones de marca en abstracto ni crea un look universal. El Design System es la fuente de verdad del proyecto; este UI Kit es su representación visual/interactiva y parte del mismo sistema, no una segunda fuente de valores o un catálogo paralelo. El Kit consume la fuente canónica de tokens/componentes; al implementarse Product, los valores y componentes técnicos viven en el source nativo del stack y el Kit los consume, deriva o verifica en una única dirección de actualización. Si el stack requiere traducción, define un dueño y mapeo explícitos; no mantengas valores compartidos editables independientemente ni impongas herramienta/generator/formato universal. El Product no depende en runtime de `artefactos/`. La dirección aprobada, referencias Approved/Strict y restricciones existentes gobiernan dentro de su alcance. Si una referencia exige un valor contrario al estándar técnico de esta skill, preserva la autoridad visual en el scope afectado y registra brevemente la excepción; Existing por sí solo no es excepción para tokens nuevos.

Para public web Greenfield/rediseño material, construye el Kit solo cuando el alcance lo requiera y a partir de la dirección visual ya decidida por el Diseñador; no lo uses para descubrir el lenguaje ni hagas kits por cada alternativa. Una síntesis de opciones se hace solo si la persona pidió combinar direcciones; no es fase de aprobación obligatoria. En app UI, Kit standalone, Existing y Approved/Strict respeta el sistema/fast path vigente. Esta regla solo fija el momento/autoridad del Kit; no amplía sus foundations, primitives, motion, media ni iconografía.

UI Kit es una representación visual navegable/evaluable del Design System, no una Home/landing completa ni un sistema separado. Presenta identidad/logo como specimen `Brand / Identity` y, cuando aplique a public web, Header/Mobile Header/Footer como specimens; no añadas un Hero de marketing, CTA de negocio ficticio, testimonios inventados ni copy comercial solo para llenar el Kit. Usa texto neutral comparable y navegación confirmada/provisional como marca el contrato UI Kit 2.0, sin neutralizar la identidad visual aprobada. Mantén el Kit compacto, fiel al proyecto y sin widgets hipotéticos. En Greenfield ubícalo bajo `artefactos/diseno/ui-kit/`, con archivos shared solo cuando cada uno tenga función real; crea rutas cuando aparezca el artefacto. Conserva fuentes/rutas Existing. En Design-only su source canónico puede residir en el Kit; al existir Product, los tokens/componentes técnicos viven en sus rutas nativas y el Kit debe presentar los mismos valores/variantes desde una fuente única o una traducción controlada, no mantener una copia editable paralela. Product no depende en runtime de `artefactos/`.

## UI Kit 2.0 para Public Web

Cuando el trigger sea public web Greenfield/rediseño material con nueva dirección, el Kit aprobado/evaluable incluye los specimens siguientes solo en la medida en que existan o apliquen al proyecto. Esto completa el sistema de diseño; no crea un catálogo enterprise ni define una gramática DOM/CSS de Product.

- **Header + Mobile Header:** muestra la identidad/logo, navegación real/confirmada o IA provisional explícitamente reconocible fuera del canvas, CTAs solo si existen, estados relevantes y su relación con el hero. La adaptación mobile es un diseño usable coherente, no solo ocultar links tras un hamburger genérico. En public web, diseña ambos como navegación persistente desde el Kit/Flagship; el specimen puede ser estático si declara ese contrato.
- **Footer:** representa el cierre visual y navegación/datos confirmados que el proyecto necesite. No inventes contacto, horarios, redes, certificaciones, legal ni claims para completar el specimen.
- **Media:** declara treatment/crop/ratio y estados pertinentes de los assets que de verdad se usarán. No presentes un slot vacío, caja gris o placeholder en un specimen high-fidelity: todo medio intencional se resuelve con asset final autorizado o la dirección elimina/sustituye el slot conscientemente. Si Flagship depende de un medio material aún sin resolver, no la declares final ni aprobada; continúa lo independiente y escala el gap.
- **Icon family:** indica una sola familia de iconos funcionales elegida según la identidad/UI y muestra solo glifos que Product use; Lucide, Phosphor, Tabler u otra biblioteca son candidatas, no defaults. Simple Icons se reserva a logos/marcas cuando proceda. No mezcles packs ni instales dependencies solo para mostrar el Kit; custom SVG se reserva para artwork/identidad, no para reinventar controles comunes sin necesidad real.
- **Motion System:** muestra solo tokens/convenciones compartidos que se usan (character y familia temporal/easing, calm/reduced-motion rules, si aplican). La secuencia por escena y sus estados ejecutables corresponden a `motion-interaction` y se demuestran en la Flagship/prototipo cuando el scope lo requiera; no repitas aquí el floor BF-068 ni crees galería de efectos.

El Core BF-068 define cuándo motion forma parte de la experiencia Public Web. El Kit presenta las convenciones de sistema aprobadas; la Flagship demuestra la secuencia concreta cuando sea material. Esto no autoriza dependencias ni sustituye la aprobación humana.

## Application UI y escala del Kit

En Application UI consume `application-ui` y el sistema aprobado: presenta únicamente shell/navigation, controles de datos, componentes y estados que existan o se necesiten para los flujos reales. Tables, filtros, formularios, vacíos, loading/error, feedback, modals u overlays son opciones condicionadas al producto, nunca una lista que completar. No importes Header/Footer, hero o patrones de public web si la aplicación no los usa. El motion de app sigue el intent y requisitos reales, no el floor de public web por extensión.

Ajusta la profundidad al proyecto: una landing puede requerir solo foundations/tokens y componentes usados; una web corporativa puede compartir patrones de páginas; una app compleja necesita estados/patrones adicionales solo donde los flujos y datos los demanden. Mantén el sistema suficiente y evolutivo, no una librería enterprise ni un UI Kit genérico. Existing, Approved/Strict y builders conservan su autoridad y representación vigente.

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

## Componentes, patrones y estados

Incluye únicamente componentes/patrones que respondan a contenido o flujos reales; no hay cuota de button/card/accordion/form/table. Para botones y enlaces, deriva forma, tipografía, jerarquía y variante de la gramática visual y del tipo de acción; no elijas la misma píldora + flecha como solución automática. Indica qué control usa la variante y qué comunica cada una. Muestra solo variantes/tamaños usados o aprobados; ejemplifica `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, `error`, `success`, `selected` o `expanded` según semántica/behavior real. En una interacción material, especifica el cambio visual provocado por el input y el estado al que llega; no añadas estados ficticios ni una galería de efectos.

Todo elemento realmente clickable comunica affordance según su input: `cursor: pointer` para acciones activas con puntero, respuesta/hover donde aporte, y no dependencia de hover para teclado/touch. No exijas un efecto uniforme. Evita `transition: all` cuando pueda animar estados inesperados y evita layout shift. Disabled no simula acción ni cursor interactivo. Preserva contraste, foco perceptible, tamaño táctil, reduced motion y robustez frente a copy real. Una extensión material existente aplica esta skill al nuevo token/component y no reconstruye el Kit entero.

### Focus de campos

En input, textarea, select y controles equivalentes, diseña un foco perceptible, contrastante y coherente con el sistema; no dependas de un cambio de color tenue. Borde, outline, box-shadow/ring o su combinación son soluciones válidas si el indicador es visible, no provoca layout shift innecesario y funciona con forced-colors/high-contrast. No elimines `outline` sin un reemplazo igual o más perceptible. Error/success conservan su prioridad y mensaje; disabled conserva su estado. Aplica la misma intención de foco a botones, enlaces y controles interactivos con su patrón apropiado. Esto define usabilidad, no una estética universal.

### Accordion: interacción y motion

El primitive base abre/cierra con continuidad espacial y una respuesta acorde al contexto: una acción repetida pide feedback breve; una apertura que orienta lectura puede durar más si no bloquea ni hace esperar. Elige duración/easing por propósito y densidad, no por rango fijo universal; evita saltos que confundan, overshoot que contradiga el sistema y transiciones cansadas. Usa una técnica nativa/stack-compatible y no prescribas implementación si el stack resuelve apertura/cierre. No uses `display:none` como único mecanismo si impide la transición.

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
