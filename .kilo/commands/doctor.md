---
description: Diagnostica localmente la integridad estructural del Web Project Blueprint sin modificarlo.
agent: dev-lead
---

# Blueprint Doctor

Comando manual, read-only y local para responder únicamente: «¿La infraestructura de este Blueprint está suficientemente íntegra y coherente para operar?». Diagnostica el Blueprint/Core de la carpeta actual, no la aplicación ni el contenido de negocio. No es gate rutinario ni sustituye tests de proyecto, Reviewer o QA especializado.

## Alcance del diagnóstico

1. **Versión y Core:** confirma `.blueprint-version`, SemVer no vacía, y existencia de los indispensables: `AGENTS.md`, `BLUEPRINT.md`, `MANIFEST.md`, `kilo.jsonc`, agentes Dev Lead/Reviewer y comandos `new-project`, `checkpoint`, `review` y `doctor`. Versión antigua pero válida no es error. No compares con releases/web. No exijas README ni Project Context; `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md` son mutables.
2. **Agents:** enumera `.kilo/agents/*.md`; confirma frontmatter delimitado y `description` y `mode` legibles. Dev Lead y Reviewer deben existir. Contrasta referencias explícitas a agentes y destinos permitidos de `task` desde Dev Lead con nombres de archivos reales; no hardcodees el total ni atribuyas nombre de agente a palabras genéricas.
3. **Skills:** enumera las carpetas inmediatas de `.kilo/skills/` y los archivos `SKILL.md`; confirma que cada carpeta de skill contiene su `SKILL.md` y frontmatter mínimo legible con `name`/`description`. Revisa solo referencias canónicas expresas en routing de agentes y commands: si una skill se menciona como destino de activación debe existir. No interpretes arbitrariamente cada backtick como referencia a skill.
4. **Commands:** enumera `.kilo/commands/*.md`. Cada comando debe tener frontmatter con `description` y `agent`, y cada `agent` declarado debe existir. No uses el conteo esperado fijo: compáralo con MANIFEST.
5. **Rutas operativas:** valida determinísticamente los destinos de `task` permitidos/ruteados por Dev Lead, los agentes indicados por commands, las skills explícitamente ruteadas y las rutas Core citadas por comandos cuando su existencia pueda comprobarse directamente. No hagas link-check universal.
6. **Permisos críticos:** inspecciona estáticamente `.kilo/agents/reviewer.md`. Debe permitir `read`, `glob`, `grep` según su contrato y declarar explícitamente `bash`, `websearch`, `webfetch`, `skill`, `task`, `agent_manager`, `write`, `edit` y `apply_patch: deny`. Si una denegación falta, no es explícita o queda debilitada de modo que permita la capacidad protegida, es BROKEN. Comprueba en Dev Lead solo que conserva `task`/allow para los destinos que realmente enruta. No cambies ni pruebes escrituras/permisos.
7. **MANIFEST:** cuenta desde filesystem agentes, skills, commands, profiles y cualquier otra categoría que MANIFEST numere explícitamente (incluidas referencias/plantillas declaradas). MANIFEST resume, no es autoridad sobre el filesystem. Diferencias de conteo son normalmente WARNINGS, salvo que también revelen infraestructura requerida ausente.

Usa inspección local (glob/read/grep y conteos de archivos); si el directorio es oculto, consulta su ruta explícita. Lee solo metadatos, frontmatter y routing necesarios; no inspecciones contenido editorial o archivos de usuario ajenos a comprobar estructura. No hace falta parsear completamente YAML/JSONC/Markdown: marca como problema solo evidencia clara de estructura requerida ilegible. Runtime introspection es opcional si existe una capacidad local read-only fiable; no inventes comandos ni trates su ausencia como BROKEN.

## Severidad y salida

- **HEALTHY:** versión/Core requeridos existen, routing y permisos críticos son coherentes, componentes resolubles y sin discrepancias materiales de inventario.
- **WARNINGS:** drift no bloqueante, como MANIFEST desactualizado, metadata secundaria incompleta o runtime no introspectable. Cada warning incluye categoría/código breve, archivo/área, evidencia, impacto y acción sugerida (sin ejecutarla).
- **BROKEN:** falla material que compromete operación o control, como Core esencial ausente, versión inválida, command a agente inexistente, frontmatter operativo inutilizable, destino crítico irresoluble o invariante protegida de Reviewer rota. Describe evidencia exacta y acción sugerida; no la apliques.

Si coexisten resultados, cualquier BROKEN determina el estado global; si no, cualquier warning determina WARNINGS. Resume checks de versión/Core, agentes, skills, commands, routing, permisos críticos y MANIFEST con PASS/WARN/FAIL según evidencia. Diferencia ausencia de prueba de evidencia de fallo y evita falsos positivos por imperfecciones editoriales.

Formato breve:

```text
Blueprint Doctor
Version: <versión local o inválida/no disponible>
Status: HEALTHY | WARNINGS | BROKEN
Checks: Core · Agents · Skills · Commands · Routing · Critical permissions · MANIFEST
[Warnings/Broken: código/categoría, archivo, evidencia, impacto, acción sugerida]
```

## Read-only y activación

Ejecútalo solo por petición explícita o si Dev Lead observa una señal concreta de posible corrupción/desalineación del Blueprint y lo recomienda. Nunca lo ejecutes automáticamente desde `/new-project`, checkpoint, antes de commit/Reviewer, en una tarea normal, Completion Mode ni al abrir sesión. No uses web, Reviewer, Agent Manager, scripts, hooks o auto-repair. No modifiques archivos, `STATE.md`, MANIFEST ni artefactos; no crees commit ni hagas push. Diagnostica → informa HEALTHY/WARNINGS/BROKEN → STOP. Una reparación solicitada será una tarea separada.
