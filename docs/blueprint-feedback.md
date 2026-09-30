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
