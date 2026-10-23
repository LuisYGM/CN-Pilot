# Changelog

## [2.8.3] - 2026-10-23

- BF-072 establece Header persistente (sticky preferido) para nuevas interfaces web/rediseños en scope, con navegación primaria equivalente en Application UI y protección de contenido, anchors y mobile.
- Los controles interactivos requieren affordance perceptible, hover con transición apropiada, pointer activo y `:focus-visible`; disabled, touch y reduced motion conservan comportamiento accesible.
- Existing fuera de scope no se modifica y Approved/Strict mantiene autoridad. Core QA/updater cubren el contrato y la actualización no toca Product, Project Context ni recursos existentes.
- Sin nuevas skills, agentes ni comandos.

## [2.8.2] - 2026-10-23

- Se aclara la conversión de un frontend Approved a Product: la autoridad visual no congela su implementación interna; la conversión optimizada es la opción recomendada cuando no se pide conservar estructura ni se autoriza un cambio visual.
- Se incorpora Technical Normalization focal: extracción de tokens por roles compartidos con valores aprobados, reutilización de componentes reales y ownership proporcional de shared/page styles, scripts y assets.
- Se preservan breakpoints responsive del source Approved y se integra la adaptación a WordPress nativo sin volver dinámico todo contenido ni crear un UI Kit retroactivo.
- Tests cubren autoridad/intención, tokens/componentes/breakpoints, parity y updater Core-only; no se modificó ningún Product.

## [2.8.1] - 2026-10-23

- Documentation & Onboarding Refresh: README y guía de primer día reflejan el Core actual y explican uso en lenguaje natural, contexto, aprobaciones, diseño, Existing, WordPress y límites de publicación.
- Se añade un mapa documental y catálogos de comandos, skills/capacidades y glosario; los índices se verifican contra los recursos reales.
- Se actualizan flujo de vida/equipo/Git, configuración de Kilo, seguridad, troubleshooting y actualización; referencias a versión/rutas canónicas obsoletas corregidas.
- Project Context se explica brevemente en el scaffold; updater tests verifican que no sobrescribe contexto, README, recursos, artefactos ni Product al actualizar Core.
- Patch documental: no cambia comportamiento de agentes/skills/comandos/updater, no añade capabilities y no modifica Product.

## [2.8.0] - 2026-10-23

- Se endurece el catálogo con cambios focales en Accessibility, Bricks, Performance, Responsive, Motion, UI Kit, Security, Database Migrations, Content, Webapp Testing y WordPress deploy/plugin; las skills maduras y los límites de ownership se preservan.
- Se corrigen reglas demasiado absolutas: foco admite indicadores perceptibles distintos, `clamp()` es contextual y responsive contempla container queries sin sustituir la escala viewport Greenfield.
- Se consolida BF-057 en una sola sección, mejora debugging routing natural y se integra WordPress Product Contract 2.7 en deploy/plugins sin migrar Product.
- Se añade `analytics-instrumentation` para medición técnica con owner Desarrollador, event contract, consentimiento/PII, deduplicación y QA por destino. La auditoría no encontró otra skill con ownership de instrumentation.
- El inventario aumenta en una skill (40); no se añaden agentes ni comandos. Actualización del Core sin cambiar tags, properties de analytics, breakpoints, builders ni integraciones de proyectos existentes.

## [2.7.0] - 2026-10-23

- Se formaliza el WordPress Product Contract: el source Greenfield administrado por CN Pilot reside bajo `producto/wp-content/`; Core y uploads quedan fuera por defecto, y Existing conserva su root/hosting/CI sin migración automática.
- Se incorpora Professional Custom Theme Architecture con distinción explícita Classic/Hybrid/Block, WordPress Template Hierarchy, shell Header/Footer y sus hooks, template parts y `functions.php` bootstrap proporcional.
- Se documentan `inc/`, setup/enqueue/assets nativos, paths portables, uso coordinado de `theme.json`, media responsive 2.6.1 y límites theme/plugin.
- Se refuerzan ownership de datos/lógica, seguridad, accesibilidad, rendimiento, compatibilidad con child themes y WooCommerce condicional; no se exige scaffolding, Composer/Node/build ni estructura vacía.
- Se añaden tests contractuales y de updater 2.6.1→2.7.0; la actualización no crea `producto/wp-content/`, no mueve Existing ni modifica Product.

## [2.6.1] - 2026-10-23

Corrección compatible del alcance incompleto de Frontend Architecture/Fidelity 2.0.

