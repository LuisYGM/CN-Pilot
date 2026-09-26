# Blueprint Feedback

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

**Status:**
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

**Status:**
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

**Status:**
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

**Status:**
Open / Testing / Resolved.
