# CN Pilot Core — Especificación V1.2

**Versión:** `1.2.0`

Documento de referencia para maintainers del CN Pilot. Un usuario nuevo debe empezar por [`docs/START-HERE.md`](docs/START-HERE.md); no necesita leer esta especificación para trabajar.

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

## Principio local-first y modo de entrega

El CN Pilot prepara el trabajo localmente por defecto y lo versiona cuando Git está disponible. La plataforma objetivo, el alcance del repositorio y el modo de entrega son dimensiones independientes: un destino WordPress, Bricks, Elementor o WooCommerce no implica automáticamente implementación dentro de esa plataforma.

Cada proyecto define hasta dónde llega el repositorio y cómo se entrega cada artefacto: trabajo manual posterior, integración/MCP opcional o implementación completa desde el repositorio. Diferentes entregables pueden tener destinos distintos. El núcleo no depende de ningún proveedor o MCP; si una integración no está disponible o queda fuera de alcance, se produce un handoff completo y el flujo se detiene en el punto acordado.

`/new-project` inicializa una sola vez el contexto de cada carpeta de proyecto creada desde el CN Pilot; no significa «crear una web nueva». Puede describir trabajo nuevo o un sistema existente y debe preservar como fuente de verdad la implementación vigente que corresponda.

## Capas de configuración

El repositorio separa Core portable en `.cn-pilot/`, rutas técnicas requeridas por herramientas, contexto mutable, inputs del proyecto y código/artefactos. `.cn-pilot/config/responsive.json` es la fuente versionada para responsive de proyectos nuevos; los proyectos existentes conservan sus breakpoints salvo migración aprobada.

Los MCPs y workflows de deployment no se activan ni distribuyen por defecto. Ante una solicitud explícita, prepara la configuración MCP local con base en el servidor, capability y configuración real; no se crea durante `/new-project`, no se leen/escriben archivos MCP protegidos ni se solicitan secretos. Si se solicita GitHub Actions y el método/destino están definidos y autorizados, crea un workflow específico para el proyecto. Los triggers automáticos requieren autorización independiente. `kilo.jsonc` conserva únicamente configuración general compartible sin secretos. Consulta `.cn-pilot/docs/CONFIGURATION.md`.

## Capas de archivos y artefactos

- **CN Pilot Core:** infraestructura interna reusable en `.cn-pilot/`, junto a ubicaciones técnicas como `.kilo/`, `.github/`, `AGENTS.md` y `kilo.jsonc`. `.cn-pilot/MANIFEST.md` describe esta capa.
- **Project Context:** `README.md`, memoria operativa (`PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md`) y el índice raíz `ARTIFACTS.md`.
- **Project input:** materiales recibidos bajo `project-resources/`; son input, no producción ni output.
- **Project Artifacts:** outputs auxiliares reales bajo `project-artifacts/` en greenfield; container y subcarpetas on-demand, creados solo al aparecer el primer artefacto, sin README-placeholder ni `.gitkeep`.
- **Product:** implementación/runtime activo administrado en el workspace bajo `product/` para Greenfield y Existing importado; el stack define el layout interno nativo, separado de supporting artifacts. Solo un Existing repository operativo adoptado puede conservar un product root real fuera del container como excepción documentada.

## Contrato de payload del template

La rama predeterminada `main` es el payload distribuible del template. Cada archivo versionado debe tener una función real para el proyecto derivado o el Core que recibe: operación de CN Pilot, bootstrap que se transforma al inicializar, Project Context limpio, configuración portable, catálogo Core reusable o aviso legal aplicable. El catálogo puede activarse solo cuando una tarea lo necesite; la distribución de la capacidad no precrea sus outputs.

El payload excluye expedientes detallados de revisión/validación del mantenedor, research y arquitectura interna del repositorio; el changelog conserva solo la evolución resumida del Core. Tampoco incluye datos propios de CN Pilot ni integraciones opcionales inactivas «por si acaso». No se configuran MCPs ni workflows de deployment durante `/new-project`: solo se materializan tras una tarea explícita y cuando alcance, configuración y autorización son suficientes. Triggers automáticos requieren intención y autorización explícitas.

## Frontera de licencias: Core, producto e inputs

`LICENSE` distribuye el CN Pilot Core/harness bajo GPL-3.0-or-later. El repositorio define qué parte propia ofrece CN Pilot como Core; no convierte automáticamente en GPL cualquier obra nueva que se guarde junto a él.

- **Core/harness:** los archivos propios de CN Pilot Core se distribuyen según `LICENSE`.
- **Producto y outputs:** código, diseño, contenido y assets nuevos creados por el usuario en `product/` o `project-artifacts/` no quedan cubiertos solo por usar el harness, sus agentes/instrucciones o compartir repositorio. Pueden tener una licencia propia cuando sean obras independientes y su autor tenga los derechos para decidirla. La carpeta, por sí sola, no prueba independencia.
- **Uso y distribución:** la GPL permite explotación comercial sujeta a sus términos cuando se distribuye material cubierto. Hacer/usar cambios privadamente sin transmitirlos a otros no obliga a publicarlos; si se distribuyen copias de obras cubiertas se aplican sus condiciones. El uso del mismo repositorio o publicar un servicio no resuelve por sí solo qué copias de código se entregan.
- **Inputs:** `project-resources/` conserva las licencias y derechos de sus fuentes originales.

La relación entre una obra concreta y código/texto protegido depende de su contenido, integración, procedencia y distribución. Estas reglas expresan el alcance previsto del Core y no son asesoría jurídica para un producto individual.

`ARTIFACTS.md` es el mapa legible de entregables significativos de todo el proyecto, no solo los ubicados bajo `project-artifacts/`: puede indexar outputs auxiliares, producto significativo bajo `product/` y otros entregables reales. No registra Core, Project Context, inputs originales, caches, dependencias ni placeholders. Se organiza solo con categorías presentes y estados simples cuando aportan valor. Se actualiza ante altas, bajas, movimientos o cambios materiales de estado/propósito, no por cada edición interna, inspeccionando archivos con o sin Git.

## Repository root y product boundary

La raíz del repositorio CN Pilot no es el product root canónico ni el destino habitual de outputs generados. En los workspaces Greenfield y Existing importados regidos por el Repository Layout Contract, la implementación activa vive bajo `product/`; outputs auxiliares bajo `project-artifacts/`; inputs recibidos bajo `project-resources/`. Los containers pueden no existir: `/new-project` registra ubicaciones canónicas pero nunca los crea por sí solo. `product/` se crea al iniciar implementación/adopción explícita y `project-artifacts/` al producir el primer artefacto. El stack decide la estructura nativa dentro de `product/`, sin wrapper universal. No coloques código productivo, prototipos, documentos de arquitectura/specs/auditorías, copy, design systems ni reportes en repo root por rutina.

La raíz queda destinada principalmente a infraestructura técnica requerida, Project Context, `project-resources/` y, solo cuando existan, `project-artifacts/` y `product/`. Para greenfield, `content/`, `design/` y `docs/` de proyecto pertenecen bajo `project-artifacts/`; igual para outputs auxiliares de Existing importado. Esos mismos nombres dentro de `product/` pertenecen a la estructura nativa del producto y no colisionan. Existing importado al workspace se organiza con su producto activo bajo `product/`, sin capa `legacy-site/` salvo significado técnico real. Existing repository adoptado preserva el root operativo como excepción solo con evidencia material de contratos externos; registra modo, product root real y razón en `PROJECT.md`. Código o carpetas source top-level fuera de `product/` —p. ej. `legacy-site/`— sin esa evidencia quedan `Pending normalization/migration`: no los eleves a excepción por comodidad ni comiences implementación allí hasta resolverlo de forma segura. No muevas ninguna estructura durante onboarding.