- Se incorpora Frontend Media Strategy: media representacional prefiere `<img>`/`<picture>` o primitive semántico equivalente; `background-image` sigue disponible para decoración y fondos genuinos.
- Se precisan responsive images, loading para Hero/LCP, layout stability, alt y preservación de media/crops aprobados sin migración automática de Existing.
- Column/Block favorece `gap` para spacing interno repetible cuando Grid/Flex lo permitan, sin convertirlo en dogma; Section y Container conservan sus responsabilidades.
- Se refuerzan tests de `!important` excepcional, consolidación de patch piles, CSS legible y Safe Parallelism para el sistema CSS compartido.
- Actualización normal del Core: sin migración de Project Context, conversión de backgrounds ni cambios en `producto/wp-content/**`.

## [2.6.0] - 2026-10-23

- Se formaliza Frontend Architecture/Fidelity 2.0 con gramática adaptable, sistema compartido/styles por página y respeto a la autoridad visual.
- Compositional Diversity, estructura semántica y Visual Consolidation Pass mejoran mantenibilidad sin imponer framework/DOM ni refactor en Existing.
- Responsive y representación de imágenes siguen las convenciones vigentes del stack; no se adelanta un contrato WordPress.

## [2.5.0] - 2026-10-22

- UI Kit público incorpora Header/Mobile Header, Footer, Motion System, media, iconografía funcional y specimens proporcionales.
- Se formalizan motion/responsive/reduced-motion, No Empty Media Slots, resolución/provenance de assets, icon library-first y Visual Quality Floor con fast paths intactos.

## [2.4.0] - 2026-10-22

- Visual Pipeline 2.0 añade Reference Coverage, Concept Studies visuales reales, Human Creative Review con selección/mezcla y Visual Synthesis antes del UI Kit derivado.
- Se incorpora el workflow de Flagship y sus fast paths, manteniendo las aprobaciones humanas, Guided Journey, BF-062 y la compatibilidad Project Context.

## [2.3.0] - 2026-10-22

- BF-062 incorpora SERIAL por defecto, paralelismo read-only y worktrees nativos de Agent Manager solo para unidades realmente independientes, con un writer por worktree e integración secuencial.
- Se refuerzan la recuperación global por unidad paralela y la limpieza segura; Agent Manager es opcional y el fallback es SERIAL.

## [2.2.0] - 2026-10-22

- Se incorpora Guided Project Journey: onboarding conversacional, orientación del siguiente paso, aceptación de skips y decisiones «Decide tú» sin wizard rígido.
- El Journey se adapta al tipo y estado real del proyecto; `Pending` no material no bloquea y la continuidad respeta el scope autorizado y los gates humanos.

## [2.1.1] - 2026-10-22

Corrección de consistencia Spanish-first en la documentación y los prompts activos del Core.

- Se unifican los nombres visibles de roles y la doctrina de idioma; se añade Core QA para prevenir regresiones terminológicas.

## [2.1.0] - 2026-10-22

Actualización compatible del Core centrada en continuidad y finalización.

### Añadido y mejorado

- Se eliminan los límites numéricos `steps` de los siete agentes activos; Progress Guard define avance observable, cambio de estrategia tras fallos comparables y reutilización de fuentes/evidencia/tests válidos.
- Se refuerza la continuidad de trabajo incompleto recuperable, la reconciliación de handoffs y checkpoints, y Completion Mode sin scopes opcionales.
- QA y evidence budget quedan limitados a la mínima evidencia suficiente, conservando BF-059 y BF-062.
- Core QA valida el inventario de siete agentes y falla si reaparece un step cap numérico en un agente activo.

## [2.0.0] - 2026-10-22

Primera base Spanish-first y migración de estructura del Core.

### Cambiado

- Se establecen los nombres canónicos en español para el contexto del proyecto, recursos, artefactos, documentación, perfiles, plantillas, agentes y comandos.
- Se incorpora migración mayor explícita desde CN Pilot 1.x que conserva las rutas legacy como origen hasta verificar destino y colisiones; las excepciones operativas Existing no se reorganizan.
- Se mantiene intacto el catálogo técnico de skills y la compatibilidad con los contratos de máquina existentes.

## [1.5.4] - 2026-10-17

Parche de mantenimiento del updater/status.

### Corregido

- `/cn-status` solo indica `Ready to update.` con plan válido y working tree tracked limpio; si hay cambios tracked, indica readiness bloqueada y la causa. `updateExisting` conserva su guard `DIRTY_TRACKED_TREE`; commits locales ahead y untracked no colisionantes no bloquean readiness.

## [1.5.3] - 2026-10-17

Parche backward-compatible del Core.

### Corregido

