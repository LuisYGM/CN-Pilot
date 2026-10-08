# Feedback del Blueprint

## BF-001 — El onboarding solicita campos internos manualmente

**Contexto:**
Primera prueba de `/new-project`.

**Comportamiento observado:**
El onboarding solicita manualmente campos internos como perfil, capacidades, entornos, alcance y restricciones, sin inspeccionar primero la implementación ni inferir la información disponible.

**Comportamiento esperado:**
El workflow debe inspeccionar el proyecto antes de preguntar, usar una primera ronda breve y natural, inferir los campos internos y marcar como `Pending` lo desconocido. Antes de editar debe presentar la información disponible y los pendientes en lenguaje natural para una confirmación explícita, sin exigir separar ni exponer las categorías de hechos e inferencias. BF-002 refina el formato de ese resumen.

**Impacto:**
Medium.

**Mejora propuesta:**
Reestructurar `/new-project` para priorizar la inspección, evitar preguntas inferibles o con terminología interna, aceptar incertidumbre y exigir una confirmación informada antes de actualizar el contexto del proyecto.

**Estado:**
Resolved.

## BF-002 — El resumen expone la estructura interna del Blueprint

**Contexto:**
Segunda prueba de `/new-project`.

**Comportamiento observado:**
El resumen previo separa hechos e inferencias, enumera los archivos que se modificarán y recomendaciones internas como las relativas a `.gitignore`, y pide confirmar explícitamente tanto el resumen como las modificaciones.

**Comportamiento esperado:**
El resumen debe centrarse en el proyecto con lenguaje natural y omitir archivos, categorías y reglas internas. Una confirmación simple debe bastar para que Dev Lead distribuya la información internamente.

**Impacto:**
Medium.

**Mejora propuesta:**
Elevar la abstracción del onboarding: resumir qué se construirá, propósito, público, stack, alcance y pendientes relevantes, y cerrar con una única confirmación simple sin exponer destinos internos ni pedir confirmaciones adicionales.

**Estado:**
Resolved.

## BF-003 — DIRECT actualiza estado sin cambio operativo y queda sin commit

**Contexto:**
Tarea `DIRECT` para definir la primera fase solo en español.

**Comportamiento observado:**
El agente actualizó correctamente el contexto, pero modificó `STATE.md` sin un cambio operativo y dejó la tarea terminada sin commit local.

**Comportamiento esperado:**
Las tareas `DIRECT` deben modificar solo los archivos estrictamente necesarios y seguir un flujo ligero. `STATE.md` solo debe cambiar ante una variación material del estado operativo. Dev Lead debe crear automáticamente un commit local al terminar y verificar una tarea con cambios, salvo las exclusiones definidas, sin preguntar al usuario y sin hacer push.

**Impacto:**
Medium.

**Mejora propuesta:**
Definir de forma coherente la proporcionalidad de `DIRECT`, los criterios estrictos de actualización de `STATE.md` y la política de commit local automático con sus excepciones.

**Estado:**
Resolved.

## BF-004 — Permisos restrictivos provocan una ubicación incorrecta

**Contexto:**
TASK de contenido para preparar una página.

**Comportamiento observado:**
`content-seo` no pudo escribir en su área habitual por el orden efectivo de las reglas de permisos. Dev Lead esquivó el bloqueo guardando el contenido en `docs/features/contenido-inicio.md`, fuera de su ubicación canónica.

**Comportamiento esperado:**
Cada agente debe poder editar su área habitual y solicitar permiso fuera cuando sea legítimo, manteniendo `deny` para secretos, Core protegido y acciones peligrosas. El contenido de páginas pertenece a `content/pages/`; un bloqueo debe reportarse como problema de permisos, no resolverse reubicando el artefacto.

**Impacto:**
High.

**Mejora propuesta:**
Ordenar las reglas específicas antes del fallback según la prioridad real de Kilo, ampliar permisos proporcionales y establecer rutas canónicas obligatorias para contenido, diseño y documentación técnica.

**Estado:**
Resolved.

## BF-005 — Una TASK rutinaria activa un flujo desproporcionado

**Contexto:**
Preparación del contenido inicial de una sola página.

**Comportamiento observado:**
La tarea consumió aproximadamente 142K tokens y casi 11 minutos por lecturas, razonamiento, delegaciones y revisión independiente sin beneficio proporcional.

**Comportamiento esperado:**
Una TASK sencilla y de bajo riesgo debe seguir aproximadamente: Dev Lead → Content/SEO → verificación básica → inspección del diff → commit local automático, sin Reviewer independiente por defecto.

**Impacto:**
High.

**Mejora propuesta:**
Reservar Reviewer completo para riesgo, impacto, criterios de aceptación relevantes, áreas sensibles, trabajo STRUCTURAL o una razón concreta; evitar contexto irrelevante, relecturas, análisis duplicado y delegaciones innecesarias.

**Estado:**
Resolved.

## BF-006 — Documentación operativa generada en el idioma incorrecto

**Contexto:**
Inicialización y generación de documentación para proyectos creados desde el Blueprint.

**Comportamiento observado:**
Archivos técnicos como `PROJECT.md`, `STATE.md`, `DECISIONS.md`, `REQUIREMENTS.md` y templates destinados a personas conservaban headings, instrucciones y placeholders en inglés.

**Comportamiento esperado:**
Los nombres, rutas, IDs, claves y valores técnicos permanecen en inglés, mientras el contenido humano se genera en español por defecto o en el idioma de trabajo definido explícitamente por el proyecto. `/new-project` debe sustituir o eliminar placeholders heredados que ya no describan el proyecto real.

**Impacto:**
Medium.

**Mejora propuesta:**
Establecer una convención explícita de idioma, traducir la documentación base y los templates humanos, y limpiar durante la inicialización los mensajes residuales del Blueprint.

**Estado:**
Resolved.

## BF-007 — Recomendaciones provisionales tratadas como decisiones aprobadas

**Contexto:**
Prueba STRUCTURAL sobre almacenamiento de solicitudes de contacto en WordPress.

**Comportamiento observado:**
Architect recomendó una custom table como almacenamiento operativo sin marcar la propuesta como provisional, aunque seguían pendientes volumen, retención, duplicación con Fluent Forms, roles de acceso y lifecycle del dato.

**Comportamiento esperado:**
Architect debe distinguir hechos, restricciones, supuestos, recomendaciones provisionales y decisiones aprobadas. Si una incógnita puede cambiar materialmente la arquitectura, la propuesta permanece `PROVISIONAL`, explicita alternativas y tradeoffs y no se implementa ni se registra como decisión hasta resolver los puntos bloqueantes.

**Impacto:**
High.

**Mejora propuesta:**
Introducir estados de madurez para propuestas arquitectónicas, reservar `DECISIONS.md` y ADRs para decisiones suficientemente establecidas y exigir en WordPress la evaluación previa de capacidades nativas y del stack existente.

