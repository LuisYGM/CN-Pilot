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

## Flujo individual por defecto

Para trabajo secuencial de una persona, `main` representa normalmente el estado actual y estable del proyecto:

```text
main → trabajar → verificar → commit local → push manual cuando corresponda
```

Las ramas son opcionales y no se crean ni recomiendan por defecto. Úsalas cuando exista una razón concreta: trabajo simultáneo, cambios grandes o de alto riesgo que requieran aislamiento, experimentos descartables, Pull Requests, desarrollo paralelo o una solicitud explícita.

## Comandos del CN Pilot

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

Las ramas, Pull Requests, tags y GitHub Releases son herramientas opcionales. No son pasos obligatorios del flujo normal ni se crean para cada cambio, parche o versión. Los tags y releases se reservan para hitos importantes, entregas públicas o versiones que el usuario quiera congelar y documentar especialmente.

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
4. Para trabajo individual, permanecer en `main` es válido y preferido cuando no exista una razón para aislar cambios.
5. Para equipo, usa ramas y PRs cuando aporten aislamiento, revisión o coordinación.

## Versiones y CHANGELOG

`.cn-pilot-version` identifica la generación/base del CN Pilot, pero no debe cambiar con cada commit. `CHANGELOG.md` se actualiza para cambios relevantes, no para cada modificación menor. No es necesario crear un tag o una GitHub Release para cada cambio de versión; ambos son opcionales y dependen de un hito o una decisión explícita.
