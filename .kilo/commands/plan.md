---
description: Analiza una tarea o feature y crea un plan proporcional antes de implementar.
agent: dev-lead
---

# Plan

1. Lee contexto relevante.
2. Clasifica DIRECT/TASK/STRUCTURAL.
3. Evalúa riesgo.
4. Define criterios de aceptación si aplica.
5. Si es STRUCTURAL, delega arquitectura a `architect`.
6. Identifica agentes y skills necesarios.
7. Divide en etapas verificables.
8. Señala decisiones que requieren aprobación.
9. Para una tarea STRUCTURAL cuyo resultado se usará después, persiste la especificación de la funcionalidad en `docs/features/<slug>.md` o la arquitectura transversal en `docs/architecture/<slug>.md`; guarda ADRs formales en `docs/adr/` y decisiones aprobadas ligeras en `DECISIONS.md`. Crea estas rutas solo cuando exista el artefacto real.
10. Usa `.blueprint/templates/feature-spec.md` cuando corresponda y conserva hechos confirmados, restricciones, recomendaciones provisionales, decisiones pendientes, alcance, alternativas, seguridad, criterios de aceptación, plan de implementación y bloqueos previos.
11. «No escribir código todavía» significa no implementar; no impide documentar. Solo evita modificar archivos si el usuario lo pide explícitamente.
12. Revisa el artefacto y, si Git existe, el diff. Si la planificación quedó completa y verificada, crea automáticamente un commit local Conventional Commit en español solo cuando Git esté disponible; sin Git conserva el artefacto localmente.
13. No implementes código salvo que la petición incluya implementación inmediata y nunca hagas push automático.
