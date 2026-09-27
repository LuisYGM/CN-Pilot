# Web Project Blueprint — Especificación V1

**Versión:** `1.0.0-draft`

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

## Principio local-first y modo de entrega

El Blueprint prepara y versiona el trabajo localmente por defecto. La plataforma objetivo, el alcance del repositorio y el modo de entrega son dimensiones independientes: un destino WordPress, Bricks, Elementor o WooCommerce no implica automáticamente implementación dentro de esa plataforma.

Cada proyecto define hasta dónde llega el repositorio y cómo se entrega cada artefacto: trabajo manual posterior, integración/MCP opcional o implementación completa desde el repositorio. Diferentes entregables pueden tener destinos distintos. El núcleo no depende de ningún proveedor o MCP; si una integración no está disponible o queda fuera de alcance, se produce un handoff completo y el flujo se detiene en el punto acordado.

`/new-project` inicializa una sola vez el contexto de cada repositorio creado desde el Blueprint; no significa «crear una web nueva». Puede describir trabajo nuevo o un sistema existente y debe preservar como fuente de verdad la implementación vigente que corresponda.

## Capas de configuración

El repositorio separa convenciones universales, configuración específica compartible del proyecto, configuración local del desarrollador, secretos y templates opcionales. `config/responsive.json` es la fuente versionada para responsive de proyectos nuevos; los proyectos existentes conservan sus breakpoints salvo migración aprobada.

Los MCPs y workflows de deployment no se activan por defecto. Sus ejemplos viven bajo `templates/` y solo se integran cuando el alcance los confirma. `kilo.jsonc` puede versionar configuración MCP no sensible; credenciales, tokens y ajustes locales permanecen fuera de Git. Consulta `docs/CONFIGURATION.md`.

## Convención de idioma

La estructura técnica permanece en inglés: archivos, carpetas, agentes, skills, workflows, profiles, capabilities, claves internas, tecnologías y valores consumidos por el sistema. La documentación y el contenido destinados a personas se generan en español por defecto. Si un proyecto define explícitamente otro idioma de trabajo, se adapta el contenido humano sin traducir identificadores técnicos.

## Arquitectura conceptual

```text
PROJECT
→ PROFILE
→ CAPABILITIES
→ TASK CLASSIFICATION
→ RISK
→ AGENT
→ SKILL
→ WORKFLOW
→ ACCEPTANCE CRITERIA
→ DEFINITION OF DONE
→ REVIEW
→ GIT CHECKPOINT
```

## Perfiles

- `wordpress-site`
- `woocommerce`
- `wordpress-plugin`
- `custom-web`
- `landing-page`
- `maintenance`
- `content-site`

El perfil define contexto y capacidades disponibles; no obliga a ejecutar todo el flujo.

## Agentes

- **Dev Lead:** coordina, clasifica, evalúa riesgo y delega.
- **Architect:** arquitectura, dependencias, migraciones y planes.
- **Content / SEO:** sitemap, copy, blog, metadata e intención.
- **UI/UX Designer:** layouts, componentes, responsive y sistema visual.
- **Developer:** backend, PHP, WordPress, WooCommerce, APIs y datos.
- **Frontend / Builder:** HTML/CSS/JS, responsive, Bricks y Elementor.
- **Reviewer:** revisión independiente.

## Permisos

Las reglas por patrón se ordenan de lo específico a lo general porque Kilo aplica la primera coincidencia. Cada agente tiene `allow` en su área habitual, `ask` fuera cuando una edición puede ser legítima y `deny` para secretos, Core del Blueprint que no le corresponde y operaciones peligrosas. Reviewer permanece en lectura y verificación.

## Niveles de trabajo

### DIRECT
Cambio pequeño, localizado y reversible. Modifica solo los archivos estrictamente necesarios y sigue un flujo ligero, sin Architect, Reviewer completo, branch ni documentación adicional, salvo que el riesgo lo justifique.

`identificar → modificar lo mínimo → verificar → commit local automático según la política Git`

### TASK
Cambio acotado con lógica o impacto. Una TASK rutinaria de bajo riesgo no requiere Reviewer independiente por defecto.

`especialista → verificación básica proporcional → inspección del diff → commit local automático`

Reviewer completo se reserva para una TASK con riesgo o impacto suficiente, criterios de aceptación relevantes, seguridad, pagos, autenticación, datos o integraciones sensibles, o una razón concreta de Dev Lead.

### STRUCTURAL
Cambio importante, de arquitectura o riesgo alto.

`requirements → architecture → plan → branch → implementación incremental → tests → review → checkpoint → staging → acceptance → production`

