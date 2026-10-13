# Actualizaciones de CN Pilot Core

CN Pilot se actualiza solo por solicitud explícita. `/cn-status` consulta la rama estable `main`; `/cn-update` instala archivos framework gestionados, verifica Core QA y crea un commit local. No hay auto-update, polling, channels alternativos, GitHub Releases, tags ni push.

## Ownership

La distribución de `.cn-pilot/update/manifest.json` registra SemVer, source repository/branch/commit, compatibilidad mínima, migraciones y el inventario exacto con SHA-256 de los archivos administrados. El hash normaliza únicamente CRLF→LF para que line endings de Windows no aparezcan como personalización. El manifiesto es metadata baseline y no se incluye a sí mismo en su lista (evita un hash recursivo); su estructura y versión se validan por separado.

V1 gestiona únicamente `AGENTS.md`, `.cn-pilot/**` excepto `.cn-pilot/runtime/**` y el propio manifest (metadata especial), `.kilo/agents/**`, `.kilo/skills/**`, `.kilo/commands/**` y `.cn-pilot-version`. Solo paths declarados en el manifest se aplican. El allowlist rechaza traversal, paths absolutos, symlinks y fuera de raíces.

Project-owned y fuera de overwrite automático: Project Context (`PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md`, `ARTIFACTS.md`), `README.md`, `product/`, `project-resources/`, `project-artifacts/`, configuración local/mixta (`kilo.jsonc`, `.gitignore`, `.editorconfig`, `.gitattributes`), `.env*`, secrets, runtime, base de datos, uploads, contenido, diseño, assets y datos de proyecto. Una futura migración semántica de esos datos requiere implementación y aprobación propia; V1 no la ejecuta.

## `/cn-status`

Solo bajo invocación manual: clona shallow la rama `main` canónica a un subdirectorio temporal dentro de `.cn-pilot/runtime/`, verifica repo/branch/manifest/hashes y limpia el temporal. No cambia tracked files, versión, configuración Git ni remotes del proyecto. Informa versión instalada/latest, compatibilidad de Node/Kilo, baseline, cambios locales, conflictos, migraciones y active task. El source commit real se obtiene del checkout temporal; el campo `sourceCommit` del manifest puede ser `null` al generarse antes del commit que incorpora la distribución, evitando autorreferencia.

## `/cn-update`

El comando exige invocación explícita. Preflight exige Git en su raíz, branch y HEAD disponibles, ausencia de tracked changes y ausencia de `ACTIVE`, `INTERRUPTED`, `BLOCKED`/`BLOCKED_*` o `FAILED` en `active-task.json`. Un checkpoint ausente es válido. Untracked files no bloquean salvo colisión con un archivo a agregar/reemplazar. No hay stash, reset, clean, remote persistente, pull, merge o Git remoto mutante.

El plan compara `local` vs baseline instalada vs hashes de `main`. Se actualiza cuando local coincide con baseline y upstream cambió; se agregan archivos nuevos sin colisión y se elimina un archivo solo si local coincide con baseline y upstream lo retiró. Modificaciones locales cuyo upstream no cambió, y borrados locales cuyo upstream no cambió, se preservan mientras avanza la baseline. Cambios divergentes concurrentes, paths symlink/unsafe y colisiones se reportan y bloquean antes del primer write. No hay merge automático.

Tras el plan seguro se verifican hashes de cada fuente; se instalan solo los paths administrados, se actualizan versión y manifest, y Core QA debe dar `PASS` antes de stage/commit. El commit añade únicamente paths de la actualización. Un fallo deja cambios/evidencia para inspección, sin commit falso ni rollback destructivo automático. Un fallo post-commit se reporta como tal sin alterar el commit. Push no se ejecuta.

## Legacy bootstrap

Una instalación previa no tiene baseline: su `.cn-pilot-version` no permite distinguir una copia oficial de una personalización. No se reconstruye una historia de snapshots ni se presupone que todos los archivos del número SemVer sean iguales.

Para el primer bootstrap, en el root Git del proyecto legacy y solo después de cerrar cualquier tarea activa:

1. Comprueba que `git status --short` no muestre cambios tracked. Conserva untracked resources; no deben colisionar con paths managed que el bootstrap vaya a crear.
2. Obtén la copia portable del master dentro de runtime ignorado:

   ```sh
   mkdir -p .cn-pilot/runtime
   git clone --depth 1 --branch main --single-branch --no-tags https://github.com/LuisYGM/cn-pilot.git .cn-pilot/runtime/cn-pilot-update-source
   ```

3. Presenta el plan legacy sin escribir:

   ```sh
   node .cn-pilot/runtime/cn-pilot-update-source/.cn-pilot/update/updater.mjs bootstrap --target . --source-dir .cn-pilot/runtime/cn-pilot-update-source
   ```

   Revisar cada archivo `LEGACY BOOTSTRAP MODE` listado; los contenidos divergentes no se pueden clasificar sin baseline. Si un archivo debe conservar su contenido local, volver a ejecutar con `--preserve <managed-path>` por cada ruta.
4. Solo tras revisar las sobrescrituras enumeradas, reejecutar incluyendo `--approve-legacy`, `--cleanup-source` y los `--preserve` decididos. El bootstrap verifica compatibilidad, manifest fuente, active task y árbol tracked; protege paths project-owned, hace Core QA y commit local. Los paths tracked antiguos ausentes del upstream se conservan y reportan, no se borran porque no existe baseline. Tras commit exitoso elimina solo el clone temporal designado; ante error de cleanup deja una advertencia y el clone inspeccionable.
5. Verifica `git status --short`, commit y Core QA. El runtime del proyecto nunca se borra completo ni se modifican active-task/otros temporales.

Si aparece personalización/framework path que no se revisó, no pases `--approve-legacy`. Conserva el plan y resuelve manualmente antes de continuar. El bootstrap legacy es de una vez; después el manifest ofrece detección precisa de modificaciones locales.

## Versionado y migraciones

`.cn-pilot-version` es `MAJOR.MINOR.PATCH`. PATCH corrige comportamiento compatible; MINOR incorpora capabilities compatibles; MAJOR es para incompatibilidad/migración material. Desde `1.3.0`, cada distribución del Core debe bump SemVer, aunque un BF interno solo no requiera release separado. `main` es stable. No hay versionado de la aplicación cliente.

El manifest reserva `migrations`. V1 publica una lista vacía y bloquea cualquier migración declarada: no ejecuta scripts ni muta Project Context, Product o datos. Futuras migraciones deben registrarse explícitamente con from/to, paths, scope, aprobación e idempotencia/detección antes de habilitar su ejecución.

## Regeneración de distribución por maintainer

Solo al preparar un release compatible después de inspeccionar/revisar el cambio, bump `.cn-pilot-version` y la versión canónica en `CORE.md`, stagea los paths Core previstos para que aparezcan en `git ls-files`, y ejecuta:

```sh
node .cn-pilot/update/updater.mjs manifest
node .cn-pilot/update/updater.mjs verify-manifest
```

El generador ordena paths, excluye runtime, configuración mixta, archivos project-owned y el manifest autorreferente. `verify-manifest` comprueba esquema, versión, inventario Git exacto y hashes upstream. El Core QA de una instalación valida metadata/schema y sincronía de `.cn-pilot-version`, pero **no** compara sus archivos locales contra los hashes baseline: eso permitiría conservar modificaciones de framework válidas. Un update verifica todos los hashes de la distribución upstream antes de cualquier write; no se crean tags/releases automáticamente.
