# Configuración de modelos en Kilo y Codex

CN Pilot conserva los mismos contratos compartidos de roles y skills en Kilo Code y OpenAI Codex. Cada runtime controla su propia selección de provider, model, razonamiento, aprobación y sandbox; CN Pilot no fija esos valores.

## Límite de responsabilidades

**CN Pilot → workflow, roles, calidad y reglas de decisión.**

**Runtime → provider, model, razonamiento, permisos, aprobaciones y sandbox efectivos.**

Model selection is environment/user-controlled. Cada desarrollador elige desde la configuración del runtime el modelo y proveedor disponibles, según coste, calidad, preferencias, acceso/licencia y necesidades del proyecto. El CN Pilot no sobreescribe esas decisiones ni fija generaciones, niveles de razonamiento, tiers de precio o asignaciones por rol.

Los agentes y skills no fijan proveedor, generación o modelo concreto. Dos desarrolladores pueden tener opciones distintas y compartir workflow/roles. La disponibilidad, autenticación y herencia de modelos depende de la configuración y versión del runtime; Jefe de proyecto decide si delegar y qué especialista necesita, no qué proveedor configura una persona. `/nuevo-proyecto` o `$cnp-nuevo-proyecto` no pregunta por modelos ni registra preferencias personales en Project Context.

Solo se documenta un proveedor o modelo concreto como requisito **del proyecto/producto** cuando existe dependencia técnica real: integración de una API de IA, evaluación de compatibilidad, proveedor exigido por el cliente o feature dependiente de esa API. No equivale a una política de modelos de los agentes.

## Coste y calidad

Usa el enfoque menos costoso que complete la tarea con fiabilidad: menos sesiones e iteraciones, scope preciso, skills adecuadas y ninguna duplicación innecesaria. Una tarea compleja puede beneficiarse de mayor capacidad de razonamiento, pero la elección concreta de modelo o esfuerzo pertenece al desarrollador y al runtime. Evalúa el resultado, evidencia, QA y cumplimiento del alcance, no la marca ni la versión del modelo.

Usa la delegación nativa del runtime para análisis o unidades claramente separables. Kilo puede aislar writers con worktrees; en Codex, no asumas aislamiento de filesystem, branch o worktree de un subagente. Limita writers paralelos y revisa cada unidad antes de integrarla. Revisor puede analizar solo el estado estable, pero en Codex el permiso de solo lectura debe imponerlo la sesión raíz.

Consulta [Configuración de Kilo](CONFIGURACION-KILO.md), [Configuración de Codex](CONFIGURACION-CODEX.md) y [Configuración](CONFIGURACION.md) para separar preferencias locales, configuración compartible y secretos. El `kilo.jsonc` versionado no fija modelos ni proveedor.
