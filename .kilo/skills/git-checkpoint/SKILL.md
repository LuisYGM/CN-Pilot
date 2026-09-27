---
name: git-checkpoint
description: Preparar un checkpoint Git seguro: inspeccionar status/diff, verificar cambios, agrupar unidades lógicas y generar commits Conventional Commits con descripción siempre en español. Úsala antes de crear commits.
---

# git-checkpoint

1. Comprueba si existe repositorio Git.
2. Si no existe, no ejecutes `git init`: informa que esta skill no aplica y devuelve el control para verificar archivos directamente.
3. Si existe, ejecuta `git status` y `git diff`.
4. Detecta secretos/cambios accidentales.
5. Agrupa unidades lógicas.
6. Verifica pruebas si corresponde.
7. Stagea solo cambios relacionados.
8. Genera mensaje desde el diff.
9. Commit en español.
10. Confirma hash/estado final.

No hacer push.
