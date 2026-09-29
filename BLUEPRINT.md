# Web Project Blueprint — Especificación V1

**Versión:** `1.0.1`

Documento de referencia para maintainers del Blueprint. Un usuario nuevo debe empezar por [`docs/START-HERE.md`](docs/START-HERE.md); no necesita leer esta especificación para trabajar.

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

## Principio local-first y modo de entrega

El Blueprint prepara el trabajo localmente por defecto y lo versiona cuando Git está disponible. La plataforma objetivo, el alcance del repositorio y el modo de entrega son dimensiones independientes: un destino WordPress, Bricks, Elementor o WooCommerce no implica automáticamente implementación dentro de esa plataforma.

Cada proyecto define hasta dónde llega el repositorio y cómo se entrega cada artefacto: trabajo manual posterior, integración/MCP opcional o implementación completa desde el repositorio. Diferentes entregables pueden tener destinos distintos. El núcleo no depende de ningún proveedor o MCP; si una integración no está disponible o queda fuera de alcance, se produce un handoff completo y el flujo se detiene en el punto acordado.

`/new-project` inicializa una sola vez el contexto de cada carpeta de proyecto creada desde el Blueprint; no significa «crear una web nueva». Puede describir trabajo nuevo o un sistema existente y debe preservar como fuente de verdad la implementación vigente que corresponda.

## Capas de configuración

El repositorio separa convenciones universales, configuración específica compartible del proyecto, configuración local del desarrollador, secretos y templates opcionales. `config/responsive.json` es la fuente versionada para responsive de proyectos nuevos; los proyectos existentes conservan sus breakpoints salvo migración aprobada.

Los MCPs y workflows de deployment no se activan por defecto. El ejemplo de configuración MCP por proyecto vive en `.kilocode/mcp.example.json`; la configuración activa `.kilocode/mcp.json` permanece local e ignorada por Git. `kilo.jsonc` conserva configuración general compartible sin secretos. Consulta `docs/CONFIGURATION.md`.

## Capas de archivos y artefactos

- **Blueprint Core:** infraestructura heredada y reusable. `MANIFEST.md` describe esta capa y no los entregables del proyecto.
- **Project Context:** memoria operativa (`PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md`) y su índice de artefactos.
- **Project Artifacts:** entregables reales creados para el proyecto, conservados en sus rutas canónicas sin carpetas artificiales ni etiquetas permanentes de origen IA.

`docs/ARTIFACTS.md` existe como registro base vacío y se convierte en el mapa legible de Project Artifacts. Se organiza solo con categorías presentes y estados simples cuando aportan valor. Se actualiza ante altas, bajas, movimientos o cambios materiales de estado/propósito, no por cada edición interna. Funciona mediante inspección de archivos con o sin Git.

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
→ OPTIONAL GIT CHECKPOINT
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

`identificar → modificar lo mínimo → verificar → commit local automático si Git existe`

### TASK
Cambio acotado con lógica o impacto. Una TASK rutinaria de bajo riesgo no requiere Reviewer independiente por defecto.

`especialista → verificación básica proporcional → inspección de cambios → commit local automático si Git existe`

Reviewer completo se reserva para una TASK con riesgo o impacto suficiente, criterios de aceptación relevantes, seguridad, pagos, autenticación, datos o integraciones sensibles, o una razón concreta de Dev Lead.

### STRUCTURAL
Cambio importante, de arquitectura o riesgo alto.

`requirements → architecture → plan → branch si aplica → implementación incremental → tests → review → checkpoint → staging → acceptance → production`

La fase de planificación produce un artefacto persistido cuando la especificación, arquitectura, plan o criterios vayan a utilizarse posteriormente. «No escribir código todavía» no impide persistir documentación; solo una instrucción explícita de no modificar la carpeta del proyecto evita escribirla. Las especificaciones de funcionalidades van en `docs/features/`, la arquitectura transversal en `docs/architecture/` y las decisiones aprobadas en `DECISIONS.md` o `docs/decisions/`. Una planificación completa y verificada crea su commit local si Git existe; sin Git queda guardada localmente.

El flujo reutiliza análisis, tests y reviews todavía válidos, evita verificaciones duplicadas y reserva margen antes de Reviewer para recibir hallazgos, corregir, probar y cerrar. Si una sesión debe continuar, recupera el estado vigente y ejecuta únicamente el trabajo pendiente.

## Autonomía técnica

