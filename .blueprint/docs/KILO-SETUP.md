# Configuración de Kilo Code

## Requisitos
- VS Code
- Kilo Code
- Git (opcional)
- GitHub Desktop (opcional, si se utiliza Git/GitHub)
- herramientas del stack del proyecto

## Configuración personal de proveedor y modelos

El Blueprint no fija proveedor, modelo ni nivel de razonamiento en `kilo.jsonc`, agentes o skills. Cada desarrollador elige su configuración desde Kilo; dos personas pueden usar distintos proveedores/modelos con el mismo workflow y responsabilidades.

En Kilo Code:

1. Abre **Settings**.
2. Entra en **Providers**.
3. Selecciona cualquier proveedor compatible.
4. Completa la autenticación mediante el mecanismo seguro ofrecido por Kilo y el proveedor.
5. Verifica que los modelos elegidos estén disponibles.

Si lo necesitas, ajusta en Kilo Settings, configuración local o global el modelo principal, pequeño, de subagentes o de compactación, los overrides y el esfuerzo de razonamiento. Elige según disponibilidad, coste, calidad, preferencia, acceso y necesidades del proyecto; no hay valores recomendados por el Blueprint. Consulta [Configuración de IA en Kilo](MODEL-STRATEGY.md).

No reemplaces a ciegas una configuración global existente: cambia únicamente lo que necesites y no copies preferencias personales al repositorio.

La configuración global/personal no se incluye al clonar el repositorio. Puede ser diferente en cada máquina y no debe versionarse. Cambiar de proveedor o asignar otro modelo a un agente no requiere editar el Blueprint.

## Verificar agentes

Deben estar disponibles:
`dev-lead`, `architect`, `content-seo`, `ui-ux-designer`, `developer`, `frontend-builder`, `reviewer`.

`dev-lead` es primario; los demás son subagentes.

## Verificar skills

Ubicación: `.kilo/skills/<name>/SKILL.md`.

Si modificas skills durante una sesión, usa `/reload` o inicia otra.

## Verificar workflows

Ubicación: `.kilo/commands/`.

Primera acción recomendada: `/new-project`.

El recorrido completo del primer día está en [Empieza aquí](START-HERE.md).

## Configuración MCP por proyecto

MCP es opcional. Si el proyecto utiliza Kilo con integración MCP, copia [`.kilocode/mcp.example.json`](../../.kilocode/mcp.example.json) como `.kilocode/mcp.json` y configura allí los servidores activos. `kilo.jsonc` en la raíz contiene la configuración general de Kilo/Blueprint; `.kilocode/mcp.json` contiene la configuración MCP activa local y no versionada; `.kilocode/mcp.example.json` es el ejemplo MCP versionado y sin secretos. Un proyecto puede tener varios MCP. Antes de escribir sobre un sistema real, Dev Lead descubre las capabilities/tools expuestas y ejecuta exactamente el flujo `Discovery → Read-only → Plan → Write autorizado → Verification` descrito en [Configuración del Blueprint](CONFIGURATION.md#mcp-opcional).

## Seguridad

- No pegues API keys en archivos del repositorio ni en el template de ejemplo.
- No versiones la configuración personal de modelos.
- No subas `.env`.
- Revisa prompts de permisos.
- Push y deploy quedan bajo control humano.
