# Configuración del Blueprint

Fuente de verdad para las capas de configuración compartible, responsive, MCP, deployment opcional y secretos locales. La separación de responsabilidades sobre IA se documenta en [Configuración de IA en Kilo](MODEL-STRATEGY.md).

## Capas de configuración

- **Convenciones universales:** fuentes versionadas y portables que aplican por defecto, como `.blueprint/config/responsive.json`.
- **Configuración del proyecto:** decisiones compartibles del proyecto, sin secretos, como configuración general en `kilo.jsonc` o un workflow de deployment aprobado.
- **Configuración local:** preferencias, autenticación y ajustes propios del desarrollador o máquina. Se mantienen fuera de Git.
- **Selección de IA:** proveedor, modelos principal/pequeño/de subagentes/de compactación, overrides y esfuerzo de razonamiento pertenecen al usuario y al runtime de Kilo. El proyecto no los fija por defecto ni los registra como decisiones compartidas.
- **Secretos:** tokens, API keys, passwords, claves privadas y credenciales. Nunca se versionan.
- **Templates opcionales:** ejemplos inactivos bajo `.blueprint/templates/`; se consultan/adaptan solo cuando el alcance lo requiere.

## Responsive

`.blueprint/config/responsive.json` es la fuente de verdad para proyectos nuevos. Define una estrategia `fluid-first`, Base sin media query y los breakpoints descendentes disponibles. Base concentra la mayor parte del diseño mediante `clamp()`, unidades relativas, Grid, Flexbox, `min()`, `max()`, `minmax()` y layouts intrínsecos.

Los breakpoints son correcciones condicionales, no fases obligatorias. No se crea un override si el diseño ya funciona. Cuando la implementación directa usa un builder con breakpoints configurables, se mapea la fuente de verdad al builder solo si esa implementación forma parte del alcance. En un handoff manual se documenta la convención para quien continúe.

En proyectos existentes, los breakpoints implementados son la fuente de verdad. `.blueprint/config/responsive.json` no los reemplaza salvo solicitud o decisión explícita de migración.

## MCP opcional

El Blueprint no incluye ejemplos ni configura MCPs por defecto y no depende de un proveedor concreto. Cuando la persona solicite una integración MCP para su proyecto:

1. verifica que la integración forma parte del alcance y que está disponible;
2. descubre el servidor, sus capabilities/tools y el esquema real que soporta; prepara únicamente los campos no secretos necesarios para este proyecto;
3. conserva en `kilo.jsonc` únicamente configuración general de Kilo/Blueprint a nivel de proyecto y sin secretos;
4. guía a la persona para aplicar configuración y autenticación local por un mecanismo soportado por Kilo/el servicio; no pidas, leas ni guardes secretos;
5. valida, mediante capabilities disponibles y autorización, la conexión antes de usarla para publicar o modificar el sistema objetivo.

Las ubicaciones tienen responsabilidades distintas:

- `kilo.jsonc`: configuración general y compartible de Kilo/Blueprint a nivel de proyecto.
- `.kilocode/mcp.json`: si el runtime utiliza esta ubicación, es configuración local activa y puede contener referencias sensibles. Está ignorada por Git y protegida frente a lectura/edición de agentes; no forma parte del template.

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

No se distribuye ni crea un workflow de deployment durante onboarding. Su ausencia es la condición segura por defecto: no hay acción que ejecutar o trigger que pueda publicar. Una persona puede solicitar configurar deployment; solo entonces Dev Lead identifica método, destino/entorno, stack, artifact/source, exclusiones, autorización, verificación y recuperación antes de crear un workflow adecuado a ese proyecto. Si falta un dato material o autorización para configurarlo, no crea ni ejecuta el workflow; ofrece un handoff de lo pendiente. No existe método universal.

Triggers automáticos —incluidos `push` y `schedule`— solo se añaden con intención y autorización explícitas para esa automatización. Configurar un workflow no autoriza publicar en producción; esa publicación mantiene su propio gate. No se solicitan ni escriben secretos: se referencian mediante GitHub Actions Secrets/environments o el mecanismo seguro aplicable. La ausencia de workflow no produce una ejecución fallida ni es una incidencia.

En workspace canónico, `product/` es la superficie primaria candidata, no un target universal: el stack determina artifact, public root, build output y exclusiones. Para `Existing compatibility exception`, usa el artifact/source real registrado en `PROJECT.md`; no muevas ni cambies deployment solo para satisfacer la convención de carpetas. `.blueprint/`, `project-resources/` y `project-artifacts/` quedan fuera del deployment productivo por defecto. Un output auxiliar puede ser la entrega/handoff final sin convertirse por ello en runtime. Los recursos recibidos se integran/copian a ubicaciones internas del producto autorizadas si se necesitan; nunca se publica `project-resources/` por inferencia.

## Archivos locales y secretos

- `.env`, sus variantes sensibles y `secrets/**` permanecen fuera de Git.
- `kilo.local.json` y `kilo.local.jsonc` son archivos locales ignorados; si se usan, deben cargarse mediante un mecanismo soportado como `KILO_CONFIG` y nunca incluirse en commits.
- La configuración global de Kilo bajo `~/.config/kilo/` pertenece al desarrollador y no al repositorio.
- Los valores almacenados en GitHub Actions Secrets, environments, OAuth o gestores externos no se copian a documentación, manifests ni logs versionados.
