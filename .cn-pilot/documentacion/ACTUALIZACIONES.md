# Actualizaciones de CN Pilot Core

CN Pilot se actualiza solo por solicitud explícita. `/cn-estado` consulta la rama estable `main`; `/cn-actualizar` instala archivos gestionados y crea un commit local tras Core QA. No hay auto-update, polling, channels alternativos, GitHub Releases, tags ni push.

## Preflight determinista de `/cn-estado` y `/cn-actualizar`

Antes de invocar el updater, determina el Git root real y comprueba los paths literales con Node filesystem (nunca `Glob`). Desde cualquier subdirectorio Git, este probe read-only clasifica los paths sin depender del cwd relativo:

```sh
node -e "const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');let root;try{root=cp.execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim()}catch(e){console.error('GIT_ROOT_NOT_FOUND: '+(e.code||e.message));process.exit(2)}console.log('Git root: '+root);for(const p of ['.cn-pilot/update/updater.mjs','.cn-pilot/update/manifest.json']){try{const s=fs.lstatSync(path.join(root,...p.split('/')));console.log(p+': '+(s.isFile()&&!s.isSymbolicLink()?'present':'UNSAFE'))}catch(e){console.log(p+': '+(e.code==='ENOENT'?'missing':'ERROR '+(e.code||e.message)))}}"
```

Solo updater realmente ausente clasifica como `LEGACY`. Updater presente + manifest ausente es `MANIFEST_MISSING`/baseline ausente (bootstrap manual explícito); manifest existente se valida, y corrupción/schema/hash/runtime unsafe se informa como error bloqueante, nunca como legacy. Root no determinable es error explícito. Con root válido, ejecutar `node "<root>/.cn-pilot/update/updater.mjs" status --target "<root>"` o `update --target "<root>"`; status informa aunque haya checkpoint bloqueante, update lo bloquea. `--runtime kilo|codex` selecciona runtime y conserva Kilo como valor predeterminado; en modo Codex se valida Node y que el manifest habilite `codex`, sin detectar ni exigir Kilo. Esto prepara el updater para una distribución posterior y no declara completa la integración Codex. El primer salto desde 3.1.1 debe ejecutarse con el updater Kilo existente. El CLI también descubre el root automáticamente cuando no se pasa `--target`; un target explícito debe ser el root.

## Ownership

La distribución de `.cn-pilot/update/manifest.json` registra SemVer, source repository/branch/commit, compatibilidad mínima, migraciones y el inventario exacto con SHA-256 de los archivos administrados. El hash normaliza únicamente CRLF→LF para que line endings de Windows no aparezcan como personalización. El manifiesto es metadata baseline y no se incluye a sí mismo en su lista (evita un hash recursivo); su estructura y versión se validan por separado.

V1 gestiona `AGENTS.md`, `.cn-pilot/**` excepto `.cn-pilot/runtime/**` y el propio manifest (metadata especial), `.kilo/agents/**`, `.kilo/skills/**`, `.kilo/commands/**`, `.agents/skills/**`, `.codex/agents/**` y `.cn-pilot-version`. Solo paths declarados en el manifest se aplican. El allowlist rechaza traversal, paths absolutos, symlinks y fuera de raíces. El puente 3.1.2 reconoce las raíces futuras de Codex, pero no distribuye sus adaptadores. La metadata aditiva `updaterRuntimes` habilita runtimes declarados; los manifests anteriores sin ese campo siguen usando Kilo.

Fuera del overwrite del updater ordinario: contexto de proyecto (`PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md`), `README.md`, `producto/`, `recursos/`, `artefactos/`, configuración local/mixta, `.env*`, secrets, runtime, base de datos, uploads, contenido, diseño, assets y datos de proyecto. Solo `migrate --approve-migration` ejecuta la transformación de ruta de proyecto tras preview y aprobación explícita.

## `/cn-estado`

