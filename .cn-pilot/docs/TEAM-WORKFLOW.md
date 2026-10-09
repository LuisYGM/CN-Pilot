# Flujo de trabajo del equipo

El onboarding individual está en [Empieza aquí](START-HERE.md). Este documento cubre únicamente continuidad y colaboración del equipo.

## Proyecto compartido

Si el proyecto usa Git, haz Pull y comprueba la rama. En todos los casos, revisa `PROJECT.md`, `STATE.md`, `DECISIONS.md`, `REQUIREMENTS.md` y `ARTIFACTS.md` según la tarea antes de modificar archivos.

## Trabajo en funcionalidades

Para trabajo individual y secuencial, usa normalmente:

`main → implementación → verificación → commit local → push manual cuando corresponda`

Las ramas son opcionales. Para features estructurales o trabajo compartido:

- Con Git, cuando la colaboración o el riesgo lo justifique: branch → implementación → checkpoint → push manual → Pull Request → review → merge.
- Sin Git: implementación → verificación de archivos → entrega local; no se inicializa Git automáticamente.

Tags y GitHub Releases son opcionales y se reservan para hitos, entregas públicas o versiones que el usuario quiera congelar y documentar especialmente.

## Mejoras del CN Pilot

Una mejora general descubierta en un proyecto debe aplicarse y probarse en el repositorio maestro del CN Pilot. El maintainer la incorpora a una release y actualiza versión/`CHANGELOG.md` cuando corresponda; los proyectos existentes no se actualizan silenciosamente.