Dentro de `product/`, la estructura depende del stack: puede alojar directamente un sitio estático o un proyecto framework, o contener una raíz interna como un plugin/theme WordPress. Una raíz interna/múltiples componentes solo se añaden si hay significado técnico o productos reales; un único sitio no se envuelve en `product/<slug>/` por rutina. El Repository Layout Contract de `PROJECT.md` registra por separado Product container, Product root(s) internos, entry points, public/static roots, comandos, artifact/build output, tests/harness y rutas generated/cache. Registra solo ubicaciones observadas/decididas; no exige crear carpetas. Una necesidad material demostrada de tooling/hosting o una `Existing compatibility exception` documentada con contratos operativos puede justificar un product root fuera de `product/`; registra ruta y evidencia en `PROJECT.md`, no inventes excepciones por costumbre.

Hay dos modos Existing. **Imported into CN Pilot workspace:** el CN Pilot es workspace y la implementación activa reside en `product/`; si el código está en `product/`, inspecciona y conserva su estructura interna. Si solo está en `project-resources/source/`, sigue siendo original/input, no active product: no lo edites ni copies durante onboarding; una tarea explícita de adopción prepara conscientemente la working copy en `product/` y preserva el original. Si aparece código o una carpeta source top-level fuera de `product/` sin contratos operativos, registra discrepancia `Pending normalization/migration`, no empieces implementación allí ni muevas nada durante onboarding. **Adopted operational repository:** se incorpora CN Pilot sobre un repositorio ya ligado materialmente a hosting/document root, CI/CD, imports, scripts, tooling, producción u otros paths externos. Preserva el product root observado (incluido `.`), documéntalo como `Existing compatibility exception` en `PROJECT.md` y continúa allí sin wrapper/migración automática. En ambos modos, alterar rutas requiere tarea explícita y evaluación de impacto. Una adopción autorizada a `product/` no termina hasta verificar working root, estructura interna, entry points, imports/assets/referencias, Project Context y que el source anterior no sea necesario ni queden refs obsoletas. El source container anterior se elimina solo si la misma migración verificada lo dejó vacío, con cero archivos y sin función independiente; no se borran no-vacíos, contenido desconocido ni originales de `project-resources/`. `project-artifacts/` no sustituye salidas existentes sin autorización. El producto no depende directamente de `project-resources/` ni de `project-artifacts/` salvo excepción material explícita.

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

En Kilo 7.8.1, las reglas por patrón verificadas aplican la última coincidencia: el fallback va antes de las excepciones. Tras editar permisos se comprueba su resolución en el runtime instalado, sin asumir que otras versiones o tools usan idéntica semántica. Cada agente tiene `allow` en su área habitual, `ask` fuera cuando una edición puede ser legítima y `deny` para secretos, Core del CN Pilot que no le corresponde y operaciones peligrosas. Reviewer permanece en lectura y verificación.

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

`requisitos → decisión arquitectónica si existe → plan compacto + gates/checkpoint inicial → implementación por batches → tests dirigidos y fixes → Reviewer si aplica → checks finales/cleanup → commit local → Done`

La fase de planificación produce un artefacto persistido cuando la especificación, arquitectura, plan o criterios vayan a utilizarse posteriormente. «No escribir código todavía» no impide persistir documentación; solo una instrucción explícita de no modificar la carpeta del proyecto evita escribirla. En greenfield, las especificaciones de funcionalidades van en `project-artifacts/docs/features/`, la arquitectura transversal en `project-artifacts/docs/architecture/`, los ADRs formales en `project-artifacts/docs/adr/`, las auditorías durables en `project-artifacts/docs/audits/` y las decisiones aprobadas ligeras en `DECISIONS.md`. Crea `project-artifacts/` y subcarpetas solo cuando exista el primer artefacto real; `product/docs/` pertenece a documentación interna del producto. En existentes preserva los destinos vigentes. Una planificación completa y verificada crea su commit local si Git existe; sin Git queda guardada localmente.

### Completion-Driven Execution & Recovery (BF-047)

Una tarea se reporta `COMPLETED` solo después de satisfacer todos los gates que aplican al scope: cambio y acceptance, pruebas proporcionales, Reviewer cuando corresponda, cleanup, contexto material, checks finales y commit local si el workflow lo requiere. Que no quede implementación no significa Done si hay Reviewer/cleanup/checks/commit pendientes. No fuerces gates en un DIRECT que no los necesita. Un stop de runtime, maximum steps, timeout, crash o herramienta interrumpida deja la tarea `INTERRUPTED / INCOMPLETE`, nunca `COMPLETED`, `VALIDATED` ni `APPROVED` sin evidencia.

Para una tarea `STRUCTURAL` o larga, Dev Lead prepara al inicio un plan compacto de objetivo, scope, paths probables, acceptance y gates. Reviewer si aplica, cleanup, checks finales y commit quedan reservados desde ese plan; no se aplazan para después de agotar la ejecución. Trabaja en batches coherentes, inspecciona una fuente una vez, agrupa operaciones independientes seguras, evita narraciones/handoffs largos, reutiliza resultados vigentes y prueba cambios afectados. Si una modificación no puede invalidar un test `PASS`, su estado permanece `PASS`; regresa solo tests con superficie/semántica realmente afectada. No repitas un test PASS para gastar presupuesto de ejecución en vez de un gate obligatorio.

Las tareas `STRUCTURAL`/largas mantienen un único checkpoint local en `.cn-pilot/runtime/active-task.json`; `.cn-pilot/runtime/` se ignora en Git. Se crea después del plan inicial y se actualiza solo en milestones materiales (plan, batches, test group, fallo/fix, Reviewer, cleanup, listo para commit), no por tool-call. Su JSON breve puede registrar `schemaVersion`, `taskId/title`, `ownerSessionId` o `subagentTaskIds` cuando existan, branch/HEAD, `status`, `phase`, objective/acceptance, gates con `PENDING/PASS/FAIL/BLOCKED` + resumen de evidencia y paths afectados, paths modificados, Reviewer/cleanup/commit y `nextAction`. No guarda secretos, credenciales, environment values, transcript completo ni razonamiento.

Estados de la tarea: `ACTIVE`, `INTERRUPTED`, `BLOCKED_HUMAN`, `BLOCKED_EXTERNAL`, `FAILED`, `COMPLETED`. Una caída puede dejar `ACTIVE` porque no hubo oportunidad de escribir `INTERRUPTED`; en una continuación, Dev Lead reconcilia ese estado con sesión/working tree antes de decidir. El checkpoint guía, no sustituye `git status`, HEAD o diff. Recovery empieza por verificar esos estados, conservar ediciones y conciliar solo diferencias relevantes; nunca usa reset/clean/restore destructivo. Continúa únicamente gates pendientes. Si una sesión nueva detecta trabajo pendiente y el mensaje es ambiguo/no relacionado, pregunta naturalmente si se termina primero o se deja pendiente; frases como «continúa» son suficientes para reanudar el mismo task. No uses `/doctor` como requisito de recovery.

