# Troubleshooting

Problemas operativos frecuentes de CN Pilot. Para la primera puesta en marcha, empieza por [Empieza aquí](EMPIEZA-AQUI.md).

## Git no está inicializado

**Síntoma:** `git status` indica que la carpeta no es un repositorio.

**Comportamiento esperado:** el CN Pilot continúa trabajando, verifica los archivos directamente y no registra la ausencia de Git como bloqueo. No ejecuta `git init` salvo petición explícita o alcance confirmado.

`/commit` sí requiere Git y debe detener únicamente ese comando. `/nuevo-proyecto`, `/punto-control`, `/revision`, `/entrega` y `/preparar-despliegue` pueden operar sin Git. Las ramas, hashes, commits y worktrees no están disponibles.

## El MCP no está disponible

**Síntoma:** el servidor no aparece, no conecta o la herramienta requerida no está autorizada.

1. Confirma que se solicitó la integración; su ausencia antes de una solicitud es normal.
2. Descubre el servidor, capabilities y configuración local disponible en Kilo; el template no incluye un ejemplo MCP genérico.
3. Durante una tarea explícita de setup, prepara solo los campos no secretos que correspondan al esquema real y guía la configuración local del usuario. No pidas, leas ni copies secretos.
4. Valida capabilities disponibles y autorización antes de publicar o modificar el sistema objetivo.
5. Si no puede utilizarse, detén el flujo en contenido, diseño, código o handoff manual según lo acordado.

La falta de MCP no impide que el CN Pilot produzca un entregable completo para continuación manual.

## Un subagente usa un modelo inesperado

Los agentes del repositorio no fijan modelos. La selección procede de la configuración personal de Kilo y de la sesión activa. Una asignación `agent.<id>.model` en la configuración global puede mapear cada agente; si no existe, Kilo usa la selección heredada aplicable.

1. Revisa `~/.config/kilo/kilo.jsonc` y cualquier archivo señalado por `KILO_CONFIG`.
2. Comprueba el modelo y la variante activos en Kilo.
3. Verifica que el ID del agente coincida con `jefe-proyecto`, `arquitecto`, `revisor` u otro agente real.
4. Recarga Kilo o inicia una sesión nueva después de cambiar la configuración.

Las sesiones nuevas de Agent Manager pueden heredar el modelo y la variante de la sesión que las crea, salvo configuración del desarrollador. Consulta [Configuración de IA en Kilo](ESTRATEGIA-DE-MODELOS.md).

Si la herencia multiplica el coste de sesiones paralelas, revisa tu configuración en Kilo antes de iniciarlas. Jefe de proyecto no impone overrides de modelos.

## Agent Manager abre demasiadas sesiones o paraleliza sin necesidad

SERIAL es el modo por defecto. Usa `task` para una unidad sin aislamiento; sus writers comparten el worktree padre. Usa Agent Manager `worktree` solo para writers independientes con branch/checkout propio; las sesiones `local` comparten archivos y no permiten writers simultáneos. READ-ONLY puede coincidir cuando las preguntas sean independientes y el estado esté estable.

Limita el paralelo a dos unidades por defecto y tres como máximo solo con independencia clara, integración barata y beneficio/capacidad demostrables. No hagas swarm ni multipliques research/tests/evidencia. Si falta Agent Manager, worktree o permiso, continúa en SERIAL sin bloquear el trabajo.

## La configuración global y la del proyecto no coinciden

La configuración global bajo `~/.config/kilo/` pertenece al desarrollador y no se clona. `kilo.jsonc` pertenece al proyecto y contiene únicamente configuración compartible. Kilo combina sus capas de configuración; una capa de mayor prioridad puede cambiar el resultado efectivo.

- Modelos, preferencias y autenticación: configuración personal.
- Reglas y ajustes compartibles del proyecto: `kilo.jsonc`.
- Secretos: mecanismo seguro local, OAuth o variables admitidas; nunca Git.
- Overrides locales ignorados: `kilo.local.json` o `kilo.local.jsonc`, cargados mediante un mecanismo compatible como `KILO_CONFIG`.

No copies una configuración global completa dentro del repositorio para resolver una diferencia local.

