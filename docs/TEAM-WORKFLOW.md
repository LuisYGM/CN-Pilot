# Flujo de trabajo del equipo

El onboarding individual está en [Empieza aquí](START-HERE.md). Este documento cubre únicamente continuidad y colaboración del equipo.

## Proyecto compartido

Si el proyecto usa Git, haz Pull y comprueba la rama. En todos los casos, revisa `PROJECT.md`, `STATE.md`, `DECISIONS.md`, `REQUIREMENTS.md` y `docs/ARTIFACTS.md` según la tarea antes de modificar archivos.

## Trabajo en funcionalidades

Para features estructurales:

- Con Git: branch → implementación → checkpoint → push manual → Pull Request → review → merge.
- Sin Git: implementación → verificación de archivos → entrega local; no se inicializa Git automáticamente.

## Mejoras del Blueprint

Una mejora general descubierta en un proyecto debe aplicarse y probarse en el repositorio maestro del Blueprint. El maintainer la incorpora a una release y actualiza versión/`CHANGELOG.md` cuando corresponda; los proyectos existentes no se actualizan silenciosamente.
