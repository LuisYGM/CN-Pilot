# Manifiesto de CN Pilot Core

Inventario de CN Pilot Core. No sustituye `../ARTIFACTS.md`, que registra entregables específicos del proyecto.

`.cn-pilot/runtime/` es estado operacional local e ignorado por Git; no forma parte del Core distribuido ni del manifiesto versionado.

- 7 agentes en `.kilo/agents/`
- 26 skills (`.kilo/skills/*/SKILL.md`)
- 6 documentos de referencia bajo `.kilo/skills/technical-seo/references/` (no son skills adicionales)
- 12 comandos en `.kilo/commands/`
- 7 perfiles en `.cn-pilot/profiles/`
- 9 archivos de plantilla en la raíz de `.cn-pilot/templates/` y 18 archivos en total bajo `.cn-pilot/templates/` (incluye subdirectorios)
- QA ejecutable read-only y on-demand del Core en `.cn-pilot/qa/` (Node built-in; sin dependencias npm)
- Core portable en `.cn-pilot/` (config, docs, profiles y templates)
- documentación operativa bajo `.cn-pilot/docs/`
- registro base de artefactos del proyecto
- configuración responsive versionada en `.cn-pilot/config/`
- configuración Kilo compartible en `kilo.jsonc` y controles locales en `.gitignore` / `.kilocodeignore`
- política de formato portable en `.editorconfig` / `.gitattributes`
- MCP y workflows GitHub Actions opcionales, no preconfigurados en el template; se materializan dentro de tareas explícitas autorizadas
- input scaffold `project-resources/README.md`
- política Git y seguridad; sin expedientes detallados de revisión/research del mantenedor
- licencia principal de CN Pilot Core en `LICENSE`