**Estado:**
Resolved.

## BF-008 — La planificación estructural no se persiste

**Contexto:**
Validación de una tarea STRUCTURAL cuya implementación debía posponerse.

**Comportamiento observado:**
Architect realizó correctamente el análisis y mantuvo las decisiones no resueltas como provisionales, pero el plan quedó únicamente en la conversación y no se guardó para su uso posterior.

**Comportamiento esperado:**
Las especificaciones, arquitecturas, planes de implementación y criterios de aceptación reutilizables deben persistirse en su ruta canónica aunque todavía no deba escribirse código. Solo una instrucción explícita de no modificar el repositorio debe impedirlo.

**Impacto:**
High.

**Mejora propuesta:**
Hacer obligatoria la persistencia de artefactos STRUCTURAL reutilizables, distinguir documentación de implementación y cerrar una planificación completa y verificada con un commit local automático sin push.

**Estado:**
Resolved.

## BF-009 — Confirmaciones excesivas para decisiones técnicas internas

**Contexto:**
Implementación STRUCTURAL de un componente nuevo aún no publicado.

**Comportamiento observado:**
Developer interrumpió el flujo para pedir aprobación de slug provisional, namespace, prefijo y nombres técnicos derivados, aunque eran detalles internos, reversibles y de bajo riesgo.

**Comportamiento esperado:**
Los agentes deben resolver autónomamente las convenciones técnicas internas derivables del contexto y reservar la aprobación humana para decisiones con impacto material en alcance, arquitectura, producción, datos, contratos públicos, seguridad, privacidad, negocio o experiencia visible.

**Impacto:**
Medium.

**Mejora propuesta:**
Definir criterios explícitos de escalado y autonomía, permitiendo documentar como provisionales los detalles internos sin interrumpir al usuario solo porque no fueron especificados.

**Estado:**
Validated.

**Resultado del retest:**
Los agentes resolvieron autónomamente naming, slug, namespace, prefijos y otras decisiones técnicas internas y reversibles sin solicitar confirmaciones innecesarias.

## BF-010 — Límite de pasos insuficiente para cerrar un flujo STRUCTURAL

**Contexto:**
Flujo completo con Architect, Developer, implementación, tests, Reviewer, correcciones, tests finales y commit.

**Comportamiento observado:**
Dev Lead alcanzó su límite de pasos antes de procesar la revisión y cerrar la unidad, aunque actuó correctamente al no crear un commit incompleto.

**Comportamiento esperado:**
El flujo debe evitar relecturas, delegaciones, polling, verificaciones y reviews duplicadas; debe reservar margen para correcciones y cierre, y disponer de un límite razonable para una ejecución STRUCTURAL legítima.

**Impacto:**
High.

**Mejora propuesta:**
Optimizar continuaciones y revisiones, reutilizar resultados todavía válidos y aumentar únicamente el límite de Dev Lead de 40 a 60 pasos, manteniendo acotados los especialistas.

**Estado:**
Validated.

**Resultado del retest:**
Dev Lead completó los flujos probados sin alcanzar nuevamente el límite de pasos y reutilizó correctamente el trabajo previo.

## BF-011 — Reviewer y worktree quedan huérfanos al terminar la sesión padre

**Contexto:**
Revisión independiente lanzada como sesión de Agent Manager en un worktree temporal cuando Dev Lead estaba cerca de su límite.

**Comportamiento observado:**
En la primera prueba, Reviewer terminó con hallazgos útiles después de que la sesión solicitante dejara de estar disponible. En el retest, la entrega ya funcionó, pero Dev Lead informó que el worktree estaba cerrado aunque Agent Manager y `git worktree list` todavía mostraban worktrees registrados. También quedó una carpeta bajo `.kilo/worktrees/` que Git ya no registraba. La limpieza real requirió `git worktree remove`, `git worktree prune` y tratamiento separado de la carpeta huérfana.

**Comportamiento esperado:**
Las revisiones dependientes deben usar preferentemente un subagente `task` ligado al flujo, reservar margen y reutilizar informes accesibles. Si se usa worktree, Dev Lead debe diferenciar sesión finalizada, worktree desregistrado, carpeta física eliminada y carpeta huérfana; verificar cambios y registros antes y después del cleanup; y nunca afirmar que terminó sin evidencia.

**Impacto:**
High.

**Mejora propuesta:**
Mantener las mitigaciones de entrega y añadir un protocolo verificable de cleanup con `git worktree list`, eliminación segura, `git worktree prune`, comprobación final y reporte explícito de carpetas huérfanas o limitaciones de Kilo.

**Estado:**
Validated con limitación conocida de Kilo.

**Resultado del retest:**
Reviewer terminó y entregó correctamente su informe. El worktree específico de la revisión se eliminó del registro Git junto con su carpeta física y rama temporal, y Agent Manager dejó de mostrar la sesión/worktree correspondiente. Ante otro worktree detached cuya propiedad no podía confirmarse, Dev Lead no lo eliminó a ciegas y reportó su estado real.

**Limitación conocida:**
Kilo puede dejar worktrees residuales cuya propiedad no sea identificable desde Agent Manager. Deben conservarse hasta verificar su origen y estado, reportarse con precisión y gestionarse mediante cleanup seguro; nunca deben eliminarse automáticamente sin esa evidencia.

## BF-012 — Git tratado incorrectamente como requisito de trabajo

**Contexto:**
P02 inicializado correctamente en una carpeta local sin repositorio Git.

**Comportamiento observado:**
Dev Lead continuó la inicialización, pero registró la ausencia de Git como bloqueo en `STATE.md`, aunque el trabajo no dependía de control de versiones.

**Comportamiento esperado:**
El Blueprint debe funcionar en carpetas sin Git, repositorios locales o repositorios con cualquier remoto. Sin Git continúa trabajando, verifica archivos directamente, omite operaciones exclusivas de Git y reporta el guardado local sin considerar el proyecto bloqueado ni ejecutar `git init`.

**Impacto:**
High.

**Mejora propuesta:**
Hacer condicional toda la política Git, adaptar onboarding, checkpoint, commit, review, handoff y flujos habituales, y reservar `git init` para una solicitud explícita o un alcance confirmado.

**Estado:**
Resolved.

## BF-013 — Paralelización con Agent Manager hereda un modelo costoso

**Nota histórica:** la recomendación de tiers y overrides descrita abajo fue sustituida por BF-024. Siguen vigentes el uso proporcional de `task`/Agent Manager y el límite de sesiones; el Blueprint ya no decide modelos ni esfuerzo de razonamiento.

**Contexto:**
P10 con varias sesiones paralelas lanzadas mediante Agent Manager.

