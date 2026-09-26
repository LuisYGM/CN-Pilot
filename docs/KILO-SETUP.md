# Kilo Code Setup

## Requirements
- VS Code
- Kilo Code
- Git
- GitHub Desktop (opcional/recomendado)
- herramientas del stack del proyecto

## OpenAI API

La API key de OpenAI no debe guardarse en este repo.

En Kilo Code:

1. Abre **Settings**.
2. Entra en **Providers**.
3. Selecciona **OpenAI**.
4. Añade tu API key.
5. Selecciona el modelo deseado.

El Blueprint no fija un modelo en los agentes para mantener portabilidad.

## Verify agents

Deben estar disponibles:
`dev-lead`, `architect`, `content-seo`, `ui-ux-designer`, `developer`, `frontend-builder`, `reviewer`.

`dev-lead` es primario; los demás son subagentes.

## Verify skills

Ubicación: `.kilo/skills/<name>/SKILL.md`.

Si modificas skills durante una sesión, usa `/reload` o inicia otra.

## Verify workflows

Ubicación: `.kilo/commands/`.

Primera acción recomendada: `/new-project`.

## Security

- No pegues API keys en archivos.
- No subas `.env`.
- Revisa prompts de permisos.
- Push y deploy quedan bajo control humano.
