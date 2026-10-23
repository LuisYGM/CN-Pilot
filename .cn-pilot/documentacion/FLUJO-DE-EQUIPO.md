# Flujo de equipo

Jefe de proyecto es el coordinador y contacto humano normal. Lee lo que ya existe, conserva las decisiones vigentes, propone especialistas según el trabajo y reúne el resultado. No necesitas repartir tareas entre agentes.

Los especialistas trabajan con procedimientos bajo demanda. Desarrollo conserva el ownership de backend, APIs, datos y lógica; Maquetador frontend implementa la presentación aprobada; Diseñador define decisiones visuales cuando aplican; Contenido / SEO trabaja copy e intención; Arquitecto entra si hay una decisión estructural; Revisor realiza una revisión final de solo lectura cuando el riesgo/alcance la justifican.

## Serial por defecto, paralelo con aislamiento

La forma normal es una unidad de trabajo cada vez. Jefe de proyecto puede paralelizar solo si hay unidades realmente independientes, superficies separadas y beneficio de integración claro. En ese caso:

- estabiliza primero contratos y archivos compartidos;
- limita writers simultáneos y aísla sus cambios con worktrees cuando Git/Kilo lo permite;
- los readers/reviewers no cambian los archivos;
- integra una unidad cada vez, verifica y conserva cualquier checkout con cambios no integrados.

Si no existe esa capacidad o no aporta valor, continúa en serie. Agent Manager/worktrees son detalles de coordinación interna, no un requisito para usar CN Pilot. [Flujo Git](FLUJO-GIT.md) explica cómo se relacionan branches, worktrees y push manual.

## Revisión y cierre

Revisor inspecciona diff, criterios y pruebas proporcionadas sin implementar. Diseño visual subjetivo permanece bajo aprobación humana; QA técnico verifica riesgos observables. El trabajo puede cerrar con código, contenido, diseño o handoff. Commit local puede ser parte del cierre Git; push, PR, merge, tag, release y deployment no son implícitos.

Para colaboración del mismo repositorio revisa los hechos actuales antes de escribir. No se obliga a un pull/branch ni se habilita auto-merge por usar CN Pilot.
