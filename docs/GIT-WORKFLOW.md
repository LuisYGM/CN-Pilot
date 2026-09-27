# Flujo de trabajo de Git

Este workflow aplica únicamente cuando el proyecto utiliza Git. Una carpeta sin Git puede completar el resto de flujos sin inicializarlo ni quedar bloqueada.

## Principios

- Conventional Commits.
- Descripción siempre en español.
- Mensaje basado en `git diff`.
- Un commit = unidad lógica.
- Kilo puede crear commits locales.
- Dev Lead crea el commit local automáticamente cuando una tarea con cambios queda completa y verificada, salvo exclusión explícita o error bloqueante.
- Push bajo aprobación humana.

## Comandos del Blueprint

- `/commit` requiere un repositorio Git; sin Git informa que no aplica y no inicializa uno.
- `/checkpoint` verifica siempre, pero solo crea commit si Git existe.
- `/new-project`, `/review`, `/handoff` y `/pre-deploy` funcionan también sin Git.
- Ramas, hashes, Pull Requests, Agent Manager con worktrees y operaciones `git worktree` requieren Git.

## Tipos

`feat`, `fix`, `style`, `refactor`, `perf`, `seo`, `content`, `docs`, `test`, `chore`.

## Ejemplos

```text
feat: agregar carga de comprobantes en pedidos
fix: evitar envío duplicado del formulario
style: ajustar espaciado del hero en móvil
perf: cargar scripts del simulador solo donde se necesitan
content: actualizar textos de la página de servicios
docs: documentar proceso de despliegue
```

## Ramas

```text
feature/carga-comprobantes
feature/nueva-home
fix/menu-movil
refactor/permisos-usuarios
```

## GitHub Desktop

1. Kilo trabaja/crea commits locales.
2. Revisa en GitHub Desktop.
3. `Push origin` cuando corresponda.
4. Para equipo, usa PRs en features estructurales.
