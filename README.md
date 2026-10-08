# Web Project Blueprint

Blueprint portable para iniciar, desarrollar, revisar y mantener proyectos web con Kilo Code. Organiza contexto, agentes especializados, workflows y artefactos sin imponer un proveedor de IA, un CMS, un método de entrega ni Git.

**Versión:** `1.1.0`

Sirve para proyectos nuevos o existentes: HTML/CSS/JS, WordPress, WooCommerce, plugins, themes, Bricks, Elementor, PHP, APIs, contenido y SEO. El repositorio puede terminar en contenido, diseño, código, handoff manual, integración mediante MCP o deployment, según el alcance real.

## Empieza aquí

1. **Primer día:** sigue [`.blueprint/docs/START-HERE.md`](.blueprint/docs/START-HERE.md).
2. **Configura Kilo:** consulta [`.blueprint/docs/KILO-SETUP.md`](.blueprint/docs/KILO-SETUP.md).
3. **Configura tu IA en Kilo:** elige modelos y proveedor según tu entorno; consulta [`.blueprint/docs/MODEL-STRATEGY.md`](.blueprint/docs/MODEL-STRATEGY.md).
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

- [`.blueprint/docs/START-HERE.md`](.blueprint/docs/START-HERE.md): recorrido práctico, filosofía, escenarios y ubicación de entregables.
- [`.blueprint/docs/TROUBLESHOOTING.md`](.blueprint/docs/TROUBLESHOOTING.md): problemas habituales y recuperación segura.
- [`ARTIFACTS.md`](ARTIFACTS.md): índice de entregables reales del proyecto.
- [`.blueprint/docs/LIFECYCLE.md`](.blueprint/docs/LIFECYCLE.md): fases posibles y puntos de entrega.

### Configuración y trabajo del equipo

- [`.blueprint/docs/KILO-SETUP.md`](.blueprint/docs/KILO-SETUP.md): instalación y configuración personal de Kilo.
- [`.blueprint/docs/MODEL-STRATEGY.md`](.blueprint/docs/MODEL-STRATEGY.md): separación entre política del Blueprint y selección personal de IA en Kilo.
- [`.blueprint/docs/CONFIGURATION.md`](.blueprint/docs/CONFIGURATION.md): responsive, MCP, deployment, configuración local y secretos.
- [`.blueprint/docs/GIT-WORKFLOW.md`](.blueprint/docs/GIT-WORKFLOW.md): commits, ramas y operación con o sin remoto.
- [`.blueprint/docs/TEAM-WORKFLOW.md`](.blueprint/docs/TEAM-WORKFLOW.md): colaboración y continuidad entre personas.
- [`.blueprint/docs/SECURITY.md`](.blueprint/docs/SECURITY.md): línea base de seguridad.

### Maintainers del Blueprint

- [`.blueprint/BLUEPRINT.md`](.blueprint/BLUEPRINT.md): especificación completa del sistema.
- [`AGENTS.md`](AGENTS.md): reglas universales para agentes.
- [`.blueprint/MANIFEST.md`](.blueprint/MANIFEST.md): inventario de Blueprint Core.
- [`.blueprint/docs/blueprint-feedback.md`](.blueprint/docs/blueprint-feedback.md): pruebas y limitaciones observadas.
- [`.blueprint/CHANGELOG.md`](.blueprint/CHANGELOG.md): historial de versiones.

El contexto de cada proyecto vive en `README.md`, `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` y `ARTIFACTS.md`. Los entregables se conservan en sus rutas canónicas, creadas solo cuando se necesitan (por ejemplo `content/`, `design/` o `docs/`); el código sigue el layout nativo del stack.
