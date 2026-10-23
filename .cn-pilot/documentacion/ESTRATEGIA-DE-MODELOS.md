# Configuración de IA en Kilo

CN Pilot es agnóstico a proveedor/modelo **dentro de Kilo Code**: el workflow y las responsabilidades no dependen de una marca de modelo. No promete compatibilidad nativa con otros runtimes de agentes.

## Límite de responsabilidades

**CN Pilot → workflow, roles, calidad y reglas de decisión.**

**Kilo/runtime → provider, model, razonamiento y model overrides.**

Model selection is environment/user-controlled. Cada desarrollador elige desde Kilo Settings, su configuración local o su configuración global el modelo principal, el modelo pequeño, el modelo de subagentes, el modelo de compactación, los overrides, el esfuerzo de razonamiento y el proveedor, según disponibilidad, coste, calidad, preferencias, acceso/licencia y necesidades del proyecto. El CN Pilot no sobreescribe esas decisiones ni fija valores, generaciones, niveles de razonamiento, tiers de precio o asignaciones por rol.

Los agentes y skills no fijan proveedor, generación o modelo concreto. Dos desarrolladores pueden tener opciones distintas dentro de Kilo y compartir workflow/roles. La disponibilidad, autenticación y herencia de modelos depende de la configuración y versión del runtime; Jefe de proyecto decide si delegar y qué especialista necesita, no qué proveedor configura una persona. `/nuevo-proyecto` no pregunta por modelos ni registra preferencias personales en Project Context.

Solo se documenta un proveedor o modelo concreto como requisito **del proyecto/producto** cuando existe dependencia técnica real: integración de una API de IA, evaluación de compatibilidad, proveedor exigido por el cliente o feature dependiente de esa API. No equivale a una política de modelos de los agentes.

## Coste y calidad

Usa el enfoque menos costoso que complete la tarea con fiabilidad: menos sesiones e iteraciones, scope preciso, skills adecuadas y ninguna duplicación innecesaria. Una tarea compleja puede beneficiarse de mayor capacidad de razonamiento, pero la elección concreta de modelo o esfuerzo pertenece al desarrollador y a Kilo. Evalúa el resultado, evidencia, QA y cumplimiento del alcance, no la marca ni la versión del modelo.

`task` sirve para delegación integrada; Agent Manager con worktrees se reserva para unidades escritoras realmente independientes. Dos unidades paralelas como máximo por defecto; una tercera solo con scopes aislados, integración barata y capability real. Revisor/read-only puede coincidir solo sobre estado estable e independiente. Considera el coste y el riesgo, no uses sesiones duplicadas para ahorrar tiempo. Este es un límite de coordinación, no de modelos ni steps.

Consulta [Configuración de Kilo](CONFIGURACION-KILO.md) para opciones personales y [Configuración](CONFIGURACION.md) para separar preferencias locales, configuración compartible y secretos. El `kilo.jsonc` versionado no fija modelos ni proveedor.