- Eliminadas las heurísticas de disciplina visual con atribución histórica a un upstream externo y la instrucción huérfana que pedía conservar esa atribución. La expresión tipográfica, el color, la densidad y la composición se derivan del contexto, sin moderación automática.
- Reconciliados wording heredado de UI/UX y expresiones de BF-045/dirección de medios que podían sugerir límites estilísticos generales. Se mantienen intención, usable/accessibility, contenido veraz, referencias Approved/Strict, continuidad Existing y Creative Quality Gate.
- Creative Refinement ahora continúa focalmente si queda Genericity Risk o falla evidencia material; una pasada no es límite de creatividad. BF-059 sigue deteniendo loops de bajo retorno cuando el gate creativo ya está satisfecho.
- Retest contractual confirma cero menciones/archivos activos de esa atribución y conserva las capacidades creativas, a11y, performance, motion, responsive y browser QA existentes.

## [1.5.2] - 2026-10-16

Parche backward-compatible del Core.

### Corregido

- **Updater root discovery:** `/cn-status` y `/cn-update` resuelven el Git root y revisan los paths de updater/manifest con filesystem literal, distinguiendo legacy real, baseline ausente, manifiesto inválido y errores de root/paths unsafe; el CLI encuentra el root desde subdirectorios.
- **Checkpoint BF-047:** contrato mínimo obligatorio `schemaVersion: 1`, `status`, `objective` y `nextAction` para tareas abiertas; writer/reader alineados, compatibilidad de lectura con `BLOCKED` histórico y `COMPLETED` terminal legacy, con diagnósticos de validación específicos. Checkpoints inválidos siguen bloqueando update sin reparación. Retests de filesystem, root, lifecycle y Silent Closure PASS; sin rediseño del updater.

## [1.5.1] - 2026-10-16

Parche backward-compatible del Core.

### Corregido

- **No-op / Silent Closure:** separa cierre operacional de persistencia durable. La confirmación humana resuelve gates y cierra checkpoint sin propagar push, sincronización, review o cierre ya representados por Git/runtime; solo cambios durables se registran en su fuente canónica mínima. Retests conductuales A–F cubren cierre/push sin commit, baseline visual nuevo, decisión durable y recovery; sin framework QA nuevo.

## [1.5.0] - 2026-10-15

Release MINOR compatible que incorpora BF-067.

### Cambiado

- **BF-067 — Creative Discovery & Divergence:** discovery basado en evidencia y ejecución real de reference/font scouting; Input Audit READY/ENRICHABLE/BLOCKED, Creative Opportunity Questions agrupadas, MEDIA GAP/Content Enrichment Opportunity, Concept Divergence y Creative Quality Gate basado en fuentes, alternativas y motion intent. Existing/Application UI/Approved/Strict preservados; sin agentes, runners ni dependencias nuevos. BF-059/062/063 no cambian.

## [1.4.0] - 2026-10-15

Release MINOR backward-compatible que incorpora BF-066.

### Añadido

- **BF-066 — Creative Web Experience:** nueva capability default para public web Greenfield/rediseño material con brand grammar, reference scouting, typography/media/icon discovery, vocabulario compositivo, motion direction/personality/signature opcional y Creative Quality Gate pre-`VISUAL INTENT STABILIZED`. Existing localized, Application UI y Approved/Strict conservan continuidad/routing/authority; scouting acotado, sin QA runner ni dependencies.

## [1.3.1] - 2026-10-13

Parche backward-compatible del Core.

### Corregido

- **BF-065 — Safe Optional Active Task Detection:** la ausencia de `.cn-pilot/runtime/active-task.json` es normal; Dev Lead verifica existencia sin error antes de leerlo y continúa sin warning cuando no existe. Un archivo existente inválido sigue siendo un error visible.

## [1.3.0] - 2026-10-13

Release compatible del Core que incorpora BF-063 y BF-064. Desde esta versión, toda distribución futura requiere bump SemVer.

### Añadido

- **BF-064 — Versioned Core Update System:** `/cn-status` read-only y `/cn-update` manual con rama estable `main`, manifest de baseline/hash SHA-256, instalador allowlisted, detección de conflictos, compatibilidad, bloqueos active-task/dirty-tree, legacy bootstrap sujeto a revisión humana y commit local posterior a Core QA. Project Owned, configuración mixta y runtime quedan fuera; no auto-update, merge, push, tags/releases ni migrations ejecutables en v1. La distribución SemVer `1.3.0` incluye también BF-063.
- **BF-063 distribuible:** preservación de candidato visual y separación entre QA/fixes objetivos y rediseño subjetivo, aprobado en el registro BF-063 anterior.

## [1.2.0] - 2026-10-09

Migración estructural del Core y limpieza del payload del template.

### Cambiado