Usa continuation nativa cuando la superficie actual la exponga: un child `task_id` retornado puede reanudarse mediante `task` sujeto a sesión/permisos; una sesión Agent Manager existente se retoma solo con su ID real verificado y mientras Kilo la mantenga disponible; el Kilo CLI actual documenta `kilo --continue`/`-c` para la última sesión del workspace, `--session` para ID y `kilo run --continue` para enviar follow-up ([CLI session continuation](https://kilo.ai/docs/code-with-ai/platforms/cli#session-continuation), [CLI reference](https://kilo.ai/docs/code-with-ai/platforms/cli-reference), [Agent Manager tasks](https://kilo.ai/docs/automate/agent-manager#task-subagents)). Verifica siempre el `--help`/versión instalada antes de instruir; `/continue` es alias nativo de CLI para `/sessions`, así que no crees slash command homónimo ni hace falta un comando CN Pilot adicional. El CLI instalado verificado expone también `--format json` (eventos raw) y exit codes genéricos, pero la documentación/interfaz actual no define una señal estable que discrimine interrupción por step limit de pregunta humana/error: `CLI AUTO-RESUME` queda `DEFERRED`. No implementes un loop por strings/texto/exit code ambiguo ni uses `--auto`, cambies permissions o evadas aprobaciones.

Al quedar `BLOCKED_HUMAN`/`BLOCKED_EXTERNAL`, conserva checkpoint y explica lo mínimo necesario. Al completar todos los gates, elimina el checkpoint activo. Solo los hechos/decisiones reutilizables pasan a Project Context según su ownership; nunca copies allí el registro runtime completo.

El flujo reutiliza análisis, tests y reviews todavía válidos, evita verificaciones duplicadas y reserva margen antes de Reviewer para recibir hallazgos, corregir, probar y cerrar. Si una sesión debe continuar, recupera el estado vigente y ejecuta únicamente el trabajo pendiente.

Cuando la implementación principal de una tarea larga esté completa y existan criterios suficientes, Dev Lead entra en `Completion Mode`: reconcilia el checkpoint ya abierto → verificación → Reviewer si el riesgo/scope lo requiere → correcciones relevantes → regresión focalizada → cleanup/final checks → commit local si corresponde → elimina el checkpoint → STOP. No inicia discovery, investigación opcional, refactors, features o QA no previsto por iniciativa propia; mejoras fuera de scope se reportan. Completion Mode no elimina pruebas o revisión requeridas. Una vez satisfechos aceptación y verificaciones, no continúa inspeccionando por seguridad subjetiva ni abre trabajo nuevo.

Asigna un owner principal por unidad lógica siempre que pueda completarla correctamente; cambia de owner solo por responsabilidad material distinta. La salida válida del especialista se considera contexto procesado: reanalizarla completa exige contradicción, evidencia insuficiente, riesgo material o cambio de estado relevante. Architect no es una estación automática de handoff.

## Autonomía técnica

Las decisiones que cambian alcance o arquitectura, afectan producción/datos, crean contratos públicos, son costosas de revertir, implican materialmente seguridad/privacidad/negocio, dependen del criterio visible o comercial del usuario o presentan tradeoffs importantes requieren aprobación. Los detalles internos, convencionales, reversibles, de bajo riesgo y derivables del contexto se resuelven autónomamente aunque no hayan sido especificados.

### Autonomía segura dentro del alcance aprobado (BF-053)

La autorización inequívoca de una tarea incluye su ejecución local rutinaria, esperable y reversible dentro del ownership del agente; no se solicitan aprobaciones humanas repetidas para editar/crear archivos o ejecutar QA normal. **AUTO**: local, in-scope, reversible/versionable, sin secretos ni efecto externo material. **ASK**: riesgo material, ambigüedad o efecto externo (incluidos dependencias, datos, producción y Git remoto), salvo autorización explícita que resuelva la decisión humana; no se repite una aprobación conceptual ya otorgada. **DENY**: invariantes protegidas, secretos, escalada de privilegios, edición del Reviewer, Git destructivo/force y superficies fuera del ownership autorizado. Si una capability nativa no permite restringir una herramienta de escritura por ruta, no se amplía globalmente para evitar prompts: conserva ASK o usa el owner/superficie con containment demostrable. El scope no autoriza por sí solo deploy, publicación ni acciones remotas.

En Kilo 7.8.8, responder `always` a una solicitud puede persistir los recursos `save` como regla de permiso a nivel de proyecto, no limitada a la tarea ni al agente; los file tools actuales piden guardar `edit: *`. Prefiere autorización de una sola llamada cuando una regla persistente ampliaría ownership; no uses `always` como atajo de fricción.

Si la implementación depende materialmente de comportamiento externo/versionado no demostrado localmente, detecta la versión/configuración real, plantea la cuestión concreta, consulta fuente primaria y prueba la conclusión en el proyecto. La skill `source-grounded-development` define el procedimiento; investigación no es un paso universal, `latest` no reemplaza lo instalado y documentación no sustituye prueba local.

## Filosofía creativa y conversacional

El CN Pilot opera como un equipo senior en lenguaje natural durante todo el ciclo de vida: inspecciona el contexto, infiere lo seguro, pregunta progresivamente solo por vacíos materiales, integra respuestas y continúa. No exige prompt engineering, vocabulario interno, contenido ni diseño completos; permite `Pending` no material y no convierte conversación en formulario. Dev Lead es el interlocutor normal y consolida las incertidumbres de los especialistas. El contexto solo se persiste ante un delta material bajo su fuente de verdad; la guía [`HUMAN-INTERACTION.md`](docs/HUMAN-INTERACTION.md) es canónica para materialidad, ownership y continuidad.

Content/SEO distingue propuestas creativas de hechos empresariales. Puede construir arquitectura de contenidos, narrativa, copy, CTAs, metadata, enlaces y estrategia SEO, pero nunca inventa datos materiales. UI/UX deriva una dirección visual de sector, producto, audiencia, posicionamiento, contenido, assets y uso; evita defaults no justificados y conserva el lenguaje aprobado de proyectos Existing. La paleta puede ser cualquier familia si está fundada; no existe un color prohibido ni una cuota de novedad. Frontend conserva la intención visual, responsive, estados e interacciones del diseño.

Ante una petición natural de diseño visual de página/interfaz web (por ejemplo, «quiero el diseño de la página de inicio»), si el trabajo crea una experiencia o sistema visual nuevo, BF-046 establece primero el UI Kit visual y su checkpoint de aprobación; una página high-fidelity comienza solo después. Sus páginas se entregan como HTML/CSS/JS con responsive real bajo `project-artifacts/design/pages/`; el usuario no necesita pedir HTML, UI Kit ni usar el término high-fidelity. Markdown puede documentar Creative Direction y complementar los artefactos visuales, nunca ser el único output cuando aplique alta fidelidad. No se entrega un render rasterizado en sustitución del HTML; los assets visuales siguen permitidos y el diseño en imagen/render se produce solo por petición. En runtime y comparación visual se prefiere evidencia estructural/directa; screenshots se reservan para condiciones visuales que lo requieran, no son logging o paso rutinario.

Mientras el diseño/prototipo espera Human Visual Approval, incluido cuando el usuario pide verlo o abrirlo como página responsive, su ownership permanece en Project Artifacts y no es runtime. `product/` recibe implementación solo después de aprobación visual y un trigger de desarrollo suficiente. No se pregunta si se desea convertir a HTML cuando el diseño high-fidelity ya fue solicitado.

Dev Lead infiere tres niveles internos de fidelidad:

- `Structural`: valida arquitectura, contenido, layout y comportamiento.
- `Visual`: propuesta visual completa, coherente y presentable.
- `Implementation reference`: resultado acabado para guiar fielmente una implementación posterior.

Estas etiquetas no forman un formulario para el usuario. Una solicitud natural de diseñar visualmente una página web infiere `Visual` por defecto salvo que el contexto/scope indique una especificación estructural o que el propio usuario limite el entregable. Antes de alta fidelidad se evalúa si faltan datos materiales. Un proyecto real recibe únicamente preguntas indispensables; uno ficticio o exploratorio puede autorizar en una sola pregunta la creación de marca, contenido, identidad y assets conceptuales. No se degrada silenciosamente el nivel pedido.

## Reviewer y Agent Manager

Reviewer permanece independiente, de solo lectura y verificación. Su revisión normal se limita al diff, criterios afectados, evidencia válida ya disponible y dependencias directas para probar hipótesis concretas. Emite hallazgos con evidencia/escenario/impacto y se detiene; cero hallazgos es un resultado completo. No ejecuta browser/screenshot, paridad visual, performance measurement, investigación web, auditorías generales ni suites aún válidas; una cuestión de especialidad se enruta aparte solo si Dev Lead determina que aplica. No busca refactors ni mejoras estilísticas no relacionadas.

Solo si un finding suyo `HIGH`/`CRITICAL` es materialmente bloqueante y aún discutible, Dev Lead puede abrir un único task fresco de Reviewer para intentar refutarlo y obtener `CONFIRMED`, `REFUTED` o `UNPROVEN`. No se verifican así hallazgos ya demostrados, notas ni severidades menores; no es una cadena ni un gate general.

Para una revisión que bloquea el siguiente paso se usa preferentemente un subagente `task` en primer plano; Agent Manager/worktrees se reservan para aislamiento real o trabajo independiente. La solicitud exige un informe conciso, priorizado y accionable, sin polling ni repetición completa tras cada corrección si basta una revisión incremental.

`task` es también el mecanismo predeterminado para delegar trabajo que forma parte de la tarea actual y no requiere branch, worktree, filesystem aislado ni una conversación top-level separada. Agent Manager no se usa automáticamente para paralelizar; Dev Lead lo reserva para aislamiento real, alternativas concurrentes, trabajo realmente independiente o una sesión top-level separada. Antes de abrirlo evalúa si un subagente `task` es suficiente.

El CN Pilot define workflow, responsabilidades, criterios de decisión y calidad; Kilo y la configuración del desarrollador definen proveedor, modelos, overrides y esfuerzo de razonamiento. La selección de IA está controlada por el usuario/entorno: Dev Lead decide cuándo delegar y a quién, pero no asigna modelos a subagentes. Todos los agentes y skills deben funcionar con proveedores y modelos distintos sin cambiar el proceso. Una dependencia concreta solo pertenece al proyecto si la exige realmente el producto o un requisito técnico. La calidad se evalúa mediante resultados, evidencia, QA y alcance, no por branding o versión del modelo. Mantén un enfoque cost-aware: usa la vía menos costosa que complete la tarea con fiabilidad, evitando agentes, iteraciones y trabajo duplicado innecesarios.

Por defecto no se abren más de dos sesiones Agent Manager pagadas simultáneamente. Si más de dos aportan un beneficio real, Dev Lead solicita confirmación antes de iniciarlas. El criterio es aislamiento, paralelismo real, complejidad, coste y utilidad; la selección de modelos permanece en Kilo/el entorno del desarrollador.

Las sesiones separadas de Agent Manager tienen transcript y ciclo de vida propios; no existe garantía del CN Pilot de entregar un resultado a una sesión padre ya terminada. Si el informe sigue accesible, se reutiliza.

El cleanup distingue cuatro estados: sesión finalizada, worktree desregistrado de Git, carpeta física eliminada y carpeta huérfana no registrada. Dev Lead solo declara la limpieza completada después de verificar ausencia de cambios, consultar `git worktree list`, usar mecanismos seguros, ejecutar `git worktree prune` cuando corresponda y volver a comprobar el listado y la ruta. Nunca elimina automáticamente un worktree con cambios no confirmados ni una carpeta huérfana cuya eliminación segura no pueda demostrar. Si Kilo no expone control suficiente, reporta el estado real y la limpieza pendiente en lugar de editar `.kilo/agent-manager.json` o fingir automatización.

## Riesgo

Complejidad y riesgo se evalúan por separado. Un cambio pequeño puede elevarse si afecta producción, DB, autenticación, pagos, DNS, servidor o información sensible.

`/doctor` diagnostica bajo demanda y en solo lectura la integridad local del Core, routing, permisos críticos e inventario del CN Pilot; no es un test del proyecto, no se ejecuta automáticamente ni repara.

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
- `project-artifacts/docs/features/`: specs funcionales greenfield.
- `project-artifacts/docs/architecture/`: arquitectura transversal greenfield.
- `project-artifacts/docs/adr/`: ADRs formales greenfield.
- `project-artifacts/docs/audits/`: informes durables greenfield.
- `ARTIFACTS.md`: índice de entregables reales del proyecto.

## Onboarding de proyectos

`/new-project` se ejecuta una sola vez para inicializar el contexto de la carpeta del proyecto; no equivale a crear una web nueva. Debe inspeccionar primero las reglas, la versión del CN Pilot, las plantillas de contexto y la implementación existente. Si hace falta preguntar, avanzará de forma progresiva con una pregunta natural breve o un grupo pequeño estrechamente relacionado; solo preguntará por gaps materiales aún sin resolver y no repetirá información inferida con fiabilidad. No exigirá que el usuario conozca o elija un stack técnico cuando no sea necesario todavía.

El sistema inferirá si se parte de un proyecto nuevo o existente, objetivo, plataforma/stack, alcance del repositorio, punto y modo de entrega, fuentes de verdad y destinos distintos por entregable. Marcará como `Pending` lo desconocido sin convertir estos conceptos en un formulario técnico para el usuario.

Antes de editar, presentará un resumen simple y centrado en el proyecto: trabajo previsto, propósito y público, stack conocido, qué se preparará en el repositorio, hasta dónde llegará, cómo continuará después y pendientes relevantes. No expondrá archivos, categorías, reglas internas ni la distinción entre hechos e inferencias salvo que sean útiles para una decisión del proyecto. La única confirmación será «¿Inicializo el proyecto con esta información?» y una respuesta simple bastará; Dev Lead distribuirá después la información internamente entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`.

`DECISIONS.md` solo registrará decisiones importantes con alternativas razonables, que condicionen la arquitectura o el desarrollo futuro, sean costosas de cambiar o hayan sido decididas explícitamente por el usuario. Requisitos, páginas, alcance y workflow no son decisiones automáticamente. Las reglas operativas se aplican internamente y no se trasladan al usuario para recordarlas o confirmarlas. El onboarding no desarrolla páginas, componentes ni funcionalidades. Tras verificar los archivos, si Git existe revisa status/diff y crea el commit local `chore: inicializar proyecto`; sin Git finaliza correctamente sin commit.

## Contenido

En greenfield, `project-artifacts/content/` puede actuar como fuente editorial versionada para voz de marca, sitemap, metadata y enlazado. Las páginas se guardan en `project-artifacts/content/pages/`, los artículos en `project-artifacts/content/blog/` y packs opcionales en `project-artifacts/content/strategy/`. Crea las carpetas solo cuando exista su primer artefacto. `product/content/` pertenece al stack/producto. En existentes conserva las fuentes vigentes. No usar Lorem Ipsum si existe contenido real o puede prepararse.

## Diseño

En greenfield, `project-artifacts/design/` contiene design systems, componentes, specs y enlaces/IDs de Figma; un UI Kit web compartido puede vivir en `project-artifacts/design/ui-kit/index.html` con fuentes comunes bajo `project-artifacts/design/ui-kit/shared/`; páginas/prototipos se guardan en `project-artifacts/design/pages/`, referencias en `project-artifacts/design/references/` y assets auxiliares creados para Design en `project-artifacts/design/assets/{images,illustrations,icons}/`, creando solo las carpetas necesarias. Las páginas importan/reutilizan las fuentes compartidas; no dupliques allí assets existentes ni edites originales de `project-resources/`. No confundas Design con producto implementado en `product/`; `product/design/` y sus assets pertenecen al stack. En Existing conserva sus rutas/fuentes vigentes.

### Visual Reference Intake & Fidelity (BF-048)

Una referencia visual puede llegar como adjunto, screenshot, URL, Figma, PDF, template, moodboard, vídeo, asset existente o mención natural del usuario. No exijas que la persona conozca rutas internas ni complete campos técnicos. Dev Lead inspecciona las fuentes pertinentes, crea en on-demand `project-resources/references/REFERENCES.md` desde la plantilla cuando aparezca la primera referencia material y registra las referencias manuales descubiertas; no precrees folders vacíos. El registro es metadata operativa, no una copia del análisis ni de los originales. Trátalo como Project Resources/Input: no lo stages/commitees automáticamente porque puede exponer URLs privadas o provenance; revisa privacidad, tamaño y derechos igual que para el resto de `project-resources/`. Los originales permanecen read-only en `project-resources/references/` o en su source actual; los análisis derivados opcionales viven en `project-artifacts/design/references/`. Una URL puede quedar registrada sin descargar un mirror.

Cada referencia material conserva cuatro dimensiones independientes:

- **Source/type:** origen exacto o asset path y si es Figma, screenshot, URL, template, asset u otro medio.
- **Authority:** `INSPIRATION`, `DIRECTIONAL`, `APPROVED VISUAL REFERENCE` o `STRICT IMPLEMENTATION REFERENCE`.
- **Fidelity:** `LOOSE`, `DIRECTIONAL`, `HIGH` o `STRICT`.
- **Scope:** sitio, sistema, página, sección, component, asset, estado/interacción o breakpoint al que aplica.

El registro también indica brevemente qué `preserve` y qué `may adapt`, con notes/status solo si ayudan. Un nivel no fuerza el otro: un diseño aprobado puede requerir fidelidad alta sin exigir reproducción estricta. Inferencia natural: “me gusta” → Inspiration; “en esta dirección” → Directional; “aprobado por el cliente” → Approved; “replicarlo exactamente” → Strict cuando haya autoridad suficiente. Si el usuario declara propiedad/aprobación/licencia suficiente no vuelvas a preguntar en lenguaje jurídico. Si solicita copia exacta de un sitio/template externo de terceros sin aclarar si está autorizado, haz una sola pregunta material; un template comprado/uso autorizado no requiere reconfirmación.

La autoridad visual no implica automáticamente derechos para copiar sus fotos/logos/ilustraciones ni autoridad editorial sobre textos/claims. Respeta BF-044/BF-045: se puede replicar treatment/placement sin descargar un asset de terceros. No copies copy o información de referencia como hechos del proyecto salvo que el contenido también esté autorizado. No descargues sitios o assets indiscriminadamente; usa capability externa solo si existe, el source/scope/derechos bastan y la tarea lo requiere.

Las referencias compuestas se asignan por scope/ID, no se mezclan arbitrariamente. Una authority mayor prevalece solo donde se solapen sus scopes; referencias igual de autorizadas que se contradicen materialmente en el mismo scope requieren una sola pregunta. Una referencia desktop estricta gobierna lo observable en desktop; si falta mobile, dedúcelo con el sistema vigente sin afirmar que fue extraído, y una referencia mobile posterior gobierna ese breakpoint. Existing vigente es referencia de continuidad, no inspiración genérica.

Cuando exista referencia Approved/Strict, BF-046 sigue aplicando: el UI Kit deriva de la referencia y expone la extracción para aprobación humana, sin Creative Direction competidora. Tras aprobarlo, Dev/Design handoffs conservan **reference ID, source, authority, fidelity, scope, preserve, may adapt**. No se pierde esa semántica entre Dev Lead, UI/UX, Frontend, Developer y Reviewer. Authority determina si la referencia gobierna como source of truth dentro de su scope; fidelity determina exclusivamente la tolerancia: `LOOSE` no exige paridad visual detallada, `DIRECTIONAL` compara principios, `HIGH` preserva con precisión las relaciones observables y `STRICT` exige la correspondencia más cercana razonable. `APPROVED` no eleva por sí mismo la fidelidad declarada. Inspiration no activa pixel parity. Adaptaciones técnicas justificadas se documentan; drift material no se aprueba silenciosamente.

### Advanced Visual & Interaction Capabilities (BF-049)

Aplica **Use the smallest capable tool**: `Native first → Specialized when justified → Install on demand → Remove when no longer needed`. El recorrido es `visual/interaction requirement → intent + complexity → clean native fit? → native solution OR justified specialized capability → capability-specific QA`. Decide según complejidad, mantenibilidad, fidelidad, performance, accesibilidad, browser support, stack, arquitectura Existing, duración/lifecycle de la interacción, responsive y scope real. Que una librería esté disponible o figure aquí no justifica usarla.

Para motion, usa una escalera orientativa, no una receta: **CSS** para hover/focus, transitions, opacity/transforms, reveals simples, estados y keyframes pequeños; **native HTML/JS/TS/Web APIs** para controles accesibles, accordion/tabs/menus/toggles, `IntersectionObserver`, `Web Animations API`, scroll-awareness modesta y coordinación pequeña; **GSAP** como primera capability especializada cuando timelines coordinadas, scroll-storytelling, scrub/pin, secuencias multi-stage, SVG/text sequencing, stagger complejo, hero choreography u otros estados excedan razonablemente el mantenimiento/fidelidad nativos. Ningún trigger obliga por sí solo a GSAP; button/card hover, fade-in, menú básico, accordion, tooltip o reveal ordinario no lo justifican por default. No sustituyas un engine adecuado por cadenas de timers, listeners/timelines artesanales dispersos ni trackers duplicados.

Usa `.kilo/skills/motion-interaction/SKILL.md` solo para intent/interacción compleja o riesgo real de implementación/QA; no cargues una skill ni abras análisis de tooling para un hover CSS trivial.

Este criterio no es universal a motion: conserva scroll nativo; scroll animation no implica smooth scrolling ni scroll-jacking. View Transitions, carruseles, primitivas headless, SVG/Rive/Lottie, Canvas/PixiJS, Three.js/React Three Fiber, charts/D3, mapas (p. ej. MapLibre/Leaflet/Mapbox) y rich media son categorías/candidatos futuros, no preferencias ni dependencias del Core. Escálalos por requisito real, stack, datos/proveedor/licencia/privacidad y QA correspondiente; usa DOM/CSS/SVG/nativo para escenas simples, Canvas/PixiJS para 2D realmente intensivo y Three.js/equivalent stack-native para 3D que justifique su carga, fallback móvil, performance, memory/disposal y accessibility. SVG animado por CSS/JS/GSAP y assets authored Rive/Lottie son opciones distintas; conserva los derechos BF-044/045. Para charts sencillos usa HTML/SVG o una librería apropiada antes que D3; nunca inventes datos. Prefiere video/audio nativo a playback/streaming especializado sin un requisito real. Para dialogs, popovers, comboboxes y primitivas complejas evalúa primero comportamiento stack-native/headless accesible frente a una implementación frágil propia; el visual layer sigue a BF-046. No generes skills completas para categorías sin caso de proyecto.

Motion es parte del visual fingerprint de BF-043 y sigue BF-045/046/048. Deriva su carácter, timing, trigger, states y responsive de identidad, sector, público, contenido, intención y autoridad de referencia; no impongas `fade-up + stagger + parallax`. Si motion es material para la dirección, el UI Kit muestra solo los specimens necesarios antes de multiplicarlo por las páginas; UI Kit obligatorio no implica Motion System obligatorio. Una referencia visual Approved/Strict gobierna también el comportamiento observable dentro de su scope según su fidelity. Una imagen estática no es evidencia de motion: cualquier interacción añadida se marca como inferred/proposed, no como extraída de la referencia.

Design define motion intent (qué, por qué, trigger, character/timing y states) antes de seleccionar tecnología. Cuando una interacción compleja sea esencial para la aprobación humana, el prototipo evaluable puede usar la capability necesaria bajo Project Artifacts; continúa siendo Design, no Product. El handoff conserva motion intent, specimens aprobados, estados y secuencias materialmente relevantes, authority/fidelity/scope de referencias, adaptación responsive, intención de reduced motion y capability aprobada/justificada cuando aplique. Product traduce eso al stack nativo; no exige compartir la implementación técnica del prototipo.

Product integra GSAP solo dentro del stack/product cuando esté justificado: carga por el método compatible (por ejemplo package/import en un build, runtime correctamente en un sitio estático o enqueue/asset pipeline vigente en WordPress); respeta lifecycle y editabilidad del framework/builder. No conviertas Bricks/Elementor en React, no reemplaces un sistema Existing que ya funciona por preferencia y verifica API/integración/licencia actual con fuentes oficiales cuando sean materialmente version-sensitive. Evalúa proporcionalmente bundle/runtime cost, mantenimiento, browser compatibility, alternativa existente, imports/code splitting y usage terms si son relevantes; un paquete menor no necesita informe formal. El estado actual de licencias/package no se fija en Core. Ninguna dependency, CDN, script, configuración o runtime avanzado entra al template/Core o a un Product “por si acaso”. Registra solo las decisiones de arquitectura avanzadas que sean materiales; el uso de CSS para un hover no necesita ADR.

Toda capability runtime aplica accessibility, responsive, performance y lifecycle proporcionales: reduced motion reduce/quita movimiento no esencial sin perder contenido, layout ni estado final; nunca escondas contenido esencial tras una animación ni exijas hover para usarlo. Conserva teclado, foco, semantic controls, touch/pointer y timing razonable; evita flashing con riesgo de seizure. Simplifica/reconsidera pinning, distancias y triggers por viewport cuando sea útil, sin copiar desktop ciegamente. Prioriza transform/opacity cuando proceda, batching y observers/listeners limitados; evita layout thrashing, `will-change` global/permanente, instancias duplicadas y loops runaway. Revert/kill/cleanup de timelines, triggers, observers, listeners, estilos temporales e instancias al desmontar o cambiar de ruta; contenido esencial debe seguir siendo usable con JS o motion reducido siempre que sea razonable.

La selección se verifica con QA específica del comportamiento implementado: estados/timeline/scroll y navegación; reduced motion con estado final visible; keyboard/focus/touch; responsive representativo; lifecycle/remount y limpieza cuando aplique; errores de consola/red; performance observada y costo/dependencia reales. No hay umbral universal de FPS ni telemetría/benchmark permanente por default. Retira imports, dependency, runtime, assets/config y dead code propios al dejar de ser necesarios cuando esté en scope; no migres motion en Existing sin razón material y autorización de scope.

### Integridad de recursos visuales (BF-044)

Antes de diseñar o implementar una superficie visual, clasifica la función de sus recursos:

- **Gráficos/vectoriales:** logos y marcas, iconos, patrones, divisores, diagramas, gráficos sustentados por contenido y composiciones abstractas intencionales que sean parte explícita del lenguaje visual. SVG es apropiado cuando representa uno de estos recursos con función visual clara. Toda posición, escala, secuencia, flujo o relación que el gráfico afirme debe estar en la fuente/brief; una lista de espacios u objetos no autoriza inventar su distribución o conexión. Si falta esa información, no fabriques el diagrama: compón con los hechos disponibles o entrega el gap fuera del lienzo.
- **Representacionales:** productos, personas, objetos principales, espacios/interiores/fachadas, escenas, instalaciones, estudios e imágenes editoriales que prometen mostrar aquello que representan.

Un recurso representacional no se sustituye por defecto con blobs, óvalos, líneas, siluetas genéricas ni pseudo-SVG que pretenda ocupar el lugar de una foto, producto o espacio real. El detalle técnico de un dibujo no lo vuelve fiel por sí solo: no infieras geometría, piezas, apariencia ni proporciones de un producto real a partir de datos parciales como material, color o medidas generales. Una ilustración vectorial representacional es asset final solo si su forma corresponde a una fuente o art direction aprobada. En proyectos ficticios/conceptuales puede proponerse una forma original de producto únicamente cuando el usuario haya autorizado crear también ese diseño físico; su condición propuesta y necesidad de Human Visual Approval se comunican fuera del lienzo, y Product espera aprobación. Patrones o diagramas sí pueden ser abstractos si tienen una función y un significado reales.

Para recursos representacionales, inspecciona solo assets pertinentes proporcionados por el usuario y la biblioteca vigente del proyecto. Prioriza assets existentes/aprobados o assets finales creados mediante una capacidad disponible y autorizada. Si la composición puede funcionar sin imagen, resuélvela sin simularla. Si la imagen es material para el resultado y no hay fuente apropiada ni capacidad autorizada para preparar un asset final, escala la necesidad/bloqueo al Dev Lead o autor; continúa las partes independientes, pero no declares terminada como final la región que depende de ese recurso ni la rellenes con una representación falsa.

No conviertas la ausencia o falta de validación de un asset, dato o decisión visual en copy dentro de la UI/prototipo. No muestres notas de estado como “imagen conceptual”, “no es fotografía”, “pendiente de aprobación”, “espacio reservado”, “contenido provisional” o equivalentes, salvo solicitud explícita del usuario o que sean contenido editorial final y necesario. Compón con los hechos confirmados; explica la incertidumbre de procedencia, autenticidad, licencia, disponibilidad, aprobación o brief incompleto en el handoff, reporte o contexto fuera del lienzo.

En Design, guarda únicamente assets auxiliares creados/curados para ese entregable bajo las carpetas on-demand indicadas arriba. `project-resources/` sigue siendo input original y los assets de proyectos existentes conservan su ubicación/source of truth. En Product, usa la ubicación nativa del proyecto e implementa solo assets aprobados o definidos por el flujo de diseño correspondiente; no conviertas `project-artifacts/design/assets/` en dependencia de runtime. En Existing, respeta la biblioteca, art direction y convenciones visuales vigentes: no introduzcas recursos vectoriales genéricos ajenos al sistema.

### Estrategia contextual de recursos visuales (BF-045)

En páginas o secciones visualmente importantes, UI/UX decide deliberadamente qué combinación de medios aporta valor. Esta mezcla forma parte del visual fingerprint de BF-043 y se deriva del sector, identidad, audiencia, posicionamiento, contenido, producto/servicio, función de la sección, assets existentes y capabilities reales. La ausencia de una foto no implica una página casi exclusivamente tipográfica; antes de reducir presencia visual, evalúa alternativas auténticas y coherentes con el proyecto.

Al seleccionar recursos, prioriza según disponibilidad, pertinencia y autorización:

1. assets reales proporcionados por el usuario;
2. assets existentes/aprobados del proyecto;
3. recursos externos apropiados, solo si el scope/capability lo permite y origen, derechos y condiciones de uso son suficientes;
4. assets de apariencia final producidos con una capability autorizada disponible;
5. ilustración, SVG, iconografía, textura, pattern, forma, tipografía, gráfico, diagrama o motion original cuando ese medio sea coherente con la dirección visual y respete BF-044;
6. una composición alternativa rica que no finja representar un objeto, producto, espacio o persona concretos;
7. comunicar un gap solo si un recurso representacional es materialmente imprescindible y no hay una alternativa honesta de calidad.

Esta es una prioridad de evaluación, no una checklist ni un mandato de agotar fuentes: ningún diseño debe mezclar todos los medios o añadir assets solo por “enriquecerlo”. Riqueza visual significa una presencia visual intencional y adecuada —puede ser sobria o muy expresiva—, no saturación. Evita repetir la misma fórmula “sin foto → tipografía y whitespace” y también sustituirla por un pattern/SVG genérico recurrente. En Existing, la variedad de medios se subordina a continuidad con su identidad y su biblioteca aprobadas.

### Design System First (BF-046)

Ante una nueva experiencia visual material —sitio, landing, página nueva, ecommerce, SaaS, app, dashboard o rediseño relevante— no empieces directamente diseñando la primera página high-fidelity. En Greenfield o cuando se establezca una nueva dirección, sigue `Inspect Context → Creative Direction → Visual Asset Strategy → Foundations → Initial UI Kit → Internal System Review → Human Visual Approval → Page Design`; ninguna página completa de la experiencia ni Product puede adelantarse al UI Kit aprobado. Una landing pequeña necesita un kit más compacto, no saltárselo. No aplica a correcciones DIRECT, bugs, hotfixes, mantenimiento localizado o ajustes dentro de un sistema vigente y aprobado.

El UI Kit inicial es un artefacto visual navegable/evaluable, no solo Markdown. Para web es HTML/CSS/JS responsive bajo la ruta `project-artifacts/design/ui-kit/` y ofrece la base reutilizable suficiente para entender y revisar el proyecto: identity/brand source; color roles; type families/scale/line-height; spacing/gutters/containers/grid; border styles/widths, radii, shadows, opacity y z-index cuando apliquen; image/illustration/motion language según BF-044/BF-045; componentes y estados relevantes para las páginas conocidas; y al menos una revisión desktop/mobile. Sus muestras ilustran foundations/componentes aislados: no componen el hero, Home, CTA, layout ni copian el H1/copy aprobados de la página solicitada por anticipado. Muestra typography con specimen labels/texto neutro —no con el copy real de página—; la jerarquía/contenido de la página se diseña después de aprobar el kit. Incluye solo controles/form components usados por el scope; no inventes componentes hipotéticos ni estados irrelevantes para llenar el kit.

En Greenfield centraliza las decisiones compartidas en una fuente de diseño: por ejemplo, `project-artifacts/design/ui-kit/shared/{tokens.css,global.css,components.css}` cuando cada archivo cumpla una función real. Todos los colores intencionales del sistema (incluidos acentos usados una sola vez) se declaran en la palette/tokens y los componentes/páginas consumen esos roles, no hexes locales. Tipos jerárquicos (incluidos H1/H2/H3), spacing/section rhythm, layout primitives, borders/widths, radii, shadows, opacity, z-index, estados, motion y componentes globales usan la fuente compartida cuando son decisiones comunes; cambiar una definición debe afectar sus instancias sin editar cada página. El `index.html` del Kit enlaza esos CSS compartidos en vez de copiar tokens/reglas globales inline; los prototipos HTML en `project-artifacts/design/pages/` los importan por rutas relativas válidas. El CSS de página se limita a composición/variants exclusivas; si un valor de composición coincide con un token aplicable, reutilízalo en vez de hardcodearlo. Tras aprobar el kit, las páginas usan los nombres exactos de tokens/global classes/components de la source approved; no crean alias ni copias locales para una decisión ya representada, salvo nueva semántica/variant o extensión del sistema aprobada. Usa nombres semánticos, fuentes de verdad únicas y overrides explícitos para variants genuinas. No conviertas valores únicos, medidas de composición local o coincidencias en variables/componentes sin significado, ni repartas reglas globales hardcoded entre páginas.

Define los core UI controls que las páginas y flows del scope usarán (p. ej. botones, links o fields de un formulario real) y muestra sus estados pertinentes: default/hover/focus/active/disabled/loading/error/success/selected/expanded según función; no todos aplican a todos. No añadas navegación/form fields ni otros componentes solo para llenar el showcase. Integra contraste, teclado, focus, touch size, reduced motion y tolerancia razonable a copy real; el focus visible debe contrastar con sus superficies adyacentes (al menos 3:1 para el indicador) y usar variants contextuales si aparece sobre fondos distintos. Usa `.cn-pilot/config/responsive.json` en Greenfield con el mecanismo que realmente admita el stack; no inventes custom properties de breakpoint para media queries si no son soportadas.

Antes de mostrarlo, UI/UX revisa internamente grounding, fuente única, variedad visual, responsive/accesibilidad (incluido contraste de cada combinación texto/superficie que muestra el Kit y etiquetas legibles de color swatches), contenido resiliente, states y proporcionalidad. Dev Lead presenta entonces el UI Kit al usuario y se detiene con una pregunta natural y breve de aprobación. Registra la aprobación en el Project Context existente solo cuando sea un delta material; no crees un expediente paralelo de approvals. El gate es material: aprobación del UI Kit autoriza continuar con la página solicitada, **no** implementarla. PAGE/DESIGN approval permanece aparte y puede autorizar Product solo si el scope confirmado ya incluye desarrollo. No preguntes de nuevo si empezar la página tras aprobar el kit; continúa dentro del scope acordado.

Cuando el usuario apruebe el UI Kit, las páginas de Design deben consumir esas foundations/shared files; solo su composición exclusiva tiene estilos locales. Si la página revela un patrón reutilizable coherente, clasifícalo como instance, variant o nuevo shared component, agrégalo al sistema/UI Kit con evidencia de uso y reutilízalo. Las extensiones naturales que conservan la dirección no requieren rehacer o volver a aprobar todo el kit. Un cambio material de typography, palette, visual fingerprint, component paradigm o layout foundation sí se presenta a Human Visual Review antes de propagarse.

En Existing primero descubre Figma/tokens/framework/theme/builders/component library vigentes, que permanecen fuente de verdad. Antes de una nueva página relevante, crea una vista/UI Kit que exponga las foundations existentes y solo las propuestas de extensión necesarias para revisar continuidad; no crees un sistema paralelo ni refactorices un sitio legacy por un ajuste pequeño. Una fuente ya aprobada e inalterada satisface su gate sin una reconfirmación redundante; revisa humanamente cualquier adición material no aprobada.

Design y Product mantienen la misma intención aprobada, pero Product implementa su sistema mediante la solución nativa al stack (Figma/Design source, CSS, framework theme, WordPress/theme.json, Bricks Variables/Global Classes, Elementor Globals u otra fuente vigente); no exige compartir los mismos archivos. Conserva una sola fuente de verdad en cada fase, traduce tokens/variants/states y no introduzcas un sistema paralelo.

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

La fuente única también aplica fuera del CSS cuando valores con significado compartido se repiten en JS/TS/PHP u otro lenguaje: centraliza configuración, estados, límites, durations o endpoints compartidos mediante constants/config/enums/helpers propios del stack si eso evita divergencia real. No conviertas cada literal en abstraction: valores triviales (`0`, `1`, string vacío) y valores locales de una sola función se quedan locales salvo semántica/contrato real.

## Flujo visual de alta fidelidad

Cuando un trabajo incluye diseño visual de página, sistema o interfaz relevante, aplica proporcionalmente:

```text
Inspect Context → Final Content → Creative Direction → Visual Asset Strategy
→ Foundations → Initial UI Kit → Internal System Review
→ Human Visual Approval (UI Kit) → High-Fidelity Page Design
→ Human Visual Approval (Page) → Implementation si está en scope
→ Visual Fidelity Pass → Visual Parity QA → Human Visual QA → Publish
```

El gate inicial de UI Kit y el de aprobación de la página son distintos. La aprobación del UI Kit autoriza continuar con páginas, no con Product; la aprobación de una página permite implementation únicamente si ya pertenece al scope confirmado. No se pregunta redundantemente si se desea diseñar páginas después de aprobar el kit ni si se desea implementar después de aprobar la página cuando desarrollo ya estaba incluido. Estos gates no aplican a cambios DIRECT, bugs, hotfixes, mantenimiento/cambios localizados dentro de un sistema aprobado ni a entregables explícitamente estructurales que no comiencen un diseño visual. El contenido final o aprobado es la fuente editorial: se puede reorganizar y presentar visualmente, pero no inventar claims, datos, headings comerciales, microcopy ni reescribir el mensaje sin autorización. La libertad creativa de presentación no equivale a libertad editorial.

El prototipo web high-fidelity se entrega como HTML/CSS/JS responsive real por defecto (con assets visuales permitidos), no como imagen plana. Representa composición, fondos, tamaños, max-width, spacing, tipografía, imágenes, botones, bordes, estados y responsive esperado. Tras su aprobación es la fuente visual de verdad; Frontend compara e implementa directamente ese artefacto, no necesita convertirlo a screenshots. La implementación debe trasladar sus detalles, no solo contenido, imágenes y columnas. `Structurally valid` no equivale a `visually faithful`.

La prioridad de implementación es `native settings → clean structure → minimal scoped CSS when necessary`. CSS local es válido para detalles aprobados que el builder no resuelva razonablemente, siempre que esté scoped, no afecte recursos globales y no sustituya una arquitectura correcta. No se optimizan métricas artificiales como cero CSS, cero Divs, un Container obligatorio o cien por cien native.

Visual Parity QA compara proporciones, widths, whitespace, prominencia de imágenes, escala tipográfica, botones, relaciones de columnas, posiciones, spacing, ritmo y composición con la referencia aprobada. Ante referencia HTML/CSS/JS prioriza estructura, DOM, estilos y responsive; ante referencia raster/Figma puede requerirse captura representativa. No uses screenshots como logging ni los generes de rutina. Human Visual QA en navegador no se sustituye por render MCP, fragmentos de contenido, inspección del árbol o integridad técnica; si falta evidencia visual fiable, se informa `Technical QA complete; Visual QA pending`. No se exigen estas fases sin referencia visual aprobada y no se mantienen iteraciones de microajustes de bajo retorno indefinidamente.

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

- Git es una capacidad opcional: el CN Pilot funciona en carpetas sin Git, repositorios locales y repositorios con GitHub u otros remotos.
- Sin Git se omiten comandos, ramas, hashes, worktrees y commits; se verifican los archivos directamente y la ausencia no se trata como bloqueo.
- El CN Pilot nunca ejecuta `git init` salvo solicitud explícita o alcance confirmado.
- Cuando Git existe, Dev Lead crea automáticamente un commit local por defecto cuando una tarea modificó archivos y quedó totalmente terminada y verificada; no pregunta al usuario si quiere hacerlo.
- Para trabajo individual y secuencial, el flujo local por defecto es `main → trabajar → verificar → commit local`; `main` representa normalmente el estado actual y estable del proyecto. Cualquier acción remota requiere la autorización del contrato Git indicada abajo.
- Las ramas son opcionales: solo se crean cuando existe una razón concreta de colaboración, aislamiento por riesgo, experimento descartable, Pull Request, desarrollo paralelo o solicitud explícita. No son necesarias para mantenimiento, documentación, mejoras pequeñas o trabajo individual normal.
- No crea commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario lo prohibió explícitamente.
- Conventional Commits.
- Descripciones siempre en español.
- Mensajes basados en el diff real.
- Stage limitado a la unidad lógica relacionada.
- Nunca hace push automático.
- El cierre por defecto es local: acciones remotas (push, deploy/publicación, PR, merge, tag, release) requieren autorización explícita o un scope ya aprobado que las incluya inequívocamente. Las reglas permanentes se heredan sin repetirlas en cada prompt.
- No se hereda un workflow GitHub Actions de deployment. Se crea uno específico solo cuando el proyecto solicita configurarlo, método/destino están definidos y existe autorización; un trigger automático exige además intención y autorización explícitas.
- Cada tarea completada recibe un informe final breve y proporcional; incluye solo resultado, cambios y verificaciones pertinentes, agentes/Reviewer si intervinieron y hash/mensaje exactos si hubo commit. Tras informar, Dev Lead se detiene.
- Los tags y GitHub Releases son opcionales y no se crean ni recomiendan para cada parche, commit o cambio de versión. `.cn-pilot-version` identifica la generación/base del CN Pilot y no tiene que cambiar con cada commit; `CHANGELOG.md` se actualiza para cambios relevantes.
- Operaciones destructivas bloqueadas.

## Versionado

SemVer:

- PATCH: correcciones compatibles.
- MINOR: capacidades compatibles.
- MAJOR: cambios estructurales/incompatibles.

Cada proyecto conserva `.cn-pilot-version`.

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

## QA ejecutable del Core (BF-051)

`.cn-pilot/qa/core-check.mjs` comprueba de forma read-only, determinística y portable las invariantes estructurales expresas de CN Pilot. Usa solo APIs built-in de Node; no instala dependencias, accede a la red, ejecuta código de Product ni modifica archivos. `--json` produce el contrato machine-readable y los exit codes documentan PASS/WARN/FAIL/runtime error. `node:test` es estable desde Node 20 según la [documentación oficial](https://nodejs.org/api/test.html); la suite se verificó con Node 24.19.0, sin fijar una versión/engine para el Core.

Actívalo para mantenimiento del Core o desde `/doctor` cuando Node esté disponible y su ejecución autorizada, no para tareas normales de proyecto. Sin Node/acceso, reporta QA como `UNAVAILABLE` (no `BROKEN`); `/doctor` conserva fallback manual read-only. QA puede acelerar la instantánea de Doctor, pero no la evaluación contextual ni reemplaza Reviewer, behavioral retests, testing del producto o `/doctor`. No auto-repair.

## Seguridad

Considerar según aplique: sanitización, escaping, auth, capabilities, nonce/CSRF, XSS, SQL, uploads, REST/AJAX, secretos y exposición de datos.

## Ciclo de vida

`Content → Design → Frontend/Prototype → Handoff → CMS Integration → Deployment`

Las fases son puntos posibles de entrega, no una secuencia obligatoria. Un flujo puede empezar o terminar en cualquiera de ellas y omitir las demás. En sistemas existentes se inspecciona primero la implementación actual y solo se activan las fases necesarias. El destino puede variar por entregable dentro del mismo proyecto. En greenfield, supporting outputs de contenido/diseño/documentación van en `project-artifacts/` y la implementación bajo `product/`; la raíz no es destino habitual de outputs.

## Principio de contexto

El CN Pilot puede ser completo sin cargarlo entero en cada tarea. Los agentes deben usar solo archivos, skills y documentación relevantes; evitar releer lo ya analizado, rehacer razonamientos correctos del especialista, delegar sin necesidad o activar reviews sin beneficio.

Las skills deben declarar una capability coherente y un trigger claro, ofrecer guía operacional y verificable proporcional a su riesgo, evitar duplicar doctrina del Core y consultar fuentes primarias actuales cuando el comportamiento dependa materialmente de una versión. Se descubren por metadata y se cargan bajo demanda. Antes de incorporar una skill, comprueba que cubra una capability distinta, su routing, profundidad suficiente, límites/ownership y una vía de verificación; no uses el tamaño como proxy de calidad.

## Criterio de éxito

Otro desarrollador debe poder clonar el repo, entender contexto/estado/decisiones y continuar trabajando sin depender del ordenador o memoria del creador.

## Regla final

Si una regla, documento, agente, skill o workflow no aporta valor proporcional a la tarea, no debe activarse.
