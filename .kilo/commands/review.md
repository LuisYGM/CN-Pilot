---
description: Ejecuta una revisión independiente contra requisitos y criterios de aceptación.
agent: dev-lead
---

# Review

1. Inspecciona diff/archivos modificados y solo los requisitos/criterios relacionados. Si no existe Git, inspecciona directamente los artefactos afectados.
2. Reutiliza evidencia de pruebas/verificaciones e informes previos si cubren el mismo alcance y siguen vigentes.
3. Si el siguiente paso depende del resultado, delega a `reviewer` mediante `task` en primer plano. Usa Agent Manager/worktree solo si existe Git y se necesita aislamiento real o una sesión independiente.
4. Solicita un informe final conciso, priorizado y accionable; no hagas polling.
5. No expandas la revisión a browser, visual, performance, accessibility, SEO o security audit por asociación: Dev Lead decide si una skill especializada aplica por scope/riesgo.
6. Cero hallazgos es válido. Emite un informe corto con evidencia concreta, hallazgos relacionados y resultado; no sigas investigando para fabricar findings.
7. Tras correcciones, revisa incrementalmente el área afectada y regresiones pertinentes; repite la revisión completa solo si riesgo/cambio lo exige.
8. No implementes ni corrijas hallazgos; entrégalos al Dev Lead.
9. Finaliza con APPROVED, APPROVED WITH NOTES o CHANGES REQUIRED y detente.
10. Si la revisión usó un worktree temporal, Dev Lead ejecuta el cleanup verificable: estado limpio, `git worktree list`, cierre/eliminación segura, `git worktree prune` cuando corresponda y verificación final del listado y la ruta. No equipares sesión finalizada con worktree eliminado.
