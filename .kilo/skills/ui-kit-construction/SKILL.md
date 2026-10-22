---
name: ui-kit-construction
description: Construir o ampliar materialmente un UI Kit web, sus foundations, tokens globales y primitives. Obligatoria al crear foundations/design system visual Greenfield o al añadir/cambiar tokens globales de color, tipografía o spacing; no usar para cambios locales de Product ni para consumir un Kit aprobado sin modificarlo.
---

# ui-kit-construction

Fuente de verdad operativa para crear un UI Kit desde cero y ampliar materialmente uno existente. UI/UX Designer carga esta skill siempre que aplica; no depende de que la persona mencione «UI Kit». Se usa junto con `ui-design-system` cuando también se resuelve Creative Direction. No aplica a un color puntual de Product, copy, microcambios frontend que reutilizan un sistema aprobado ni páginas que solo consumen el Kit.

## Alcance y relación con el sistema visual

`ui-design-system` conserva Creative Direction, grounding, autoridad de referencias, diversidad y continuidad Existing. Esta skill convierte esas decisiones en foundations, tokens, specimens y componentes concretos. No toma decisiones de marca en abstracto ni crea un look universal. La dirección aprobada, referencias Approved/Strict y restricciones existentes gobiernan dentro de su alcance. Si una referencia exige un valor contrario al estándar técnico de esta skill, preserva la autoridad visual en el scope afectado y registra brevemente la excepción; Existing por sí solo no es excepción para tokens nuevos.

UI Kit es un sistema visual navegable/evaluable, no Home/landing. Presenta identidad/logo como specimen `Brand / Identity`; no uses header/navigation comercial, hero, CTA de negocio, testimonios ficticios ni marketing inventado. Usa texto neutral comparable. Mantén el kit compacto y sin widgets hipotéticos. En Greenfield ubícalo bajo `artefactos/diseno/ui-kit/`, con archivos shared solo cuando cada uno tenga función real; crea rutas cuando aparezca el artefacto. Conserva fuentes/rutas Existing. El kit y sus fuentes no son runtime de producto; producto implementa sus tokens/componentes dentro de sus rutas nativas.

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

### Tokens de font-size: fluidos obligatorios

Todo token nuevo de tamaño tipográfico definido en el Kit usa `clamp()`; incluye display, headings, body y variantes globales presentes (body-large/small, labels, buttons, eyebrow, caption, metadata u otros). No dejes definiciones finales en `rem`, `px` fijo u otra forma sin clamp. Usa rango/fluidez proporcionados al rol y MIN < MAX. Evita clamps cosméticos constantes como `clamp(16px, 16px, 16px)`.

### Tokens de spacing: fluidos obligatorios

Todo token reusable nuevo de espacio del Kit usa `clamp()` con progresión fluida real y endpoints distintos; incluye escala, gap, padding, section spacing, gutters, stack/cluster, grid y equivalentes. No dejes tokens finales de spacing en `rem`, `px` fijo u otra forma sin clamp. Deriva rangos de escala y propósito; no impongas una escala universal ni hagas variaciones agresivas solo para cumplir el contrato.

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

Muestra los estados que correspondan por control: default, hover, focus, active, disabled, loading, error, success, selected/expanded según función. Preserva contraste, teclado, foco perceptible, tamaño táctil, reduced motion y robustez frente a copy real. Una extensión material existente aplica esta skill al nuevo token/component y no reconstruye el Kit entero.

### Focus de campos

En input, textarea, select y controles equivalentes con borde:

- default usa el borde normal;
- focus/focus-visible mantiene exactamente border-width, dimensions, radius y padding; cambia el borde a primary;
- no agrega outline/halo/box-shadow grueso ni causa layout shift;
- error y success conservan su prioridad/color y el mensaje visible aunque el campo tenga foco;
- disabled conserva su apariencia.

El cambio de borde debe hacer el foco perceptible; permite/fortalece indicación nativa en forced-colors/high-contrast cuando se requiera. Este contrato no se extiende a botones/enlaces, que conservan sus propios indicadores apropiados.

### Accordion: interacción y motion

El primitive base abre y cierra suavemente, con continuidad espacial, transición perceptible pero discreta, sin salto instantáneo. Objetivo orientativo: 280–400 ms con easing suave (`ease`, `ease-in-out` o equivalente); sin bounce, spring exagerado, overshoot ni duración cansada. La técnica es nativa/stack-compatible (p. ej. grid rows, altura medida o API existente), no prescribas una implementación si el stack ya resuelve bien apertura y cierre. No uses `display:none` como único mecanismo de visibilidad si impide transición.

Conserva control semántico, teclado, foco, estado ARIA cuando corresponda, comportamiento single-open y primer item abierto por defecto según baseline, además de contenido correctamente disponible. `prefers-reduced-motion` reduce o elimina movimiento sin alterar estado, interacción ni acceso al contenido; no elimines motion para todos los usuarios invocando accesibilidad.

## Responsive y precedencia

El Kit entero y sus specimens reflow correctamente, sin overflow material ni versión desktop meramente recortada. Los clamps permiten observar fluidez entre viewports; no añadas media queries donde fluidez/layout ya resuelvan. Usa `.cn-pilot/config/responsive.json` en Greenfield con mecanismo soportado; Existing conserva configuración/convención vigente. En Approved/Strict, la referencia manda dentro del scope; cualquier excepción técnica queda visible y breve.

## Pre-approval check obligatorio y local

Antes de Human Visual Approval, inspecciona las fuentes reales del Kit. Haz un único pase compacto y corrige en el mismo batch los incumplimientos; no traslades defectos básicos a Reviewer/browser QA.

1. **Root:** existe `html { font-size: 100%; }`; no hay override que cambie la equivalencia `1rem = 16px`.
2. **Body:** body/base usa token real con mínimo de 16px; sub-16px solo en roles explícitos.
3. **Typography tokens:** cada nuevo font-size token está definido con `clamp()`; min/max px, MIN < MAX y fluidez no cosmética.
4. **Spacing tokens:** cada nuevo spacing token reusable está definido con `clamp()`; min/max px, MIN < MAX y fluidez real.
5. **Labels:** cada token mostrado coincide exactamente con identifier/value declarado.
6. **Accordion:** apertura y cierre transicionan suavemente alrededor de 280–400ms/equivalente; sin bounce/overshoot; reduced-motion conserva estado/contenido.
7. **Form fields:** focus mantiene border-width/dimensiones, usa primary, sin halo grueso; error/success/disabled tienen prioridad.
8. **Font:** las fuentes/weights del specimen están realmente cargados con fallback deliberado.
9. **Responsive:** Kit/specimens reflow y no tienen overflow material en viewports representativos.

Si cualquier punto falla, corrige antes de aprobación. Existing conserva tokens previos no tocados; todo token nuevo de una extensión sigue esta skill salvo excepción Approved/Strict material y explícita.

No se incluye un checker automático universal: la clasificación de tokens/roles y la correspondencia identifier↔specimen dependen del markup/CSS de cada Kit y una regex general produciría falsos positivos; este check determinista se hace contra las fuentes en el punto de construcción. No añadas framework de lint, dependencia, browser harness ni suite pesada por esta pauta.
