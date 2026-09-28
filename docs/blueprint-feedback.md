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