Solo bajo invocación manual: descubre el Git root y hace el preflight literal anterior; después clona shallow la rama `main` canónica a un subdirectorio temporal dentro de `.cn-pilot/runtime/`, verifica repo/branch/manifest/hashes y limpia el temporal. No cambia tracked files, versión, configuración Git ni remotes del proyecto. Informa versión instalada/latest, runtime seleccionado y compatibilidad de Node/runtime, baseline, cambios locales, conflictos, migraciones y active task. Un checkpoint inválido se informa como `INVALID` con razón concreta. El source commit real se obtiene del checkout temporal; el campo `sourceCommit` del manifest puede ser `null` al generarse antes del commit que incorpora la distribución, evitando autorreferencia.

## `/cn-actualizar`

El comando exige invocación explícita. Preflight resuelve el Git root real, requiere branch y HEAD disponibles, ausencia de tracked changes y ausencia de `ACTIVE`, `INTERRUPTED`, `BLOCKED`/`BLOCKED_*` o `FAILED` en `active-task.json`. Un checkpoint ausente es válido. Un checkpoint de tarea abierta requiere objeto, `schemaVersion: 1`, enum `status`, `objective` y `nextAction` no vacíos; inválido bloquea con causa concreta, sin reparar, inferir, borrar o sobrescribir. Reader acepta `BLOCKED` heredado bajo el schema y `COMPLETED` histórico como terminal legacy sin campos de recovery; writers emiten solo `ACTIVE`, `INTERRUPTED`, `BLOCKED_HUMAN`, `BLOCKED_EXTERNAL` o `FAILED`, y eliminan al completar. Untracked files no bloquean salvo colisión con un archivo a agregar/reemplazar. No hay stash, reset, clean, remote persistente, pull, merge o Git remoto mutante.

El plan compara `local` vs baseline instalada vs hashes de `main`. Se actualiza cuando local coincide con baseline y upstream cambió; se agregan archivos nuevos sin colisión y se elimina un archivo solo si local coincide con baseline y upstream lo retiró. Modificaciones locales cuyo upstream no cambió, y borrados locales cuyo upstream no cambió, se preservan mientras avanza la baseline. Cambios divergentes concurrentes, paths symlink/unsafe y colisiones se reportan y bloquean antes del primer write. No hay merge automático.

Tras el plan seguro se verifican hashes de cada fuente; se instalan solo los paths administrados, se actualizan versión y manifest, y Core QA normalmente debe dar `PASS` antes de stage/commit. Para el gate **post-apply** compartido por `update` y `bootstrap`, se acepta además un `WARN` solo si el único check/finding no-PASS es `core.optionalScaffold: WARN` por `recursos/README.md` ausente (`ENOENT`) con nota `Expected input scaffold; not required to run Core`; el reporte global permanece `WARN`, visible como excepción aceptada. Cualquier `FAIL`, error del checker, warning desconocido, findings combinados o discrepancia check/finding bloquea antes del commit. Esta excepción no cambia el Core QA, no vuelve managed `recursos/README.md` y no aplica a gates de migración. El commit añade únicamente paths de la actualización. Un fallo deja cambios/evidencia para inspección, sin commit falso ni rollback destructivo automático. Un fallo post-commit se reporta como tal sin alterar el commit. Push no se ejecuta.

## Proyectos antiguos 1.x → 2.x

Un proyecto creado con CN Pilot 1.5.4 u otra versión 1.x puede actualizar el Core con `/cn-estado` para revisar el plan y `/cn-actualizar` para ejecutarlo. La actualización instala archivos gestionados de CN Pilot; no equivale a migrar su Product, datos ni Project Context.

La transición 1.x→2.0 introdujo la estructura actual y registró migraciones versionadas. `/cn-estado` muestra el plan antes de mover rutas de Context/containers 1.x→2.0; no lo aplica. Si ese plan incluye una migración, ciérrala o acuerda cómo recuperar la tarea actual, confirma que el preview protege los datos y aprueba explícitamente antes de aplicar. No hagas renames/copias manuales para evitar el preflight. Una instalación 1.x que no puede clasificarse como limpia requiere revisar personalizaciones con cuidado.

También es válido iniciar un piloto limpio desde una copia nueva del template y trasladar selectivamente contexto y recursos confirmados. No existe una opción universalmente mejor: proyecto activo puede actualizarse preservando personalizaciones; evaluación aislada puede favorecer el piloto limpio. No mezcles ramas/rutas sin comparar el plan.

## Detalle de migración mayor 1.x → 2.0

