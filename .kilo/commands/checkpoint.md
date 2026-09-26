---
description: Verifica una unidad lógica, actualiza estado cuando corresponde y crea commits locales en español.
agent: dev-lead
---

# Checkpoint

1. `git status`.
2. Inspecciona el diff completo.
3. Detecta archivos accidentales o sensibles.
4. Determina nivel y pruebas relevantes.
5. Delega Reviewer independiente solo para trabajo STRUCTURAL, TASK con riesgo o impacto suficiente, criterios de aceptación relevantes, seguridad, pagos, autenticación, datos, integraciones sensibles o una razón concreta documentada; no para una TASK rutinaria de bajo riesgo.
6. No continúes con fallos bloqueantes.
7. Actualiza `STATE.md` solo si cambió materialmente el trabajo actual, un bloqueo, el siguiente paso, la rama activa o un checkpoint relevante; no por cambios rutinarios de metadata, idioma, stack, requisitos, contenido o configuración.
8. Agrupa cambios por unidad lógica.
9. Si la tarea modificó archivos y está totalmente terminada y verificada, stagea únicamente la unidad relacionada y crea automáticamente el commit local, sin preguntar al usuario.
10. No crees commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario pidió explícitamente no hacer commits.
11. Usa Conventional Commits, deriva el mensaje del diff y escribe la descripción en español.
12. Confirma hashes y estado final cuando exista commit.
13. Nunca hagas push automático.
