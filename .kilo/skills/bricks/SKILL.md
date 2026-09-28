---
name: bricks
description: Trabajo con Bricks Builder, templates, clases globales, variables, componentes y estructura responsive. Úsala cuando el proyecto use Bricks o haya que implementar/ajustar una interfaz dentro de Bricks.
---

# bricks

1. Inspecciona clases globales, variables y templates.
2. Reutiliza sistema de diseño.
3. Evita CSS custom innecesario y reglas duplicadas.
4. Considera condiciones de templates/datos dinámicos.
5. Verifica desktop, tablet y móvil.
6. Mantén lógica compleja fuera del builder cuando corresponda.
7. Documenta snippets/integraciones custom relevantes.

## Estructura nativa

Usa como baseline:

```text
Section
→ Container [display: grid]
  → Block
    → widgets
```

Normalmente una Section contiene un Container. Añade Containers hermanos únicamente cuando haya dos o más regiones de layout independientes que necesiten grids diferentes; no separes automáticamente heading, contenido, footnotes o CTA. El Container resuelve columnas, filas, gaps, proporciones, alineación y responsive con Grid; usa Flex para micro-layouts como icono + texto, botones o badges. Los Blocks son unidades lógicas/celdas del grid y los widgets viven directamente dentro de ellos.

Usa `Div` solo como agrupador auxiliar con una función real —alineación, agrupación, interacción, responsive interno o unidad visual—. No uses Div como wrapper automático, Code como sustituto de elementos nativos ni HTML/CSS importado masivamente como shortcut. Antes de modificar, descubre elementos y settings nativos, consulta schemas y respeta convenciones existentes para preservar editabilidad humana. En operaciones MCP/API trabaja incrementalmente: crea, relee y verifica antes de continuar; tras un error o timeout, relee el estado persistido antes de repetir.
