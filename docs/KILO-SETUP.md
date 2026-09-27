# Configuración de Kilo Code

## Requisitos
- VS Code
- Kilo Code
- Git
- GitHub Desktop (opcional/recomendado)
- herramientas del stack del proyecto

## Configuración personal de proveedor y modelos

El Blueprint no fija proveedor ni modelo dentro de `.kilo/agents/`. Después de clonar el template, cada desarrollador configura sus modelos globales una sola vez; los siguientes proyectos reutilizan esa configuración de la máquina.

En Kilo Code:

1. Abre **Settings**.
2. Entra en **Providers**.
3. Selecciona OpenAI, Anthropic, Google u otro proveedor compatible.
4. Completa la autenticación mediante el mecanismo seguro ofrecido por Kilo y el proveedor.
5. Verifica que los modelos elegidos estén disponibles.

Después, integra en `~/.config/kilo/kilo.jsonc` las asignaciones que necesites. `templates/kilo/global-models.example.jsonc` ofrece un ejemplo provider-agnostic con placeholders conceptuales; no es una configuración activa y no contiene credenciales.

No reemplaces a ciegas una configuración global existente: incorpora únicamente las claves necesarias. Sustituye los placeholders por IDs reales y adapta `variant` a los niveles admitidos por el proveedor. Cuando existan niveles de razonamiento, usa `medium` por defecto y reserva `high` para tareas complejas o sensibles.

La configuración global/personal no se incluye al clonar el repositorio. Puede ser diferente en cada máquina y no debe versionarse. Cambiar de proveedor o asignar otro modelo a un agente no requiere editar el Blueprint. Consulta `docs/MODEL-STRATEGY.md` para los tiers recomendados y el criterio de coste.

No uses el modelo más potente para todos los agentes: reserva los modelos caros para coordinación, arquitectura o revisión compleja cuando aporten valor. Las tareas rutinarias, los subagentes genéricos, el small model y la compactación deben favorecer opciones balanced o económicas.

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

## Seguridad

- No pegues API keys en archivos del repositorio ni en el template de ejemplo.
- No versiones la configuración personal de modelos.
- No subas `.env`.
- Revisa prompts de permisos.
- Push y deploy quedan bajo control humano.
