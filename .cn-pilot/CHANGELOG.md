# Changelog

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
