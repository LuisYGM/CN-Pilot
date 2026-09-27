# Configuración del Blueprint

## Capas de configuración

- **Convenciones universales:** fuentes versionadas y portables que aplican por defecto, como `config/responsive.json`.
- **Configuración del proyecto:** decisiones compartibles del proyecto, sin secretos, como un MCP confirmado en `kilo.jsonc` o un workflow de deployment aprobado.
- **Configuración local:** preferencias, autenticación y ajustes propios del desarrollador o máquina. Se mantienen fuera de Git.
- **Secretos:** tokens, API keys, passwords, claves privadas y credenciales. Nunca se versionan.
- **Templates opcionales:** ejemplos inactivos bajo `templates/`; solo se copian y adaptan cuando el alcance lo requiere.

## Responsive

`config/responsive.json` es la fuente de verdad para proyectos nuevos. Define una estrategia `fluid-first`, Base sin media query y los breakpoints descendentes disponibles. Base concentra la mayor parte del diseño mediante `clamp()`, unidades relativas, Grid, Flexbox, `min()`, `max()`, `minmax()` y layouts intrínsecos.

Los breakpoints son correcciones condicionales, no fases obligatorias. No se crea un override si el diseño ya funciona. Cuando la implementación directa usa un builder con breakpoints configurables, se mapea la fuente de verdad al builder solo si esa implementación forma parte del alcance. En un handoff manual se documenta la convención para quien continúe.

En proyectos existentes, los breakpoints implementados son la fuente de verdad. `config/responsive.json` no los reemplaza salvo solicitud o decisión explícita de migración.

## MCP opcional

El Blueprint no activa MCPs por defecto ni depende de un proveedor concreto. Cuando un proyecto confirme un MCP:

1. verifica que la integración forma parte del alcance y que está disponible;
2. parte de `templates/mcp/kilo.example.jsonc` y adapta uno o varios servidores;
3. integra en `kilo.jsonc` únicamente configuración compartible sin secretos;
4. configura autenticación mediante OAuth administrado por Kilo, variables/secretos del entorno o configuración local fuera del repositorio, según admita el servicio;
5. valida la conexión antes de usarla para publicar o modificar el sistema objetivo.

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
