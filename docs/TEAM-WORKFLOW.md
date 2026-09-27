# Flujo de trabajo del equipo

## Proyecto nuevo

1. Crear repo desde GitHub Template o copiar el Blueprint a una carpeta local.
2. Clonar con GitHub Desktop si el proyecto utiliza Git/GitHub.
3. Abrir en VS Code.
4. Configurar proveedor personal en Kilo.
5. Ejecutar `/new-project`.
6. Trabajar. La ausencia de Git no bloquea este flujo.

## Proyecto compartido

Antes de trabajar: Pull, leer PROJECT/STATE/DECISIONS y comprobar rama.

## Trabajo en funcionalidades

Para features estructurales:

- Con Git: branch → implementación → checkpoint → push manual → Pull Request → review → merge.
- Sin Git: implementación → verificación de archivos → entrega local; no se inicializa Git automáticamente.

## Mejoras del Blueprint

Una mejora general descubierta en un proyecto debe aplicarse y probarse en el repositorio maestro del Blueprint, incrementando versión/CHANGELOG. Los proyectos existentes no se actualizan silenciosamente.
