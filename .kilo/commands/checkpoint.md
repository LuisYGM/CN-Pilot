---
description: Verifica una unidad lógica, actualiza estado cuando corresponde y crea commits locales en español si Git existe.
agent: dev-lead
---

# Checkpoint

1. Detecta si existe repositorio Git.
2. Si existe, ejecuta `git status` e inspecciona el diff completo. Si no, inspecciona directamente los archivos afectados y omite operaciones Git.
3. Detecta archivos accidentales o sensibles mediante las capacidades disponibles.
4. Determina nivel y pruebas relevantes.
5. Delega Reviewer independiente solo para trabajo STRUCTURAL, TASK con riesgo o impacto suficiente, criterios de aceptación relevantes, seguridad, pagos, autenticación, datos, integraciones sensibles o una razón concreta documentada; no para una TASK rutinaria de bajo riesgo. Antes, reserva margen para recibir el informe, corregir y probar; reutiliza reviews válidas y no hagas polling.
6. No continúes con fallos bloqueantes.
7. Actualiza `STATE.md` solo si cambió materialmente el trabajo actual, un bloqueo, el siguiente paso, la rama activa si aplica o un checkpoint relevante; no por cambios rutinarios de metadata, idioma, stack, requisitos, contenido, configuración o ausencia de Git.
8. Agrupa cambios por unidad lógica aunque no exista Git.
9. Si Git existe y la tarea modificó archivos y está totalmente terminada y verificada, stagea únicamente la unidad relacionada y crea automáticamente el commit local, sin preguntar al usuario.
10. No crees commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario pidió explícitamente no hacer commits.
11. Cuando haya commit, usa Conventional Commits, deriva el mensaje del diff y escribe la descripción en español.
12. Confirma hashes y estado final cuando exista commit. Sin Git, informa que los archivos quedaron guardados localmente y que no se creó commit.
13. Si hubo worktree temporal, informa por separado el estado de la sesión, el registro Git y la carpeta física; no declares cleanup completado sin verificar `git worktree list` después de la limpieza.
14. La ausencia de Git no bloquea la tarea, no se registra como bloqueo y no autoriza ejecutar `git init`.
15. Nunca hagas push automático.