El update gestionado instala primero el Core 2.0 y mantiene separado el contenido project-owned. `status` muestra el plan de rutas del proyecto y sus colisiones; no mueve datos. Tras cerrar cualquier tarea activa y obtener autorización explícita para la migración, el owner ejecuta `node .cn-pilot/update/updater.mjs migrate --target <Git-root>` para volver a previsualizar. Sin `--approve-migration` no hay escrituras. La aplicación requiere branch nombrada, tracked working tree limpio, active-task cerrado y ausencia de colisiones.

El plan cubre contexto raíz y containers 1.x → 2.0. Si solo existe la ruta antigua, se renombra sin copiar ni alterar su árbol; si ambas existen y su contenido no coincide, bloquea. Si son equivalentes, elimina únicamente el origen tras comprobar igualdad completa. Paths untracked se trasladan preservando contenido pero no se stagean ni incluyen en el commit; solo se incluyen rutas antes rastreadas. Symlinks y rutas inseguras bloquean. La migración ejecuta Core QA antes del commit local. Una `Existing compatibility exception` registrada en `PROYECTO.md` conserva el root operativo y omite el movimiento de `producto/`. Tras finalizar, las rutas legacy ya no aparecen como pendientes en status.

Las rutas managed CN Pilot se actualizan por el manifest; los datos project-owned nunca se tratan como archivos managed a eliminar/agregar. Legacy bootstrap continúa siendo un flujo distinto, sin baseline, y no ejecuta esta migración automáticamente.

## Legacy bootstrap

Este procedimiento manual de una sola vez aplica únicamente cuando `/cn-estado` informa `LEGACY` (updater ausente) o `MANIFEST_MISSING` (updater presente, pero sin baseline). Si hay manifest válido, usa `/cn-actualizar`; un manifest inválido/unsafe es un error bloqueante, no motivo para hacer bootstrap. Una instalación sin baseline no permite distinguir una copia oficial de una personalización a partir de `.cn-pilot-version`: no se reconstruye historia ni se presupone que los archivos del mismo SemVer sean iguales.

Para el primer bootstrap, sitúate en el root Git del proyecto legacy y cierra cualquier tarea activa. Estos comandos son iguales en PowerShell, macOS y Linux:

```text
git status --short
git branch --show-current
git rev-parse --verify HEAD
```

Antes de clonar, confirma que no hay cambios tracked, que `git branch --show-current` devuelve una branch nombrada, que `HEAD` está disponible y que los untracked no colisionan con paths managed. Si algo no se cumple, detente. El updater vuelve a validar branch, HEAD, estado tracked, tarea activa, compatibilidad y colisiones antes de aplicar.

1. Inspecciona `.cn-pilot`, `.cn-pilot/runtime` y `.cn-pilot/runtime/cn-pilot-update-source` sin seguir symlinks/reparse points. `.cn-pilot` debe ser un directorio real; si runtime existe, también debe ser un directorio real; el destino del clone debe estar ausente. Si encuentras un symlink/reparse point, un tipo inesperado, un `ERROR` en el probe o un clone existente, detente e inspecciona el estado: no lo sobrescribas, borres ni clones encima. Probe read-only portable con Node:

   ```sh
   node -e "const fs=require('node:fs');for(const p of ['.cn-pilot','.cn-pilot/runtime','.cn-pilot/runtime/cn-pilot-update-source']){try{const s=fs.lstatSync(p);console.log(p+': '+(s.isSymbolicLink()?'SYMLINK':s.isDirectory()?'directory':'NOT_DIRECTORY'))}catch(e){console.log(p+': '+(e.code==='ENOENT'?'missing':'ERROR '+(e.code||e.message)))}}"
   ```

2. Si `.cn-pilot/runtime` está ausente, créalo sin `-Force`/`-p`; si ya existe como directorio real, omite este paso:

   ```powershell
   New-Item -ItemType Directory -Path ".cn-pilot/runtime" | Out-Null
   ```

   ```sh
   mkdir .cn-pilot/runtime
   ```

3. Obtén la copia shallow de `main` dentro del runtime ignorado. El comando de clone y los siguientes comandos `node` son iguales en PowerShell, macOS y Linux; ejecútalos desde el root Git:

   ```text
   git clone --depth 1 --branch main --single-branch --no-tags "https://github.com/LuisYGM/cn-pilot.git" ".cn-pilot/runtime/cn-pilot-update-source"
   ```

