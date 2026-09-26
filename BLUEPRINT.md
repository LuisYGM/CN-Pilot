# Web Project Blueprint — Especificación V1

**Versión:** `1.0.0-draft`

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

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

## Niveles de trabajo

### DIRECT
Cambio pequeño, localizado y reversible.

`identificar → modificar → verificar → commit si corresponde`

### TASK
Cambio acotado con lógica o impacto.

`analizar → especialista → implementar → tests proporcionales → review proporcional → checkpoint`

### STRUCTURAL
Cambio importante, de arquitectura o riesgo alto.

`requirements → architecture → plan → branch → implementación incremental → tests → review → checkpoint → staging → acceptance → production`

## Riesgo

Complejidad y riesgo se evalúan por separado. Un cambio pequeño puede elevarse si afecta producción, DB, autenticación, pagos, DNS, servidor o información sensible.

## Acceptance Criteria

TASK y STRUCTURAL deben convertir requisitos en condiciones verificables cuando aporte valor.

## Memoria del proyecto

- `PROJECT.md`: contexto relativamente estable.
- `STATE.md`: estado operativo breve.
- `DECISIONS.md`: decisiones importantes.
- `REQUIREMENTS.md`: requisitos.
- `docs/features/`: specs importantes.
- `docs/decisions/`: ADRs.

## Onboarding de proyectos

La inicialización debe inspeccionar primero las reglas, la versión del Blueprint, las plantillas de contexto y la implementación existente. La primera ronda será breve y natural: preguntará solo los temas previstos que sigan faltando y nunca repetirá información inferida con fiabilidad. El sistema inferirá el contexto disponible y marcará como `Pending` lo desconocido, sin pedir al usuario que decida dónde o cómo guardarlo.

Antes de editar, presentará un resumen simple y centrado en el proyecto: qué se construirá, propósito y público, stack conocido, alcance inicial y pendientes relevantes. No expondrá archivos, categorías, reglas internas ni la distinción entre hechos e inferencias salvo que sean útiles para una decisión del proyecto. La única confirmación será «¿Inicializo el proyecto con esta información?» y una respuesta simple bastará; Dev Lead distribuirá después la información internamente entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`.

`DECISIONS.md` solo registrará decisiones importantes con alternativas razonables, que condicionen la arquitectura o el desarrollo futuro, sean costosas de cambiar o hayan sido decididas explícitamente por el usuario. Requisitos, páginas, alcance y workflow no son decisiones automáticamente. Las reglas operativas se aplican internamente y no se trasladan al usuario para recordarlas o confirmarlas. El onboarding no desarrolla páginas, componentes ni funcionalidades. Tras revisar diff y estado Git, puede crear únicamente el commit local `chore: inicializar proyecto`; nunca hará push.

## Contenido

`content/` puede actuar como fuente versionada para voz de marca, sitemap, páginas, artículos, metadata y enlazado. No usar Lorem Ipsum si existe contenido real o puede prepararse.

## Diseño

`design/` puede contener design system, componentes, specs, referencias y enlaces/IDs de Figma.

## Git

- Conventional Commits.
- Descripciones siempre en español.
- Mensajes basados en el diff real.
- Unidades lógicas.
- Push bajo aprobación humana por defecto.
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

## Deploy

`preflight → backup/checkpoint → deploy manifest → deploy → smoke test`

Si falla: `rollback`.

## Testing

Pruebas proporcionales: syntax, lint, unit, integration, browser/e2e, smoke, responsive y accessibility cuando correspondan.

## Seguridad

Considerar según aplique: sanitización, escaping, auth, capabilities, nonce/CSRF, XSS, SQL, uploads, REST/AJAX, secretos y exposición de datos.

## Ciclo de vida

`Discovery → Architecture → Content → Design → Development → QA → Staging → Acceptance → Production → Maintenance`

No todos los proyectos usan todas las fases.

## Principio de contexto

El Blueprint puede ser completo sin cargarlo entero en cada tarea. Los agentes deben usar solo archivos, skills y documentación relevantes.

## Criterio de éxito

Otro desarrollador debe poder clonar el repo, entender contexto/estado/decisiones y continuar trabajando sin depender del ordenador o memoria del creador.

## Regla final

Si una regla, documento, agente, skill o workflow no aporta valor proporcional a la tarea, no debe activarse.