## La tarea se interrumpió antes de completarse

Una interrupción del runtime puede detener un flujo estructural antes de completarse.

- No fuerces un commit si la unidad está incompleta o tiene errores bloqueantes.
- Conserva los artefactos y resultados ya válidos; no reinicies discovery, arquitectura, tests o review sin motivo.
- Actualiza `ESTADO.md` solo si existe un cambio operativo material o un checkpoint relevante.
- Continúa en una sesión nueva indicando el objetivo pendiente y reutilizando el contexto del repositorio.
- Ejecuta `/punto-control` cuando una unidad lógica esté terminada y verificada, no solo porque se haya producido una interrupción.

## Agent Manager o un worktree causa confusión

Los `task` normales no aíslan el filesystem. En Agent Manager, `worktree` crea un checkout/branch independiente; `local` comparte el worktree y solo admite paralelo read-only seguro. El uso de worktrees requiere Git; si no está disponible, sigue SERIAL.

Antes de integrar, identifica base/branch/worktree/HEAD y revisa el scope/diff. Jefe de proyecto integra una unidad a la vez mediante el método local o nativo más sencillo disponible (Apply a local, cherry-pick o merge según el flujo real). No hay auto-merge; no uses `git stash`, que se comparte entre worktrees. Push/PR requiere la autorización vigente.

Una sesión finalizada no demuestra que el worktree o su carpeta se hayan eliminado; el cierre de sesión tampoco implica descartar los cambios.

## Quedan worktrees o carpetas residuales

Distingue siempre:

1. sesión finalizada;
2. worktree todavía registrado por Git;
3. carpeta física todavía presente;
4. carpeta huérfana bajo `.kilo/worktrees/` que Git ya no registra.

Para limpiar un worktree temporal: integra o conserva primero el resultado; consulta `Agent Manager list`, `git worktree list` y el status/branch del path. Solo cierra/elimina el checkout cuando esté limpio e integrado o su descarte seguro esté resuelto. Prefiere el cierre nativo; `kilo worktree remove` puede borrar también la branch. Usa `git worktree prune` solo ante registro realmente stale y vuelve a verificar.

No elimines automáticamente un worktree con cambios ni una carpeta huérfana cuyo origen no puedas demostrar. No edites `.kilo/agent-manager.json` para forzar el estado.

## Aparecen secretos o configuración local en los cambios

Detén el commit. No pegues credenciales en prompts, documentación, manifests o archivos versionados.

- `.env`, sus variantes sensibles y `secrets/**` deben quedar fuera de Git.
- `kilo.local.json` y `kilo.local.jsonc` están destinados a configuración local ignorada.
- Los ejemplos bajo `.cn-pilot/plantillas/` deben conservar placeholders y permanecer inactivos.
- Si un secreto llegó al historial o a un remoto, revócalo y sigue el procedimiento de seguridad del proveedor; borrarlo del archivo actual no basta.

Consulta [Configuración](CONFIGURACION.md#archivos-locales-y-secretos) y [Seguridad](SEGURIDAD.md).

## Un comando parece requerir Git

Solo `/commit` depende estrictamente de Git. `/punto-control` crea commit únicamente si Git existe; en caso contrario verifica por archivos. `/revision`, `/entrega`, `/nuevo-proyecto` y `/preparar-despliegue` también contemplan carpetas sin Git.

`/desplegar-pruebas` requiere un entorno staging y un método de deployment documentado, no necesariamente Git. Agent Manager con worktrees, ramas, hashes, commits, merge, rebase, Pull Requests y `git worktree` sí dependen de Git.

## El deployment no puede ejecutarse

La ausencia de un workflow es el estado esperado hasta que se solicite configurar deployment. Solo una tarea explícita con método, destino/entorno, alcance y autorización suficientes genera un workflow específico para el proyecto. Si faltan, prepara un handoff de lo pendiente y no crees ni ejecutes el workflow. No se habilitan triggers automáticos sin intención y autorización explícitas; publicar en producción mantiene su propia aprobación.

Si falta método, autorización o acceso, prepara un handoff y detente. Nunca improvises credenciales ni despliegues a producción sin aprobación.
