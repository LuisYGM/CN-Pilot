# Web Project Blueprint

Blueprint portable para iniciar, desarrollar, revisar y mantener proyectos web con Kilo Code. Organiza contexto, agentes especializados, workflows y artefactos sin imponer un proveedor de IA, un CMS, un método de entrega ni Git.

**Versión:** `1.0.1`

Sirve para proyectos nuevos o existentes: HTML/CSS/JS, WordPress, WooCommerce, plugins, themes, Bricks, Elementor, PHP, APIs, contenido y SEO. El repositorio puede terminar en contenido, diseño, código, handoff manual, integración mediante MCP o deployment, según el alcance real.

## Empieza aquí

1. **Primer día:** sigue [`docs/START-HERE.md`](docs/START-HERE.md).
2. **Configura Kilo:** consulta [`docs/KILO-SETUP.md`](docs/KILO-SETUP.md).
3. **Configura tu IA en Kilo:** elige modelos y proveedor según tu entorno; consulta [`docs/MODEL-STRATEGY.md`](docs/MODEL-STRATEGY.md).
4. **Inicializa la carpeta:** habla con `dev-lead` y ejecuta `/new-project` una sola vez.
5. **Trabaja normalmente:** describe la tarea en lenguaje natural; Dev Lead selecciona agentes, skills y profundidad del proceso.

Git es opcional. Sin Git, el Blueprint trabaja y verifica archivos localmente. Con Git, crea commits locales cuando corresponde, pero nunca hace `push` automático.

## Cómo se usa

Normalmente solo interactúas con **Dev Lead**. No necesitas seleccionar manualmente agents, profiles, capabilities, skills o rutas internas. `/new-project` tampoco crea una web: inicializa el contexto de la carpeta, tanto para proyectos nuevos como para sistemas existentes.

Principios operativos:

- trabajo local-first y proceso proporcional al riesgo;
- inspección de la implementación vigente antes de modificarla;
- plataforma objetivo, alcance del repositorio y punto de entrega tratados por separado;
- MCP y deployment opcionales, nunca activados por defecto;
- conversaciones naturales en lugar de formularios técnicos;
- decisiones internas reversibles resueltas por el agente y control humano para alcance, producción, datos, seguridad y decisiones costosas.

## Mapa de documentación

### Usuario del Blueprint

- [`docs/START-HERE.md`](docs/START-HERE.md): recorrido práctico, filosofía, escenarios y ubicación de entregables.
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md): problemas habituales y recuperación segura.
- [`docs/ARTIFACTS.md`](docs/ARTIFACTS.md): índice de entregables reales del proyecto.
- [`docs/LIFECYCLE.md`](docs/LIFECYCLE.md): fases posibles y puntos de entrega.

### Configuración y trabajo del equipo

- [`docs/KILO-SETUP.md`](docs/KILO-SETUP.md): instalación y configuración personal de Kilo.
- [`docs/MODEL-STRATEGY.md`](docs/MODEL-STRATEGY.md): separación entre política del Blueprint y selección personal de IA en Kilo.
- [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md): responsive, MCP, deployment, configuración local y secretos.
- [`docs/GIT-WORKFLOW.md`](docs/GIT-WORKFLOW.md): commits, ramas y operación con o sin remoto.
- [`docs/TEAM-WORKFLOW.md`](docs/TEAM-WORKFLOW.md): colaboración y continuidad entre personas.
- [`docs/SECURITY.md`](docs/SECURITY.md): línea base de seguridad.

### Maintainers del Blueprint

- [`BLUEPRINT.md`](BLUEPRINT.md): especificación completa del sistema.
- [`AGENTS.md`](AGENTS.md): reglas universales para agentes.
- [`MANIFEST.md`](MANIFEST.md): inventario de Blueprint Core.
- [`docs/blueprint-feedback.md`](docs/blueprint-feedback.md): pruebas y limitaciones observadas.
- [`CHANGELOG.md`](CHANGELOG.md): historial de versiones.

El contexto de cada proyecto vive en `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`. Los entregables se conservan en sus rutas canónicas, como `content/`, `design/`, `docs/features/`, `docs/architecture/` o las carpetas de código del stack.