**Comportamiento observado:**
Las sesiones heredaron el modelo de la sesión que las creó y varias tareas utilizaron simultáneamente un tier más costoso de lo necesario. Agent Manager se usó como mecanismo de paralelización aunque un subagente `task` habría sido suficiente en parte del trabajo.

**Comportamiento esperado:**
Dev Lead debe usar `task` por defecto para trabajo integrado en la tarea actual y reservar Agent Manager para aislamiento, worktrees/branches, alternativas concurrentes, trabajo independiente o sesiones top-level separadas. La estrategia debe ser `economical/balanced by default, escalate on demand`; un tier superior solo se activa temporalmente por complejidad o riesgo concreto. No deben abrirse por defecto más de dos sesiones Agent Manager pagadas simultáneamente; más de dos requiere confirmación.

**Impacto:**
High.

**Mejora propuesta:**
Formalizar la estrategia provider-agnostic de capacidad, hacer explícita la evaluación `task` frente a Agent Manager, advertir sobre la herencia de modelos y añadir un límite de coste para sesiones paralelas pagadas.

**Estado:**
Resolved.

## BF-014 — Configuración MCP por proyecto y manejo de secretos

**Contexto:**
Primer proyecto en producción con Blueprint 1.0.0 utilizando varios MCP.

**Problema observado:**
La documentación contemplaba MCP conceptualmente, pero no dejaba suficientemente claro dónde vive la configuración activa del proyecto, cómo conviven varios servidores, qué se versiona, qué permanece local ni cómo manejar secretos antes de escribir sobre un sistema real.

**Causa:**
La configuración general `kilo.jsonc`, los templates de referencia y la configuración activa local no estaban diferenciados con una ruta canónica de proyecto.

**Solución:**
Formalizar `.kilocode/mcp.json` como configuración activa local ignorada por Git y `.kilocode/mcp.example.json` como ejemplo versionado, genérico y sin secretos. Mantener `kilo.jsonc` para configuración general compartible y documentar OAuth, mecanismos seguros equivalentes, producción reforzada y revocación de credenciales expuestas.

**Reglas derivadas:**

- Nunca versionar credenciales MCP ni inventar endpoints, usuarios, tokens o parámetros.
- Un proyecto puede utilizar varios MCP simultáneamente.
- Nunca copiar secretos reales a documentación, examples, templates o logs.
- Antes de escribir sobre un sistema real, realizar discovery y read-only.

**Impacto:**
High.

**Estado:**
Resolved.

## BF-015 — Descubrimiento y enrutamiento de capacidades MCP

**Contexto:**
Primer proyecto en producción con dos MCP de orientación distinta, donde las capabilities disponibles no coincidieron necesariamente con el nombre o intención declarada de cada servidor.

**Problema observado:**
El agente podía asumir que un servidor exponía las capabilities sugeridas por su nombre y forzar una integración directa aunque otro MCP expusiera legítimamente la capability requerida.

**Causa:**
El enrutamiento estaba implícitamente basado en el proveedor o servidor, no en el descubrimiento de tools y capabilities realmente disponibles durante la sesión.

**Solución:**
Adoptar un enfoque capability-first: descubrir servidores, inspeccionar capabilities/tools, mapear `capability → responsabilidad`, elegir la ruta más específica y segura, usar fallback legítimo y reportar limitaciones. Formalizar el flujo `Discovery → Read-only → Plan → Write autorizado → Verification`, con cautela reforzada en producción.

**Reglas derivadas:**

- No asumir `servidor X → capacidades X` por el nombre del servidor.
- No duplicar llamadas si un MCP ya proporciona la capability requerida.
- Escribir solo con alcance claro, autorización, riesgo identificado y capability apropiada.
- Después de escribir, releer, verificar integridad y reportar exactamente las operaciones realizadas.

**Impacto:**
High.

**Estado:**
Resolved.

## Plantilla reutilizable

### BF-XXX — [Título]

**Contexto:**
Proyecto/tarea.

**Comportamiento observado:**
Qué ocurrió.

**Comportamiento esperado:**
Qué debería haber ocurrido.

**Impacto:**
Low / Medium / High.

**Mejora propuesta:**
Corrección propuesta.

**Estado:**
Open / Testing / Resolved / Validated.

## BF-028 — Arquitectura estratégica SEO

**Contexto:**
Sitios greenfield de varias páginas y migraciones con decisiones abiertas de negocio, audiencia, intención, arquitectura, URLs y contenido.

**Regla:**
`web-strategy` puede materializar un pack reutilizable y proporcional (brief, sitemap, URL/keyword maps, content plan y, en migración, inventario/mapping de URLs). Se activa según alcance; no es obligatorio para landings o tareas DIRECT. La evidencia de búsqueda informa, pero no dicta URLs ni entidades técnicas.

**Límites:**
No inventar métricas/research; no crear una URL por keyword ni CPT por entidad; preservar URLs publicadas salvo transición justificada y aprobada; los redirect maps son planificación y no ejecutan cambios. `PROJECT.md` conserva hechos, `content/strategy/` estrategia editorial/search, `content/pages/` y `content/blog/` copy, `docs/architecture/` arquitectura técnica.

**Impacto:**
Planificación editorial/search reutilizable sin hacer Strategy obligatoria ni acoplarla a una plataforma.

**Estado:**
Validated.

## BF-017 — Flujo Git simplificado para trabajo individual

**Contexto:**
Uso secuencial del Blueprint por un desarrollador individual en `main`.

**Problema observado:**
El flujo con ramas de mantenimiento, merges, tags y GitHub Releases añadía complejidad innecesaria cuando no existían necesidades de colaboración, aislamiento o publicación formal. Git debe aportar seguridad e historial sin imponer mecanismos adicionales.

**Solución:**
Formalizar como flujo normal para trabajo individual `main → trabajar → verificar → commit local → push manual cuando corresponda`. `main` representa normalmente el estado actual y estable del proyecto. Las ramas, Pull Requests, tags y GitHub Releases permanecen disponibles, pero son opcionales y se usan solo cuando existe una razón concreta.

**Reglas derivadas:**

- No crear ni recomendar ramas automáticamente para mantenimiento, documentación, mejoras pequeñas o trabajo secuencial individual.
- Crear ramas únicamente por colaboración, aislamiento de cambios grandes o de riesgo, experimentos descartables, Pull Requests, desarrollo paralelo o solicitud explícita.
- Mantener commits frecuentes, claros, recuperables y compatibles con Conventional Commits, con descripción en español.
- Mantener el push bajo control humano; los agentes pueden crear commits locales, pero no hacer push automáticamente.
- No crear ni recomendar tags o GitHub Releases para cada parche, commit o cambio de versión; reservarlos para hitos, entregas públicas o versiones congeladas por decisión explícita.
- Conservar `.blueprint-version` sin exigir que cambie con cada commit y actualizar `CHANGELOG.md` para cambios relevantes.
- Mantener Git opcional y conservar soporte para ramas, Pull Requests, tags y releases cuando aporten valor.