Las decisiones que cambian alcance o arquitectura, afectan producción/datos, crean contratos públicos, son costosas de revertir, implican materialmente seguridad/privacidad/negocio, dependen del criterio visible o comercial del usuario o presentan tradeoffs importantes requieren aprobación. Los detalles internos, convencionales, reversibles, de bajo riesgo y derivables del contexto se resuelven autónomamente aunque no hayan sido especificados.

## Filosofía creativa y conversacional

El Blueprint opera como un equipo senior: pregunta únicamente por contexto o restricciones materiales, investiga cuando aporta valor, propone soluciones y decide profesionalmente la ejecución dentro del alcance. No exige que el usuario entregue contenido y diseño completos ni convierte las fases creativas en formularios.

Content/SEO distingue propuestas creativas de hechos empresariales. Puede construir arquitectura de contenidos, narrativa, copy, CTAs, metadata, enlaces y estrategia SEO, pero nunca inventa datos materiales. UI/UX deriva una dirección original del contexto, puede investigar referencias sin copiarlas y evita usar por defecto una estética corporativa genérica. Frontend conserva la intención visual, responsive, estados e interacciones del diseño.

Dev Lead infiere tres niveles internos de fidelidad:

- `Structural`: valida arquitectura, contenido, layout y comportamiento.
- `Visual`: propuesta visual completa, coherente y presentable.
- `Implementation reference`: resultado acabado para guiar fielmente una implementación posterior.

Estas etiquetas no forman un formulario para el usuario. Antes de alta fidelidad se evalúa si faltan datos materiales. Un proyecto real recibe únicamente preguntas indispensables; uno ficticio o exploratorio puede autorizar en una sola pregunta la creación de marca, contenido, identidad y assets conceptuales. No se degrada silenciosamente el nivel pedido.

## Reviewer y Agent Manager

Reviewer permanece independiente, de solo lectura y verificación. Para una revisión que bloquea el siguiente paso se usa preferentemente un subagente `task` en primer plano; Agent Manager/worktrees se reservan para aislamiento real o trabajo independiente. La solicitud exige un informe conciso, priorizado y accionable, sin polling ni repetición completa tras cada corrección si basta una revisión incremental.

`task` es también el mecanismo predeterminado para delegar trabajo que forma parte de la tarea actual y no requiere branch, worktree, filesystem aislado ni una conversación top-level separada. Agent Manager no se usa automáticamente para paralelizar; Dev Lead lo reserva para aislamiento real, alternativas concurrentes, trabajo realmente independiente o una sesión top-level separada. Antes de abrirlo evalúa si un subagente `task` es suficiente.

La estrategia de modelos es **economical/balanced by default, escalate on demand**. La configuración concreta de proveedor, modelo y variante es local y el Blueprint solo define la capacidad recomendada. Un tier superior se activa temporalmente para complejidad o riesgo concreto —por ejemplo arquitectura difícil, debugging, seguridad, autenticación, pagos, migraciones críticas o revisión de alto riesgo— y después se vuelve al baseline económico/balanceado. No se recomienda fijar permanentemente el modelo más potente a Dev Lead, Architect, Reviewer u otro agente.

Por defecto no se abren más de dos sesiones Agent Manager pagadas simultáneamente. Si más de dos aportan un beneficio real, Dev Lead solicita confirmación antes de iniciarlas. Como una sesión puede heredar el modelo de quien la crea, la herencia debe revisarse desde el punto de vista de coste y no asumirse adecuada automáticamente.

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
- `STATE.md`: estado operativo breve. Solo cambia materialmente ante variaciones en el trabajo actual, bloqueos, siguiente paso, rama activa si aplica o checkpoints relevantes; no por cambios rutinarios de metadata, idioma, stack, requisitos, contenido, configuración o ausencia de Git.
- `DECISIONS.md`: decisiones importantes.
- `REQUIREMENTS.md`: requisitos.
- `docs/features/`: specs funcionales.
- `docs/architecture/`: documentación de arquitectura.
- `docs/decisions/`: ADRs.
- `docs/ARTIFACTS.md`: índice de entregables reales del proyecto.

## Onboarding de proyectos

`/new-project` se ejecuta una sola vez para inicializar el contexto de la carpeta del proyecto; no equivale a crear una web nueva. Debe inspeccionar primero las reglas, la versión del Blueprint, las plantillas de contexto y la implementación existente. La primera ronda será breve y natural: preguntará solo los temas previstos que sigan faltando y nunca repetirá información inferida con fiabilidad.

