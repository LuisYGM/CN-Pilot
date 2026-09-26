# Flujo de trabajo de Git

## Principios

- Conventional Commits.
- Descripción siempre en español.
- Mensaje basado en `git diff`.
- Un commit = unidad lógica.
- Kilo puede crear commits locales.
- Push bajo aprobación humana.

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