**Impacto:**
Medium.

**Estado:**
Validated.

## BF-022 — Specialized Skill Depth & Progressive QA

**Problema:**
Skills demasiado pequeñas dispersan procedimientos importantes entre agents y documentación, mientras que vendorizar sistemas externos completos introduce solapamiento, contradicciones, dependencias y demasiado contexto.

**Regla:**
Preferir skills especializadas con profundidad suficiente, triggers estrechos, progressive disclosure y QA proporcional, en lugar de cargar muchas skills frontend solapadas a la vez. Browser/runtime, visual parity, accessibility y performance son responsabilidades distintas y se seleccionan por scope, riesgo y evidencia disponible.

**Impacto:**
Menor consumo de tokens, menos conflictos entre instrucciones y QA más preciso.

**Estado:**
Validated.

## BF-023 — Risk-Based Security Review

**Problema:**
El Blueprint tenía QA especializado visual, accessibility, performance y SEO, pero no formalizaba seguridad con la misma profundidad ni una activación proporcional.

**Regla:**
La seguridad se revisa según riesgo y superficie real, no como auditoría universal ni checklist de security theater. `security-review` se activa para auth, autorización, APIs, uploads, formularios con datos reales, persistencia, plugins, WooCommerce, webhooks, secretos e integraciones sensibles; no para copy, CSS trivial o frontend sin superficie sensible.

**Impacto:**
Secure defaults, menos vulnerabilidades evitables y mejor revisión de backend/integraciones sin añadir Security QA innecesario a tareas visuales simples.

**Estado:**
Validated.

## BF-021 — Prototype Functionality Boundary

**Problema observado:**
Un prototipo high-fidelity podía terminar implementando funcionalidad productiva que después debía reconstruirse en WordPress, un builder o un custom theme.

**Causa:**
Se interpretaba `high-fidelity` como producto técnicamente completo, en lugar de como validación visual, responsive, de estados e interacción UX.

**Solución:**
Los prototipos implementan por defecto presentación, responsive, estados e interacción ligera necesaria para validar UX. Formularios, búsqueda, filtros, login, checkout, newsletter y booking pueden usar estados simulados, mock data y lógica local. Integraciones, persistencia, backend, APIs, autenticación, pagos y servicios externos se difieren a la implementación final salvo petición explícita.

**Reglas derivadas:**

- `High-fidelity prototype` no equivale a `production-complete implementation`.
- `prototype interaction` no equivale a `production functionality`.
- La funcionalidad esencial para validar UX puede usar local state, JavaScript simple y mock data sin crear infraestructura temporal.
- El handoff conserva diseño, estados, interacción, responsive y UX; el stack final implementa la funcionalidad real una sola vez.
- Prototype QA valida visual, responsive, estados e interacción; Production QA añade integraciones, persistencia, backend, seguridad y servicios externos.
- Una petición explícita puede autorizar funcionalidad real dentro del scope.

**Impacto:**
Medium.

**Estado:**
Validated.

## BF-018 — High-Fidelity UI/UX & Builder Workflow

**Contexto:**
Implementación real de una página visualmente importante en WordPress/Bricks.

**Problema observado:**
Una implementación puede ser técnicamente válida y tener una estructura builder-native limpia, pero diferir significativamente del diseño aprobado cuando no existe una dirección visual, un prototipo de alta fidelidad, una pasada explícita de fidelidad ni una revisión visual humana.

**Solución:**
Formalizar proporcionalmente el flujo `Final Content → Creative Direction → High-Fidelity Prototype → Human Visual Approval → Builder-native Implementation → Visual Fidelity Pass → Visual Parity QA → Human Visual QA → Publish` para páginas visualmente importantes, sin exigirlo en cambios pequeños o sin referencia aprobada. Tratar el contenido final como editorial source of truth y el prototipo aprobado como visual source of truth.

**Reglas derivadas:**

- La creatividad se expresa en composición, jerarquía, tipografía, spacing, color, grids, ritmo y assets aprobados; no se inventan datos visuales ni se confunde impacto con headings gigantes.
- `native settings → clean structure → minimal scoped CSS when necessary`; no perseguir cero CSS, cero Divs o cien por cien native como métricas.
- Grid y Flex se eligen por intención: Grid distribuye múltiples unidades bidimensionales y Flex resuelve flujos lineales sencillos, incluidos Blocks verticales.
- Visual Fidelity Pass trabaja sobre diferencias concretas; Visual Parity QA compara proporciones, spacing, tipografía, composición y responsive; Human Visual QA no se sustituye por integridad técnica, árbol o render MCP.
- `clamp(min-px, fluid-vw, max-px)` es preferencia para proyectos nuevos, no dogma; responsive QA incluye fidelidad visual además de ausencia de overflow.
- Se detienen iteraciones cuando solo quedan microajustes de bajo retorno, sin abandonar diferencias estructurales o visuales importantes.

**Impacto:**
High.

**Estado:**
Validated.

## BF-019 — MCP Capability Lifecycle

**Contexto:**
Una capability específica apareció después de activar una integración Pro y reconectar el MCP.

**Problema observado:**
El agente podía tratar Discovery como permanente, declarar una capability inexistente demasiado pronto o usar un workaround low-level aunque existiera una capability especializada tras actualizar el entorno.

**Solución:**
Formalizar un lifecycle dinámico: después de activar o actualizar plugins, módulos, licencias, integraciones, servidores o configuración MCP, aplicar `reconnect / refresh → rediscover → update capability understanding`. Antes de declarar una limitación se comprueban servidor, abilities, especializaciones, versión, módulos y Discovery posterior al refresh.

**Reglas derivadas:**

- Priorizar `specialized capability → safe generic capability → low-level workaround only when justified`.
- Diferenciar `read` de `write`; una capability disponible no amplía el scope autorizado.
- Documentar solo cuando aporte valor el mapa `capability → provider → read/write → scope → risk`.
- Serializar escrituras sobre el mismo recurso con revisiones, digests o tokens de estado: `write → reread → verify state/digest → next write`.
- Ante fallo remoto, timeout o respuesta incierta aplicar `reconnect → reread → determine what persisted → identify last valid state → continue`, sin blind retry.
- Evaluar HTML/CSS import y capabilities de builder en entorno seguro; import successful no equivale a implementación builder-native limpia.

**Impacto:**
High.

**Estado:**
Validated.

## BF-020 — SEO Plugin-Aware Optimization

**Contexto:**
Optimización de metadata en una página WordPress con plugin SEO activo.

**Problema observado:**
Guardar title, description, keyword, canonical, robots, social metadata o schema no garantiza que el plugin considere la página optimizada. Pueden permanecer checks fallidos sobre keyword, contenido, longitud, readability u otros factores.

