---
description: Diagnostica localmente la integridad estructural del Core de CN Pilot sin modificarlo.
agent: dev-lead
---

# Diagnóstico de CN Pilot

Comando manual, read-only y local para responder únicamente: «¿La infraestructura técnica de CN Pilot está suficientemente íntegra y coherente para operar?». Diagnostica CN Pilot Core en la carpeta actual, no la aplicación ni el contenido de negocio. No es gate rutinario ni sustituye tests de proyecto, Reviewer o QA especializado.

## Fresh Diagnostic Snapshot — cada invocación

Cada ejecución obtiene una instantánea nueva del filesystem local actual antes de clasificar. No reutilices resultados ni lecturas de otra ejecución de `/doctor`, aunque ocurriera momentos antes en la misma conversación/sesión. El conocimiento estable de qué comprobar se conserva; los valores observados se vuelven a leer.

Al inicio de **cada** invocación, vuelve a consultar de forma read-only y proporcional:

- Si Node está disponible y el comando está permitido, ejecuta únicamente `node .cn-pilot/qa/core-check.mjs --json` y toma ese resultado como snapshot fresco para versión, rutas, inventarios, MANIFEST, routing y permisos determinísticos. Es read-only, usa solo APIs built-in y no instala paquetes.
- Si Node/QA no está disponible, no se permite su ejecución, devuelve exit `2` o el JSON no puede validarse, clasifica QA como `UNAVAILABLE` (no `BROKEN`) y sigue el fallback manual read-only enumerado bajo “Alcance del diagnóstico”.
- Exit `0` incluye `PASS` o `WARN`; exit `1` indica invariantes `FAIL`; exit `2` es usage/runtime error y no prueba por sí solo que Core esté roto.
- Tras un snapshot QA válido no repitas inspecciones determinísticas sin una contradicción concreta; añade solo el juicio diagnóstico que el checker no cubra.

No uses la ejecución previa como PASS ni para mantener conteos, MANIFEST, permisos, routing o inventarios en PASS: estado previo ≠ evidencia actual suficiente. Limita la relectura a ese scope; no releas contenido de negocio ni audites el repositorio completo. Sigue el orden `fresh local snapshot → comparar invariantes → clasificar HEALTHY/WARNINGS/BROKEN → reportar → STOP`.

## Alcance del diagnóstico

Usa la lista manual siguiente **solo como fallback** cuando Executable Core QA esté `UNAVAILABLE`, o para investigar una finding concreta sin repetir checks ya `PASS`.

1. **Versión y Core:** confirma `.cn-pilot-version`, SemVer no vacía, y existencia de los indispensables: `AGENTS.md`, `.cn-pilot/CORE.md`, `.cn-pilot/MANIFEST.md`, `.cn-pilot/config/responsive.json`, `.cn-pilot/docs/`, `.cn-pilot/profiles/`, `.cn-pilot/templates/`, `kilo.jsonc`, agentes Dev Lead/Reviewer y comandos `new-project`, `checkpoint`, `review` y `doctor`. La ausencia de `project-resources/README.md` es WARNINGS por scaffold esperado, no BROKEN. `product/` y `project-artifacts/` no son Core ni son obligatorios antes de implementation/output; no los exijas ni audites su contenido. Versión antigua pero válida no es error. No compares con releases/web. No exijas README ni Project Context; `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md` son mutables.
2. **Agents:** enumera `.kilo/agents/*.md`; confirma frontmatter delimitado y `description` y `mode` legibles. Dev Lead y Reviewer deben existir. Contrasta referencias explícitas a agentes y destinos permitidos de `task` desde Dev Lead con nombres de archivos reales; no hardcodees el total ni atribuyas nombre de agente a palabras genéricas.
3. **Skills:** enumera las carpetas inmediatas de `.kilo/skills/` y los archivos `SKILL.md`; confirma que cada carpeta de skill contiene su `SKILL.md` y frontmatter mínimo legible con `name`/`description`. Revisa solo referencias canónicas expresas en routing de agentes y commands: si una skill se menciona como destino de activación debe existir. No interpretes arbitrariamente cada backtick como referencia a skill.
4. **Commands:** enumera `.kilo/commands/*.md`. Cada comando debe tener frontmatter con `description` y `agent`, y cada `agent` declarado debe existir. No uses el conteo esperado fijo: compáralo con MANIFEST.
5. **Rutas operativas:** valida determinísticamente los destinos de `task` permitidos/ruteados por Dev Lead, los agentes indicados por commands, las skills explícitamente ruteadas y las rutas Core citadas por comandos cuando su existencia pueda comprobarse directamente. No hagas link-check universal.
6. **Permisos críticos:** inspecciona estáticamente `.kilo/agents/reviewer.md`. Debe permitir `read`, `glob`, `grep` según su contrato y declarar explícitamente `bash`, `websearch`, `webfetch`, `skill`, `task`, `agent_manager`, `write`, `edit` y `apply_patch: deny`. Si una denegación falta, no es explícita o queda debilitada de modo que permita la capacidad protegida, es BROKEN. Comprueba en Dev Lead solo que conserva `task`/allow para los destinos que realmente enruta. No cambies ni pruebes escrituras/permisos.
7. **MANIFEST:** cuenta desde filesystem agentes, skills, commands, `.cn-pilot/profiles/` y cualquier otra categoría que MANIFEST numere explícitamente (incluidas referencias/plantillas declaradas bajo `.cn-pilot/`). MANIFEST resume, no es autoridad sobre el filesystem. Diferencias de conteo son normalmente WARNINGS, salvo que también revelen infraestructura requerida ausente.