- **Identidad y rutas:** `.blueprint/` pasa a `.cn-pilot/`, `BLUEPRINT.md` a `CORE.md` y `.blueprint-version` a `.cn-pilot-version`; se consolida CN Pilot / CN Pilot Core como terminología operativa.
- **Versionado:** versión base del Core actualizada a `1.2.0`.
- **Onboarding:** `/new-project` pasa a ser el primer slash command del Quick Start; `/doctor` queda como diagnóstico manual avanzado, read-only y bajo demanda.
- **Payload del template:** se depura material auxiliar que no forma parte del payload portable; `.vscode/` queda excluido para configuración local. Se conservan `.editorconfig`, `.gitattributes`, `.kilocodeignore` y el `LICENSE` principal.
- **BF-043 — Validated:** R1 PASS mediante invocación nativa manual de `/new-project` en Kilo Code; R2, R3, R4 y R5-A/B/C PASS. `/doctor` se ejecutó en `1.2.0`: `WARNINGS` solo por no poder introspectar estáticamente los permisos efectivos de Reviewer; los permisos declarados son correctos y la limitación no es bloqueante.
- **BF-044 — Visual Resource Integrity (Validated):** retests verifican que un recurso representacional solo se proponga con source o autorización para diseñarlo; gaps materiales sin fuente se reportan fuera de UI; se componen interiores sin falsa escena/plano, se conservan SVGs para diagramas sustentados y Existing reutiliza assets aprobados. Sin placeholders ni notas de estado en UI.
- **BF-045 — Visual Asset Strategy (Validated):** retests A–E validan alternativas visuales sin foto, fotos aprobadas, SVG sustentado, video/motion y sobriedad Existing. Validan decisiones/routing de medios, no inspección de binarios, derechos ni runtime; no obligan una cuota ni una fórmula.
- **BF-046 — Design System First (Validated):** retests focalizados A–J PASS; UI Kit/page consumen tokens compartidos (H1 64→56px propagado), el fixture Chrome responsive 390/768/1024/1440 no muestra overflow e incluye states/focus/reduced motion/content-resilience; Reviewer APPROVED. Fixtures temporales eliminados.
- **BF-047 — Completion-Driven Execution & Recovery (Validated):** retests A–J PASS; Reviewer APPROVED; checkpoint runtime local, reanudación focalizada y preservación del working tree verificados. Continuación CLI nativa disponible; auto-resume queda `DEFERRED` porque no se halló señal terminal estable para distinguir interrupciones/bloqueos.
- **BF-048 — Visual Reference Intake & Fidelity (Validated):** retests conductuales A–N y combinaciones cruzadas authority/fidelity PASS; Reviewer APPROVED en revisión completa e incremental. Organiza fuentes on-demand, separa derechos y aplica parity proporcional; no se usaron secretos reales en las pruebas.
- **BF-049 — Advanced Visual & Interaction Capabilities (Validated):** retests A–O PASS, fixture GSAP real/build/browser QA PASS en Chrome a 390/1440px y Reviewer APPROVED; formaliza escalamiento native-first, motion bajo demanda, capability catalog extensible y QA específico sin añadir dependencias a CN Pilot.
- **BF-050 — Context Architecture & Progressive Loading (Validated):** retests A–K PASS y Reviewer APPROVED; confirma la carga real de contexto Kilo y reduce 78% las superficies fijas medidas con routing progresivo, sin retirar capacidades.
- **BF-051 — Executable Core QA (Validated):** 13 self-tests PASS, QA del Core actual PASS (15 checks/0 findings) y Reviewer APPROVED; checker read-only, portable, Node built-in, salida humana/JSON y sin dependencias externas.
- **BF-052 — Skill Quality & Implementation Depth (Validated):** auditoría proporcional de las 25 skills; mejoradas `api-integration`, `elementor`, `systematic-debugging` y `woocommerce`; `git-checkpoint` permanece intencionalmente compacta, sin nuevas skills ni cambios de inventory. Añade estándar canónico mínimo sin inflar kernel (BF-050), retests A–O dirigidos PASS, seis escenarios realistas PASS, fuentes oficiales actuales de WooCommerce/Elementor consultadas, Core QA PASS (15 checks) y Reviewer APPROVED; no se afirma despacho de skills en runtime ni pruebas de producto.
- **BF-053 — Safe Autonomy & Permission Friction (Validated):** Kilo 7.8.8/docs/source confirman last-match-wins y que `edit`, `write`, `apply_patch` evalúan rutas con acción `edit`; los allows de ownership hacen autónoma la escritura de UI/UX, Architect y Content, por lo que se preserva la matrix sin blanket allows. Se incorpora autorización local inherente y AUTO/ASK/DENY compactos; `always` puede guardar `edit: *` a nivel de proyecto, por lo que no se usa para saltar ownership. Core QA PASS y Reviewer APPROVED. Resoluciones contrastadas con `kilo debug agent`; no se afirma telemetría interactiva de prompts.
- **BF-054 — Automation & Integrations (Validated):** audit confirma capability distinta para orquestación operativa frente a `api-integration`, backend síncrono y deployment; creada `automation-integrations` native-first/provider-agnostic, routing lazy de una fila y doctrina Core compacta. Retests de decisión A–R y seis probes realistas PASS como análisis tabletop (no dispatch/runtime de producto); fuentes oficiales actuales de GitHub Actions (triggers/schedule y concurrencia) y n8n (error workflows/ejecuciones) consultadas. Core QA PASS (26 skills/0 findings), Reviewer APPROVED; sin workflows, instalaciones, credenciales ni cambios a la versión `1.2.0` o BF-043–053.

