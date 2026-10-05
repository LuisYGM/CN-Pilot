---
name: bricks
description: Trabajo con Bricks Builder, templates, clases globales, variables, componentes y estructura responsive. Úsala cuando el proyecto use Bricks o haya que implementar/ajustar una interfaz dentro de Bricks.
---

# bricks

1. Inspecciona clases globales, variables y templates pertinentes al alcance; con fuente aprobada reutiliza contexto y evita inventario global.
2. Reutiliza sistema de diseño.
3. Evita CSS custom innecesario y reglas duplicadas.
4. Considera condiciones de templates/datos dinámicos.
5. Verifica desktop, tablet y móvil.
6. Mantén lógica compleja fuera del builder cuando corresponda.
7. Documenta snippets/integraciones custom relevantes.

## Aplicación focalizada con fuente aprobada

Usa el trigger de `AGENTS.md` y el procedimiento único de `frontend-builder`, sin repetirlos como workflow Bricks separado. Preflight identifica target, controles/campos usados, clases/componentes reutilizables, query/pagination y acceso write/preview. Reutiliza schemas ya confirmados salvo cambios de entorno; no consulta controles o rutas de importación que no se usarán.

Para un Blog con featured, loop y pager, valida primero el conjunto mínimo: featured conserva su item, el loop cambia con pager y la paginación responde correctamente. Resuelve incompatibilidades antes de construir las secciones completas, con las garantías de escritura vigentes. Una página estática no necesita un spike artificial.

Si está disponible `bricks-html-css-to-bricks`, aprovecha solo los hints de mapping pertinentes a la ruta elegida; no reinicies discovery ni investigues importaciones alternativas por rutina. Sus instrucciones de import directo no sustituyen el preflight, las precondiciones del target ni las garantías de BF-019. Su disponibilidad no obliga a importar ni crea dependencia del Blueprint; schema/target y editabilidad siguen gobernando el método.

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
