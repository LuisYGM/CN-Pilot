---
name: bricks
description: Implementar o mantener UI en un stack Bricks confirmado, considerando templates, Components/properties/variants/slots, Queries, interacciones, clases globales, variables y responsive según capabilities reales de la versión/add-ons. No asumir que todo feature existe.
---

# bricks

1. Inspecciona solo el target y capacidades que puedan cambiar esta tarea: versión Bricks y add-ons si importan, breakpoints, clases/variables globales, templates/conditions, Components/properties/variants/slots, Query System/Global Queries, dynamic data e interactions/forms cuando estén en scope. Reutiliza contexto aprobado y evita inventario global.
2. Reutiliza sistema de diseño.
3. Evita CSS custom innecesario y reglas duplicadas.
4. Considera condiciones de templates/datos dinámicos.
5. Verifica los viewports mínimos que cubren el cambio; desktop/tablet/mobile no son una matriz obligatoria para cada edición.
6. Mantén lógica compleja fuera del builder cuando corresponda.
7. Documenta snippets/integraciones custom relevantes.

Si una capability o comportamiento de Bricks depende materialmente de versión/add-on, confirma disponibilidad en el proyecto y usa `source-grounded-development` con fuente oficial cuando la documentación vigente pueda cambiar la implementación. No derives soporte de una etiqueta de UI, demo o nombre aproximado.

## Aplicación focalizada con fuente aprobada

Usa el trigger de `AGENTS.md` y el procedimiento único de `maquetador-frontend`, sin repetirlos como workflow Bricks separado. Preflight identifica target, controles/campos usados, clases/componentes reutilizables, query/pagination y acceso write/preview. Reutiliza schemas ya confirmados salvo cambios de entorno; no consulta controles o rutas de importación que no se usarán.

Para un Blog con featured, loop y pager, valida primero el conjunto mínimo: featured conserva su item, el loop cambia con pager y la paginación responde correctamente. Resuelve incompatibilidades antes de construir las secciones completas, con las garantías de escritura vigentes. Una página estática no necesita un spike artificial.

Si está disponible `bricks-html-css-to-bricks`, aprovecha solo los hints de mapping pertinentes a la ruta elegida; no reinicies discovery ni investigues importaciones alternativas por rutina. Sus instrucciones de import directo no sustituyen el preflight, las precondiciones del target ni las garantías de BF-019. Su disponibilidad no obliga a importar ni crea dependencia del CN Pilot; schema/target y editabilidad siguen gobernando el método.

## Components y APIs de edición

Cuando el proyecto use Bricks Components, distingue **source/component**, **instance**, properties, variants y slots. Properties exponen decisiones configurables intencionales; variants nombran variaciones/estados reales; slots permiten contenido flexible solo donde el componente lo necesita. Un local override puede divergir de un valor source/global y un cambio global puede propagarse a varias instancias: inspecciona alcance y efecto antes de editar. Preserva names/defaults Existing; no conviertas cada wrapper en Component ni diseñes una API genérica por anticipación. Cambia source cuando el cambio global sea intencional y autorizado; si el target debe ser local, limita el override y verifica instancias hermanas.

## Estructura nativa

Usa como baseline:

```text
Section
→ Container [Grid cuando la intención sea bidimensional]
  → Block
    → widgets
```

Normalmente una Section contiene un Container. Añade Containers hermanos únicamente cuando haya dos o más regiones de layout independientes; no separes automáticamente heading, contenido, footnotes o CTA. Usa Grid cuando el Container distribuya múltiples Blocks en columnas, filas o una composición bidimensional. Si contiene un solo Block, mantén Flex/default de Bricks; los Blocks conservan normalmente Flex/default para contenido vertical. Grid dentro de un Block requiere una composición interna real. Los Blocks son unidades lógicas/celdas y los widgets viven directamente dentro de ellos.

Usa `Div` solo como agrupador auxiliar con una función real —alineación, agrupación, interacción, responsive interno o unidad visual—. No uses Div como wrapper automático, Code como sustituto de elementos nativos ni HTML/CSS importado masivamente como shortcut. Prioriza settings nativos, estructura limpia y CSS local scoped mínimo cuando sea necesario; no persigas cero CSS, cero Divs o cien por cien native. Antes de modificar, descubre elementos y settings nativos, consulta schemas y respeta convenciones existentes para preservar editabilidad humana. Una referencia HTML/CSS aprobada es fuente visual, no una orden de importación automática: evalúa estructura nativa, editabilidad, wrappers, clases globales, responsive, fidelidad y mantenibilidad. En operaciones MCP/API trabaja incrementalmente y secuencialmente por recurso: crea, relee y verifica antes de continuar; tras un error o timeout, reconecta y relee el estado persistido antes de repetir.

## Queries, interactions y fuente global

En listados/dynamic content determina la fuente/query owner real, filtros, contexto, pagination, empty state y nested-query behavior que afecten el resultado. Reutiliza Query System/Global Query o query manager disponible si es fuente canónica; no dupliques como configuración local por comodidad. Comprueba el editor y el render de contenido/estados representativos. Las Bricks Interactions nativas pueden resolver comportamiento simple y estable; no añadas JS custom innecesario, no las uses para business logic y escala complejidad/motion coordinado a sus owners. Classes, variables, Components, global styles y breakpoints son un sistema compartido: respeta source-of-truth y no copies tokens aprobados como valores locales masivos.

QA del cambio verifica la fuente editable, effects de component propagation, conditions, dynamic fields/query, responsive relevante, frontend render y editor state cuando esté disponible; comprueba que no haya CSS/JS duplicado ni wrappers sin función. No impongas tres viewports, inventario completo ni browser/runtime si no aplica al scope.