El sistema inferirá si se parte de un proyecto nuevo o existente, objetivo, plataforma/stack, alcance del repositorio, punto y modo de entrega, fuentes de verdad y destinos distintos por entregable. Marcará como `Pending` lo desconocido sin convertir estos conceptos en un formulario técnico para el usuario.

Antes de editar, presentará un resumen simple y centrado en el proyecto: trabajo previsto, propósito y público, stack conocido, qué se preparará en el repositorio, hasta dónde llegará, cómo continuará después y pendientes relevantes. No expondrá archivos, categorías, reglas internas ni la distinción entre hechos e inferencias salvo que sean útiles para una decisión del proyecto. La única confirmación será «¿Inicializo el proyecto con esta información?» y una respuesta simple bastará; Dev Lead distribuirá después la información internamente entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`.

`DECISIONS.md` solo registrará decisiones importantes con alternativas razonables, que condicionen la arquitectura o el desarrollo futuro, sean costosas de cambiar o hayan sido decididas explícitamente por el usuario. Requisitos, páginas, alcance y workflow no son decisiones automáticamente. Las reglas operativas se aplican internamente y no se trasladan al usuario para recordarlas o confirmarlas. El onboarding no desarrolla páginas, componentes ni funcionalidades. Tras verificar los archivos, si Git existe revisa status/diff y crea el commit local `chore: inicializar proyecto`; sin Git finaliza correctamente sin commit.

## Contenido

`content/` puede actuar como fuente versionada para voz de marca, sitemap, metadata y enlazado. Las páginas se guardan en `content/pages/` y los artículos en `content/blog/`. No usar Lorem Ipsum si existe contenido real o puede prepararse.

## Diseño

`design/` puede contener design system, componentes, specs y enlaces/IDs de Figma. Los diseños de páginas se guardan en `design/pages/` y las referencias en `design/references/`.

Si los permisos impiden escribir una ruta canónica, se reporta el bloqueo y no se reubica el artefacto en otra carpeta.

## Convenciones estructurales de maquetación

La validez técnica no equivale a calidad de implementación. Las interfaces deben conservar una estructura nativa, semántica, editable y mantenible en el stack de destino, además de renderizar correctamente.

La convención general es conceptual y no obliga a añadir wrappers innecesarios:

```text
Section / región semántica
→ Container de layout
  → Block / unidad lógica o celda
    → Contenido
