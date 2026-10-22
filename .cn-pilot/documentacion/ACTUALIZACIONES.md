# Actualizaciones de CN Pilot Core

CN Pilot se actualiza solo por solicitud explícita. `/cn-estado` consulta la rama estable `main`; `/cn-actualizar` instala archivos gestionados y crea un commit local tras Core QA. No hay auto-update, polling, channels alternativos, GitHub Releases, tags ni push.

## Preflight determinista de `/cn-estado` y `/cn-actualizar`

Antes de invocar el updater, determina el Git root real y comprueba los paths literales con Node filesystem (nunca `Glob`). Desde cualquier subdirectorio Git, este probe read-only clasifica los paths sin depender del cwd relativo:

```sh
node -e "const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');let root;try{root=cp.execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim()}catch(e){console.error('GIT_ROOT_NOT_FOUND: '+(e.code||e.message));process.exit(2)}console.log('Git root: '+root);for(const p of ['.cn-pilot/update/updater.mjs','.cn-pilot/update/manifest.json']){try{const s=fs.lstatSync(path.join(root,...p.split('/')));console.log(p+': '+(s.isFile()&&!s.isSymbolicLink()?'present':'UNSAFE'))}catch(e){console.log(p+': '+(e.code==='ENOENT'?'missing':'ERROR '+(e.code||e.message)))}}"
```

Solo updater realmente ausente clasifica como `LEGACY`. Updater presente + manifest ausente es `MANIFEST_MISSING`/baseline ausente (bootstrap manual explícito); manifest existente se valida, y corrupción/schema/hash/runtime unsafe se informa como error bloqueante, nunca como legacy. Root no determinable es error explícito. Con root válido, ejecutar `node "<root>/.cn-pilot/update/updater.mjs" status --target "<root>"` o `update --target "<root>"`; status informa aunque haya checkpoint bloqueante, update lo bloquea. El CLI también descubre el root automáticamente cuando no se pasa `--target`; un target explícito debe ser el root.

## Ownership

La distribución de `.cn-pilot/update/manifest.json` registra SemVer, source repository/branch/commit, compatibilidad mínima, migraciones y el inventario exacto con SHA-256 de los archivos administrados. El hash normaliza únicamente CRLF→LF para que line endings de Windows no aparezcan como personalización. El manifiesto es metadata baseline y no se incluye a sí mismo en su lista (evita un hash recursivo); su estructura y versión se validan por separado.

V1 gestiona únicamente `AGENTS.md`, `.cn-pilot/**` excepto `.cn-pilot/runtime/**` y el propio manifest (metadata especial), `.kilo/agents/**`, `.kilo/skills/**`, `.kilo/commands/**` y `.cn-pilot-version`. Solo paths declarados en el manifest se aplican. El allowlist rechaza traversal, paths absolutos, symlinks y fuera de raíces.

Fuera del overwrite del updater ordinario: contexto de proyecto (`PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md`), `README.md`, `producto/`, `recursos/`, `artefactos/`, configuración local/mixta, `.env*`, secrets, runtime, base de datos, uploads, contenido, diseño, assets y datos de proyecto. Solo `migrate --approve-migration` ejecuta la transformación de ruta de proyecto tras preview y aprobación explícita.

## `/cn-estado`

Solo bajo invocación manual: descubre el Git root y hace el preflight literal anterior; después clona shallow la rama `main` canónica a un subdirectorio temporal dentro de `.cn-pilot/runtime/`, verifica repo/branch/manifest/hashes y limpia el temporal. No cambia tracked files, versión, configuración Git ni remotes del proyecto. Informa versión instalada/latest, compatibilidad de Node/Kilo, baseline, cambios locales, conflictos, migraciones y active task. Un checkpoint inválido se informa como `INVALID` con razón concreta. El source commit real se obtiene del checkout temporal; el campo `sourceCommit` del manifest puede ser `null` al generarse antes del commit que incorpora la distribución, evitando autorreferencia.

## `/cn-actualizar`

El comando exige invocación explícita. Preflight resuelve el Git root real, requiere branch y HEAD disponibles, ausencia de tracked changes y ausencia de `ACTIVE`, `INTERRUPTED`, `BLOCKED`/`BLOCKED_*` o `FAILED` en `active-task.json`. Un checkpoint ausente es válido. Un checkpoint de tarea abierta requiere objeto, `schemaVersion: 1`, enum `status`, `objective` y `nextAction` no vacíos; inválido bloquea con causa concreta, sin reparar, inferir, borrar o sobrescribir. Reader acepta `BLOCKED` heredado bajo el schema y `COMPLETED` histórico como terminal legacy sin campos de recovery; writers emiten solo `ACTIVE`, `INTERRUPTED`, `BLOCKED_HUMAN`, `BLOCKED_EXTERNAL` o `FAILED`, y eliminan al completar. Untracked files no bloquean salvo colisión con un archivo a agregar/reemplazar. No hay stash, reset, clean, remote persistente, pull, merge o Git remoto mutante.

El plan compara `local` vs baseline instalada vs hashes de `main`. Se actualiza cuando local coincide con baseline y upstream cambió; se agregan archivos nuevos sin colisión y se elimina un archivo solo si local coincide con baseline y upstream lo retiró. Modificaciones locales cuyo upstream no cambió, y borrados locales cuyo upstream no cambió, se preservan mientras avanza la baseline. Cambios divergentes concurrentes, paths symlink/unsafe y colisiones se reportan y bloquean antes del primer write. No hay merge automático.

Tras el plan seguro se verifican hashes de cada fuente; se instalan solo los paths administrados, se actualizan versión y manifest, y Core QA debe dar `PASS` antes de stage/commit. El commit añade únicamente paths de la actualización. Un fallo deja cambios/evidencia para inspección, sin commit falso ni rollback destructivo automático. Un fallo post-commit se reporta como tal sin alterar el commit. Push no se ejecuta.

## Migración mayor 1.x → 2.0

El update gestionado instala primero el Core 2.0 y mantiene separado el contenido project-owned. `status` muestra el plan de rutas del proyecto y sus colisiones; no mueve datos. Tras cerrar cualquier tarea activa y obtener autorización explícita para la migración, el owner ejecuta `node .cn-pilot/update/updater.mjs migrate --target <Git-root>` para volver a previsualizar. Sin `--approve-migration` no hay escrituras. La aplicación requiere branch nombrada, tracked working tree limpio, active-task cerrado y ausencia de colisiones.

El plan cubre contexto raíz y containers 1.x → 2.0. Si solo existe la ruta antigua, se renombra sin copiar ni alterar su árbol; si ambas existen y su contenido no coincide, bloquea. Si son equivalentes, elimina únicamente el origen tras comprobar igualdad completa. Paths untracked se trasladan preservando contenido pero no se stagean ni incluyen en el commit; solo se incluyen rutas antes rastreadas. Symlinks y rutas inseguras bloquean. La migración ejecuta Core QA antes del commit local. Un `Existing compatibility exception` detectado en `PROJECT.md` omite `product/`; el root operativo no se reorganiza. Tras finalizar, las rutas legacy ya no aparecen como pendientes en status.

Las rutas managed CN Pilot se actualizan por el manifest; los datos project-owned nunca se tratan como archivos managed a eliminar/agregar. Legacy bootstrap continúa siendo un flujo distinto, sin baseline, y no ejecuta esta migración automáticamente.

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