- **BF-055 — Maintenance & Operations (Validated):** audit confirma gap propio de coordinación de lifecycle operativo; creada `maintenance-operations` provider-agnostic, profile compacto, routing lazy y doctrina Core breve. Retests A–S y seis probes realistas tabletop PASS (decisiones/routing, no dispatch/runtime de producto); Core QA PASS (27 skills, 0 findings), Reviewer APPROVED. Sin monitoring, workflows, comandos, instalaciones ni mutaciones de producción; versión `1.2.0` y BF-043–054 preservados.
- **BF-056 — Discovery & Strategy Coverage (Validated):** audit confirma cobertura suficiente de web/content strategy, human-first onboarding y contexto; gap real de behavioral product discovery para apps/features complejas antes de decisiones técnicas/visuales. Añadida `product-discovery` lazy, extensión opcional de feature-spec, un routing, nota compacta en `custom-web` y doctrina Core mínima. Retests A–W y ocho probes realistas tabletop PASS (decisiones/routing, no dispatch/runtime); Core QA PASS (28 skills, 0 findings); Reviewer APPROVED. `/new-project` y `web-strategy` sin cambios; profiles 7, commands 12, versión `1.2.0` y BF-043–055 preservados.
- **BF-057 — Benchmark-Driven Visual & Execution Refinement (Validated):** retests A–Z y 20 probes tabletop PASS; Core QA BF-051 PASS y Reviewer APPROVED. Evoluciona BF-046 con UI Kit baseline, Product-first en scope full, fast paths Design-only/Strict/Existing y validation/Discovery proporcionales; no afirma mejora de timing benchmark.
- **BF-058 — Proportional QA Efficiency & UI Consistency (Validated):** motivado por benchmarks 05–06, sin fixtures ni reabrir BF-057. Retests decisionales A–W y 10 probes de análisis PASS (no tests de runtime/producto); Core QA PASS (28 skills, 12 commands, 7 agents, 7 profiles; 0 findings); Reviewer APPROVED. Formaliza plan/stop por evidencia, persistencia de PASS/reruns dirigidos, responsive máximo normal 3 viewports y capturas no rutinarias; mantiene profundidad de ingeniería y revisión humana. Refina clamp min/max px con excepción Existing, headings token/variants completas, accordion accesible/motion sutil y fuentes web contextuales cuya carga deberá verificarse en Product. Sin nuevas capabilities, cambios de permisos, screenshots, scripts, version bump ni afirmación de mejora temporal.

- **BF-059 — Execution Proportionality & Bounded Completion:** corrige gaps de aplicación y hace operativos el mínimo suficiente, QA de máximo dos rondas normales + excepción acotada a blocker, Product PASS independiente del cierre documental/Git, clasificación de runtime estático portable/HTTP/app, límite Product/Artifacts, labels de tokens, clamps px y focus de campos. Añade continuidad Existing, preguntas seleccionables nativas y checks locales en el punto de generación; preserva profundidad según outcome/riesgo, gates Reviewer, seguridad y QA de alta fidelidad. Core health PASS (15 checks/0 findings), tests existentes del checker PASS (13/13), `git diff --check` PASS y Reviewer APPROVED. La evidencia es contractual/checker/estática: este repositorio no contiene Product/Kit/browser fixture con el cual ejecutar los escenarios de output A–J; no se afirma validación runtime de dichos productos. Sin nueva capability, suite ni framework.

- **BF-060 — Canonical UI Kit Construction:** separa la construcción y sus checks pre-aprobación de Creative Direction/design-system decisions. Añade skill `ui-kit-construction`, activación obligatoria desde UI/UX/Dev Lead y estándar global para root 100%, base body ≥16px, font-size/spacing tokens fluidos en clamp con endpoints px, specimens con identifiers exactos, primitives, accordion motion/reduced-motion, field focus, carga de fuentes y responsividad. Core QA ya calcula inventario de skills; MANIFEST actualizado a 29, sin lógica/count hardcodeado ni nueva suite/checker.

