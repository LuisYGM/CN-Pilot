# Manifiesto del Blueprint

Inventario de la infraestructura heredada del Blueprint. No sustituye `../ARTIFACTS.md`, que registra entregables específicos del proyecto.

- 7 agentes en `.kilo/agents/`
- 24 skills (`.kilo/skills/*/SKILL.md`)
- 6 documentos de referencia bajo `.kilo/skills/technical-seo/references/` (no son skills adicionales)
- 12 comandos en `.kilo/commands/`
- 7 perfiles en `.blueprint/profiles/`
- 8 archivos de plantilla en la raíz de `.blueprint/templates/` y 17 archivos en total bajo `.blueprint/templates/` (incluye subdirectorios)
- Core portable en `.blueprint/` (config, docs, profiles y templates)
- documentación operativa bajo `.blueprint/docs/`
- registro base de artefactos del proyecto
- configuración responsive versionada en `.blueprint/config/`
- configuración Kilo compartible en `kilo.jsonc` y controles locales en `.gitignore` / `.kilocodeignore`
- política de formato en `.editorconfig` / `.gitattributes` y recomendaciones de extensiones en `.vscode/extensions.json`
- MCP y workflows GitHub Actions opcionales, no preconfigurados en el template; se materializan dentro de tareas explícitas autorizadas
- input scaffold `project-resources/README.md`
- política Git y seguridad; sin expedientes detallados de revisión/research del mantenedor