**Solución:**
Formalizar el flujo `inspect current SEO → define target keyword → write metadata → run plugin analysis → inspect failed checks → improve authorized fields → re-run analysis → report remaining checks` cuando el plugin y sus capabilities estén disponibles. Buscar la puntuación práctica más alta sin degradar contenido ni UX.

**Reglas derivadas:**

- Usar checks, recomendaciones y análisis reales del plugin como parte del QA; el score es una señal, no una métrica absoluta.
- No usar keyword stuffing, frases antinaturales, headings innecesarios, enlaces irrelevantes, contenido de relleno ni cambios que deterioren legibilidad.
- Proteger el copy aprobado: metadata optimization no equivale a editorial rewrite. Proponer cambios de contenido en vez de aplicarlos automáticamente.
- Tratar con cautela slug de página publicada, schema destructivo e indexación; verificar index/noindex, follow/nofollow y canonical.
- Validar también OG/Twitter/X, schema y otros checks disponibles; reportar score inicial/final, metadata, checks corregidos y pendientes.
- Si se activa un plugin, Pro, módulo o integración, reconectar MCP y repetir Discovery antes de concluir que falta una capability SEO.

**Impacto:**
High.

**Estado:**
Validated.

## BF-016 — Convenciones estructurales y calidad nativa de maquetación

**Contexto:**
Validación real de una implementación de interfaz mediante un builder visual.

**Problema observado:**
Una primera implementación superó verificaciones de integridad, headings, responsive y recursos globales, pero utilizó wrappers genéricos, conversión automática HTML/CSS, shortcuts de código, estilos mal trasladados y una estructura poco mantenible y editable. Una segunda implementación, construida nativamente e incrementalmente según las convenciones del stack destino, produjo una estructura limpia y mantenible.

**Por qué el QA técnico inicial fue insuficiente:**
Validó sintaxis, render, integridad, headings y responsive, pero no inspeccionó el árbol de elementos, la semántica, la responsabilidad de cada nivel, la necesidad de los wrappers, el sistema de layout, la editabilidad ni la mantenibilidad. La integridad técnica no equivale a calidad estructural.

**Solución:**
Formalizar como baseline agnóstico del proveedor la jerarquía conceptual `Section → Container → Block → Contenido`, sin convertirla en una obligación de añadir wrappers. La Section agrupa una región semántica; el Container es la capa principal de layout; el Block es una celda o unidad lógica; el contenido vive directamente dentro del Block cuando no requiere otra agrupación.

Un Container por Section es el default. Se añaden Containers hermanos únicamente cuando existen regiones de layout independientes que requieren grids diferentes; no se crea un Container para cada heading, párrafo, footnote o CTA de una misma composición. El layout principal es Grid-first: resuelve columnas, filas, gaps, proporciones, alineación y responsive. Flex se reserva principalmente para micro-layouts unidimensionales.

**Aclaración de vigencia:** la formulación original «Grid-first» es histórica y fue refinada/sustituida parcialmente por `layout-intent first` en las reglas operativas vigentes. No implica Grid para todo Container: decide por cantidad/dimensionalidad de Blocks y flujo requerido; composición lineal o un solo Block vertical usa Flex/default cuando corresponda. Consulta `BLUEPRINT.md`, `.kilo/agents/frontend-builder.md` y `.kilo/skills/bricks/SKILL.md` como reglas actuales. Se preserva el hallazgo histórico sobre jerarquía nativa, wrappers con propósito y editabilidad.

Los wrappers auxiliares no están prohibidos: incluidos `Div`, deben tener una función real y justificable, como agrupar widgets, alinear elementos, crear un micro-layout, resolver responsive interno, interacción o una unidad visual. En HTML y custom themes se aplica el mismo principio usando elementos semánticos apropiados y evitando `div soup`.

En builders se prioriza la reconstrucción builder-native, respetando elementos nativos, jerarquía, responsive, design system, convenciones existentes y editabilidad humana. Una referencia HTML/CSS no se importa automáticamente si la conversión no preserva estructura, estilos, responsive y mantenibilidad. Cuando existan schemas de elementos/settings, se consultan antes de utilizar propiedades desconocidas (`schema-first`).

Las integraciones MCP/API para interfaces complejas se ejecutan incrementalmente: `crear → releer → verificar → continuar`. Ante fallo, timeout o pérdida de conexión, se reconecta y relee el recurso para determinar qué persistió y continuar desde el último estado válido; no se repiten escrituras a ciegas ni se reconstruye trabajo ya correcto. QA debe validar también árbol, semántica, Containers, Blocks, wrappers, layout, editabilidad, mantenibilidad y convenciones del proyecto.

**Impacto:**
High.

**Estado:**
Validated.

## BF-024 — Model-Agnostic Runtime Configuration

**Problema:**
Hardcodear modelos, proveedores, tiers o razonamiento en el Blueprint causa obsolescencia rápida, mantenimiento innecesario, menor portabilidad, diferencias entre desarrolladores y acoplamiento al pricing y disponibilidad externos.

**Regla:**
El Blueprint define workflow, roles, orquestación, calidad y criterios de decisión. La selección de `provider`, `model`, `reasoning` y `model overrides` pertenece al runtime/configuración de Kilo de cada desarrollador. Los agentes y skills heredan esa selección, son provider/model-agnostic y no prescriben modelos por rol ni subagente. Solo un requisito técnico real del producto justifica documentar un modelo o proveedor concreto como dependencia del proyecto.

**Impacto:**
Mayor portabilidad, menos mantenimiento, libertad de proveedor/modelo y un Blueprint más durable. El coste se controla mediante alcance, cantidad de agentes, iteraciones y QA proporcional, no mediante una asignación fija de modelos.

**Estado:**
Validated.

## BF-025 — Strategy & Existing-Site Discovery

**Contexto:**
La estrategia de contenidos y las skills técnicas ya existían, pero faltaba un procedimiento explícito para decisiones de negocio e información antes de estructurar un sitio, y un baseline proporcional para intervenir en sistemas heredados sin presumir stack.

**Regla:**
La estrategia precede a decisiones estructurales únicamente cuando siguen abiertas decisiones de oferta, audiencia, conversión o URLs. En sitios existentes con estado relevante desconocido, primero se identifica en solo lectura la fuente vigente, cobertura, incertidumbre y riesgo; después se activan solo los procedimientos especialistas necesarios. Ni estrategia ni auditoría inicial son obligatorias para trabajo trivial o ya decidido. `DIRECT` conserva el camino mínimo.

**Aplicación:**
`web-strategy` coordina conclusiones editoriales con `content-seo` y entrega a `architect` solo consecuencias técnicas. `existing-site-audit` es multistack, no ejecuta auditorías profundas ni prueba permisos mediante escrituras, y solo persiste el baseline cuando el resultado lo requiere. Se mantienen BF-017 a BF-024, incluidos el control humano de cambios publicados, BF-019 y BF-023.

