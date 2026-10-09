# Empieza aquí

Guía práctica para el primer día con CN Pilot. Está dirigida a quien va a usar el harness en un proyecto, no a quien mantiene su infraestructura interna.

## Qué necesitas

- VS Code.
- La extensión Kilo Code.
- Acceso a un proveedor de modelos compatible con Kilo.
- Las herramientas propias del stack del proyecto.
- Git y GitHub Desktop solo si el proyecto utilizará control de versiones.

No necesitas conocer previamente los agentes, profiles, capabilities, skills ni workflows internos de CN Pilot.

## Recorrido del primer día

### 1. Crea tu carpeta de trabajo

Usa el repositorio como GitHub Template, clónalo o copia sus archivos a una carpeta local. Git es opcional: no ejecutes `git init` solo para poder usar el sistema. El CN Pilot Core usa [`GPL-3.0-or-later`](../../LICENSE); el [README explica la licencia principal](../../README.md#licencia).

### 2. Abre el proyecto

Abre la carpeta raíz en VS Code e inicia Kilo Code. Kilo debe detectar `dev-lead` como agente primario y los especialistas como subagentes.

### 3. Configura Kilo una vez por máquina

Autentica cualquier proveedor compatible y comprueba que sus modelos estén disponibles. La configuración personal no se incluye al clonar el repositorio.

Sigue [Configuración de Kilo](KILO-SETUP.md). CN Pilot no recomienda modelos por agente; tus preferencias de IA se mantienen en Kilo, fuera del contexto de `/new-project`.

### 4. Selecciona Dev Lead

`dev-lead` es el interlocutor normal. Basta explicar en lenguaje natural qué quieres conseguir, incluso en una frase sencilla: no necesitas escribir un prompt elaborado ni conocer nombres internos. Dev Lead inspecciona el contexto, pregunta solo si falta algo material y coordina a los especialistas necesarios.

No selecciones manualmente `architect`, `developer`, `reviewer` u otros subagentes salvo que estés diagnosticando o manteniendo el propio CN Pilot.

### 5. Ejecuta `/new-project`

Ejecuta `/new-project` una sola vez por carpeta creada desde el template. El comando **no crea una web nueva**: inspecciona la carpeta e inicializa su contexto, también cuando se trata de una web existente o de mantenimiento.

Si no basta el contexto disponible, Dev Lead preguntará progresivamente y en lenguaje natural por una ausencia material; no convertirá propósito, público y stack en campos obligatorios ni exigirá elegir tecnología. Después mostrará un resumen sencillo y pedirá confirmar:

> ¿Inicializo el proyecto con esta información?

Tras la confirmación actualizará el contexto. No desarrollará todavía páginas o funcionalidades. Si Git existe, creará el commit local de inicialización; sin Git guardará los archivos y continuará sin tratarlo como bloqueo.

El README de CN Pilot presenta el producto y su onboarding. Al inicializar un proyecto real, `/new-project` convierte ese README genérico en una presentación breve del proyecto, basada en contexto confirmado; un README propio existente se conserva por defecto. `.cn-pilot/CORE.md` mantiene la especificación técnica del sistema y los archivos canónicos de contexto prevalecen sobre el resumen del README.

No vuelvas a ejecutar `/new-project` si `PROJECT.md` ya describe el proyecto real y `STATE.md` dejó atrás la inicialización. Los datos que no hacen falta todavía pueden dejarse para una tarea posterior.

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
- **Contexto progresivo:** puedes completar el contexto a medida que surjan tareas; la información no necesaria ahora puede quedar pendiente.
- **Equipo coordinado:** los especialistas se activan por necesidad y Dev Lead integra y verifica sus resultados.

## Proyectos soportados

| Escenario | Cómo puede usarse el CN Pilot |
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

El sistema separa las capas de infraestructura, contexto, inputs, outputs auxiliares y producto:

- **CN Pilot Core:** infraestructura portable bajo `.cn-pilot/`, además de rutas técnicas como `.kilo/`, `.github/`, `.kilocode/`, `AGENTS.md` y `kilo.jsonc`. Su inventario está en [`MANIFEST.md`](../MANIFEST.md).
- **Project Context:** resumen y memoria breve que permiten continuar el trabajo: `README.md`, `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` y `ARTIFACTS.md`.
- **Project input:** materiales proporcionados en `project-resources/`; no equivalen a código/assets de producción ni se registran en `ARTIFACTS.md` por defecto.
- **Producto activo del workspace:** `product/` es el container canónico en Greenfield y Existing importado; se crea al iniciar implementación/adopción, no durante onboarding, y se preserva el layout interno observado. Existing repository previamente operativo puede conservar su product root real solo con `Existing compatibility exception` documentada en `PROJECT.md`.
- **Project Artifacts:** outputs auxiliares reales bajo `project-artifacts/` en greenfield. El container puede no existir; se crea con el primer artefacto, no durante onboarding. Documentación de producto dentro de `product/docs/` sigue perteneciendo al producto.

Rutas habituales de Project Artifacts:

| Tipo | Ruta habitual |
|---|---|
| Contenido de páginas | `project-artifacts/content/pages/` cuando se cree contenido en greenfield |
| Artículos | `project-artifacts/content/blog/` cuando se creen artículos en greenfield |
| Estrategia editorial/search | `project-artifacts/content/strategy/` cuando exista un pack reutilizable |
| Diseño de páginas | Prototipo HTML/CSS/JS responsive en `project-artifacts/design/pages/` cuando aplique alta fidelidad; `.md` puede acompañar, no sustituirlo |
| Referencias visuales | `project-artifacts/design/references/` cuando existan referencias versionadas |
| Especificaciones funcionales | `project-artifacts/docs/features/` cuando se persista una especificación |
| Arquitectura transversal | `project-artifacts/docs/architecture/` cuando exista documentación real |
| ADRs | `project-artifacts/docs/adr/` cuando exista un ADR formal |
| Auditorías | `project-artifacts/docs/audits/` cuando se solicite un informe durable |
| Código y pruebas | Producto activo en `product/` para Greenfield/Existing importado, con estructura/harness nativos; en adopted exception, product root real registrado |
| Handoff | Entregable auxiliar en `project-artifacts/` cuando corresponda, con `.cn-pilot/templates/handoff.md` como base; respeta destinos acordados |

Al pedir el diseño visual de una página web, el resultado de alta fidelidad es un prototipo HTML/CSS/JS responsive que puedes revisar como página. Una spec Markdown puede acompañarlo, pero no sustituirlo; visualizar el prototipo no significa implementar o publicar el producto.

[`ARTIFACTS.md`](../../ARTIFACTS.md) es el mapa de entregables significativos de todo el proyecto, no solo de `project-artifacts/`: puede incluir implementación bajo `product/` cuando aporte valor y entregables excepcionales. No incluye Core, Project Context, inputs originales, caches, dependencias ni placeholders. No es una copia del contenido, changelog ni inventario del CN Pilot; se actualiza ante altas/bajas, movimientos o cambios materiales de propósito/estado.

En proyectos existentes, el modo de producto se infiere con evidencia: Existing importado al workspace activo usa `product/`; source en `project-resources/` es solo input; repositorio operativo adoptado puede registrar excepción y preservar root real. El código top-level sin contratos operativos no se vuelve excepción por inferencia. Las rutas de contenido/diseño/documentación ya vigentes se preservan durante onboarding; no se reorganizan bajo `project-artifacts/` sin tarea explícita.

## Responsive y breakpoints

En proyectos nuevos, `.cn-pilot/config/responsive.json` define la convención `fluid-first`: Base no usa media query y los breakpoints descendentes son correcciones condicionales, no pasos que deban aplicarse siempre.

En proyectos existentes prevalecen los breakpoints ya implementados. No se sustituyen por la configuración del CN Pilot salvo que se apruebe una migración. Consulta [Configuración del CN Pilot](CONFIGURATION.md#responsive).

## Qué decide el agente

Dev Lead resuelve sin interrumpir detalles internos, convencionales, reversibles y de bajo riesgo: estructura interna, nombres técnicos provisionales, selección de skills y profundidad proporcional del proceso.

Requieren aprobación humana las decisiones que cambian alcance o arquitectura, afectan producción o datos existentes, crean contratos públicos, son costosas de revertir, implican seguridad, privacidad o negocio, dependen de criterio visual/comercial o incluyen tradeoffs materiales. `push`, `merge`, deployment, DNS, servidor y operaciones destructivas también permanecen bajo control humano.

## Siguientes referencias

- [Interacción human-first y contexto progresivo](HUMAN-INTERACTION.md)
- [Configuración, MCP y deployment](CONFIGURATION.md)
- [Trabajo con Git](GIT-WORKFLOW.md)
- [Ciclo de vida y puntos de entrega](LIFECYCLE.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [CN Pilot Core](../CORE.md)
