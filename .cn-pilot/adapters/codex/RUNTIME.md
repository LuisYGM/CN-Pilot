# Runtime Codex de CN Pilot

Este documento adapta el Core compartido a Codex. Las responsabilidades y procedimientos permanecen en sus fuentes canónicas Kilo; este adaptador explica cómo encontrarlas y aplicar sus límites en Codex.

## Roles

El agente raíz de Codex cumple el rol de Jefe de proyecto según `AGENTS.md` y `.kilo/agents/jefe-proyecto.md`. Para cargar ese contrato, lee el archivo canónico desde el encabezado `# Jefe de proyecto`; omite únicamente el frontmatter y el bloque de permisos Kilo anterior al encabezado.

Los agentes especializados viven en `.codex/agents/`. Cuando uno se active, debe leer su fuente en `.kilo/agents/<rol>.md` desde el encabezado del rol y seguir el contrato completo. Los frontmatters, `mode`, ACL y nombres de herramientas de Kilo no configuran ni autorizan herramientas en Codex.

## Skills y comandos

Los procedimientos canónicos viven en `.kilo/skills/<slug>/SKILL.md` y `.kilo/commands/<slug>.md`. Las skills nativas `cnp-*` son entradas ligeras para el descubrimiento de Codex: al invocarlas, carga este adaptador y después lee el procedimiento canónico completo, incluyendo recursos que este mencione y que hagan falta para la tarea. No resumas ni sustituyas el procedimiento por el texto del adaptador.

En los comandos canónicos, `agent:` describe el routing original de Kilo: en Codex, Jefe de proyecto conserva la coordinación y puede delegar al agente nativo correspondiente. Las referencias `/comando` no son comandos slash de Codex; invoca la skill `cnp-<comando>` correspondiente. Las instrucciones escritas como `skill:` se resuelven hacia la skill nativa `cnp-<slug>`.

## Permisos, delegación y escritura

La sandbox y la política de aprobación efectiva son las de la sesión raíz de Codex. Los TOML de agentes no las amplían ni restringen. La descripción de Revisor como solo lectura expresa intención conductual, no un permiso efectivo; para imponer lectura solamente, inicia Codex con una sandbox de solo lectura.

Los subagentes nativos heredan contexto de permisos y sesión. No supongas aislamiento de filesystem, branch ni worktree. Favorece delegaciones de análisis independientes; serializa escritores que puedan tocar contexto o archivos compartidos. Usa un worktree solo después de comprobar que existe y que el escritor está trabajando ahí.

## Actualización y recuperación

Invoca el updater con runtime explícito para evitar depender de Kilo: `node .cn-pilot/update/updater.mjs status --runtime codex --target .` o `node .cn-pilot/update/updater.mjs update --runtime codex --target .`. La opción selecciona el runtime que se valida; no concede permisos ni cambia la sandbox.

Usa el checkpoint compartido `.cn-pilot/runtime/active-task.json` solo cuando la tarea requiera recuperación según BF-047. El hilo y la sesión de Codex conservan su historial según el host; el checkpoint del proyecto sigue siendo la fuente de recuperación entre sesiones. No confundas el historial del host con un checkpoint escrito en el repositorio.

## Mapeo de herramientas

Si un procedimiento menciona herramientas Kilo, usa la capacidad nativa equivalente de Codex solo cuando esté disponible en esta sesión y dentro de sus permisos. Si no existe equivalencia, informa el límite y ofrece la salida manual segura prevista por el contrato; nunca interpretes la mera mención de una herramienta como autorización.
