# Flujo de equipo

Jefe de proyecto es el coordinador y contacto humano normal. Lee lo que ya existe, conserva decisiones vigentes, propone especialistas por necesidad y reconcilia resultados/gates. No necesitas repartir tareas entre agentes.

| Agente | Ownership y activación |
|---|---|
| Jefe de proyecto | Intake, scope/riesgo, contexto, selección de owners/skills, gates humanos, integración y cierre. Es el interlocutor normal. |
| Arquitecto | Decisiones estructurales/materiales, contratos compartidos y migraciones de impacto; no por cualquier cambio técnico. |
| Diseñador | UX/UI visual, dirección artística, composición, UI Kit/prototipos, estados e intent de interacción/motion cuando la decisión visual está abierta. Human Visual Approval sigue siendo de la persona. |
| Redactor | Estrategia editorial, copy comercial/editorial, SEO editorial, storytelling, UX writing y microcopy cuando el contenido/intención requiere resolución. No implementa código ni SEO técnico. |
| Desarrollador | Único owner de implementación técnica full stack: UI/frontend/responsive/builders y backend/datos/APIs/WordPress; usa el stack existente y recibe inputs aprobados de Diseñador/Redactor. No hay handoff rutinario frontend↔backend. |
| Revisor | Comprobación independiente read-only con evidencia; en Codex la instrucción no limita técnicamente permisos, que hereda de la sesión raíz. No implementa ni reemplaza QA primaria o gates humanos. |

Las skills se cargan por trigger, no en bloque. La tabla detallada de activación y secuencia está en `.kilo/agents/jefe-proyecto.md`; los procedimientos y acceptance viven en cada skill. Handoffs solo ocurren entre autoridades distintas o ante un gate real.

## Serial por defecto, paralelo con aislamiento

La forma normal es una unidad de trabajo cada vez. Jefe de proyecto puede paralelizar solo si hay unidades realmente independientes, superficies separadas y beneficio de integración claro. En ese caso:

- estabiliza primero contratos y archivos compartidos;
- limita writers simultáneos y usa worktrees solo cuando el runtime/Git permite comprobar el aislamiento real;
- los readers/reviewers no cambian los archivos;
- integra una unidad cada vez, verifica y conserva cualquier checkout con cambios no integrados.

Si no existe esa capacidad o no aporta valor, continúa en serie. Agent Manager/worktrees son detalles de coordinación interna, no un requisito para usar CN Pilot. [Flujo Git](FLUJO-GIT.md) explica cómo se relacionan branches, worktrees y push manual.

## Revisión y cierre

Revisor inspecciona diff, criterios y pruebas proporcionadas sin implementar. Diseño visual subjetivo permanece bajo aprobación humana; QA técnico verifica riesgos observables. El trabajo puede cerrar con código, contenido, diseño o handoff. Commit local puede ser parte del cierre Git; push, PR, merge, tag, release y deployment no son implícitos.

Para colaboración del mismo repositorio revisa los hechos actuales antes de escribir. No se obliga a un pull/branch ni se habilita auto-merge por usar CN Pilot.
