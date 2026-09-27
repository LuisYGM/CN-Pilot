# Web Project Blueprint

Blueprint portable para iniciar, desarrollar, revisar, versionar y mantener proyectos web con Kilo Code y Git/GitHub.

**Versión:** `1.0.0-draft`

Está diseñado para proyectos pequeños o grandes y puede adaptarse a WordPress, WooCommerce, plugins, Bricks, Elementor, HTML/CSS/JS, PHP, APIs, landing pages y proyectos de contenido.

## Principios

- La complejidad del proceso debe ser proporcional al cambio.
- Inspeccionar antes de modificar.
- Diagnosticar no significa modificar.
- Los agentes trabajan con el mínimo contexto necesario.
- Los permisos técnicos complementan las instrucciones.
- No se declara una tarea terminada sin evidencia proporcional.
- Git es opcional; cuando existe, forma parte del flujo normal de trabajo.
- Todos los mensajes de commit se escriben en español.
- Producción y operaciones destructivas requieren control humano.
- El Blueprint debe seguir siendo portable entre equipos y ordenadores.

## Inicio rápido

### 1. Repositorio maestro

Sube esta carpeta a GitHub como `web-project-blueprint` y activa **Template repository**.

### 2. Crear un proyecto nuevo

1. En GitHub pulsa **Use this template**.
2. Crea un repositorio nuevo.
3. Clónalo con GitHub Desktop.
4. Ábrelo en VS Code.
5. Abre Kilo Code.
6. Configura una sola vez tus modelos globales de Kilo si todavía no lo has hecho.
7. Selecciona el agente `dev-lead`.
8. Ejecuta `/new-project`.

Alternativamente, copia el Blueprint a una carpeta local sin Git y sigue desde el paso 4. No es necesario ejecutar `git init`.

### 3. Trabajar normalmente

Habla con `dev-lead` en lenguaje natural. Debe:

1. entender la petición;
2. clasificarla como `DIRECT`, `TASK` o `STRUCTURAL`;
3. evaluar el riesgo;
4. cargar solo las skills necesarias;
5. delegar a los subagentes apropiados;
6. verificar el resultado;
7. crear checkpoints/commits cuando corresponda.

### 4. Git opcional y GitHub Desktop

Si existe repositorio, Kilo puede crear commits locales y el usuario mantiene el control de `push`, `merge`, `rebase` y despliegues. Sin Git, los cambios quedan guardados localmente y el resto del Blueprint continúa funcionando.

## Archivos principales

- `AGENTS.md`: reglas universales.
- `BLUEPRINT.md`: especificación del sistema.
- `MANIFEST.md`: inventario de la infraestructura heredada del Blueprint.
- `PROJECT.md`: contexto estable del proyecto.
- `STATE.md`: estado operativo actual.
- `DECISIONS.md`: decisiones importantes.
- `REQUIREMENTS.md`: requisitos y criterios.
- `.blueprint-version`: versión del Blueprint.
- `.kilo/agents/`: agentes.
- `.kilo/skills/`: procedimientos reutilizables.
- `.kilo/commands/`: workflows/slash commands.
- `profiles/`: perfiles de proyecto.
- `config/`: convenciones universales versionadas.
- `templates/`: ejemplos opcionales que no se activan por defecto.
- `docs/CONFIGURATION.md`: responsive, MCP, configuración local y deployment opcional.
- `docs/MODEL-STRATEGY.md`: tiers de capacidad y configuración personal de modelos.
- `docs/ARTIFACTS.md`: mapa de entregables reales producidos para el proyecto.

## Agentes Core

- `dev-lead`
- `architect`
- `content-seo`
- `ui-ux-designer`
- `developer`
- `frontend-builder`
- `reviewer`

## Workflows principales

- `/new-project`
- `/plan`
- `/content`
- `/design`
- `/debug`
- `/review`
- `/checkpoint`
- `/commit`
- `/pre-deploy`
- `/deploy-staging`
- `/handoff`

## Modelos y Kilo

El Blueprint es provider-agnostic: los agentes describen responsabilidades y capacidad esperada, pero no contienen IDs de proveedores o modelos. Cada desarrollador elige OpenAI, Anthropic, Google u otro proveedor compatible y configura sus asignaciones globales una sola vez en Kilo.

Esa configuración personal no se hereda al clonar el template y no debe versionarse. Cambiar de proveedor o mapear los mismos agentes a otros modelos no requiere modificar el Blueprint. Usa `templates/kilo/global-models.example.jsonc` como referencia inactiva y evita asignar el modelo más potente a todas las tareas.

Consulta `docs/KILO-SETUP.md` para el onboarding y `docs/MODEL-STRATEGY.md` para los tiers y criterios de coste.

## Estado

`1.0.0-draft` es una versión candidata. Antes de promoverla a `1.0.0` debe probarse con casos reales y registrar problemas en `docs/blueprint-feedback.md`.
