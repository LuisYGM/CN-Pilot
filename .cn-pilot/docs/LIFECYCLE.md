# Ciclo de vida del proyecto

Fases disponibles:

1. Discovery
2. Requirements
3. Architecture
4. Content
5. Design
6. Frontend/Prototype
7. Development
8. Handoff
9. CMS Integration
10. QA
11. Staging
12. Acceptance
13. Deployment
14. Maintenance

No todos los proyectos pasan por todas. Cada flujo empieza y termina donde lo determine el alcance del repositorio.

En cualquier fase se conserva la misma interfaz human-first: lenguaje natural, inspección antes de preguntar y preguntas progresivas solo ante vacíos materiales. Onboarding no intenta decidir todo el trabajo futuro. Consulta [Human-First Interaction & Progressive Context](HUMAN-INTERACTION.md) como guía transversal.

## Destinos en proyectos greenfield

- Inputs proporcionados → `project-resources/` (no modificar ni publicar por defecto).
- Outputs auxiliares del proceso —contenido, diseño, arquitectura, specs, ADRs y auditorías— → `project-artifacts/`, on-demand, separado del runtime.
- Implementación/runtime → `product/`, con la estructura nativa del stack, para Greenfield y Existing importado al workspace.
- Project Context y controles → archivos canónicos en raíz.

Registrar estos destinos no crea carpetas. `project-artifacts/` y `product/` se materializan solo cuando comienza el trabajo correspondiente. Existing importado conserva su layout interno bajo `product/`; si la fuente está en `project-resources/source/`, es solo original/input y una tarea explícita prepara una copia activa. Existing repository adoptado con contratos operativos puede documentar el root real como `Existing compatibility exception`, preservándolo sin migración automática. Código top-level de workspace CN Pilot sin esos contratos queda `Pending normalization/migration`, no se convierte por defecto en product root.

Una adopción/migración autorizada a `product/` no termina hasta comprobar que la working implementation esté en el root activo correcto; se preservó su estructura; entry points, imports, assets y referencias relevantes funcionan; `PROJECT.md` refleja la ubicación (y `ARTIFACTS.md` incluye el producto si es significativo); la source location anterior ya no se necesita para runtime/edición; y no quedan referencias obsoletas. Si la migración dejó un directorio anterior vacío, elimínalo solo dentro de la misma operación, tras verificar cero archivos y que no tenga otra función. Nunca elimines directorios no vacíos/desconocidos ni originales de `project-resources/`; resuelve explícitamente cualquier residuo necesario o no clasificado antes de declarar completa la adopción.

## Flujo parcial y puntos de entrega

`Content → Design → Frontend/Prototype → Handoff → CMS Integration → Deployment`

Todas las etapas son opcionales. La plataforma objetivo no determina el punto final: WordPress + Bricks puede terminar en HTML y handoff manual o incluir implementación mediante MCP. Un proyecto custom puede terminar en HTML/CSS/JS y un plugin WordPress puede desarrollarse localmente para instalación posterior.

Dentro de un proyecto, cada entregable puede tener un destino diferente. Por ejemplo, páginas corporativas pueden terminar en diseño/HTML para maquetación manual, artículos en contenido local para publicación mediante MCP y un plugin custom en desarrollo local completo.

## Sistema existente

Empieza por inspeccionar la implementación vigente y sus fuentes de verdad. Omite discovery, arquitectura, UI/UX, frontend o cualquier otra fase que no aporte valor a la tarea concreta.

## Proyecto completo
`Discovery → Requirements → Architecture → Content → Design → Development → QA → Staging → Acceptance → Production → Maintenance`

## Páginas visualmente importantes

Para landings, páginas comerciales, páginas corporativas importantes y otras interfaces con alta fidelidad requerida, aplica proporcionalmente:

`Final Content → Creative Direction → High-Fidelity Prototype → Human Visual Approval → Builder-native Implementation → Visual Fidelity Pass → Visual Parity QA → Human Visual QA → Publish`

Para diseño visual high-fidelity de páginas/interfaces web, el prototype evaluable es HTML/CSS/JS responsive bajo `project-artifacts/design/pages/`; Markdown puede explicar Creative Direction, nunca sustituirlo. Una preview pedida en navegador sigue siendo Design Artifact. En Existing conserva el sistema aprobado; no estrenes una dirección visual por buscar novedad.

La transición Design → Implementation se decide con el alcance ya confirmado: si incluye diseño y desarrollo, una aprobación visual inequívoca satisface el gate y se continúa sin reconfirmar; si era solo diseño, la aprobación cierra en Design; si no puede inferirse, se pregunta una vez sobre la intención humana de desarrollar. Pedir una preview no es trigger de implementación. `product/` significa implementación, no producción publicada; `deployment` mantiene su autorización independiente.

No es obligatorio para cambios pequeños, mantenimiento, cambios de texto, correcciones simples, pequeñas modificaciones CSS ni páginas sin prototipo solicitado. Sin referencia visual aprobada no se exige Visual Parity QA; sin representación visual fiable se informa que Technical QA está completo y Visual QA queda pendiente.

## Límite funcional del prototipo

Un `High-Fidelity Prototype` valida principalmente visual, responsive, estados e interacción UX; no implica una implementación completa de producción. Por defecto, HTML/CSS/JS puede usar estados locales, mock data, validación simulada y comportamiento ligero, mientras integraciones, persistencia, backend, APIs, autenticación, pagos, servicios externos y notificaciones se difieren a la implementación final.

Si una interacción es esencial para validar UX, puede incluir lógica local determinista. Una petición explícita de funcionalidad real autoriza implementarla dentro del scope. El handoff conserva diseño, estados, interacción, responsive y UX, pero la plataforma final decide la implementación productiva sin reutilizar infraestructura provisional por defecto.

Cuando exista un plugin SEO activo y sus capabilities estén disponibles, añade al flujo SEO: inspección actual → metadata autorizada → análisis real del plugin → corrección de checks relevantes → reanálisis → reporte de checks pendientes. No se modifica copy aprobado ni se fuerzan puntuaciones a costa de UX o naturalidad.

## Mantenimiento
`Current state → risk / evidence → specialist diagnosis as needed → authorized change or recovery → affected-surface verification → current state / next action`

Es proporcional: un microcambio localizado conocido sigue `DIRECT`; incidents, planned maintenance, cambios materiales de producción y recovery coordinan entorno, evidencia, autorización y recuperación con `maintenance-operations`. Baseline read-only, deploy y specialist reviews siguen sus capabilities propias; no se ejecutan por rutina.

## Funcionalidad estructural
`Requirements → Architecture → Feature branch si se justifica → Implementation → Tests → Independent review → Checkpoint → Staging`