- **BF-061 — Specialized Design & Delivery Capabilities (Validated):** añade page-composition, visual-art-direction, application-ui, form-experience, auth-access-control, wordpress-content-modeling y release-deployment. Aclara fronteras con system/kit, security review, WordPress y deployment WordPress; routing progresivo por owner/trigger, sin pipeline ni agents nuevos. Retests tabletop A–D (UX/visual/forms), E–F (auth y WP model) y G (Vite artifact/deploy autorizado + dispatch WordPress) evaluaron decisiones, exclusiones y checks; sin runtime de producto/deploy. Core tests 13/13 PASS; Core QA 36 skills/15 checks/0 findings; `git diff --check` PASS; Reviewer APPROVED. MANIFEST 29→36; no se cambia AGENTS/Core ni tooling porque el routing ya se gobierna desde los agents propietarios y Core QA inventaría skills automáticamente.

- **BF-062 — Serial Subagent Orchestration & Single Writer (Validated):** reduce de dos sesiones Agent Manager simultáneas a una sola sesión subagent de proyecto activa; espera, entrega/reconciliación ligera y decisión antes de siguiente owner/Reviewer. Project Context raíz queda bajo Dev Lead; specialists conservan outputs de dominio y edit-deny focal en contexto; fresh-read y retry único para patch mismatch. Retests A/B/E/F (secuencias) fueron tabletop; C se confirmó con permisos efectivos Kilo 7.8.8 (5 specialists deny sobre 6 docs root; Dev Lead allow); D se ejercitó durante patches con refresh y retry corregido, sin blind loop. Core tests 13/13 PASS; Core QA 15 checks/0 findings; `git diff --check` PASS; Reviewer APPROVED. Sin framework de locking, nuevas suites ni claims de prueba de concurrencia runtime.

- **BF-063 — Visual Candidate Preservation / QA Is Not Redesign (Validated):** formaliza la estabilización conceptual de intención visual cuando el owner considera coherente/presentable un candidato nuevo/material; QA conserva rigor técnico y aplica fixes objetivos con mínimo delta, pero no convierte preferencias subjetivas en findings ni en permiso para rediseñar. Cambios visuales materiales vuelven a decisión/review; Human Visual Review detiene el candidato representativo post-QA cuando aplica y la aprobación se integra como referencia visual Approved BF-048 en scope/fidelity. Aclara responsive, Reviewer, parity y recovery mediante checkpoint Git/local existente, sin skill, agent, schema, infraestructura, gates para microcambios ni cambios a BF-062. Retests contractuales/tabletop A–H PASS: overflow con fix localizado; cleanup subjetivo sin cambio; accessibility material obligatorio y review posterior; Kit Approved preservado; candidato se detiene y permanece estable; aprobación integra baseline BF-048; preferencia Reviewer no finding; bug DIRECT proporcional sin gate extra. Core tests 13/13 PASS; Core QA PASS (15 checks/0 findings); `git diff --check` PASS; Reviewer APPROVED. Sin runtime/product browser test porque el cambio es contractual y no hay Product candidato que probar.

## [1.1.1] - 2026-10-09

Actualización compatible de mantenimiento sobre 1.1.0; conserva las capacidades del harness.

### Mantenimiento

- **Payload del template:** se elimina material maintainer-only de `main`, sin alterar las capacidades del Core.
- **Deployment y MCP on-demand:** no se distribuyen workflow de deployment ni ejemplo MCP inactivos; cada integración se prepara para el proyecto únicamente tras una solicitud explícita y la autorización/configuración aplicables.
- **Contrato de distribución:** se formaliza el payload de `main` y la separación entre el harness distribuido y el producto del usuario. Project Context inicial continúa limpio para `/new-project`.
- **BF-043** permanece `Testing`; este mantenimiento no cambia su estado.
- **Alcance del Core:** se aclara la frontera entre CN Pilot Core y el producto del proyecto.

## [1.1.0] - 2026-10-08

### Añadido

