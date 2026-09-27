---
description: Ejecuta una revisión independiente contra requisitos y criterios de aceptación.
agent: dev-lead
---

# Review

1. Obtén `git status` y `git diff`.
2. Identifica requisitos/criterios.
3. Reutiliza un informe previo si revisa el mismo alcance y sigue siendo válido.
4. Si el siguiente paso depende del resultado, delega a `reviewer` mediante `task` en primer plano. Usa Agent Manager/worktree solo si se necesita aislamiento real o una sesión independiente.
5. Solicita un informe final conciso, priorizado y accionable; no hagas polling.
6. Carga reviews específicas si aplican: seguridad, performance, accessibility, SEO o testing.
7. Clasifica hallazgos.
8. Tras correcciones, revisa incrementalmente los cambios y regresiones relevantes; repite la revisión completa solo si el riesgo lo justifica.
9. No corrijas automáticamente hallazgos importantes sin devolverlos al Dev Lead.
10. Finaliza con APPROVED, APPROVED WITH NOTES o CHANGES REQUIRED.
