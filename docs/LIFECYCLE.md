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

No es obligatorio para cambios pequeños, mantenimiento, cambios de texto, correcciones simples, pequeñas modificaciones CSS ni páginas sin prototipo solicitado. Sin referencia visual aprobada no se exige Visual Parity QA; sin representación visual fiable se informa que Technical QA está completo y Visual QA queda pendiente.

Cuando exista un plugin SEO activo y sus capabilities estén disponibles, añade al flujo SEO: inspección actual → metadata autorizada → análisis real del plugin → corrección de checks relevantes → reanálisis → reporte de checks pendientes. No se modifica copy aprobado ni se fuerzan puntuaciones a costa de UX o naturalidad.

## Mantenimiento
`Request → Classification → Specialist → Verification → Checkpoint`

## Funcionalidad estructural
`Requirements → Architecture → Feature branch si se justifica → Implementation → Tests → Independent review → Checkpoint → Staging`
