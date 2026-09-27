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
Resolved.

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
Resolved.

## BF-011 — Reviewer y worktree quedan huérfanos al terminar la sesión padre

**Contexto:**
Revisión independiente lanzada como sesión de Agent Manager en un worktree temporal cuando Dev Lead estaba cerca de su límite.

**Comportamiento observado:**
Reviewer terminó con hallazgos útiles después de que la sesión solicitante dejara de estar disponible; el resultado no se entregó automáticamente y quedó un worktree que requirió recuperación y limpieza manual.

**Comportamiento esperado:**
Las revisiones dependientes deben usar preferentemente un subagente `task` ligado al flujo, reservar margen de procesamiento y reutilizar informes accesibles. Los worktrees temporales limpios deben cerrarse mediante funciones soportadas, sin eliminar nunca cambios no confirmados.

**Impacto:**
High.

**Mejora propuesta:**
Reducir el uso de Agent Manager para revisiones secuenciales, evitar polling y revisiones duplicadas, crear checkpoints antes del límite y documentar que Kilo —no el Blueprint— controla la entrega a sesiones terminadas y la disponibilidad de limpieza programática segura.

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
Open / Testing / Resolved.