```

- `Section` agrupa una región visual o conceptual.
- `Container` es la capa principal de layout. Usa CSS Grid cuando deba distribuir múltiples unidades en una composición bidimensional y Flex cuando el contenido siga un flujo lineal sencillo; la intención del layout prevalece sobre un sistema obligatorio.
- `Block` representa una celda del grid, una unidad lógica o una agrupación con sentido propio. Los widgets y elementos finales viven normalmente directamente dentro del Block.
- El contenido puede ser un widget, elemento HTML, media, texto, acción u otro elemento nativo del destino.

Una Section utiliza un solo Container por defecto. Solo se añaden Containers hermanos cuando existen regiones de layout independientes que requieren grids o sistemas de layout diferentes; no se crea un Container por cada heading, párrafo, fuente o CTA si forman parte de la misma composición. Grid distribuye múltiples unidades de layout; Flex resuelve flujos lineales sencillos y no debe sustituirse por Grid solo para cumplir una convención.

Los wrappers auxiliares, incluidos `Div`, son válidos únicamente cuando tienen una función justificable: agrupar widgets, alinear elementos, crear un micro-layout, resolver responsive interno, interacción o una unidad visual interna. No se persiguen métricas artificiales de cero wrappers ni se aceptan wrappers por defecto.

En HTML y custom themes se aplica el mismo principio aprovechando `section`, `article`, `header`, `nav`, `aside` y otros elementos semánticos apropiados. Se evitan `div soup`, selectores dependientes de profundidad accidental y conversiones masivas que sacrifiquen editabilidad o mantenibilidad.

En builders visuales, antes de implementar se descubren y respetan los elementos nativos, jerarquía recomendada, responsive, design system y convenciones existentes. La apariencia visual por sí sola no valida la implementación: cuando una referencia HTML/CSS no puede convertirse conservando estructura, estilos, responsive y editabilidad, se prefiere una reconstrucción nativa e incremental.

El QA estructural valida también el árbol de elementos, semántica, responsabilidad de Containers, uso lógico de Blocks, wrappers justificados, sistema de layout, editabilidad, mantenibilidad y convenciones del proyecto. Cuando una integración expone schemas, se consultan antes de usar settings desconocidos (`schema-first`). Las interfaces complejas mediante MCP/API se construyen preferentemente como `crear → releer → verificar → continuar`; tras cualquier fallo, timeout o reconexión se relee primero el recurso para determinar qué persistió y continuar desde el último estado válido, sin repetir escrituras a ciegas.

## Flujo visual de alta fidelidad

Para landings, páginas comerciales o corporativas importantes y otras interfaces donde se requiera alta fidelidad, aplica proporcionalmente:

```text
Final Content → Creative Direction → High-Fidelity Prototype
→ Human Visual Approval → Builder-native Implementation
→ Visual Fidelity Pass → Visual Parity QA → Human Visual QA → Publish
```

No es obligatorio para cambios pequeños, mantenimiento, cambios de texto, correcciones simples, pequeñas modificaciones CSS ni páginas sin prototipo solicitado. El contenido final o aprobado es la fuente editorial: se puede reorganizar y presentar visualmente, pero no inventar claims, datos, headings comerciales, microcopy ni reescribir el mensaje sin autorización. La libertad creativa de presentación no equivale a libertad editorial.

Un prototipo HTML/CSS de alta fidelidad representa composición, fondos, tamaños, max-width, spacing, tipografía, imágenes, botones, bordes, tratamientos editoriales y responsive esperado. Tras su aprobación es la fuente visual de verdad. La implementación debe trasladar esos detalles, no solo contenido, imágenes y columnas. `Structurally valid` no equivale a `visually faithful`.

La prioridad de implementación es `native settings → clean structure → minimal scoped CSS when necessary`. CSS local es válido para detalles aprobados que el builder no resuelva razonablemente, siempre que esté scoped, no afecte recursos globales y no sustituya una arquitectura correcta. No se optimizan métricas artificiales como cero CSS, cero Divs, un Container obligatorio o cien por cien native.

Visual Parity QA compara proporciones, widths, whitespace, prominencia de imágenes, escala tipográfica, botones, relaciones de columnas, posiciones, spacing, ritmo y composición con la referencia aprobada. Human Visual QA en navegador no se sustituye por render MCP, fragmentos de contenido, inspección del árbol o integridad técnica; si falta una representación visual fiable, se informa `Technical QA complete; Visual QA pending`. No se exigen estas fases sin referencia visual aprobada y no se mantienen iteraciones de microajustes de bajo retorno indefinidamente.

Para proyectos nuevos, `clamp(min-px, fluid-vw, max-px)` es una preferencia útil para tipografía y spacing fluidos, no un dogma; en proyectos existentes prevalece la convención vigente. Responsive QA valida también jerarquía, orden, spacing, tipografía, proporciones de imagen, colapso del layout, botones, legibilidad y ritmo visual.

## Límite funcional del prototipo

`High-fidelity prototype` no equivale a `production-complete implementation`. Un prototipo debe hacer que el diseño se vea real, responda correctamente y se comporte de forma suficiente para validar UX: presentación, responsive, estados e interacción ligera. Por defecto difiere integraciones productivas, persistencia, backend, servicios externos, autenticación, pagos, email, webhooks, APIs y lógica de producción hasta la implementación final.

En formularios, búsqueda, filtros, login, checkout, newsletter, booking y patrones similares se permiten campos, labels, estados, validación visual, loading, success/error, resultados mock, selección, pasos, calendario o lógica local cuando ayuden a validar UX. No se implementan por defecto envío real, CRM, SMTP, gateways, reservas, sesiones, base de datos, backend, APIs ni servicios externos. `prototype interaction` no equivale a `production functionality`.

Si una calculadora, configurador, simulador, selector dependiente, comparador o flujo condicional es esencial para evaluar UX, puede usar local state, JavaScript simple, lógica determinista y mock data. Antes de añadir API, persistence, backend o integración de terceros, se comprueba que pertenezca a la fase y al scope; una petición explícita de funcionalidad real permite implementarla dentro del alcance autorizado. No se crea infraestructura temporal para simularla si una simulación local basta.

El prototipo aprobado es fuente de diseño, estados, interacción esperada, comportamiento visual, responsive y UX. La implementación final resuelve la funcionalidad una sola vez con el stack real —por ejemplo, un formulario visual puede pasar a una integración nativa de WordPress— y no copia automáticamente la infraestructura técnica provisional del prototipo.

## Lifecycle de capabilities y SEO

Las capabilities MCP son dinámicas. Tras instalar o activar plugins, módulos, licencias, integraciones, servidores o configuraciones, se debe reconectar o refrescar, repetir Discovery y actualizar la comprensión de capabilities antes de declarar una limitación. Prioriza `specialized capability → safe generic capability → low-level workaround only when justified`; capacidad de lectura no implica capacidad de escritura, y capacidad técnica no amplía el scope autorizado. Cuando aporte valor, documenta de forma ligera `capability → provider → read/write → scope → risk`.

No hardcodees un builder, plugin o proveedor como requisito del Core: una integración puede exponer elementos, updates, revisions, templates, components, global classes, variables, Theme Styles, design context, import/export o render. Descubre lo realmente disponible y elige la capability específica y segura. Una tool de importación HTML/CSS debe evaluarse en entorno seguro por estructura nativa, editabilidad, wrappers, clases globales, responsive, fidelidad y mantenibilidad; `import successful` no equivale a implementación builder-native limpia.

Las escrituras sobre el mismo recurso remoto que use revisiones, digests, tokens de estado u optimistic concurrency son secuenciales por defecto: `write → reread → verify state/digest → next write`. Ante timeout, reset, conflicto o respuesta incierta: `reconnect → reread → determine what persisted → identify last valid state → continue`; nunca hagas blind retry.

Cuando exista un plugin SEO activo y sus capabilities estén disponibles, el QA SEO debe inspeccionar el estado actual, escribir metadata autorizada, ejecutar el análisis real del plugin, corregir checks relevantes y volver a analizar. El objetivo es la puntuación práctica más alta sin keyword stuffing, contenido antinatural, deterioro de UX ni modificación no autorizada del copy aprobado. Un score es una señal, no una métrica absoluta. Slugs publicados, indexación, schema destructivo y contenido aprobado requieren cautela adicional.

## Security QA basado en riesgo

`security review != universal mandatory audit` y `security review != security theater`. Activa `security-review` según datos, superficie expuesta, privilegios, autenticación, integraciones, capacidad de escritura, entorno e impacto. Auth, autorización, APIs, uploads, formularios con datos reales, persistencia, plugins, WooCommerce, pagos, webhooks, secretos e integraciones sensibles requieren revisión focalizada; copy, CSS trivial y frontend sin superficie sensible normalmente no. Los hallazgos deben distinguir evidencia confirmada, riesgo probable y hardening, y mantener validación/authorization, least privilege, fallbacks seguros y protección de secretos sin añadir scanners o gates universales.

## Git

- Git es una capacidad opcional: el Blueprint funciona en carpetas sin Git, repositorios locales y repositorios con GitHub u otros remotos.
- Sin Git se omiten comandos, ramas, hashes, worktrees y commits; se verifican los archivos directamente y la ausencia no se trata como bloqueo.
- El Blueprint nunca ejecuta `git init` salvo solicitud explícita o alcance confirmado.
- Cuando Git existe, Dev Lead crea automáticamente un commit local por defecto cuando una tarea modificó archivos y quedó totalmente terminada y verificada; no pregunta al usuario si quiere hacerlo.
- Para trabajo individual y secuencial, el flujo por defecto es `main → trabajar → verificar → commit local → push manual cuando corresponda`; `main` representa normalmente el estado actual y estable del proyecto.
- Las ramas son opcionales: solo se crean cuando existe una razón concreta de colaboración, aislamiento por riesgo, experimento descartable, Pull Request, desarrollo paralelo o solicitud explícita. No son necesarias para mantenimiento, documentación, mejoras pequeñas o trabajo individual normal.
- No crea commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario lo prohibió explícitamente.
- Conventional Commits.
- Descripciones siempre en español.
- Mensajes basados en el diff real.
- Stage limitado a la unidad lógica relacionada.
- Nunca hace push automático.
- Los tags y GitHub Releases son opcionales y no se crean ni recomiendan para cada parche, commit o cambio de versión. `.blueprint-version` identifica la generación/base del Blueprint y no tiene que cambiar con cada commit; `CHANGELOG.md` se actualiza para cambios relevantes.
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