**Estado:**
Validated.

## BF-026 — WordPress Operational Depth & Deploy Integrity

**Contexto:**
Las skills WordPress y deployment describían controles correctos pero no desarrollaban suficientemente la secuencia entre estado real, escritura acotada, persistencia y verificación, ni distinguían todas las superficies afectadas por una publicación.

**Regla:**
Solo en un stack WordPress confirmado, inspeccionar fuente y estado actuales, reutilizar recursos, elegir el canal seguro específico, modificar únicamente lo propio, releer lo persistido y comprobar runtime cuando corresponda. Un deploy exige superficies explícitas, coincidencia entre preflight y ejecución, evidencia post-deploy y descripción honesta de qué revierte cada mecanismo.

**Límites:**
No impone WordPress, MCP, canales ni estructura de carpetas a otros proyectos; no añade una skill orquestadora, convierte sincronización en deploy ni cambia BF-017. Conserva BF-019, BF-020, BF-021, BF-023 y el baseline selectivo de BF-025.

**Estado:**
Validated.

## BF-027 — Art Direction & Lean Core

**Contexto:**
El flujo BF-018 garantiza alta fidelidad, pero Creative Direction necesitaba un procedimiento más verificable. Además, doctrina y detalle especializado se repetían en instrucciones cargadas siempre.

**Regla:**
Cuando hay impacto visual significativo, la dirección creativa distingue identidad normativa de referencias, transforma tesis en consecuencias visibles y decide reglas/anti-reglas antes del prototipo, sin nueva autoridad visual. Las instrucciones centrales conservan alcance, riesgo, autorizaciones, fuentes de verdad, invariantes y triggers; el cómo especializado vive en skills/documentos condicionales. `DIRECT` es un camino corto solo con decisión inequívoca, fuente localizada, riesgo bajo y verificación clara, nunca un atajo alrededor del riesgo.

**Límites:**
Se mantienen BF-017 a BF-026, Reviewer independiente, QA visual humano y prototipo aprobado como autoridad visual. No se crea workflow, agente, documento visual normativo ni requisito de motion.

**Estado:**
Validated.

## BF-029 — Operaciones SEO basadas en evidencia

**Contexto:**
Diagnósticos y auditorías SEO requieren profundidad especializada sin duplicar agentes, memoria o el lifecycle del Blueprint.

**Regla:**
Las conclusiones SEO se sustentan en observaciones proporcionales al alcance. Aplicabilidad y resultado son dimensiones distintas; muestras, hipótesis y datos ausentes se declaran. Aceptar riesgo no convierte un fallo observado en éxito y una corrección implementada aún necesita verificación.

**Límites:**
La profundidad se consulta mediante referencias según tarea. Strategy conserva intención/arquitectura y SEO técnico verifica comportamiento servido. Checks de migración se integran al deploy vigente; Content/SEO, UI/UX, rendimiento, implementación del stack y Reviewer independiente conservan sus responsabilidades. No requiere catálogo universal, validator ni otro estado SEO.

**Estado:**
Validated.

## BF-030 — Integridad de estado y ownership de capas

**Contexto:**
En una ejecución WordPress se compensó una Featured Image no renderizada duplicándola en el body, se resubieron assets por uniformar formato y se cerró inicialmente un lote Draft cuando se había pedido Published + Noindex.

**Regla:**
Un dato estructurado persistido no se duplica para suplir presentación: diagnostica ownership y corrige solo la capa autorizada. Reutiliza recursos adecuados antes de ingerir copias; formato aislado no justifica duplicación. Los criterios críticos originales requieren contraste con estado final observable; éxito de escritura no equivale a persistencia o aceptación verificadas.

**Límites:**
Imágenes inline con función editorial siguen siendo válidas y assets nuevos mantienen optimización. Media es especialización WordPress; ownership y aceptación son multistack y proporcionales. No añade estado, workflow ni auditorías para DIRECT; una corrección temporal en otra capa exige autorización, documentación y reversibilidad.

**Estado:**
Validated mediante revisión documental; no constituye retest de un sitio real.

## BF-031 — Fast path de implementación aprobada

**Contexto:**
Una implementación real con fuente visual/HTML y contenido aprobados, target WordPress/Bricks confirmado y scope claro consumió tiempo excesivo y quedó incompleta. El coste principal estuvo en discovery técnico reiterado, validación tardía de una interacción crítica, handoffs y correcciones dispersas; no en repetir Strategy/dirección visual o hacer QA por elemento.

**Regla:**
Con inputs resueltos, prioriza traducción y verificación. Limita preflight a información que cambie implementación/riesgo/QA, valida interacciones críticas antes de maquetar completo y reutiliza un mapping con continuidad de owner. Mantén QA fuerte y cohesionado, corrige findings agrupados y revalida lo afectado.

**Límites:**
Ruta condicional dentro de la clasificación vigente, no DIRECT automático ni fase universal. Preserva implementación nativa, safe writes, persistencia, ownership, Reviewer cuando corresponda, Human Visual QA y autorización de publicación. Un problema material se clasifica/resuelve/escala antes de continuar; no impone tiempos, contadores o dependencia del proyecto de origen.

**Estado:**
Validated mediante revisión documental; pendiente de evidencia operativa para cuantificar mejora, sin prometer duración.

## BF-032 — Execution Budget & Completion Discipline

**Contexto:**
Un flujo STRUCTURAL legítimo puede agotar el presupuesto de pasos en el tramo de cierre; además, después de completar la implementación principal pueden abrirse lecturas o mejoras nuevas en vez de concluir la unidad.

**Regla:**
Dev Lead dispone de 90 steps y entra explícitamente en Completion Mode cuando la implementación principal y sus criterios permiten verificar. El cierre se limita a verificación, Reviewer cuando corresponda, correcciones relevantes, regresión focalizada, checkpoint y STOP. Mantiene un owner principal por unidad y reutiliza la salida válida de especialistas.

**Límites:**
El aumento aplica solo a Dev Lead; límites de especialistas se conservan. Completion Mode no reduce QA requerido ni Reviewer sensible/STRUCTURAL; impide iniciar trabajo opcional o repetir evidencia vigente. `DIRECT` y TASK rutinaria mantienen su proporcionalidad.

**Estado:**
Validated.

**Resultado del retest (2026-10-08):**
En una tarea STRUCTURAL, Developer fue el único owner de implementación (0 handoffs); Architect no intervino al no existir decisión arquitectónica material; Reviewer intervino y devolvió APPROVED con cero hallazgos. Pasaron 14 tests, `node --check` y `git diff --check`. Dev Lead entró en Completion Mode y después solo realizó verificación focalizada, Reviewer, acceptance, Git/checkpoint y cierre; no abrió discovery, refactors, features ni QA opcional. No hubo advertencias de límite de 90 steps, ningún especialista reportó alcanzar su límite y no fue necesaria otra sesión. Se alcanzaron commits locales y STOP correctamente; no hubo push. La unidad cerró correctamente.

