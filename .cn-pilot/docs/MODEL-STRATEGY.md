# Configuración de IA en Kilo

## Límite de responsabilidades

**CN Pilot → workflow, roles, calidad y reglas de decisión.**

**Kilo/runtime → provider, model, razonamiento y model overrides.**

Model selection is environment/user-controlled. Cada desarrollador elige desde Kilo Settings, su configuración local o su configuración global el modelo principal, el modelo pequeño, el modelo de subagentes, el modelo de compactación, los overrides, el esfuerzo de razonamiento y el proveedor, según disponibilidad, coste, calidad, preferencias, acceso/licencia y necesidades del proyecto. El CN Pilot no sobreescribe esas decisiones ni fija valores, generaciones, niveles de razonamiento, tiers de precio o asignaciones por rol.

Los agentes y skills son provider-agnostic y model-agnostic: no dependen de OpenAI, Anthropic, Google, xAI ni de un nombre de modelo. Dos desarrolladores con proveedores y modelos diferentes mantienen el mismo CN Pilot, workflow y responsabilidades. Un subagente hereda la selección aplicable de Kilo o utiliza la configuración que defina el desarrollador; Dev Lead decide si delegar, qué especialista necesita y si conviene aislamiento, no qué modelo ejecuta la tarea. `/new-project` no pregunta por modelos ni registra preferencias personales en `PROJECT.md`, `REQUIREMENTS.md` o `DECISIONS.md`.

Solo se documenta un proveedor o modelo concreto como requisito **del proyecto/producto** cuando existe dependencia técnica real: integración de una API de IA, evaluación de compatibilidad, proveedor exigido por el cliente o feature dependiente de esa API. No equivale a una política de modelos de los agentes.

## Coste y calidad

Usa el enfoque menos costoso que complete la tarea con fiabilidad: menos sesiones e iteraciones, scope preciso, skills adecuadas y ninguna duplicación innecesaria. Una tarea compleja puede beneficiarse de mayor capacidad de razonamiento, pero la elección concreta de modelo o esfuerzo pertenece al desarrollador y a Kilo. Evalúa el resultado, evidencia, QA y cumplimiento del alcance, no la marca ni la versión del modelo.

`task` sirve para delegación integrada; Agent Manager se reserva para aislamiento, alternativas o trabajo realmente independiente. No se abren por defecto más de dos sesiones Agent Manager pagadas simultáneamente; para más se pide confirmación. Este límite es de orquestación y coste, no una regla ligada a un modelo.

Consulta [Configuración de Kilo](KILO-SETUP.md) para las opciones personales y [Configuración del CN Pilot](CONFIGURATION.md) para separar preferencias locales, configuración compartible y secretos. El `kilo.jsonc` versionado no fija modelos ni proveedor.