- **BF-043 — Visual Diversity & High-Fidelity Output Contract (Testing):** dirección visual fundamentada en el proyecto, continuidad para Existing, prototipo HTML high-fidelity como salida de diseño y frontera explícita previa a implementación en Product.
- **BF-042 — Human-First Interaction & Progressive Context:** guía canónica para lenguaje natural, inspección antes de preguntar, preguntas materiales/progresivas, reutilización y persistencia proporcional del contexto durante onboarding y tareas posteriores.
- **BF-041 — Repository Structure & CN Pilot Boundary:** Core portable bajo `.cn-pilot/`; `project-resources/` para inputs; `project-artifacts/` on-demand para outputs auxiliares; `product/` para producto activo Greenfield/Existing importado. Repositorios Existing ya operativos adoptados pueden preservar su root real mediante excepción de compatibilidad documentada. Project Context permanece en raíz y `ARTIFACTS.md` indexa entregables significativos de todo el proyecto. Retirados placeholders y scaffolds duplicados.
- **BF-040 — Deployment Workflow Scaffold:** workflow GitHub Actions heredable, manual y fail-closed por defecto; no publica hasta configuración específica autorizada y trigger automático explícito.
- **BF-039 — Gate Self-Test:** validación proporcional de gates custom decisivos mediante controles KNOWN-GOOD/PASS y KNOWN-BAD/FAIL aislados, sin self-test rutinario de tooling estándar ni pruebas inseguras en producción.
- **BF-038 — CN Pilot Health Check:** comando `/doctor` local y read-only para diagnosticar integridad de Core, agentes, skills, comandos, routing, permisos críticos y MANIFEST sin reparar ni ejecutarse por rutina.
- **BF-037 — Verified Blocking Findings:** verificación fresca única orientada a refutar findings Reviewer HIGH/CRITICAL realmente bloqueantes y no demostrados; discrimina CONFIRMED/REFUTED/UNPROVEN sin crear un gate universal.
- **BF-036 — Source-Grounded Development:** skill condicional para verificar afirmaciones externas/versionadas desde el estado local y fuentes primarias hasta la prueba proporcional en el proyecto, sin investigar ni actualizar dependencias por rutina.
- **BF-029 — Operaciones SEO basadas en evidencia:** metodología FOCUSED/FORMAL, diagnóstico por capas de indexabilidad/rendering, contrato de datos, referencias de schema e internacional y checks de migración integrados al deploy; refinamientos editoriales/SERP y templates opcionales de informe/cobertura, sin nuevo agente, skill de auditoría ni validator.
- **BF-028 — Arquitectura estratégica SEO:** pack opcional y proporcional con brief, sitemap, mapas de URL/keywords y plan de contenido; planificación de URLs de migración sin ejecución automática.
- **BF-025 — Estrategia y descubrimiento de sitios existentes:** `web-strategy` conecta negocio, audiencia, conversión e información/URLs cuando hay decisiones abiertas; `existing-site-audit` aporta un baseline multistack de solo lectura y enruta auditorías especializadas únicamente cuando son necesarias. Ambas conservan activación proporcional y no bloquean microcambios.

### Mejorado

- **Contrato de cierre por defecto:** commit local automático solo en cambios completos/verificados, acciones remotas autorizadas y resumen final proporcional con evidencia, hash y agentes únicamente cuando corresponden.
- **BF-033–035 — Prototipos HTML y QA sin capturas rutinarias:** Reviewer no puede cargar skills; prototipos web usan HTML/CSS/JS por defecto y runtime/paridad priorizan evidencia directa antes de capturas justificadas.
- **BF-032/033 — Cierre disciplinado y Reviewer lean:** Dev Lead amplía su margen de cierre con Completion Mode y owner único; Reviewer reduce scope al diff/evidencia pertinente, conserva independencia y read-only, acepta cero hallazgos y no dispone de investigación web.
- **BF-031 — Fast path de implementación aprobada:** preflight focalizado, spike funcional temprano cuando haga falta, un owner y mapping, construcción agrupada y correcciones QA cohesionadas; reduce rediscovery/handoffs sin retirar safe writes, fidelidad ni aceptación.
- **BF-030 — Integridad de estado y ownership:** separación contenido/presentación, reutilización de Media adecuado antes de subir duplicados y contraste de criterios críticos con estado final observable antes del cierre.
- **Mantenimiento proporcional del README:** el resumen del proyecto se sincroniza cuando cambian aspectos estables del repositorio, con ediciones mínimas y sin registrar progreso rutinario.
- **README de proyectos inicializados:** `/new-project` transforma el README genérico heredado en una presentación del proyecto con datos confirmados y conserva README propios relevantes, sin cambiar el README del CN Pilot base.
- **Correcciones de routing e integridad:** acotado el trigger de seguridad por superficie/riesgo; `/content` respeta DIRECT; manifiesto de deploy y migraciones contemplan recuperación/verificación proporcional; aclaradas vigencia de BF-016 e inventario versionado.
- **Precedencia de permisos:** documentación alineada con el matching verificado de Kilo 7.8.1 y reordenada la lectura de Reviewer para denegar secretos sin bloquear `.env.example`.
- **Límites de agentes:** Agent Manager denegado a subagentes de proyecto, procesos persistentes innecesarios desactivados, comandos Git de lectura acotados y rutas locales MCP protegidas; documentada la frontera humana de shell/escritura donde Kilo no garantiza aislamiento por path.
- **Permisos de Reviewer:** comandos Git de inspección permitidos de forma exacta y `bash` denegado por defecto, sin depender de prompts `ask` para impedir shell mutante.
- **BF-027 — Dirección visual y core ligero:** Creative Direction traduce identidad, referencias y tesis en reglas visibles antes del prototipo; `DIRECT` exige decisión clara, fuente localizada y riesgo bajo; doctrina central conserva garantías y routing mientras los procedimientos especializados permanecen en skills.
- **BF-026 — Operación WordPress y despliegue íntegro:** procedimientos proporcionales para estado real, ownership de mutaciones y verificación persistida; despliegue WordPress por superficies con manifiesto coincidente, QA post-deploy y cobertura de rollback explícita.
- **BF-024 — Configuración de IA agnóstica:** eliminada la estrategia hardcoded de modelos, tiers y reasoning; la selección pasa al runtime/configuración personal de Kilo y agentes y skills permanecen provider/model-agnostic. Se conserva la orquestación cost-aware sin asignaciones por agente.

