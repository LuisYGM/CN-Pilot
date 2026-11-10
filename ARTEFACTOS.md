# Artefactos del proyecto

> Índice breve de entregables significativos de este proyecto; no es inventario de todos los archivos. Jefe de proyecto lo actualiza cuando un entregable aparece, se mueve o cambia materialmente de estado/propósito.
> La infraestructura de CN Pilot Core se documenta en [`.cn-pilot/MANIFIESTO.md`](.cn-pilot/MANIFIESTO.md).

Forma parte del contexto operativo y no se registra a sí mismo como artefacto. Tampoco incluye normalmente `PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md` ni archivos internos irrelevantes.

## Formato

Organiza los artefactos significativos de todo el proyecto —sin limitar el índice a `artefactos/`— por categorías que existan realmente, como Contenido (`artefactos/contenido/`, incluida su `estrategia/` cuando exista), Diseño (`artefactos/diseno/`), Implementación frontend/producto (`producto/`), Plugins, Arquitectura o Handoff. Registra también otros entregables reales cuando aporte valor; la ubicación bajo `artefactos/` no es requisito para ser indexable.

Las evaluaciones durables pueden registrarse como auditorías en `artefactos/documentacion/auditorias/<scope>/`: informe y cobertura de un alcance/muestra concretos, no estado global del proyecto. Las plantillas de `.cn-pilot/plantillas/seo/` son CN Pilot Core y no se registran como auditorías reales. No crees la categoría/carpeta hasta que exista un entregable; `ESTADO.md` mantiene estado operativo y las decisiones aprobadas permanecen en `DECISIONES.md`. Los recursos originales de `recursos/` no se registran como artefactos.

Formato recomendado por categoría:

| Artefacto | Estado | Propósito |
| --- | --- | --- |

Usa la ruta canónica como artefacto, o un destino externo verificable sin secretos si el formato nativo lo requiere y el acceso está autorizado. Si responsabilidad u origen aportan información material, puede añadirse una columna breve; nunca se utiliza para etiquetar contenido como generado por IA. Relaciona cada output con el entregable de `PROYECTO.md` cuando haya varios; distingue fuente editable de exportación si afecta su uso. No registres un entregable futuro como archivo existente.

## Estados

- `Draft`
- `Review`
- `Approved`
- `Implemented`
- `Published`
- `Deprecated`

No todos los artefactos necesitan estado ni deben recorrer la secuencia completa; si una categoría no lo necesita, la columna puede omitirse. Si una implementación también fue verificada mediante QA, puede anotarse de forma breve cuando aporte valor, sin ampliar innecesariamente el catálogo.

Estado y aprobación son individuales: `Approved` exige evidencia/decisión con scope, no implica aprobar otros outputs, QA técnico ni publicar. Referencia `DECISIONES.md` o la fuente de aprobación cuando aporte autoridad durable, sin copiarla. Los bloqueos operativos y próximos pasos viven en `ESTADO.md`; dependencias y destinos estables en el registro de `PROYECTO.md`.

## Reglas

- Mantener únicamente artefactos significativos del proyecto.
- No crear categorías vacías ni conservar filas de ejemplo.
- No añadir fechas, hashes, tamaños ni historial de cambios.
- No convertir este archivo en un changelog o sistema de project management.
- No duplicar `.cn-pilot/MANIFIESTO.md` ni el contenido de los entregables.
- No limitar el índice a `artefactos/`: puede incluir implementación/producto significativo bajo `producto/` u otros entregables reales.
- No registrar CN Pilot Core, contexto del proyecto, recursos originales de `recursos/`, caches, dependencias ni placeholders.
- No registrar archivos internos irrelevantes ni marcar archivos como generados por IA.
- Mantener el mapa legible en pocos segundos.

## Actualización

Actualiza el registro únicamente cuando aparece o desaparece un artefacto significativo, se mueve o renombra, cambia materialmente su propósito o cambia de estado de forma relevante. Una edición menor de contenido o código no requiere modificar este archivo.
