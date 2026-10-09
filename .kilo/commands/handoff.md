---
description: Prepara documentación de entrega o traspaso de un proyecto a cliente o compañero.
agent: dev-lead
---

# Handoff

1. Lee proyecto, decisiones y estado.
2. Identifica stack/dependencias reales.
3. Confirma el alcance del repositorio, el punto de entrega y el destino de cada entregable.
4. Revisa y actualiza `ARTIFACTS.md`; úsalo como mapa y referencia sus rutas sin duplicar el contenido de cada entregable.
5. Indica la fidelidad realmente alcanzada: referencia estructural, propuesta visual o referencia final de implementación. No presentes una fase estructural como diseño final.
6. Identifica elementos provisionales, validaciones factuales pendientes y adaptaciones entre diseño e implementación.
7. Documenta el estado del control de versiones solo como contexto; «no inicializado» no es un bloqueo.
8. Identifica las fuentes de verdad que debe respetar quien continúe.
9. Resume la arquitectura necesaria para continuar.
10. Documenta el procedimiento manual o mediante MCP/integración sin asumir que deployment forma parte del alcance.
11. Si la maquetación continuará manualmente, referencia `.cn-pilot/config/responsive.json` o los breakpoints existentes que sean source of truth.
12. Documenta entornos, mantenimiento y backups que realmente apliquen, sin secretos.
13. Registra trabajo fuera de alcance, riesgos y pendientes.
14. Lista accesos que el propietario debe conservar, sin contraseñas/tokens.
15. Usa `.cn-pilot/templates/handoff.md`.
16. Omite o marca como no aplicables las secciones posteriores al punto de entrega; no inventes fases.
17. Verifica que la persona o sistema que recibe cada entregable pueda continuar desde el punto acordado.