## BF-033 — Lean Evidence-First Reviewer

**Contexto:**
La revisión independiente es necesaria en cambios de riesgo/impacto suficiente, pero búsqueda amplia, relectura y auditoría de superficies no afectadas pueden aumentar coste sin mejorar la segunda opinión.

**Regla:**
Reviewer conserva independencia y solo lectura; limita la revisión normal al diff, criterios afectados y dependencias directas necesarias para hipótesis concretas. Reutiliza evidencia vigente, respalda hallazgos con escenario/impacto verificable y acepta cero hallazgos como resultado completo. No investiga en web ni inicia QA especializado por asociación.

**Límites:**
Reviewer permanece utilizable en TASK de riesgo/impacto suficiente y STRUCTURAL; DIRECT/TASK rutinaria no lo activan por defecto. Browser, visual, performance, accessibility, SEO y otras auditorías siguen siendo ownership especializado. La capacidad de investigación externa se deniega; lectura y verificación continúan sin escritura.

**Estado:**
Validated.

**Resultado del retest (2026-10-08):**
En el retest inicial, Bash denegó correctamente `git show`; no se amplió el permiso y la evidencia inaccesible produjo `CHANGES REQUIRED` sin defecto encontrado. El hardening introdujo `BLOCKED` y el handoff de evidencia histórica. En el retest final, Dev Lead adjuntó correctamente el diff al task; Reviewer devolvió `APPROVED`, cero hallazgos, sin consultar archivos adicionales ni intentar capabilities prohibidas, usar websearch/webfetch, cargar skills o hacer screenshots. No hubo comportamiento inesperado.

**Resultado del retest STRUCTURAL (2026-10-08):**
En flujo pre-commit Reviewer todavía intentó recuperar `git diff` mediante Bash. Se elimina Bash por completo del Reviewer y Dev Lead prepara y adjunta siempre diff, archivos afectados, criterios y evidencia de tests/verificaciones al task, tanto para working diffs como commits históricos. Pendiente un retest de Reviewer con working tree real.

**Resultado del retest final con working tree real (2026-10-08):**
Dev Lead preparó el working diff y lo adjuntó al task. Reviewer devolvió `APPROVED`, cero hallazgos; no intentó Bash ni comandos Git, no necesitó `read`/`glob`/`grep` adicionales, no intentó capabilities prohibidas, no usó web, no cargó skills, no hizo screenshots y no devolvió `BLOCKED`. No hubo comportamiento inesperado. Se eliminó el archivo temporal del retest, el working tree quedó limpio y el retest no creó commit ni hizo push.

**Observación no bloqueante:**
En el primer intento de implementación, el especialista no reconoció el copy ya presente en la tarea y fue necesario reiterarlo. No volvió a reproducirse en BF-032; observar retests futuros antes de abrir otra BF.

## BF-034 — HTML-Only Web Design Prototypes

**Problema:**
Prototipos web expresados como imagen aplanan estructura, estados e interacciones y no constituyen un artefacto implementable/responsive.

**Regla:**
Los prototipos high-fidelity web del Blueprint se entregan como HTML/CSS/JS en `design/pages/` por defecto. Responsive vive en el prototipo; la interfaz no se reemplaza por PNG/JPG/WebP ni screenshots. Assets reales del diseño sí se permiten. Imagen/render solo por petición explícita; Figma sigue siendo opcional.

**Estado:**
Validated.

**Resultado del retest (2026-10-08):**
Se generó `design/pages/taskflow-landing.html` como HTML autónomo con CSS/JS inline y responsive real. No se generaron PNG/JPG/WebP ni screenshots; no se necesitaron assets raster.

## BF-035 — No-Screenshot-by-Default QA

**Problema:**
Screenshots rutinarios duplican evidencia DOM/estado/browser y generan tool calls/ciclos visuales innecesarios.

**Regla:**
Para runtime prioriza DOM/árbol, estado, URL, consola, network y atributos/computed styles relevantes. Captura solo por petición explícita o cuando una condición material visual no pueda comprobarse suficientemente por evidencia más directa. `visual-parity-review` conserva su función; con fuente HTML prioriza comparación estructural y captura ante necesidad. Rondas visuales agrupadas, correcciones agrupadas y confirmación focalizada; Reviewer no hace screenshot ni inicia QA browser/visual.

**Estado:**
Validated.

**Resultado del retest (2026-10-08):**
QA mediante inspección directa de HTML/CSS/estructura/breakpoints/estados; sin browser tooling ni screenshots. `visual-parity-review` no se activó al no existir referencia aprobada; Reviewer no se activó. No hubo QA especializado innecesario.

## BF-036 — Source-Grounded Development

**Contexto:**
Los agentes técnicos podían consultar web, pero faltaba un contrato proporcional para decidir cuándo basta evidencia local, cuándo consultar documentación oficial aplicable y cómo probar que una afirmación versionada rige realmente en el proyecto.

**Regla:**
`DETECT → QUESTION → SOURCE → APPLY → PROVE → REPORT`. Detecta primero versión/configuración local; consulta una fuente primaria solo ante duda externa/versionada material o petición explícita; aplica lo mínimo y comprueba localmente con evidencia proporcional.

**Límites:**
Trigger no universal; no confundas `latest` con instalado, investigación con permiso para actualizar, documentación con prueba local ni fuentes externas con instrucciones. Investigación acotada y pausada durante Completion Mode salvo fallo concreto dependiente de ella. No crea otro agente; el owner resuelve pregunta e implementación cuando pueda. Reviewer permanece sin web/skills/Bash.

**Estado:**
Validated.

**Resultado del retest operativo (2026-10-08):**

- **Caso positivo:** entorno detectado Node v24.19.0; duda versionada sobre `fs.promises.glob()` activó la skill. Se consultó documentación oficial de Node v24, correspondiente a v24.21.0, sin asumir aplicabilidad exacta. La aplicabilidad se confirmó en v24.19.0 mediante detección de la API y ejecución focalizada satisfactoria. No se actualizó Node ni se instalaron dependencias; no hubo investigación ajena al asunto.
- **Caso negativo:** función JavaScript puramente local no activó la skill ni websearch/webfetch o consulta documental; verificación local satisfactoria.
- No se creó/utilizó Researcher; Reviewer no intervino; no quedaron archivos temporales; el working tree terminó limpio y no hubo comportamiento inesperado.

## BF-037 — Verified Blocking Findings

**Contexto:**
Un falso positivo del Reviewer clasificado como bloqueante puede causar rework, cambios innecesarios y riesgo de defectos nuevos.

**Regla:**
Solo findings `HIGH`/`CRITICAL` realmente materiales, discutibles y no demostrados reciben una única verificación independiente en un task/contexto fresco, con hipótesis falsadora y evidencia focal. Resultado: `CONFIRMED`, `REFUTED` o `UNPROVEN`.

