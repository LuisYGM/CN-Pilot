# Empieza aquí

Guía práctica para el primer día con Web Project Blueprint. Está dirigida a quien va a usarlo en un proyecto, no a quien mantiene su infraestructura interna.

## Qué necesitas

- VS Code.
- La extensión Kilo Code.
- Acceso a un proveedor de modelos compatible con Kilo.
- Las herramientas propias del stack del proyecto.
- Git y GitHub Desktop solo si el proyecto utilizará control de versiones.

No necesitas conocer previamente los agentes, profiles, capabilities, skills ni workflows del Blueprint.

## Recorrido del primer día

### 1. Crea tu carpeta de trabajo

Usa el repositorio como GitHub Template y clona el proyecto, o copia el Blueprint a una carpeta local. Git es opcional: no ejecutes `git init` solo para poder usar el sistema.

### 2. Abre el proyecto

Abre la carpeta raíz en VS Code e inicia Kilo Code. Kilo debe detectar `dev-lead` como agente primario y los especialistas como subagentes.

### 3. Configura Kilo una vez por máquina

Autentica cualquier proveedor compatible y comprueba que sus modelos estén disponibles. La configuración personal no se incluye al clonar el repositorio.

Sigue [Configuración de Kilo](KILO-SETUP.md). El Blueprint no recomienda modelos por agente; tus preferencias de IA se mantienen en Kilo, fuera del contexto de `/new-project`.

### 4. Selecciona Dev Lead

`dev-lead` es el interlocutor normal. Describe el trabajo en lenguaje natural; él clasifica la petición, evalúa el riesgo y coordina únicamente a los especialistas necesarios.

No selecciones manualmente `architect`, `developer`, `reviewer` u otros subagentes salvo que estés diagnosticando o manteniendo el propio Blueprint.

### 5. Ejecuta `/new-project`

Ejecuta `/new-project` una sola vez por carpeta creada desde el template. El comando **no crea una web nueva**: inspecciona la carpeta e inicializa su contexto, también cuando se trata de una web existente o de mantenimiento.

Dev Lead preguntará solo por información material que no pueda inferir, por ejemplo qué se va a hacer, propósito, público y stack conocido. Después mostrará un resumen sencillo y pedirá confirmar:

> ¿Inicializo el proyecto con esta información?

Tras la confirmación actualizará el contexto. No desarrollará todavía páginas o funcionalidades. Si Git existe, creará el commit local de inicialización; sin Git guardará los archivos y continuará sin tratarlo como bloqueo.

El README del template presenta el Blueprint y su onboarding. Al inicializar un proyecto real, `/new-project` convierte ese README genérico en una presentación breve del proyecto, basada en contexto confirmado; un README propio existente se conserva por defecto. `.blueprint/BLUEPRINT.md` mantiene la documentación del sistema y los archivos canónicos de contexto prevalecen sobre el resumen del README.

No vuelvas a ejecutar `/new-project` si `PROJECT.md` ya describe el proyecto real y `STATE.md` dejó atrás la inicialización. Los datos todavía desconocidos pueden permanecer como `Pending`.

### 6. Confirma el contexto y empieza a trabajar

Comprueba el resumen de Dev Lead y pide la primera tarea en lenguaje natural, por ejemplo:

- «Prepara el contenido de la landing de captación».
- «Corrige el menú móvil sin cambiar el diseño de escritorio».
- «Planifica el plugin, pero todavía no implementes código».
- «Revisa esta integración antes de desplegar a staging».

Los slash commands como `/plan`, `/content`, `/design`, `/debug`, `/review` o `/handoff` son atajos opcionales. No hace falta memorizarlos para trabajar.

## Filosofía de uso

- **Local-first:** el trabajo se prepara en la carpeta del proyecto antes de cualquier publicación.
- **Git opcional:** sin Git se trabaja y verifica por archivos; con Git se añaden commits locales y trazabilidad.
- **Plataforma y entrega independientes:** que el destino sea WordPress, Bricks, Elementor o WooCommerce no obliga a implementar dentro del CMS desde este repositorio.
- **Punto de entrega explícito:** un flujo puede terminar en contenido, diseño, frontend, handoff, integración CMS o deployment.
- **MCP opcional:** solo se configura si la integración existe, está autorizada y forma parte del alcance.
- **Deployment opcional:** disponer de producción no activa un método de despliegue ni autoriza usarlo.
- **Source of truth:** en sistemas existentes prevalece la implementación vigente; en trabajo nuevo se usan las fuentes versionadas acordadas.
- **Conversación natural:** Dev Lead pregunta por decisiones del proyecto, no por campos internos ni estructuras de archivos.
- **Equipo coordinado:** los especialistas se activan por necesidad y Dev Lead integra y verifica sus resultados.

## Proyectos soportados

