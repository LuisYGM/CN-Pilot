# Configuración de OpenAI Codex

CN Pilot detecta el workspace de Codex mediante `AGENTS.md`, agentes nativos en `.codex/agents/` y skills en `.agents/skills/`. El agente raíz de Codex conserva la coordinación de Jefe de proyecto; los cinco especialistas se cargan como subagentes nativos.

## Inicio

1. Abre la raíz del repositorio CN Pilot en Codex.
2. Comprueba que el agente raíz reconoce las instrucciones de `AGENTS.md`.
3. Para orientar un proyecto nuevo o existente, describe el objetivo normalmente o invoca `$cnp-nuevo-proyecto`.
4. Si quieres llamar un flujo existente, usa su skill nativa `$cnp-*`, por ejemplo `$cnp-plan`, `$cnp-diseno`, `$cnp-depurar` o `$cnp-revision`.

Las entradas `cnp-*` son adaptadores pequeños. Al activarlas, Codex debe cargar `.cn-pilot/adapters/codex/RUNTIME.md` y leer el procedimiento canónico correspondiente bajo `.kilo/skills/` o `.kilo/commands/`, más los recursos referenciados que apliquen. No hay copias alternativas de esos contratos.

Los 14 comandos de Kilo no aparecen como comandos slash de Codex. Sus equivalentes son skills: `cn-actualizar` → `$cnp-cn-actualizar`, `cn-estado` → `$cnp-cn-estado`, `commit` → `$cnp-commit`, `contenido` → `$cnp-contenido`, `depurar` → `$cnp-depurar`, `desplegar-pruebas` → `$cnp-desplegar-pruebas`, `diagnostico` → `$cnp-diagnostico`, `diseno` → `$cnp-diseno`, `entrega` → `$cnp-entrega`, `nuevo-proyecto` → `$cnp-nuevo-proyecto`, `plan` → `$cnp-plan`, `preparar-despliegue` → `$cnp-preparar-despliegue`, `punto-control` → `$cnp-punto-control` y `revision` → `$cnp-revision`.

## Permisos y delegación

Los TOML de `.codex/agents/` definen rol, descripción e instrucciones. No asignan modelo ni pueden fijar la sandbox o las aprobaciones efectivas. Los subagentes heredan los límites de la sesión raíz; la conducta solicitada a Revisor tampoco constituye un control técnico de solo lectura. Para una revisión estrictamente read-only, usa una sesión cuyo sandbox raíz lo imponga.

La delegación es opcional y proporcional. Mantén a Jefe de proyecto como coordinador y único escritor de Project Context. Los agentes nativos no se consideran aislados en otro filesystem, branch o worktree; evita escritores paralelos con archivos compartidos. Conserva una referencia concreta al worktree antes de delegar escrituras independientes.

El runtime puede mostrar las skills nuevas al actualizar el repositorio. Si una skill no aparece, revisa que el workspace sea la raíz correcta, que `.agents/skills/cnp-*/SKILL.md` exista como archivo regular y reinicia la sesión si Codex aún conserva el índice anterior.

## Actualizar CN Pilot desde Codex

Con CN Pilot 3.2.0 o posterior, invoca `$cnp-cn-estado` o `$cnp-cn-actualizar`. En 3.1.2, el updater ya acepta `--runtime codex` para actualizar sin Kilo, pero esa versión puente todavía no incluye estas skills ni los agentes nativos; ejecuta el CLI documentado en [Actualizaciones](ACTUALIZACIONES.md) directamente desde el entorno que pueda iniciar Node. El primer salto desde 3.1.1 debe ejecutarse desde Kilo, porque su updater anterior exige ese runtime.

Esta integración no incluye credenciales, configuración personal de Codex, modelos, MCP ni políticas de aprobación. Configúralos únicamente en la superficie que Codex documenta y según el acceso de la sesión.
