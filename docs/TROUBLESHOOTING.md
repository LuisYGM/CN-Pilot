# Troubleshooting

Problemas operativos frecuentes del Blueprint. Para la primera puesta en marcha, empieza por [Empieza aquí](START-HERE.md).

## Git no está inicializado

**Síntoma:** `git status` indica que la carpeta no es un repositorio.

**Comportamiento esperado:** el Blueprint continúa trabajando, verifica los archivos directamente y no registra la ausencia de Git como bloqueo. No ejecuta `git init` salvo petición explícita o alcance confirmado.

`/commit` sí requiere Git y debe detener únicamente ese comando. `/new-project`, `/checkpoint`, `/review`, `/handoff` y `/pre-deploy` pueden operar sin Git. Las ramas, hashes, commits y worktrees no están disponibles.

## El MCP no está disponible

**Síntoma:** el servidor no aparece, no conecta o la herramienta requerida no está autorizada.

1. Confirma que MCP forma parte del alcance; no lo actives por rutina.
2. Revisa la configuración efectiva y el template `templates/mcp/kilo.example.jsonc`.
3. Verifica URL, estado `enabled`, autenticación y permisos sin copiar secretos al repositorio.
4. Valida la conexión antes de publicar o modificar el sistema objetivo.
5. Si no puede utilizarse, detén el flujo en contenido, diseño, código o handoff manual según lo acordado.

La falta de MCP no impide que el Blueprint produzca un entregable completo para continuación manual.

## Un subagente usa un modelo inesperado

Los agentes del repositorio no fijan modelos. La selección procede de la configuración personal de Kilo y de la sesión activa. Una asignación `agent.<id>.model` en la configuración global puede mapear cada agente; si no existe, Kilo usa la selección heredada aplicable.

1. Revisa `~/.config/kilo/kilo.jsonc` y cualquier archivo señalado por `KILO_CONFIG`.
2. Comprueba el modelo y la variante activos en Kilo.
3. Verifica que el ID del agente coincida con `dev-lead`, `architect`, `reviewer` u otro agente real.
4. Recarga Kilo o inicia una sesión nueva después de cambiar la configuración.

Las sesiones nuevas de Agent Manager heredan por defecto el modelo y la variante de la sesión que las crea, salvo que se indique un override. Consulta [Estrategia de modelos](MODEL-STRATEGY.md).

## La configuración global y la del proyecto no coinciden

La configuración global bajo `~/.config/kilo/` pertenece al desarrollador y no se clona. `kilo.jsonc` pertenece al proyecto y contiene únicamente configuración compartible. Kilo combina sus capas de configuración; una capa de mayor prioridad puede cambiar el resultado efectivo.

- Modelos, preferencias y autenticación: configuración personal.
- Reglas y ajustes compartibles del proyecto: `kilo.jsonc`.
- Secretos: mecanismo seguro local, OAuth o variables admitidas; nunca Git.
- Overrides locales ignorados: `kilo.local.json` o `kilo.local.jsonc`, cargados mediante un mecanismo compatible como `KILO_CONFIG`.

No copies una configuración global completa dentro del repositorio para resolver una diferencia local.

## Dev Lead alcanza el límite de pasos

`dev-lead` dispone actualmente de 60 pasos. Un flujo estructural largo puede necesitar continuidad.

- No fuerces un commit si la unidad está incompleta o tiene errores bloqueantes.
- Conserva los artefactos y resultados ya válidos; no reinicies discovery, arquitectura, tests o review sin motivo.
- Actualiza `STATE.md` solo si existe un cambio operativo material o un checkpoint relevante.
- Continúa en una sesión nueva indicando el objetivo pendiente y reutilizando el contexto del repositorio.
- Ejecuta `/checkpoint` cuando una unidad lógica esté terminada y verificada, no solo porque se aproxima el límite.

## Agent Manager o un worktree causa confusión

Los subagentes normales no necesitan un worktree. Agent Manager se reserva para aislamiento real o trabajo independiente y los worktrees requieren un repositorio Git.

Antes de integrar, identifica qué rama y carpeta contienen el trabajo, revisa sus cambios y elige un único método: Apply de Agent Manager, merge controlado o Pull Request. No uses `git stash` para mover cambios entre worktrees porque el stash se comparte entre ellos.

Una sesión finalizada no demuestra que el worktree o su carpeta se hayan eliminado.

## Quedan worktrees o carpetas residuales

Distingue siempre:

1. sesión finalizada;
2. worktree todavía registrado por Git;
3. carpeta física todavía presente;
4. carpeta huérfana bajo `.kilo/worktrees/` que Git ya no registra.

Para limpiar un worktree temporal: conserva primero el resultado, comprueba que no tenga cambios pendientes, consulta `git worktree list`, usa un mecanismo seguro de eliminación, ejecuta `git worktree prune` cuando corresponda y vuelve a verificar listado y ruta.

No elimines automáticamente un worktree con cambios ni una carpeta huérfana cuyo origen no puedas demostrar. No edites `.kilo/agent-manager.json` para forzar el estado.

## Aparecen secretos o configuración local en los cambios

Detén el commit. No pegues credenciales en prompts, documentación, manifests o archivos versionados.

- `.env`, sus variantes sensibles y `secrets/**` deben quedar fuera de Git.
- `kilo.local.json` y `kilo.local.jsonc` están destinados a configuración local ignorada.
- Los ejemplos bajo `templates/` deben conservar placeholders y permanecer inactivos.
- Si un secreto llegó al historial o a un remoto, revócalo y sigue el procedimiento de seguridad del proveedor; borrarlo del archivo actual no basta.

Consulta [Configuración](CONFIGURATION.md#archivos-locales-y-secretos) y [Seguridad](SECURITY.md).

## Un comando parece requerir Git

Solo `/commit` depende estrictamente de Git. `/checkpoint` crea commit únicamente si Git existe; en caso contrario verifica por archivos. `/review`, `/handoff`, `/new-project` y `/pre-deploy` también contemplan carpetas sin Git.

`/deploy-staging` requiere un entorno staging y un método de deployment documentado, no necesariamente Git. Agent Manager con worktrees, ramas, hashes, commits, merge, rebase, Pull Requests y `git worktree` sí dependen de Git.

## El deployment no puede ejecutarse

Comprueba que deployment forma parte del alcance, existe un método aprobado y están definidos backup, smoke test y rollback. El archivo `templates/deploy/github-actions.yml` está bloqueado deliberadamente y no despliega hasta que se copie, adapte y verifique.

Si falta método, autorización o acceso, prepara un handoff y detente. Nunca improvises credenciales ni despliegues a producción sin aprobación.
