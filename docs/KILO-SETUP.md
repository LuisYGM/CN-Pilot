# Configuración de Kilo Code

## Requisitos
- VS Code
- Kilo Code
- Git (opcional)
- GitHub Desktop (opcional, si se utiliza Git/GitHub)
- herramientas del stack del proyecto

## Configuración personal de proveedor y modelos

El Blueprint no fija proveedor ni modelo dentro de `.kilo/agents/`. Después de clonar el template, cada desarrollador configura sus modelos globales una sola vez; los siguientes proyectos reutilizan esa configuración de la máquina.

En Kilo Code:

1. Abre **Settings**.
2. Entra en **Providers**.
3. Selecciona cualquier proveedor compatible.
4. Completa la autenticación mediante el mecanismo seguro ofrecido por Kilo y el proveedor.
5. Verifica que los modelos elegidos estén disponibles.

Después, integra en `~/.config/kilo/kilo.jsonc` las asignaciones que necesites. [`templates/kilo/global-models.example.jsonc`](../templates/kilo/global-models.example.jsonc) ofrece un ejemplo provider-agnostic con placeholders conceptuales; no es una configuración activa y no contiene credenciales. Sigue los tiers y criterios de coste de [Estrategia de modelos](MODEL-STRATEGY.md).

No reemplaces a ciegas una configuración global existente: incorpora únicamente las claves necesarias. Sustituye los placeholders por IDs reales y adapta `variant` a los niveles admitidos por el proveedor.

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

## Seguridad

- No pegues API keys en archivos del repositorio ni en el template de ejemplo.
- No versiones la configuración personal de modelos.
- No subas `.env`.
- Revisa prompts de permisos.
- Push y deploy quedan bajo control humano.