Usa inspección local (glob/read/grep y conteos de archivos); si el directorio es oculto, consulta su ruta explícita. Lee solo metadatos, frontmatter y routing necesarios; no inspecciones contenido editorial o archivos de usuario ajenos a comprobar estructura. No hace falta parsear completamente YAML/JSONC/Markdown: marca como problema solo evidencia clara de estructura requerida ilegible. Runtime introspection es opcional si existe una capacidad local read-only fiable; no inventes comandos ni trates su ausencia como BROKEN.

## Severidad y salida

- **HEALTHY:** versión/Core requeridos existen, routing y permisos críticos son coherentes, componentes resolubles y sin discrepancias materiales de inventario.
- **WARNINGS:** drift no bloqueante, como MANIFEST desactualizado, metadata secundaria incompleta o runtime no introspectable. Cada warning incluye categoría/código breve, archivo/área, evidencia, impacto y acción sugerida (sin ejecutarla).
- **BROKEN:** falla material que compromete operación o control, como Core esencial ausente, versión inválida, command a agente inexistente, frontmatter operativo inutilizable, destino crítico irresoluble o invariante protegida de Reviewer rota. Describe evidencia exacta y acción sugerida; no la apliques.

Si coexisten resultados, cualquier BROKEN determina el estado global; si no, cualquier warning determina WARNINGS. Resume checks de versión/Core, agentes, skills, commands, routing, permisos críticos y MANIFEST con PASS/WARN/FAIL según evidencia. Diferencia ausencia de prueba de evidencia de fallo y evita falsos positivos por imperfecciones editoriales. La falta del runtime deja QA en `UNAVAILABLE`, pero permite seguir con este diagnóstico manual.

Formato breve:

```text
CN Pilot Health Check
Version: <versión local o inválida/no disponible>
Status: HEALTHY | WARNINGS | BROKEN
Core QA: PASS | WARN | FAIL | UNAVAILABLE
Checks: Core · Agents · Skills · Commands · Routing · Critical permissions · MANIFEST
[Warnings/Broken: código/categoría, archivo, evidencia, impacto, acción sugerida]
```

## Read-only y activación

Ejecútalo solo por petición explícita o si Dev Lead observa una señal concreta de posible corrupción/desalineación del CN Pilot y lo recomienda. Nunca lo ejecutes automáticamente desde `/new-project`, checkpoint, antes de commit/Reviewer, en una tarea normal, Completion Mode ni al abrir sesión. No uses web, Reviewer, Agent Manager, npm/npx, scripts distintos del checker Core permitido, hooks o auto-repair. Ejecutar el checker read-only no autoriza escrituras. No modifiques archivos, `STATE.md`, MANIFEST ni artefactos; no crees commit ni hagas push. Diagnostica → informa HEALTHY/WARNINGS/BROKEN/QA UNAVAILABLE → STOP. Una reparación solicitada será una tarea separada.
