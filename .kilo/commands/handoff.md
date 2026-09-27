---
description: Prepara documentación de entrega o traspaso de un proyecto a cliente o compañero.
agent: dev-lead
---

# Handoff

1. Lee proyecto, decisiones y estado.
2. Identifica stack/dependencias reales.
3. Confirma el alcance del repositorio, el punto de entrega y el destino de cada entregable.
4. Revisa y actualiza `docs/ARTIFACTS.md`; úsalo como mapa y referencia sus rutas sin duplicar el contenido de cada entregable.
5. Documenta el estado del control de versiones solo como contexto; «no inicializado» no es un bloqueo.
6. Identifica las fuentes de verdad que debe respetar quien continúe.
7. Resume la arquitectura necesaria para continuar.
8. Documenta el procedimiento manual o mediante MCP/integración sin asumir que deployment forma parte del alcance.
9. Si la maquetación continuará manualmente, referencia `config/responsive.json` o los breakpoints existentes que sean source of truth.
10. Documenta entornos, mantenimiento y backups que realmente apliquen, sin secretos.
11. Registra trabajo fuera de alcance, riesgos y pendientes.
12. Lista accesos que el propietario debe conservar, sin contraseñas/tokens.
13. Usa `templates/handoff.md`.
14. Omite o marca como no aplicables las secciones posteriores al punto de entrega; no inventes fases.
15. Verifica que la persona o sistema que recibe cada entregable pueda continuar desde el punto acordado.
