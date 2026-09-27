---
description: Crea un commit local coherente cuando Git existe; sin Git informa que el comando no aplica.
agent: dev-lead
---

# Commit

1. Comprueba si el directorio pertenece a un repositorio Git.
2. Si Git no está inicializado, detén únicamente este comando e informa con claridad; no ejecutes `git init` y no presentes el proyecto como bloqueado.
3. Si existe Git, ejecuta `git status`.
4. Revisa `git diff` y `git diff --staged`.
5. No uses la conversación como única fuente.
6. Excluye secretos, temporales y cambios no relacionados.
7. Separa unidades lógicas si hace falta.
8. Stagea la unidad seleccionada.
9. Crea el commit.

Tipos: `feat`, `fix`, `style`, `refactor`, `perf`, `seo`, `content`, `docs`, `test`, `chore`.

La descripción debe estar siempre en español.

No hagas push.