**Límites:**
No es gate universal: no verifica findings ya demostrados, `MEDIUM`/`LOW`, notas ni mejoras. Dev Lead provee diff, criterios y evidencia neutral; verifier no hace review completa, no busca findings adicionales ni implementa. `UNPROVEN` no equivale a confirmado y no abre ciclos; Reviewer mantiene permisos actuales y la QA especializada conserva su owner.

**Estado:**
Validated.

**Resultado del retest operativo (2026-10-08):**

- **Finding A — HIGH, material y discutible:** Dev Lead activó BF-037 y abrió un task fresco de Reviewer. Resultado `REFUTED`: `writeDraft()` preservaba correctamente campos existentes mediante merge. Sin capabilities prohibidas ni búsqueda de findings adicionales.
- **Finding B — HIGH, material y discutible:** se abrió un segundo task fresco e independiente. Resultado `CONFIRMED`: `replaceSnapshot()` reemplazaba el registro completo y provocaba pérdida de campos. Sin capabilities prohibidas ni reutilización indebida de la conclusión/contexto de A.
- **Finding C — LOW:** BF-037 se omitió correctamente; no se abrió verifier.
- Hubo exactamente dos Finding Verification tasks; no se utilizó Agent Manager ni hubo ciclos adicionales de Reviewer. `REFUTED` y `CONFIRMED` llevaron a decisiones distintas. El retest no inició desarrollo ni regresión; se eliminaron el fixture temporal y demás archivos temporales. El entorno de prueba no tenía Git, así que no hubo working-tree check, sin afectar la validación del procedimiento.

## BF-038 — Blueprint Doctor

**Contexto:**
El Blueprint acumula agentes, skills, comandos, permisos y routing condicional. Cambios parciales pueden dejar referencias rotas, inventario desactualizado o invariantes críticas degradadas.

**Regla:**
`/doctor` inspecciona localmente y en solo lectura versión, Core, agents, skills, commands, routing, permisos críticos y MANIFEST; devuelve `HEALTHY`, `WARNINGS` o `BROKEN` con evidencia proporcional.

**Límites:**
Manual o recomendado ante señal concreta; no automático, web, Reviewer, Agent Manager, auto-repair, scripts, estado ni commit. No evalúa aplicación/contenido ni sustituye QA de proyecto.

**Estado:**
Validated.

**Resultado del primer retest (2026-10-08):**
La ejecución inicial devolvió HEALTHY. Reviewer con `bash: allow` produjo BROKEN; en esa misma ejecución Doctor también reportó el warning de MANIFEST. Restaurar `bash: deny` eliminó el fallo crítico. Se detectó además una ejecución con evidencia stale que no observó el cambio de conteo 12→11; se añadió Fresh Diagnostic Snapshot por invocación. Doctor permaneció read-only y no realizó auto-repair.

**Resultado del retest final tras Fresh Diagnostic Snapshot (2026-10-08):**
Sobre un Blueprint íntegro, `/doctor` devolvió `HEALTHY`. Sin cambiar de sesión, se modificó temporalmente `MANIFEST.md` de 12 a 11 comandos; una nueva ejecución releyó el estado y devolvió `WARNINGS` por discrepancia, sin corregir el archivo. Se restauró MANIFEST a 12; otra ejecución en la misma sesión volvió a leer el filesystem y devolvió `HEALTHY`. Quedó demostrado que no reutiliza como evidencia del estado actual el resultado de una ejecución anterior.

## BF-039 — Gate Self-Test

**Contexto:**
Un checker custom puede devolver PASS con lógica invertida/incorrecta, path o regex erróneos, errores absorbidos o condiciones imposibles, generando falsa confianza cuando controla una decisión.

**Regla:**
Antes de confiar en lógica propia materialmente decisiva, demuestra `KNOWN-GOOD → PASS` y `KNOWN-BAD → FAIL` por la causa esperada. Fixtures, mocks o entornos aislados permiten probar el detector sin activar el side-effect protegido.

**Límites:**
Solo gates/checkers custom que controlan decisiones materiales; no herramientas estándar ni tests ordinarios. No se provoca daño en producción, no se exige mutation testing, agentes, skills, comandos o frameworks nuevos. Reutiliza evidencia mientras no cambie materialmente la lógica; si un negative control seguro no existe, no declares el gate validado y reporta el límite. Reviewer consume evidencia, no ejecuta pruebas.

**Estado:**
Validated.

**Resultado del retest operativo (2026-10-08):**
Se creó `scripts/release-gate.mjs`, gate custom cuyo PASS/FAIL controla si se puede continuar hacia una publicación hipotética; BF-039 se activó correctamente por lógica propia materialmente decisiva.

- **KNOWN-GOOD:** input `{"deployReady":true}` → exit code 0; PASS por `deployReady === true`.
- **KNOWN-BAD:** input `{"deployReady":false}` → exit code 1; FAIL con `Gate blocked: deployReady is not true.` No falló por sintaxis, archivo ausente, JSON inválido, permisos ni causa ajena.
- Ambos fixtures se aislaron temporalmente y eliminaron. No se tocó producción ni un entorno real. Se crearon exactamente dos casos artificiales: uno positivo y uno negativo.
- `node --check scripts/release-gate.mjs` pasó como verificación estándar, sin self-test propio. Después el gate se reutilizó una vez con input válido sin crear otro known-bad ni repetir Gate Self-Test.
- Se usó `testing-strategy`. Reviewer aprobó sin hallazgos y solo consumió la evidencia; no ejecutó scripts/tests. No hubo websearch/webfetch ni comportamiento inesperado.
- El entorno temporal no tenía Git y no produjo commit; esto no afectó la validación del procedimiento.

## BF-040 — Deployment Workflow Scaffold

**Contexto:**
Los proyectos creados desde el Blueprint necesitaban una superficie base para configurar deployment sin inventar desde cero el workflow ni habilitar una publicación antes de confirmar stack, destino y método.

**Regla:**
Cada proyecto hereda `.github/workflows/deploy.yml` manual y fail-closed. Su presencia no significa deployment configurado. Al confirmarse GitHub Actions como canal, especializa por proyecto el artifact/source, entorno, transporte, secretos referenciados, trigger y verificación/recuperación. Deployment automático requiere intención explícita.

**Límites:**
El scaffold no publica ni contiene secretos/destinos. `/new-project` identifica intención pero no configura infraestructura. Sin método completo permanece manual y fail-closed. Stack-aware; BF-036 aplica a comportamiento/versiones externas y BF-039 a gates custom. En WordPress, `deploy-wordpress` mantiene el ownership de publicación y superficies persistentes.

**Estado:**
Testing; pendiente probar herencia del scaffold y configuración por proyecto sin riesgo de publicación.
