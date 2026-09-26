---
description: Inicializa un proyecto creado desde el Blueprint y completa su contexto base.
agent: dev-lead
---

# New Project

1. Lee `.blueprint-version`, `PROJECT.md`, `STATE.md`, `DECISIONS.md` y `REQUIREMENTS.md`.
2. Determina o solicita únicamente lo esencial que falte:
   - nombre;
   - objetivo;
   - perfil;
   - stack;
   - capacidades;
   - entornos;
   - alcance;
   - restricciones.
3. No solicites credenciales.
4. Completa `PROJECT.md`.
5. Ajusta `REQUIREMENTS.md`.
6. Inicializa `STATE.md`.
7. Añade decisiones iniciales a `DECISIONS.md` solo si existen.
8. Revisa `.gitignore` y sugiere ignores específicos del stack.
9. Comprueba `git status`.
10. No reescribas historia Git.
11. Si hay cambios lógicos listos, prepara `chore: inicializar proyecto`.
12. No hagas push.