4. Presenta el plan legacy sin escribir:

   ```text
   node ".cn-pilot/runtime/cn-pilot-update-source/.cn-pilot/update/updater.mjs" bootstrap --target "." --source-dir ".cn-pilot/runtime/cn-pilot-update-source"
   ```

   Revisa cada archivo `LEGACY BOOTSTRAP MODE` listado; sin baseline no se pueden clasificar automáticamente contenidos divergentes. Si una personalización debe conservarse, registra su managed path para `--preserve` al aplicar. Si el plan informa rutas inseguras, colisiones, incompatibilidad o un estado distinto al esperado, detente; no intentes sortear el preflight.
5. Solo tras revisar el plan y decidir las rutas a preservar, solicita/aplica la autorización humana y vuelve a ejecutar el mismo comando añadiendo `--approve-legacy --cleanup-source` y un `--preserve "<managed-path>"` por cada archivo que deba conservarse. Ejemplo con una ruta:

   ```text
   node ".cn-pilot/runtime/cn-pilot-update-source/.cn-pilot/update/updater.mjs" bootstrap --target "." --source-dir ".cn-pilot/runtime/cn-pilot-update-source" --approve-legacy --cleanup-source --preserve ".kilo/commands/mi-comando.md"
   ```

   `--preserve` puede repetirse para archivos managed individuales, salvo `.cn-pilot-version` y el manifest, que no admite preservar. No ejecutes este comando hasta confirmar la autorización; puede sobrescribir los archivos managed revisados y crea un commit local tras Core QA. El bootstrap valida fuente/manifest, compatibilidad, tarea activa, branch, HEAD, estado tracked y colisiones; protege paths project-owned. Los paths tracked antiguos ausentes del upstream se conservan y reportan, no se borran porque no existe baseline. `--cleanup-source` solo acepta el clone designado y lo elimina tras una aplicación/commit correctos; no borres manualmente el runtime ni otros temporales.
6. Verifica `git status --short`, el commit y el Core QA informado. Ante fallo, conserva e inspecciona el estado/diff; no repitas con aprobación ni elimines la fuente temporal a ciegas.

Si aparece personalización/framework path que no se revisó, no pases `--approve-legacy`. Conserva el plan y resuelve manualmente antes de continuar. El bootstrap legacy es de una vez; después el manifest ofrece detección precisa de modificaciones locales.

## Versionado y migraciones

`.cn-pilot-version` es `MAJOR.MINOR.PATCH`. PATCH corrige comportamiento compatible; MINOR incorpora capabilities compatibles; MAJOR es para incompatibilidad/migración material. Desde `1.3.0`, cada distribución del Core debe bump SemVer, aunque un BF interno solo no requiera release separado. `main` es stable. No hay versionado de la aplicación cliente.

El manifest reserva `migrations`. V1 publica una lista vacía y bloquea cualquier migración declarada: no ejecuta scripts ni muta Project Context, Product o datos. Futuras migraciones deben registrarse explícitamente con from/to, paths, scope, aprobación e idempotencia/detección antes de habilitar su ejecución.

## Regeneración de distribución por maintainer

Para mantenedores que preparan una distribución compatible, inspecciona/revisa el cambio, actualiza `.cn-pilot-version` y la versión del header en `.cn-pilot/NUCLEO.md`, stagea los paths Core previstos para que aparezcan en `git ls-files`, y ejecuta:

```sh
node .cn-pilot/update/updater.mjs manifest
node .cn-pilot/update/updater.mjs verify-manifest
```

El generador ordena paths, excluye runtime, configuración mixta, archivos project-owned y el manifest autorreferente. `verify-manifest` comprueba esquema, versión, inventario Git exacto y hashes upstream. El Core QA de una instalación valida metadata/schema y sincronía de `.cn-pilot-version`, pero **no** compara sus archivos locales contra los hashes baseline: eso permitiría conservar modificaciones de framework válidas. Un update verifica todos los hashes de la distribución upstream antes de cualquier write; no se crean tags/releases automáticamente.