| Escenario | Cómo puede usarse el Blueprint |
|---|---|
| Landing HTML/CSS/JS | Contenido, diseño, frontend responsive y entrega de archivos estáticos. |
| WordPress + Bricks con handoff manual | Preparar contenido, diseño y referencia de implementación para que otra persona maquete en Bricks. |
| WordPress + Elementor | Diseñar o implementar componentes y templates cuando Elementor forme parte del alcance. |
| WooCommerce | Trabajar catálogo, carrito, checkout, pedidos o extensiones con revisión proporcional al riesgo. |
| Plugin WordPress | Planificar, desarrollar, probar y empaquetar un plugin localmente para instalación posterior. |
| Theme custom | Mantener o desarrollar el theme respetando su arquitectura y herramientas existentes. |
| Blog/SEO de una web existente | Versionar estrategia, artículos, metadata y enlazado sin reconstruir el sitio. |
| Mantenimiento de web existente | Inspeccionar la fuente vigente, corregir lo mínimo y verificar regresiones. |
| Proyecto híbrido | Entregar unas piezas como contenido o diseño y otras como código listo para integrar. |
| Publicación mediante MCP | Publicar solo los entregables autorizados cuando el servidor MCP esté disponible y validado. |

Estos escenarios no activan automáticamente todas las fases ni capacidades. El alcance real determina qué agentes y artefactos se necesitan.

## Dónde vive cada cosa

El sistema separa tres capas:

- **Blueprint Core:** infraestructura portable heredada bajo `.blueprint/`, además de rutas técnicas como `.kilo/`, `.github/`, `.kilocode/`, `AGENTS.md` y `kilo.jsonc`. Su inventario está en [`MANIFEST.md`](../MANIFEST.md).
- **Project Context:** resumen y memoria breve que permiten continuar el trabajo: `README.md`, `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` y `ARTIFACTS.md`.
- **Project input:** materiales proporcionados en `project-resources/`; no equivalen a código/assets de producción ni se registran en `ARTIFACTS.md` por defecto.
- **Product container:** `product/` es el contenedor canónico de implementación nueva greenfield bajo Blueprint 1.1.x; se crea al iniciar implementación, no durante onboarding. El stack define su estructura interna. En existentes se registra y preserva el layout observado.
- **Project Artifacts:** entregables reales del proyecto, conservados en su ruta canónica.

Rutas habituales de Project Artifacts:

| Tipo | Ruta habitual |
|---|---|
| Contenido de páginas | `content/pages/` cuando se cree contenido y el stack no posea esa ruta |
| Artículos | `content/blog/` cuando se creen artículos y el stack no posea esa ruta |
| Diseño de páginas | `design/pages/` cuando exista un prototipo real |
| Referencias visuales | `design/references/` cuando existan referencias versionadas |
| Especificaciones funcionales | `docs/features/` cuando se persista una especificación |
| Arquitectura transversal | `docs/architecture/` cuando exista documentación real |
| ADRs | `docs/adr/` cuando exista un ADR formal |
| Auditorías | `docs/audits/` cuando se solicite un informe durable |
| Código y pruebas | Código greenfield dentro de `product/`, con estructura/harness nativos del stack; en existentes, layout observado y preservado |
| Handoff | Ruta acordada usando `.blueprint/templates/handoff.md` como base |

[`ARTIFACTS.md`](../../ARTIFACTS.md) es el mapa de los entregables significativos que existen, no una copia de su contenido, un changelog ni un inventario del Blueprint. Se actualiza cuando un artefacto aparece, desaparece, cambia de ubicación, propósito o estado material.

## Responsive y breakpoints

En proyectos nuevos, `.blueprint/config/responsive.json` define la convención `fluid-first`: Base no usa media query y los breakpoints descendentes son correcciones condicionales, no pasos que deban aplicarse siempre.

En proyectos existentes prevalecen los breakpoints ya implementados. No se sustituyen por la configuración del Blueprint salvo que se apruebe una migración. Consulta [Configuración del Blueprint](CONFIGURATION.md#responsive).

## Qué decide el agente

Dev Lead resuelve sin interrumpir detalles internos, convencionales, reversibles y de bajo riesgo: estructura interna, nombres técnicos provisionales, selección de skills y profundidad proporcional del proceso.

Requieren aprobación humana las decisiones que cambian alcance o arquitectura, afectan producción o datos existentes, crean contratos públicos, son costosas de revertir, implican seguridad, privacidad o negocio, dependen de criterio visual/comercial o incluyen tradeoffs materiales. `push`, `merge`, deployment, DNS, servidor y operaciones destructivas también permanecen bajo control humano.

## Siguientes referencias

- [Configuración, MCP y deployment](CONFIGURATION.md)
- [Trabajo con Git](GIT-WORKFLOW.md)
- [Ciclo de vida y puntos de entrega](LIFECYCLE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Especificación para maintainers](../BLUEPRINT.md)
