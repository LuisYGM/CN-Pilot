# Web Project Blueprint — Especificación V1

**Versión:** `1.0.0-draft`

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

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

La inicialización debe inspeccionar primero las reglas, la versión del Blueprint, las plantillas de contexto y la implementación existente. La primera ronda será breve y natural: preguntará solo los temas previstos que sigan faltando y nunca repetirá información inferida con fiabilidad. El sistema inferirá el contexto disponible y marcará como `Pending` lo desconocido, sin pedir al usuario que decida dónde o cómo guardarlo.

Antes de editar, presentará un resumen simple y centrado en el proyecto: qué se construirá, propósito y público, stack conocido, alcance inicial y pendientes relevantes. No expondrá archivos, categorías, reglas internas ni la distinción entre hechos e inferencias salvo que sean útiles para una decisión del proyecto. La única confirmación será «¿Inicializo el proyecto con esta información?» y una respuesta simple bastará; Dev Lead distribuirá después la información internamente entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`.

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

`Discovery → Architecture → Content → Design → Development → QA → Staging → Acceptance → Production → Maintenance`

No todos los proyectos usan todas las fases.

## Principio de contexto

El Blueprint puede ser completo sin cargarlo entero en cada tarea. Los agentes deben usar solo archivos, skills y documentación relevantes; evitar releer lo ya analizado, rehacer razonamientos correctos del especialista, delegar sin necesidad o activar reviews sin beneficio.

## Criterio de éxito

Otro desarrollador debe poder clonar el repo, entender contexto/estado/decisiones y continuar trabajando sin depender del ordenador o memoria del creador.

## Regla final

Si una regla, documento, agente, skill o workflow no aporta valor proporcional a la tarea, no debe activarse.