La fase de planificación produce un artefacto versionado cuando la especificación, arquitectura, plan o criterios vayan a utilizarse posteriormente. «No escribir código todavía» no impide persistir documentación; solo una instrucción explícita de no modificar el repositorio evita escribirla. Las especificaciones de funcionalidades van en `docs/features/`, la arquitectura transversal en `docs/architecture/` y las decisiones aprobadas en `DECISIONS.md` o `docs/decisions/`. Una planificación completa y verificada crea su commit local automático y nunca hace push.

El flujo reutiliza análisis, tests y reviews todavía válidos, evita verificaciones duplicadas y reserva margen antes de Reviewer para recibir hallazgos, corregir, probar y cerrar. Si una sesión debe continuar, recupera el estado vigente y ejecuta únicamente el trabajo pendiente.

## Autonomía técnica

Las decisiones que cambian alcance o arquitectura, afectan producción/datos, crean contratos públicos, son costosas de revertir, implican materialmente seguridad/privacidad/negocio, dependen del criterio visible o comercial del usuario o presentan tradeoffs importantes requieren aprobación. Los detalles internos, convencionales, reversibles, de bajo riesgo y derivables del contexto se resuelven autónomamente aunque no hayan sido especificados.

## Reviewer y Agent Manager

Reviewer permanece independiente, de solo lectura y verificación. Para una revisión que bloquea el siguiente paso se usa preferentemente un subagente `task` en primer plano; Agent Manager/worktrees se reservan para aislamiento real o trabajo independiente. La solicitud exige un informe conciso, priorizado y accionable, sin polling ni repetición completa tras cada corrección si basta una revisión incremental.

Las sesiones separadas de Agent Manager tienen transcript y ciclo de vida propios; no existe garantía del Blueprint de entregar un resultado a una sesión padre ya terminada. Si el informe sigue accesible, se reutiliza.

El cleanup distingue cuatro estados: sesión finalizada, worktree desregistrado de Git, carpeta física eliminada y carpeta huérfana no registrada. Dev Lead solo declara la limpieza completada después de verificar ausencia de cambios, consultar `git worktree list`, usar mecanismos seguros, ejecutar `git worktree prune` cuando corresponda y volver a comprobar el listado y la ruta. Nunca elimina automáticamente un worktree con cambios no confirmados ni una carpeta huérfana cuya eliminación segura no pueda demostrar. Si Kilo no expone control suficiente, reporta el estado real y la limpieza pendiente en lugar de editar `.kilo/agent-manager.json` o fingir automatización.

## Riesgo

Complejidad y riesgo se evalúan por separado. Un cambio pequeño puede elevarse si afecta producción, DB, autenticación, pagos, DNS, servidor o información sensible.

## Criterios de aceptación

TASK y STRUCTURAL deben convertir requisitos en condiciones verificables cuando aporte valor.

## Madurez de decisiones arquitectónicas

Architect distingue, cuando sea relevante, hechos confirmados, restricciones, supuestos, recomendaciones provisionales y decisiones aprobadas. Si una incógnita pendiente puede cambiar materialmente la arquitectura, la propuesta permanece `PROVISIONAL` e indica razones, alternativas, tradeoffs, información pendiente y qué debe confirmarse antes de implementar.

Cuando requisitos y restricciones son suficientes, Architect puede recomendar con claridad y avanzar. Developer no convierte una recomendación provisional en código si persisten puntos bloqueantes. `DECISIONS.md` y los ADRs se reservan para decisiones aprobadas o suficientemente establecidas.

En WordPress se evalúan primero las capacidades disponibles en Core y el stack existente antes de añadir almacenamiento, infraestructura o dependencias custom; la elección considera, según aplique, volumen, consultas, lifecycle, ownership, retención, relaciones, rendimiento, duplicación, mantenibilidad y portabilidad.

## Memoria del proyecto

- `PROJECT.md`: contexto relativamente estable.
- `STATE.md`: estado operativo breve. Solo cambia materialmente ante variaciones en el trabajo actual, bloqueos, siguiente paso, rama activa o checkpoints relevantes; no por cambios rutinarios de metadata, idioma, stack, requisitos, contenido o configuración.
- `DECISIONS.md`: decisiones importantes.
- `REQUIREMENTS.md`: requisitos.
- `docs/features/`: specs funcionales.
- `docs/architecture/`: documentación de arquitectura.
- `docs/decisions/`: ADRs.

## Onboarding de proyectos

