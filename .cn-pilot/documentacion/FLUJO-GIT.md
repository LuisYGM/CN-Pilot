# Flujo de trabajo de Git

Git ayuda a conservar historial y colaborar, pero no es requisito para usar CN Pilot. Sin Git, se trabaja y verifica por archivos; no se inicializa un repositorio por inferencia. El flujo individual recomendado cuando ya hay Git es:

`main → trabajar → verificar → commit local → push manual cuando corresponda`

Commit local y push son acciones distintas. Un commit puede formar parte del cierre verificado; **push no es automático**. Branch, PR, tag o GitHub Release se usan cuando aportan un motivo concreto.

## Principios

- Conventional Commits.
- Descripción siempre en español.
- Mensaje basado en `git diff`.
- Un commit = unidad lógica.
- Kilo puede crear commits locales.
- Jefe de proyecto crea el commit local automáticamente cuando una tarea con cambios queda completa y verificada, salvo exclusión explícita o error bloqueante.
- Push bajo aprobación humana.

## Flujo individual por defecto

Para trabajo secuencial de una persona, `main` representa normalmente el estado actual y estable del proyecto:

```text
main → trabajar → verificar → commit local → push manual cuando corresponda
```

Las ramas son opcionales y no se crean ni recomiendan por defecto. Úsalas cuando exista una razón concreta: trabajo simultáneo, cambios grandes o de alto riesgo que requieran aislamiento, experimentos descartables, Pull Requests, desarrollo paralelo o una solicitud explícita.

El commit debe agrupar una unidad lógica completa/verificada; revisa el diff y stagea solo archivos de esa unidad. Usa Conventional Commits con prefijo técnico y descripción en español, por ejemplo:

```text
docs: actualizar guía de inicio
fix: corregir envío duplicado del formulario
```

No uses `reset --hard`, `clean`, `stash` ni acciones destructivas como atajo para resolver cambios manuales.

## Paralelismo con worktrees

BF-062 mantiene SERIAL por defecto. Si varias unidades son independientes y su integración resulta rentable, Jefe de proyecto puede usar worktrees nativos de Agent Manager; los writers deben tener branches/checkouts distintos y un único writer por worktree. Una sesión Local o un `task` no aísla writers. Estabiliza contratos compartidos y un `git status`/base HEAD conocido antes de repartir trabajo. Limita a dos unidades por defecto y tres como máximo bajo independencia clara. Integra una por vez, verifica el diff/tests afectados y conserva worktrees dirty; nunca uses `git stash`, `reset --hard` ni `git clean` para resolver colisiones.

## Comandos del CN Pilot

- `/commit` requiere un repositorio Git; sin Git informa que no aplica y no inicializa uno.
- `/punto-control` verifica siempre, pero solo crea commit si Git existe.
- `/nuevo-proyecto`, `/revision`, `/entrega` y `/preparar-despliegue` funcionan también sin Git.
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

`.cn-pilot-version` es la versión SemVer distribuible del Core, pero no debe cambiar con cada commit de desarrollo. Cada cambio del Core que se distribuya a proyectos existentes requiere bump SemVer; un cambio interno no obliga por sí mismo a publicar versión. `CAMBIOS.md` se actualiza para cambios relevantes, no para cada modificación menor. No se crean tags ni GitHub Releases automáticamente. Consulta [Actualizaciones de CN Pilot Core](ACTUALIZACIONES.md) para `/cn-estado`, `/cn-actualizar`, manifest, bootstrap y ownership.
