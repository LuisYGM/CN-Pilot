---
description: Ejecuta una revisión independiente contra requisitos y criterios de aceptación.
agent: jefe-proyecto
---

# Review

1. Preflight antes de crear `task`: reúne objetivo/scope, diff real relevante, archivos afectados, acceptance relacionado, resultados PASS con su vigencia y limitaciones. Si no hay diff de código, adjunta fragmento/evidencia del artefacto objetivo y dilo expresamente.
2. Comprueba que esos materiales estén realmente incluidos en el cuerpo que recibirá Revisor: pega el diff/hunks con contexto suficiente (no solo ruta, hash, resumen ni «inspecciona working tree»), paths, criterios y resultados. Para diff grande recorta a áreas pertinentes y nombra todos los archivos afectados. No sintetices defectos ni hagas pre-review.
3. Si falta algo, recupéralo mediante Git o lectura directa dentro de tus capacidades antes de delegar; no preguntes a la persona si puedes obtenerlo localmente. No invoques Revisor hasta que el preflight sea suficiente y no amplíes sus permisos.
4. Reutiliza evidencia e informes previos si objetivo y fuente/superficies que sustentan el PASS no cambiaron ni hay contradicción. Indica PASS vigente y cambio que invalida cualquier otra evidencia; no afirmes pruebas que no se ejecutaron.
5. Delega a `revisor` mediante `task` en primer plano cuando el paso dependa del resultado. Usa Agent Manager/worktree solo si existe Git y se necesita aislamiento real o una sesión independiente.
6. Solicita un informe final conciso, priorizado y accionable; no hagas polling.
7. No expandas la revisión a browser, visual, performance, accessibility, SEO o security audit por asociación: Jefe de proyecto decide si una skill especializada aplica por scope/riesgo.
8. Cero hallazgos es válido. Si la evidencia imprescindible falta y no puedes recuperarla, devuelve `BLOCKED` con el dato/capacidad exactos que falta, no `CHANGES REQUIRED`; este último significa defectos reales respaldados. Emite un informe corto; no sigas investigando para fabricar findings.
9. Tras la revisión normal, aplica BF-037 solo a findings `HIGH`/`CRITICAL` materialmente bloqueantes y discutibles no demostrados objetivamente. Prepara evidencia neutral y lanza un task nuevo para falsificar ese finding; interpreta `CONFIRMED`/`REFUTED`/`UNPROVEN`. No verifiques MEDIUM/LOW, notas ni hallazgos ya demostrados; no abras ciclos.
10. Si Revisor queda BLOCKED, resuelve solo el hueco indicado y reenvía el scope pendiente con resultado previo/evidencia recuperada; no reinicies investigación/tests/revisión sin razón material. Tras correcciones adjunta diff incremental real y revisa área afectada/regresiones pertinentes; repite revisión completa solo si riesgo/cambio lo exige.
11. No implementes ni corrijas hallazgos; entrégalos a Jefe de proyecto.
12. Finaliza con APPROVED, APPROVED WITH NOTES, CHANGES REQUIRED o BLOCKED y detente.
13. Si la revisión usó un worktree temporal, Jefe de proyecto ejecuta el cleanup verificable: estado limpio, `git worktree list`, cierre/eliminación segura, `git worktree prune` cuando corresponda y verificación final del listado y la ruta. No equipares sesión finalizada con worktree eliminado.