`/new-project` se ejecuta una sola vez para inicializar el contexto del repositorio; no equivale a crear una web nueva. Debe inspeccionar primero las reglas, la versión del Blueprint, las plantillas de contexto y la implementación existente. La primera ronda será breve y natural: preguntará solo los temas previstos que sigan faltando y nunca repetirá información inferida con fiabilidad.

El sistema inferirá si se parte de un proyecto nuevo o existente, objetivo, plataforma/stack, alcance del repositorio, punto y modo de entrega, fuentes de verdad y destinos distintos por entregable. Marcará como `Pending` lo desconocido sin convertir estos conceptos en un formulario técnico para el usuario.

Antes de editar, presentará un resumen simple y centrado en el proyecto: trabajo previsto, propósito y público, stack conocido, qué se preparará en el repositorio, hasta dónde llegará, cómo continuará después y pendientes relevantes. No expondrá archivos, categorías, reglas internas ni la distinción entre hechos e inferencias salvo que sean útiles para una decisión del proyecto. La única confirmación será «¿Inicializo el proyecto con esta información?» y una respuesta simple bastará; Dev Lead distribuirá después la información internamente entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`.

`DECISIONS.md` solo registrará decisiones importantes con alternativas razonables, que condicionen la arquitectura o el desarrollo futuro, sean costosas de cambiar o hayan sido decididas explícitamente por el usuario. Requisitos, páginas, alcance y workflow no son decisiones automáticamente. Las reglas operativas se aplican internamente y no se trasladan al usuario para recordarlas o confirmarlas. El onboarding no desarrolla páginas, componentes ni funcionalidades. Tras revisar el diff y el estado Git, si hay cambios válidos y la inicialización quedó terminada y verificada, crea automáticamente el commit local `chore: inicializar proyecto`, salvo las exclusiones generales de la política Git; nunca hace push.

## Contenido

`content/` puede actuar como fuente versionada para voz de marca, sitemap, metadata y enlazado. Las páginas se guardan en `content/pages/` y los artículos en `content/blog/`. No usar Lorem Ipsum si existe contenido real o puede prepararse.

## Diseño

`design/` puede contener design system, componentes, specs y enlaces/IDs de Figma. Los diseños de páginas se guardan en `design/pages/` y las referencias en `design/references/`.

Si los permisos impiden escribir una ruta canónica, se reporta el bloqueo y no se reubica el artefacto en otra carpeta.

## Git

- Dev Lead crea automáticamente un commit local por defecto cuando una tarea modificó archivos y quedó totalmente terminada y verificada; no pregunta al usuario si quiere hacerlo.
- No crea commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario lo prohibió explícitamente.
- Conventional Commits.
- Descripciones siempre en español.
- Mensajes basados en el diff real.
- Stage limitado a la unidad lógica relacionada.
- Nunca hace push automático.
- Operaciones destructivas bloqueadas.

## Versionado

SemVer:

- PATCH: correcciones compatibles.
- MINOR: capacidades compatibles.
- MAJOR: cambios estructurales/incompatibles.

Cada proyecto conserva `.blueprint-version`.

## Entornos

Cuando aplique:

- local;
- staging;
- production.

La autonomía disminuye al aumentar el riesgo.

## Despliegue

`preflight → backup/checkpoint → deploy manifest → deploy → smoke test`

Si falla: `rollback`.

## Pruebas

Pruebas proporcionales: syntax, lint, unit, integration, browser/e2e, smoke, responsive y accessibility cuando correspondan.

## Seguridad

Considerar según aplique: sanitización, escaping, auth, capabilities, nonce/CSRF, XSS, SQL, uploads, REST/AJAX, secretos y exposición de datos.

## Ciclo de vida

`Content → Design → Frontend/Prototype → Handoff → CMS Integration → Deployment`

Las fases son puntos posibles de entrega, no una secuencia obligatoria. Un flujo puede empezar o terminar en cualquiera de ellas y omitir las demás. En sistemas existentes se inspecciona primero la implementación actual y solo se activan las fases necesarias. El destino puede variar por entregable dentro del mismo proyecto.

## Principio de contexto

El Blueprint puede ser completo sin cargarlo entero en cada tarea. Los agentes deben usar solo archivos, skills y documentación relevantes; evitar releer lo ya analizado, rehacer razonamientos correctos del especialista, delegar sin necesidad o activar reviews sin beneficio.

## Criterio de éxito

Otro desarrollador debe poder clonar el repo, entender contexto/estado/decisiones y continuar trabajando sin depender del ordenador o memoria del creador.

## Regla final

Si una regla, documento, agente, skill o workflow no aporta valor proporcional a la tarea, no debe activarse.
