# Artefactos del proyecto

> Este archivo registra los artefactos creados específicamente para este proyecto.
> La infraestructura heredada del Blueprint se documenta en [`MANIFEST.md`](../MANIFEST.md).

Forma parte del contexto operativo y no se registra a sí mismo como artefacto. Tampoco incluye normalmente `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` ni archivos internos irrelevantes.

## Formato

Organiza los artefactos por categorías que existan realmente en el proyecto, como Contenido (incluida `content/strategy/` cuando se cree estrategia editorial/search), Diseño, Implementación frontend, Plugins, Arquitectura o Handoff. La carpeta de estrategia es un destino válido, no obligatorio.

Las evaluaciones durables pueden registrarse como Auditorías en `docs/audits/<scope>/`: informe y cobertura de un alcance/muestra concretos, no estado global del proyecto. Los templates de `templates/seo/` son Blueprint Core y no se registran como auditorías reales. No crees la categoría/carpeta hasta que exista un entregable; `STATE.md` mantiene estado operativo y las decisiones aprobadas permanecen en `DECISIONS.md`.

Formato recomendado por categoría:

| Artefacto | Estado | Propósito |
| --- | --- | --- |

Usa la ruta canónica como artefacto. Si responsabilidad u origen aportan información material, puede añadirse una columna breve; nunca se utiliza para etiquetar contenido como generado por IA.

## Estados

- `Draft`
- `Review`
- `Approved`
- `Implemented`
- `Published`
- `Deprecated`

No todos los artefactos necesitan estado ni deben recorrer la secuencia completa; si una categoría no lo necesita, la columna puede omitirse. Si una implementación también fue verificada mediante QA, puede anotarse de forma breve cuando aporte valor, sin ampliar innecesariamente el catálogo.

## Reglas

- Mantener únicamente artefactos significativos del proyecto.
- No crear categorías vacías ni conservar filas de ejemplo.
- No añadir fechas, hashes, tamaños ni historial de cambios.
- No convertir este archivo en un changelog o sistema de project management.
- No duplicar `MANIFEST.md` ni el contenido de los entregables.
- No registrar archivos internos irrelevantes ni marcar archivos como generados por IA.
- Mantener el mapa legible en pocos segundos.

## Actualización

Actualiza el registro únicamente cuando aparece o desaparece un artefacto significativo, se mueve o renombra, cambia materialmente su propósito o cambia de estado de forma relevante. Una edición menor de contenido o código no requiere modificar este archivo.
