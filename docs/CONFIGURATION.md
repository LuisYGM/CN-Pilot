# Configuración del Blueprint

Fuente de verdad para las capas de configuración compartible, responsive, MCP, deployment opcional y secretos locales. La separación de responsabilidades sobre IA se documenta en [Configuración de IA en Kilo](MODEL-STRATEGY.md).

## Capas de configuración

- **Convenciones universales:** fuentes versionadas y portables que aplican por defecto, como `config/responsive.json`.
- **Configuración del proyecto:** decisiones compartibles del proyecto, sin secretos, como configuración general en `kilo.jsonc` o un workflow de deployment aprobado.
- **Configuración local:** preferencias, autenticación y ajustes propios del desarrollador o máquina. Se mantienen fuera de Git.
- **Selección de IA:** proveedor, modelos principal/pequeño/de subagentes/de compactación, overrides y esfuerzo de razonamiento pertenecen al usuario y al runtime de Kilo. El proyecto no los fija por defecto ni los registra como decisiones compartidas.
- **Secretos:** tokens, API keys, passwords, claves privadas y credenciales. Nunca se versionan.
- **Templates opcionales:** ejemplos inactivos bajo `templates/`; solo se copian y adaptan cuando el alcance lo requiere.

## Responsive

`config/responsive.json` es la fuente de verdad para proyectos nuevos. Define una estrategia `fluid-first`, Base sin media query y los breakpoints descendentes disponibles. Base concentra la mayor parte del diseño mediante `clamp()`, unidades relativas, Grid, Flexbox, `min()`, `max()`, `minmax()` y layouts intrínsecos.

Los breakpoints son correcciones condicionales, no fases obligatorias. No se crea un override si el diseño ya funciona. Cuando la implementación directa usa un builder con breakpoints configurables, se mapea la fuente de verdad al builder solo si esa implementación forma parte del alcance. En un handoff manual se documenta la convención para quien continúe.

En proyectos existentes, los breakpoints implementados son la fuente de verdad. `config/responsive.json` no los reemplaza salvo solicitud o decisión explícita de migración.

## MCP opcional

El Blueprint no activa MCPs por defecto ni depende de un proveedor concreto. Cuando un proyecto confirme un MCP:

1. verifica que la integración forma parte del alcance y que está disponible;
2. crea `.kilocode/mcp.json` a partir de [`.kilocode/mcp.example.json`](../.kilocode/mcp.example.json) y adapta uno o varios servidores;
3. conserva en `kilo.jsonc` únicamente configuración general de Kilo/Blueprint a nivel de proyecto y sin secretos;
4. configura autenticación mediante OAuth administrado por Kilo, variables/secretos del entorno o configuración local fuera del repositorio, según admita el servicio;
5. valida la conexión antes de usarla para publicar o modificar el sistema objetivo.

Las ubicaciones tienen responsabilidades distintas:

- `kilo.jsonc`: configuración general y compartible de Kilo/Blueprint a nivel de proyecto.
- `.kilocode/mcp.json`: configuración activa local de los servidores MCP de este proyecto. Está ignorada por Git y puede contener referencias sensibles.
- `.kilocode/mcp.example.json`: ejemplo versionado, genérico y sin secretos para uno o varios servidores. Cada desarrollador crea su propio `.kilocode/mcp.json`.

Un proyecto puede utilizar varios MCP simultáneamente, con responsabilidades diferentes. Dev Lead debe elegir herramientas por la capability real que exponen, no por el nombre o la intención declarada del servidor. El uso de MCP es capability-first, no provider-first: primero se descubren servidores y tools disponibles, después se mapea `capability → responsabilidad`, se elige la ruta funcional más específica y segura y se usa fallback solo si otro MCP expone legítimamente la capability necesaria. No se duplican llamadas cuando un MCP ya proporciona la capability requerida.

Las capabilities no son permanentes: pueden cambiar al instalar o activar plugins, módulos, licencias, integraciones, actualizar servidores o modificar la configuración MCP. Después de esos cambios, reconecta o refresca MCP, repite Discovery y actualiza la comprensión de capabilities. Antes de declarar que algo no puede hacerse mediante MCP, comprueba servidor activo, abilities expuestas, especializaciones, versiones relevantes, módulos y Discovery posterior al refresh. Prioriza `specialized capability → safe generic capability → low-level workaround only when justified`; una capability de lectura no implica escritura y una capability disponible no amplía el scope autorizado. Cuando aporte valor, documenta de forma ligera `capability → provider → read/write → scope → risk`.