## [1.0.1] - 2026-09-28

Parche backward-compatible con CN Pilot 1.0.0.

### Mejorado

- **BF-014 — Configuración MCP:** configuración MCP activa por proyecto en `.kilocode/mcp.json`, mantenida local e ignorada por Git; `.kilocode/mcp.example.json` versionado, seguro y sin secretos; separación clara entre `kilo.jsonc` como configuración general y la configuración MCP; manejo seguro de secretos y preferencia por OAuth cuando corresponda.
- **BF-015 — Orquestación MCP:** enfoque capability-first con discovery de tools y capabilities reales; flujo `Discovery → Read-only → Plan → Write autorizado → Verification`; fallback legítimo entre integraciones; restricciones reforzadas para producción y verificación posterior a las escrituras.
- **BF-016 — Calidad estructural de maquetación:** convención conceptual `Sección → Contenedor de layout → Bloque lógico → Contenido`; formulación Grid-first refinada posteriormente por layout intent; un Container por Section como default y múltiples Containers solo para regiones de layout independientes; Blocks como unidades/celdas lógicas; wrappers auxiliares únicamente con función real; builder-native; semántica para HTML/custom themes; schema-first; implementación incremental; recuperación segura tras fallos MCP/remotos; y QA estructural además de QA técnico.
- **BF-018 — Flujo visual de alta fidelidad:** dirección creativa, prototipo high-fidelity, aprobación visual humana, implementación builder-native, fidelity pass, parity QA y Human Visual QA proporcionales; contenido aprobado como fuente editorial y CSS scoped mínimo cuando sea necesario.
- **BF-019 — Lifecycle de capabilities MCP:** rediscovery tras cambios de plugins, módulos, licencias, servidores o configuración; capability especializada primero; separación read/write; writes secuenciales por recurso y recuperación segura sin blind retry.
- **BF-020 — SEO plugin-aware:** análisis del plugin antes y después de metadata, puntuación práctica sin keyword stuffing, protección del copy aprobado y cautela con slug publicado, schema e indexación.
- **Skills especializadas y QA progresivo:** nueva `visual-parity-review`, disponibilidad opcional de `webapp-testing`, mayor profundidad práctica en `accessibility-review` y rendimiento WordPress condicionado al stack, con triggers estrechos.
- **BF-023 — Revisión de seguridad basada en riesgo:** nueva `security-review` con activación proporcional, secure defaults, controles WordPress/WooCommerce/API y fallbacks seguros sin scanners ni gates universales.

## [1.0.0] - 2026-09-28

### Añadido

- Onboarding conversacional mediante `/new-project`, con Dev Lead como interfaz principal y agentes especializados.
- Flujos proporcionales `DIRECT`, `TASK` y `STRUCTURAL`, con Git opcional y enfoque local-first.
- Entregas diferenciadas por artefacto para WordPress, WooCommerce, plugins, themes, proyectos custom, contenido/SEO y UI/UX.
- Responsive con configuración versionada, handoff manual, MCP opcional y deployment opcional.
- Registro de artefactos, documentación de onboarding y continuidad del equipo.
- Estrategia de modelos provider-agnostic y orquestación consciente del coste.
- Seguridad y revisión proporcional al riesgo, incluyendo permisos, worktrees y operaciones sensibles.

### Estado

Primera versión estable del CN Pilot, validada mediante pruebas piloto en escenarios de contenido, diseño, frontend, WordPress, WooCommerce, plugins, themes, proyectos custom, handoff, MCP y deployment.
