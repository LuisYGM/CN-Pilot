---
description: Ejecuta una revisión independiente contra requisitos y criterios de aceptación.
agent: dev-lead
---

# Review

1. Antes de delegar, prepara diff relevante, lista de archivos afectados, criterios de aceptación relacionados y evidencia vigente de tests/verificaciones, usando Git o lectura directa según corresponda. No sintetices defectos ni hagas un pre-review.
2. Adjunta ese material al `task` de Reviewer en toda revisión: working diff/pre-commit, commit histórico o evidencia que no pueda recuperar con sus permisos. Reutiliza evidencia e informes previos vigentes y no amplíes permisos para permitir su recuperación directa.
3. Delega a `reviewer` mediante `task` en primer plano cuando el paso dependa del resultado. Usa Agent Manager/worktree solo si existe Git y se necesita aislamiento real o una sesión independiente.
4. Solicita un informe final conciso, priorizado y accionable; no hagas polling.
5. No expandas la revisión a browser, visual, performance, accessibility, SEO o security audit por asociación: Dev Lead decide si una skill especializada aplica por scope/riesgo.
6. Cero hallazgos es válido. Si la evidencia imprescindible falta, devuelve `BLOCKED` y qué falta, no `CHANGES REQUIRED`; este último significa defectos reales respaldados. Emite un informe corto con evidencia concreta, hallazgos relacionados y resultado; no sigas investigando para fabricar findings.
7. Tras la revisión normal, aplica BF-037 solo a findings `HIGH`/`CRITICAL` materialmente bloqueantes y discutibles no demostrados objetivamente. Dev Lead prepara evidencia neutral y lanza un task nuevo de Reviewer para falsificar ese finding; interpreta `CONFIRMED`/`REFUTED`/`UNPROVEN`. No verifiques MEDIUM/LOW, notas ni hallazgos ya demostrados; no abras ciclos.
8. Tras correcciones, revisa incrementalmente el área afectada y regresiones pertinentes; repite la revisión completa solo si riesgo/cambio lo exige.
9. No implementes ni corrijas hallazgos; entrégalos al Dev Lead.
10. Finaliza con APPROVED, APPROVED WITH NOTES, CHANGES REQUIRED o BLOCKED y detente.
11. Si la revisión usó un worktree temporal, Dev Lead ejecuta el cleanup verificable: estado limpio, `git worktree list`, cierre/eliminación segura, `git worktree prune` cuando corresponda y verificación final del listado y la ruta. No equipares sesión finalizada con worktree eliminado.
