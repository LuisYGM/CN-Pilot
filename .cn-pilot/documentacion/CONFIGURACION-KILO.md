# Configuración de Kilo Code

## Para empezar

- Instala/abre VS Code y Kilo Code en el equipo donde trabajarás.
- Abre en VS Code la carpeta del repositorio CN Pilot o del proyecto que lo contiene.
- Git es opcional; instálalo si necesitas historial, commits o worktrees.
- No necesitas instalar WordPress, Bricks, Node, MCP u otras herramientas hasta que el proyecto y su scope las requieran.

Si Kilo solicita un agente, elige `jefe-proyecto`. Comprueba que aparecen los siete agentes y empieza con `/nuevo-proyecto` o describe directamente la tarea cuando el proyecto ya está inicializado. [Empieza aquí](EMPIEZA-AQUI.md) cubre el recorrido de usuario.

## Configuración personal de proveedor y modelos

El CN Pilot no fija proveedor, modelo ni nivel de razonamiento en `kilo.jsonc`, agentes o skills. Cada desarrollador elige su configuración desde Kilo; dos personas pueden usar distintos proveedores/modelos con el mismo workflow y responsabilidades.

Configura proveedor, autenticación y modelo en la superficie personal que ofrezca la versión instalada de Kilo (interfaz Settings o configuración local/global soportada). Los nombres y ubicación de menús pueden variar entre versiones; usa las instrucciones vigentes de Kilo en lugar de copiar una ruta de UI antigua. Completa autenticación en Kilo/proveedor y comprueba disponibilidad del modelo elegido.

Si lo necesitas, ajusta en Kilo Settings, configuración local o global el modelo principal, pequeño, de subagentes o de compactación, los overrides y el esfuerzo de razonamiento. Elige según disponibilidad, coste, calidad, preferencia, acceso y necesidades del proyecto; no hay valores recomendados por CN Pilot. Consulta [Configuración de IA en Kilo](ESTRATEGIA-DE-MODELOS.md).

No reemplaces a ciegas una configuración global existente: cambia únicamente lo que necesites y no copies preferencias personales al repositorio.

La configuración global/personal no se incluye al clonar el repositorio. Puede ser diferente en cada máquina y no debe versionarse. Cambiar de proveedor o asignar otro modelo a un agente no requiere editar el CN Pilot.

## Verificar agentes

Deben estar disponibles:
`jefe-proyecto`, `arquitecto`, `contenido-seo`, `disenador-ui-ux`, `desarrollador`, `maquetador-frontend`, `revisor`.

`jefe-proyecto` es primario; los demás son subagentes.

Agent Manager es opcional y no requiere cambiar `kilo.jsonc` ni habilitar auto-approve. Un worktree crea checkout/branch aislados; una sesión Local comparte el mismo checkout. Jefe de proyecto recurre a worktrees solo para unidades independientes y vuelve a ejecución serial si la capacidad no está disponible o autorizada. Configuración de entorno por worktree solo se añade cuando el proyecto ya la necesita y con aislamiento local seguro.

## Verificar skills

Ubicación: `.kilo/skills/<name>/SKILL.md`.

Si modificas skills durante una sesión, usa `/reload` o inicia otra.

## Comandos y Agent Manager

Los shortcuts se encuentran en `.kilo/commands/`; son opcionales. La lista humana está en [Comandos](COMANDOS.md).

Primera acción recomendada: `/nuevo-proyecto`.

El recorrido completo del primer día está en [Empieza aquí](EMPIEZA-AQUI.md).

## Configuración MCP por proyecto

MCP es opcional y el template no incluye una configuración activa ni un archivo de ejemplo. Si el proyecto solicita una integración, Jefe de proyecto descubre el servidor/capabilities reales y prepara solo las instrucciones y campos no secretos de la configuración local correspondiente. Configúrala mediante una superficie local soportada por Kilo; no pegues ni envíes secretos al agente. Si el runtime usa `.kilocode/mcp.json`, esa configuración queda ignorada por Git y protegida contra lectura/edición de agentes. `kilo.jsonc` contiene la configuración compartible general de Kilo/CN Pilot, no servidores ni credenciales. Antes de escribir sobre un sistema real, Jefe de proyecto descubre las capabilities/tools expuestas y ejecuta exactamente el flujo `Discovery → Read-only → Plan → Write autorizado → Verification` descrito en [Configuración de CN Pilot](CONFIGURACION.md#mcp-opcional).

Agent Manager y worktrees son opcionales. Solo se usan cuando existen unidades escritoras independientes y aportan valor; no cambies configuración para habilitarlos por rutina. La ejecución en serie funciona sin ellos.

## Seguridad y límites

- No pegues API keys en archivos del repositorio ni en el template de ejemplo.
- No versiones la configuración personal de modelos.
- No subas `.env`.
- Revisa prompts de permisos.
- Push y deploy quedan bajo control humano.

La configuración global/modelo local no se clona ni se comparte con el proyecto. MCP solo se configura ante una integración real; una tool conectada no equivale a permiso para modificar un servicio.