### Flujo de conexión a un sistema real

En la primera conexión mediante MCP, Dev Lead sigue este orden:

1. **Discovery:** identifica MCP disponibles, inspecciona capabilities/tools reales, identifica entorno y recursos y distingue recursos locales, específicos, globales y compartidos.
2. **Read-only:** inspecciona antes de escribir, verifica el estado actual, busca recursos reutilizables, conflictos y limitaciones.
3. **Plan:** propone qué creará, modificará, reutilizará o dejará intacto, diferenciando recursos nuevos, preexistentes, globales y compartidos.
4. **Write:** escribe solo con alcance claro, autorización, riesgo identificado y capability apropiada. Prefiere `preview`, `checkout`, `dry-run`, `digest`, `rollback` o políticas como `forbid_creates` cuando existan.
5. **Verification:** relee lo modificado, verifica integridad, confirma que no se tocó fuera del alcance y reporta exactamente las escrituras realizadas.

Para interfaces complejas, aplica el mismo flujo de forma incremental (`crear → releer → verificar → continuar`) en lugar de agrupar escrituras masivas. Si una operación falla, devuelve timeout o pierde la conexión, reconecta y relee primero el recurso para determinar qué persistió, identificar el último estado válido y continuar desde ahí. No repitas escrituras sin verificar ni reconstruyas trabajo ya correcto. Cuando la integración exponga schemas de elementos o settings, consúltalos antes de usar propiedades desconocidas y utiliza únicamente capabilities soportadas.

Cuando un recurso remoto utilice revisions, digests, state tokens, version checks u optimistic concurrency, las escrituras sobre ese mismo recurso son secuenciales por defecto: `write → reread → verify state/digest → next write`. Ante timeout, connection reset, digest conflict, aborted request o respuesta incierta, aplica `reconnect → reread → determine what persisted → identify last valid state → continue`; nunca hagas blind retry ni ejecutes writes paralelos sobre el mismo recurso salvo que la API garantice concurrencia segura.

En producción el comportamiento es más restrictivo, sin convertirla en una prohibición absoluta: requiere autorización explícita, limita la escritura al alcance aprobado, prefiere drafts cuando corresponda, no modifica recursos globales o compartidos fuera del alcance, no ejecuta operaciones destructivas por conveniencia, no amplía el scope, realiza QA antes de publicar y se detiene para aprobación humana cuando así se haya solicitado.

Si un servidor exige valores sensibles dentro de su definición, mantén esa definición en la configuración local de Kilo —por ejemplo `~/.config/kilo/kilo.jsonc`— o en otro mecanismo local aprobado, no en el `kilo.jsonc` versionado. Un proyecto sin MCP no añade la clave `mcp`.

## Deployment mediante GitHub Actions

`templates/deploy/github-actions.yml` es un template inactivo y seguro por defecto. No se ejecuta desde `templates/` y contiene un bloqueo explícito hasta que se configure.

Solo cuando el proyecto confirme GitHub Actions como modo de deployment, Dev Lead puede:

1. copiarlo a `.github/workflows/deploy.yml`;
2. definir el método real —SSH, SFTP, rsync, build + artifact, hosting, WordPress, custom u otro—;
3. referenciar credenciales mediante GitHub Actions Secrets o secrets de environments y configurar las aprobaciones/protecciones requeridas;
4. retirar el bloqueo únicamente después de revisar permisos, triggers, backup, smoke tests y rollback;
5. validar el workflow sin ejecutar producción sin aprobación.

Tener un entorno de producción no activa deployment ni justifica crear el workflow. No existe un método universal.

## Archivos locales y secretos

- `.env`, sus variantes sensibles y `secrets/**` permanecen fuera de Git.
- `kilo.local.json` y `kilo.local.jsonc` son archivos locales ignorados; si se usan, deben cargarse mediante un mecanismo soportado como `KILO_CONFIG` y nunca incluirse en commits.
- La configuración global de Kilo bajo `~/.config/kilo/` pertenece al desarrollador y no al repositorio.
- Los valores almacenados en GitHub Actions Secrets, environments, OAuth o gestores externos no se copian a documentación, manifests ni logs versionados.
