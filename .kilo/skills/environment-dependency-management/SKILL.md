---
name: environment-dependency-management
description: Detectar y preparar un entorno local existente o Greenfield, resolver dependencias necesarias con el gestor/lockfile vigente y verificar scripts reproducibles. Activar solo si el entorno/runtime no está listo, falta una dependencia o la tarea autoriza setup/install; no para cada cambio de código ni para instalar herramientas globales.
---

# environment-dependency-management

## Owner y límites

Desarrollador es el owner de preparación técnica local. Jefe confirma alcance, product root y gates materiales; Arquitecto solo resuelve una elección tecnológica o contrato estructural abierto; Diseñador/Redactor conservan sus authorities. Esta skill coordina detección, preparación y dependencias locales: no reemplaza `testing-strategy`, `database-migrations`, `security-review`, `release-deployment` ni `deploy-wordpress`.

Usa únicamente permisos/tools actuales y el target autorizado de `PROYECTO.md`; el patrón Greenfield normal puede ser `producto/`, pero Existing/compatibility exceptions conservan su root. No crees wrappers/carpetas de producto por conveniencia, no trabajes en proyectos externos, no instales tools globales ni uses privilegios elevados. `ask` es un gate host, no autorización que se pueda eludir. La petición de implementar una feature no autoriza instalación global, migración de datos ni cambio de infraestructura.

## Detectar antes de cambiar

1. Delimita target, tarea y evidencia que requiere entorno. Comprueba si está inicializado, si se puede ejecutar sin install y qué ya está resuelto; reutiliza entorno, lockfile y PASS vigentes.
2. Inspecciona de forma focal los manifests, locks, scripts, CI y documentos que determinan stack/version: `package.json` + lockfiles, `composer.json`/`composer.lock`, `pyproject.toml`/`uv.lock`/`poetry.lock`/`requirements*.txt`, tool-version files, build config o equivalentes observados. No escanees `.env`, tokens, credential stores ni impriman variables privadas. Si una config secreta puede afectar una acción, conserva el acceso denegado y no la abras para diagnosticar.
3. Confirma SO/shell y versions de runtimes/gestores mediante las herramientas disponibles y permisos efectivos. El nombre de un framework/manifest no prueba que PHP, Node, Python, Composer, npm, pnpm, Yarn, Bun, uv u otra tool esté instalada o sea compatible.
4. Deriva package manager de `packageManager`, lockfile, scripts y CI en conjunto. Un solo lockfile y configuración establecida prevalecen. Si hay locks contradictorios/varios managers, incompatibilidad de runtime o una decisión de stack material abierta, no elijas por preferencia: devuelve la evidencia a Jefe/Arquitecto y pausa solo lo dependiente.
5. Trata documentación cambiante, APIs/versiones o comandos no probados en el proyecto como cuestión source-sensitive: usa `source-grounded-development` y fuente oficial de la versión real; no inventes flags, scripts o capabilities.

## Preparar e instalar localmente

- Instala solo si es necesario para el trabajo autorizado y el manifest/lock concreto del proyecto determina la operación. Conserva manager, versiones, lockfile, registry y configuración reproducible; no actualices/re-generes el lock como side-effect de instalar. Si falta lock, primero determina si el stack define un mecanismo alternativo estable; no inventes una estrategia de release.
- Ejecuta desde el product root autorizado y mantén outputs/cache locales en su ubicación vigente. No muevas un Existing a `producto/`, no escribas wrappers de instalación sin necesidad y no cambies scripts, Docker, CI, `.npmrc`, Composer config, registry o archivos del usuario para superar un error.
- Antes de `npm ci`, `composer install`, `uv sync`, `pip install` u operación equivalente, confirma el manager/versión/lock real, el target y los lifecycle scripts/plugins/hooks que puedan ejecutarse. Examina si el target de instalación ya existe: `npm ci` puede reemplazar `node_modules`; no lo ejecutes si eso podría borrar estado/archivos no confirmados. Nunca sustituyas paquetes existentes sin comprobar que son artefacto regenerable y que la operación está autorizada.
- Instala dependencias del proyecto solo en scope local con fuentes/registros esperados; no leas/imprimas `.npmrc`, `.pypirc`, secretos ni credenciales. Los permisos de lectura de Kilo no sandboxean el subprocess: el manager puede leer su configuración local. Instalación puede ejecutar código de terceros o contactar servicios; si registry, credenciales, scripts o plugins no se pueden validar dentro del scope y autorización, detente y solicita el gate específico. No uses `--force`, `--legacy-peer-deps`, `--ignore-scripts` ni flags que desactiven validaciones como arreglo por defecto; explica el conflicto y busca una resolución compatible.
- Si falta una herramienta global, reporta versión/rol requerido y verifica si existe un runtime local/project-supported. No la instales silenciosamente. Si no existe herramienta autorizada o la operación la bloquea el host, detente en ese límite en vez de pedir que la persona ejecute una secuencia rutinaria manualmente.
- No ejecutes scripts de producción, migraciones, seed/destructores, tareas contra servicios reales, publish/deploy ni comandos con target ambiguo durante setup. DB/schema usa `database-migrations`; deploy requiere autorización propia.

## Greenfield y prompts de scaffold

- Cuando el proyecto sea Greenfield, primero confirma el stack aprobado y el product root real. Si la tecnología/arquitectura afecta decisiones o mantenimiento y sigue abierta, devuelve esa decisión a Jefe/Arquitecto; no sustituyas una decisión humana.
- Inicializa directamente en el root autorizado —normalmente `producto/`— solo después de verificar que el destino no contiene archivos que puedan sobrescribirse. No crees wrappers/slug dirs por costumbre ni generes scaffolds duplicados. Existing conserva su root y layout.
- Usa el generador oficial vigente de la versión detectada y consulta su documentación/`--help` si los argumentos/capabilities son version-sensitive. Responde prompts con opciones documentadas solo si son seguras y no contienen decisiones de negocio/branding/servicio; ante prompt material o no comprendido, pausa ese paso. No inventes flags ni elijas opciones “no install/update Git/global” por nombre sin confirmar su efecto.
- Comprueba source, lockfiles/scripts generados y salida del scaffold antes de instalar dependencias o empezar implementación; no vuelvas a inicializar para reparar un setup parcial sin inspeccionar exactamente lo que ya se escribió.

## Verificar y cerrar

Usa primero scripts locales declarados (`test`, `lint`, `build`, etc.) que correspondan al acceptance; investiga qué hacen antes si tienen efectos laterales. Luego verifica versión/lock unchanged, output esperado y estado Git; reporta comandos efectivamente ejecutados, exit code, runtime y límites. No afirmes que instalaste, compilaste o probaste lo que no ocurrió. Si falta herramienta/permiso/datos, indica el bloqueo concreto y continúa trabajo independiente; no repitas installs/builds indefinidamente.

**No-go:** herramienta global/admin; overwrite/borrado no confirmado; secrets/credential output; lock/manifests cambiados fuera de scope; registry/script de instalación opaco; servicio/DB/hosting externo; prompt del host eludido; versión/capability inferida. Escala solo el permiso/decisión material, no toda la tarea.
