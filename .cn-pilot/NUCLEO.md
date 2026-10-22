# Núcleo de CN Pilot — Especificación 2.0

**Versión:** `2.2.0`

Documento de referencia para mantenedores de CN Pilot. Una persona nueva debe empezar por [`documentacion/EMPIEZA-AQUI.md`](documentacion/EMPIEZA-AQUI.md); no necesita leer esta especificación para trabajar.

## Objetivo

Sistema portable y versionado para desarrollar proyectos web con agentes de IA sin depender de una única máquina, persona o proyecto. Debe servir tanto para mantenimiento pequeño como para proyectos grandes desde cero.

## Principio local-first y modo de entrega

El CN Pilot prepara el trabajo localmente por defecto y lo versiona cuando Git está disponible. La plataforma objetivo, el alcance del repositorio y el modo de entrega son dimensiones independientes: un destino WordPress, Bricks, Elementor o WooCommerce no implica automáticamente implementación dentro de esa plataforma.

Cada proyecto define hasta dónde llega el repositorio y cómo se entrega cada artefacto: trabajo manual posterior, integración/MCP opcional o implementación completa desde el repositorio. Diferentes entregables pueden tener destinos distintos. El núcleo no depende de ningún proveedor o MCP; si una integración no está disponible o queda fuera de alcance, se produce un handoff completo y el flujo se detiene en el punto acordado.

`/nuevo-proyecto` es la puerta recomendada para iniciar u orientar cualquier carpeta de proyecto; la inicialización del contexto no se repite cuando el proyecto ya está configurado. No significa «crear una web nueva»: puede describir trabajo nuevo o un sistema existente y debe preservar como fuente de verdad la implementación vigente que corresponda.

## Capas de configuración

El repositorio separa Core portable en `.cn-pilot/`, rutas técnicas requeridas por herramientas, contexto mutable, inputs del proyecto y código/artefactos. `.cn-pilot/config/responsive.json` es la fuente versionada para responsive de proyectos nuevos; los proyectos existentes conservan sus breakpoints salvo migración aprobada.

Los MCPs y workflows de deployment no se activan ni distribuyen por defecto. Ante una solicitud explícita, prepara la configuración MCP local con base en el servidor, capability y configuración real; no se crea durante `/nuevo-proyecto`, no se leen/escriben archivos MCP protegidos ni se solicitan secretos. Si se solicita GitHub Actions y el método/destino están definidos y autorizados, crea un workflow específico para el proyecto. Los triggers automáticos requieren autorización independiente. `kilo.jsonc` conserva únicamente configuración general compartible sin secretos. Consulta `.cn-pilot/documentacion/CONFIGURACION.md`.

## Capas de archivos y artefactos

- **CN Pilot Core:** infraestructura interna reusable en `.cn-pilot/`, junto a ubicaciones técnicas como `.kilo/`, `.github/`, `AGENTS.md` y `kilo.jsonc`. `.cn-pilot/MANIFIESTO.md` describe esta capa.
- **Contexto del proyecto:** `README.md`, memoria operativa (`PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`) y el índice raíz `ARTEFACTOS.md`.
- **Recursos del proyecto:** materiales originales recibidos bajo `recursos/`; son entradas de referencia, no producción ni outputs.
- **Artefactos del proyecto:** resultados auxiliares reales bajo `artefactos/` en greenfield; container y subcarpetas on-demand, creados solo al aparecer el primer artefacto, sin README-placeholder ni `.gitkeep`.
- **Producto:** implementación/runtime activo administrado en el workspace bajo `producto/` para Greenfield y Existing importado; el stack define el layout interno nativo, separado de artefactos auxiliares. Solo un Existing repository operativo adoptado puede conservar un product root real fuera del container como excepción documentada.

## Contrato de payload del template

La rama predeterminada `main` es el payload distribuible del template. Cada archivo versionado debe tener una función real para el proyecto derivado o el Core que recibe: operación de CN Pilot, bootstrap que se transforma al inicializar, Project Context limpio, configuración portable, catálogo Core reusable o aviso legal aplicable. El catálogo puede activarse solo cuando una tarea lo necesite; la distribución de la capacidad no precrea sus outputs.

El payload excluye expedientes detallados de revisión/validación del mantenedor, research y arquitectura interna del repositorio; el historial conserva solo la evolución resumida del Core. Tampoco incluye datos propios de CN Pilot ni integraciones opcionales inactivas «por si acaso». No se configuran MCPs ni workflows de deployment durante `/nuevo-proyecto`: solo se materializan tras una tarea explícita y cuando alcance, configuración y autorización son suficientes. Triggers automáticos requieren intención y autorización explícitas.

## Frontera de licencias: Core, producto e inputs

`LICENSE` distribuye el CN Pilot Core/harness bajo GPL-3.0-or-later. El repositorio define qué parte propia ofrece CN Pilot como Core; no convierte automáticamente en GPL cualquier obra nueva que se guarde junto a él.

- **Core/harness:** los archivos propios de CN Pilot Core se distribuyen según `LICENSE`.
- **Producto y outputs:** código, diseño, contenido y assets nuevos creados por el usuario en `producto/` o `artefactos/` no quedan cubiertos solo por usar el harness, sus agentes/instrucciones o compartir repositorio. Pueden tener una licencia propia cuando sean obras independientes y su autor tenga los derechos para decidirla. La carpeta, por sí sola, no prueba independencia.
- **Uso y distribución:** la GPL permite explotación comercial sujeta a sus términos cuando se distribuye material cubierto. Hacer/usar cambios privadamente sin transmitirlos a otros no obliga a publicarlos; si se distribuyen copias de obras cubiertas se aplican sus condiciones. El uso del mismo repositorio o publicar un servicio no resuelve por sí solo qué copias de código se entregan.
- **Entradas originales:** `recursos/` conserva las licencias y derechos de sus fuentes originales.

La relación entre una obra concreta y código/texto protegido depende de su contenido, integración, procedencia y distribución. Estas reglas expresan el alcance previsto del Core y no son asesoría jurídica para un producto individual.

`ARTEFACTOS.md` es el mapa legible de entregables significativos de todo el proyecto, no solo los ubicados bajo `artefactos/`: puede indexar outputs auxiliares, producto significativo bajo `producto/` y otros entregables reales. No registra Core, contexto del proyecto, entradas originales, caches, dependencias ni placeholders. Se organiza solo con categorías presentes y estados simples cuando aportan valor. Se actualiza ante altas, bajas, movimientos o cambios materiales de estado/propósito, no por cada edición interna, inspeccionando archivos con o sin Git.

## Repository root y product boundary

La raíz del repositorio CN Pilot no es el root de producto canónico ni el destino habitual de outputs generados. En workspaces Greenfield y Existing importados, la implementación activa vive bajo `producto/`; outputs auxiliares bajo `artefactos/`; inputs recibidos bajo `recursos/`. Los containers pueden no existir: `/nuevo-proyecto` registra ubicaciones canónicas pero nunca los crea por sí solo. `producto/` se crea al iniciar implementación/adopción explícita y `artefactos/` al producir el primer artefacto. El stack decide la estructura nativa dentro de `producto/`, sin wrapper universal. No coloques código productivo, prototipos, documentos de arquitectura/specs/auditorías, copy, design systems ni reportes en repo root por rutina.

La raíz queda destinada principalmente a infraestructura técnica requerida, contexto del proyecto, `recursos/` y, solo cuando existan, `artefactos/` y `producto/`. Para greenfield, `contenido/`, `diseno/` y `documentacion/` de proyecto pertenecen bajo `artefactos/`; igual para outputs auxiliares de Existing importado. Esos mismos nombres dentro de `producto/` pertenecen a la estructura nativa del producto y no colisionan. Existing importado al workspace se organiza con su producto activo bajo `producto/`, sin capa `legacy-site/` salvo significado técnico real. Existing repository adoptado preserva el root operativo como excepción solo con evidencia material de contratos externos; registra modo, root de producto real y razón en `PROYECTO.md`. Código o carpetas source top-level fuera de `producto/` —p. ej. `legacy-site/`— sin esa evidencia quedan `Pending normalization/migration`: no los eleves a excepción por comodidad ni comiences implementación allí hasta resolverlo de forma segura. No muevas ninguna estructura durante onboarding.

Dentro de `producto/`, la estructura depende del stack: puede alojar directamente un sitio estático o un proyecto framework, o contener una raíz interna como un plugin/theme WordPress. Una raíz interna/múltiples componentes solo se añaden si hay significado técnico o productos reales; un único sitio no se envuelve en `producto/<slug>/` por rutina. El Repository Layout Contract de `PROYECTO.md` registra por separado el container de producto, sus roots internas, entry points, public/static roots, comandos, artifact/build output, tests/harness y rutas generated/cache. Registra solo ubicaciones observadas/decididas; no exige crear carpetas. Una necesidad material demostrada de tooling/hosting o una `Existing compatibility exception` documentada con contratos operativos puede justificar un product root fuera de `producto/`; registra ruta y evidencia en `PROYECTO.md`, no inventes excepciones por costumbre.

Hay dos modos Existing. **Imported into CN Pilot workspace:** CN Pilot es workspace y la implementación activa reside en `producto/`; si el código está ahí, inspecciona y conserva su estructura interna. Si solo está en `recursos/codigo-original/`, sigue siendo original/input, no producto activo: no lo edites ni copies durante onboarding; una tarea explícita de adopción prepara conscientemente la working copy en `producto/` y preserva el original. Si aparece código o una carpeta source top-level fuera de `producto/` sin contratos operativos, registra discrepancia `Pending normalization/migration`, no empieces implementación allí ni muevas nada durante onboarding. **Adopted operational repository:** se incorpora CN Pilot sobre un repositorio ya ligado materialmente a hosting/document root, CI/CD, imports, scripts, tooling, producción u otros paths externos. Preserva el product root observado (incluido `.`), documéntalo como `Existing compatibility exception` en `PROYECTO.md` y continúa allí sin wrapper/migración automática. En ambos modos, alterar rutas requiere tarea explícita y evaluación de impacto. Una adopción autorizada a `producto/` no termina hasta verificar working root, estructura interna, entry points, imports/assets/referencias, contexto del proyecto y que el source anterior no sea necesario ni queden refs obsoletas. El source container anterior se elimina solo si la misma migración verificada lo dejó vacío, con cero archivos y sin función independiente; no se borran no-vacíos, contenido desconocido ni originales de `recursos/`. `artefactos/` no sustituye salidas existentes sin autorización. El producto no depende directamente de `recursos/` ni de `artefactos/`; las excepciones requieren razón material documentada y aprobación aplicable.

## Convención de idioma

Las superficies propias de CN Pilot destinadas a personas usan español por defecto, incluidos los nombres visibles de roles, documentos, comandos y estructuras cuando no haya una restricción técnica externa. Se conservan en inglés las convenciones obligatorias de Kilo y los nombres técnicos exigidos por compatibilidad o claridad: `.kilo/agents/`, `.kilo/commands/`, `.kilo/skills/`, `SKILL.md`, `AGENTS.md`, `README.md`, `LICENSE`, APIs, claves de máquina, tokens/enums, tecnologías, vendors, frameworks, protocolos, formatos e identificadores externos. No traduzcas términos técnicos estándar como Git, commit, WordPress, WooCommerce, SEO, URL, API, JSON, HTML, CSS, JavaScript, PHP, React, Laravel, MCP, CLI, runtime, framework, stack, sitemap o ADR. Si un proyecto define explícitamente otro idioma de trabajo, adapta el contenido humano sin traducir identificadores técnicos.

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
Los nombres de archivo de `.cn-pilot/perfiles/` están en español; los valores de perfil de la lista y sus encabezados internos son identificadores técnicos estables en inglés. No los derives del nombre del archivo ni los traduzcas en una futura alteración de estructura.

## Agentes

- **Jefe de proyecto (`jefe-proyecto`):** coordina, clasifica, evalúa riesgo y delega.
- **Arquitecto (`arquitecto`):** arquitectura, dependencias, migraciones y planes.
- **Contenido / SEO (`contenido-seo`):** sitemap, copy, blog, metadata e intención.
- **Diseñador UI/UX (`disenador-ui-ux`):** layouts, componentes, responsive y sistema visual.
- **Desarrollador (`desarrollador`):** backend, PHP, WordPress, WooCommerce, APIs y datos.
- **Maquetador frontend (`maquetador-frontend`):** HTML/CSS/JS, responsive, Bricks y Elementor.
- **Revisor (`revisor`):** revisión independiente.

## Permisos

En Kilo 7.8.1, las reglas por patrón verificadas aplican la última coincidencia: el fallback va antes de las excepciones. Tras editar permisos se comprueba su resolución en el runtime instalado, sin asumir que otras versiones o tools usan idéntica semántica. Cada agente tiene `allow` en su área habitual, `ask` fuera cuando una edición puede ser legítima y `deny` para secretos, Core del CN Pilot que no le corresponde y operaciones peligrosas. Revisor permanece en lectura y verificación.

## Niveles de trabajo

### DIRECT
Cambio pequeño, localizado y reversible. Modifica solo los archivos estrictamente necesarios y sigue un flujo ligero, sin Arquitecto, revisión independiente completa, branch ni documentación adicional, salvo que el riesgo lo justifique.

`identificar → modificar lo mínimo → verificar → commit local automático si Git existe`

### TASK
Cambio acotado con lógica o impacto. Una TASK rutinaria de bajo riesgo no requiere Revisor independiente por defecto.

`especialista → verificación básica proporcional → inspección de cambios → commit local automático si Git existe`

Una revisión independiente completa se reserva para una TASK con riesgo o impacto suficiente, criterios de aceptación relevantes, seguridad, pagos, autenticación, datos o integraciones sensibles, o una razón concreta de Jefe de proyecto.

### STRUCTURAL
Cambio importante, de arquitectura o riesgo alto.

`requisitos → decisión arquitectónica si existe → plan compacto + gates/checkpoint inicial → implementación por batches → tests dirigidos y fixes → Revisor si aplica → checks finales/cleanup → commit local → Done`

La fase de planificación produce un artefacto persistido cuando la especificación, arquitectura, plan o criterios vayan a utilizarse posteriormente. «No escribir código todavía» no impide persistir documentación; solo una instrucción explícita de no modificar la carpeta del proyecto evita escribirla. En greenfield, especificaciones funcionales van en `artefactos/documentacion/funcionalidades/`, arquitectura transversal en `artefactos/documentacion/arquitectura/`, ADRs formales en `artefactos/documentacion/adr/`, auditorías durables en `artefactos/documentacion/auditorias/` y decisiones aprobadas ligeras en `DECISIONES.md`. Crea `artefactos/` y subcarpetas solo cuando exista el primer artefacto real; `producto/documentacion/` pertenece a documentación interna del producto. En existentes preserva los destinos vigentes. Una planificación completa y verificada crea su commit local si Git existe; sin Git queda guardada localmente.

### Completion-Driven Execution & Recovery (BF-047)

Una tarea se reporta `COMPLETED` solo después de satisfacer todos los gates que aplican al scope: cambio y acceptance, pruebas proporcionales, Revisor cuando corresponda, cleanup, contexto material, checks finales y commit local si el workflow lo requiere. Que no quede implementación no significa Done si hay revisión/cleanup/checks/commit pendientes. No fuerces gates en un DIRECT que no los necesita. Un crash, timeout, cierre del editor, error del proveedor, desconexión, pérdida de sesión o herramienta interrumpida por el runtime deja la tarea `INTERRUPTED / INCOMPLETE`, nunca `COMPLETED`, `VALIDATED` ni `APPROVED` sin evidencia. CN Pilot elimina los límites numéricos `steps` que declara en sus agentes; no promete impedir interrupciones externas del runtime/proveedor.

Para una tarea `STRUCTURAL` o larga, Jefe de proyecto prepara al inicio un plan compacto de objetivo, scope, paths probables, acceptance y gates. Revisor si aplica, cleanup, checks finales y commit quedan reservados desde ese plan. Trabaja en batches coherentes, inspecciona una fuente una vez, agrupa operaciones independientes seguras, evita narraciones/handoffs largos, reutiliza resultados vigentes y prueba cambios afectados. Si una modificación no puede invalidar un test `PASS`, su estado permanece `PASS`; regresa solo tests con superficie/semántica realmente afectada.

#### Progress Guard

Los agentes terminan por outcome, gates satisfechos o bloqueo real, nunca por duración, número de iteraciones/herramientas, tamaño o cantidad de archivos. Tras cada batch material identifica el avance observable frente a acceptance (criterio cerrado, bug reproducido/descartado, implementación o fix, dependencia/gap/blocker reducido, verificación o gate completado, cleanup reducido). Si no hay ninguno, no declares progreso: corrige el curso o cierra como `BLOCKED_*`/`FAILED` solo según evidencia y condiciones terminales de BF-047.

- **Fallos:** primer fallo de una operación → inspecciona causa y corrige/ajusta. Segundo fallo comparable → cambia materialmente estrategia, herramienta, approach o hipótesis. No repitas una acción/comando idéntico esperando otro resultado sin evidencia nueva; fallo aislado no equivale a `FAILED`.
- **Reutilización:** no releas completa una fuente vigente ya procesada salvo cambio, contradicción, handoff insuficiente, recovery o cambio de superficie. Reutiliza research vigente. Conserva `PASS` si el cambio posterior no pudo invalidarlo; ejecuta solo tests afectados, regresión necesaria y checks finales transversales.
- **Budget de evidencia:** cada test/research/screenshot/reporte/dump/log debe responder una pregunta concreta. Cuando la evidencia suficiente responde esa pregunta: `STOP VERIFYING THAT SURFACE`. No generes evidencia duplicada ni corras verificaciones porque quede capacidad de ejecución.
- **Completion Mode:** con objetivo/acceptance definidos y la implementación principal terminada, concilia checkpoint y pendientes; completa lo in-scope, ejecuta QA proporcional, Revisor si aplica, fixes confirmados, regresión focalizada, cleanup, checks finales, commit local y cierre/eliminación del checkpoint. No abras discovery, research opcional, refactors, auditorías ni features nuevas salvo blocker material del objetivo. El handoff incompleto de un especialista no es resultado final: Jefe de proyecto reconcilia objetivo, acceptance, working tree, checkpoint, evidencia, gates y bloqueo real; si queda trabajo recuperable y no hay bloqueo humano/externo, continúa con el owner lógico y un handoff mínimo.
- **Estado terminal:** `INCOMPLETE + RECOVERABLE + sin blocker` → continuar. `BLOCKED_HUMAN` solo ante decisión/autorización/credencial material humana; `BLOCKED_EXTERNAL` solo ante dependencia externa no disponible; `FAILED` solo ante fallo material no recuperable tras cambio razonable de estrategia. Solo acceptance y gates completados permiten cierre.

BF-059 limita QA por evidencia, no la duración de implementación: una primera ronda verifica; findings se corrigen en batch y se revalida superficie afectada en ronda dos. Una tercera iteración solo atiende un blocker material demostrable y queda acotada a él. No reinicies la suite ni amplíes scopes opcionales. BF-062 sigue imponiendo un único subagente secuencial, sin background/swarm ni writers simultáneos; la continuidad no crea mecanismos automáticos de resume ni modifica capacidades nativas de Kilo.

Las tareas `STRUCTURAL`/largas mantienen un único checkpoint local en `.cn-pilot/runtime/active-task.json`; `.cn-pilot/runtime/` se ignora en Git. Se crea después del plan inicial y se actualiza solo en milestones materiales (plan, batches, test group, fallo/fix, Revisor, cleanup, listo para commit), no por tool-call. Todo checkpoint nuevo/actualizado es un objeto JSON con `schemaVersion: 1`, `status`, `objective` y `nextAction`; `objective` y `nextAction` son strings no vacíos mientras la tarea esté abierta. Puede incluir solo recovery útil —por ejemplo taskId/title, ownerSessionId, branch/HEAD, phase, gates + evidencia breve, modifiedPaths, reviewer o commit—, no transcript, informe QA completo, dump de contexto, duplicado de STATE, secretos, credenciales, environment values ni razonamiento. Antes de persistir, Jefe de proyecto verifica que el JSON serializa y cumple esos campos y valores; checkpoint que no cumpla no se escribe como válido.

Estados emitidos por writers: `ACTIVE`, `INTERRUPTED`, `BLOCKED_HUMAN`, `BLOCKED_EXTERNAL`, `FAILED`. `COMPLETED` se elimina al cerrar todos los gates y solo se reconoce como estado terminal de checkpoints históricos; este terminal legacy no bloquea update y no requiere campos de recuperación que ya no aplican. El reader conserva además `BLOCKED` para compatibilidad con checkpoints previos; no se emite en nuevos checkpoints. Todos bloquean update excepto `COMPLETED`. Un checkpoint ausente permite continuar. Una caída puede dejar `ACTIVE` porque no hubo oportunidad de escribir `INTERRUPTED`; en una continuación, Jefe de proyecto reconcilia ese estado con sesión/working tree antes de decidir. El updater valida schema mínimo y enum para tareas abiertas; si falla, informa el campo/causa y bloquea sin inferir, reparar, borrar o sobrescribir el archivo. El checkpoint guía, no sustituye `git status`, HEAD o diff. Recovery empieza por verificar esos estados, conservar ediciones y conciliar solo diferencias relevantes; nunca usa reset/clean/restore destructivo. Continúa únicamente gates pendientes. Si una sesión nueva detecta trabajo pendiente y el mensaje es ambiguo/no relacionado, pregunta naturalmente si se termina primero o se deja pendiente; frases como «continúa» son suficientes para reanudar la misma tarea. No uses `/diagnostico` como requisito de recovery.

Usa continuation nativa cuando la superficie actual la exponga: un child `task_id` retornado puede reanudarse mediante `task` sujeto a sesión/permisos; una sesión Agent Manager existente se retoma solo con su ID real verificado y mientras Kilo la mantenga disponible; el Kilo CLI actual documenta `kilo --continue`/`-c` para la última sesión del workspace, `--session` para ID y `kilo run --continue` para enviar follow-up ([CLI session continuation](https://kilo.ai/docs/code-with-ai/platforms/cli#session-continuation), [CLI reference](https://kilo.ai/docs/code-with-ai/platforms/cli-reference), [Agent Manager tasks](https://kilo.ai/docs/automate/agent-manager#task-subagents)). Verifica siempre el `--help`/versión instalada antes de instruir; `/continue` es alias nativo de CLI para `/sessions`, así que no crees slash command homónimo ni hace falta un comando CN Pilot adicional. El CLI instalado verificado expone también `--format json` (eventos raw) y exit codes genéricos, pero la documentación/interfaz actual no define una señal estable que discrimine interrupción por step limit de pregunta humana/error: `CLI AUTO-RESUME` queda `DEFERRED`. No implementes un loop por strings/texto/exit code ambiguo ni uses `--auto`, cambies permissions o evadas aprobaciones.

Al quedar `BLOCKED_HUMAN`/`BLOCKED_EXTERNAL`, conserva checkpoint y explica lo mínimo necesario. Al completar todos los gates, elimina el checkpoint activo. Solo los hechos/decisiones reutilizables pasan a Project Context según su ownership; nunca copies allí el registro runtime completo.

### No-op / Silent Closure

El cierre operacional y la persistencia durable son decisiones separadas. Cuando una persona confirma un gate pendiente (incluidos Human Visual Review, push, sincronización o cierre), reconcilia únicamente la evidencia necesaria, resuelve el gate, elimina el checkpoint cuando todos los gates estén satisfechos y detente. La confirmación por sí sola no abre otro ciclo de documentación, commit ni push.

Antes de editar Project Context, documentación de deployment u otros archivos tracked pregunta: **¿esta información seguirá siendo necesaria para tomar decisiones correctas en una futura sesión?** Persiste solo si la respuesta es sí y existe un delta nuevo durable (arquitectura, requisitos, alcance, reglas de negocio, comportamiento, decisión relevante, procedimiento o autoridad visual que deba gobernar trabajo futuro). Escribe solo en la fuente canónica mínima de su ownership. Si la respuesta es no, no edites archivos tracked, no stages ni crees commit; cierra/elimina el checkpoint y STOP.

Push realizado, HEAD/origin sincronizados, ahead/behind, aprobación que solo satisface el gate actual, tarea cerrada, Revisor completado, commits existentes, working tree y confirmación de operación son estado operativo/efímero: no se propagan a PROYECTO, REQUISITOS, ESTADO, DECISIONES, ARTEFACTOS, README ni runbooks como diario. `ESTADO.md` puede cambiar únicamente si cambia materialmente el siguiente paso, un bloqueo o un estado que seguirá siendo relevante tras el cierre; no registra eventos ya representados por Git/runtime. REQUISITOS nunca cambia por estado de push/revisión/Git. ARTEFACTOS cambia solo si la revisión altera materialmente autoridad/lifecycle/uso futuro y la fuente canónica aún no lo expresa. Los runbooks describen procedimientos, no despliegues/push puntuales. La confirmación de push no autoriza otro push.

Excepción visual: BF-063 integra la aprobación inequívoca como referencia Approved bajo BF-048, en su scope/fidelity, cuando ese baseline nuevo debe gobernar trabajo futuro. Registra únicamente la autoridad mínima en su fuente canónica; si ya está representada suficientemente o la aprobación solo cierra el gate, no dupliques documentación. Decisiones durables comunicadas junto al cierre se persisten independientemente del cierre operacional y sin registrar la aprobación/push como evento.

Esta regla no debilita BF-047: `active-task.json` sigue preservando tareas activas, interrumpidas o bloqueadas y sus gates/evidencia para recovery. La eliminación aplica solo tras reconciliar que todos los gates están satisfechos.

El flujo reutiliza análisis, tests y revisiones todavía válidos, evita verificaciones duplicadas y reserva margen antes del Revisor para recibir hallazgos, corregir, probar y cerrar. Si una sesión debe continuar, recupera el estado vigente y ejecuta únicamente el trabajo pendiente.

Cuando la implementación principal de una tarea larga esté completa y existan criterios suficientes, Jefe de proyecto entra en `Completion Mode`: reconcilia el checkpoint ya abierto → verificación → Revisor si el riesgo/scope lo requiere → correcciones relevantes → regresión focalizada → cleanup/final checks → commit local si corresponde → elimina el checkpoint → STOP. No inicia discovery, investigación opcional, refactors, features o QA no previsto por iniciativa propia; mejoras fuera de scope se reportan. Completion Mode no elimina pruebas o revisión requeridas. Una vez satisfechos aceptación y verificaciones, no continúa inspeccionando por seguridad subjetiva ni abre trabajo nuevo.

Asigna un owner principal por unidad lógica siempre que pueda completarla correctamente; cambia de owner solo por responsabilidad material distinta. La salida válida del especialista se considera contexto procesado: reanalizarla completa exige contradicción, evidencia insuficiente, riesgo material o cambio de estado relevante. Arquitecto no es una estación automática de handoff.

## Autonomía técnica

Las decisiones que cambian alcance o arquitectura, afectan producción/datos, crean contratos públicos, son costosas de revertir, implican materialmente seguridad/privacidad/negocio, dependen del criterio visible o comercial del usuario o presentan tradeoffs importantes requieren aprobación. Los detalles internos, convencionales, reversibles, de bajo riesgo y derivables del contexto se resuelven autónomamente aunque no hayan sido especificados.

### Autonomía segura dentro del alcance aprobado (BF-053)

La autorización inequívoca de una tarea incluye su ejecución local rutinaria, esperable y reversible dentro del ownership del agente; no se solicitan aprobaciones humanas repetidas para editar/crear archivos o ejecutar QA normal. **AUTO**: local, in-scope, reversible/versionable, sin secretos ni efecto externo material. **ASK**: riesgo material, ambigüedad o efecto externo (incluidos dependencias, datos, producción y Git remoto), salvo autorización explícita que resuelva la decisión humana; no se repite una aprobación conceptual ya otorgada. **DENY**: invariantes protegidas, secretos, escalada de privilegios, edición del Revisor, Git destructivo/force y superficies fuera del ownership autorizado. Si una capability nativa no permite restringir una herramienta de escritura por ruta, no se amplía globalmente para evitar prompts: conserva ASK o usa el owner/superficie con containment demostrable. El scope no autoriza por sí solo deploy, publicación ni acciones remotas.

En Kilo 7.8.8, responder `always` a una solicitud puede persistir los recursos `save` como regla de permiso a nivel de proyecto, no limitada a la tarea ni al agente; los file tools actuales piden guardar `edit: *`. Prefiere autorización de una sola llamada cuando una regla persistente ampliaría ownership; no uses `always` como atajo de fricción.

Si la implementación depende materialmente de comportamiento externo/versionado no demostrado localmente, detecta la versión/configuración real, plantea la cuestión concreta, consulta fuente primaria y prueba la conclusión en el proyecto. La skill `source-grounded-development` define el procedimiento; investigación no es un paso universal, `latest` no reemplaza lo instalado y documentación no sustituye prueba local.

## Filosofía creativa y conversacional

CN Pilot opera como un equipo senior en lenguaje natural durante todo el ciclo de vida: inspecciona el contexto, infiere lo seguro, pregunta progresivamente solo por vacíos materiales, integra respuestas y continúa. No exige prompt engineering, vocabulario interno, contenido ni diseño completos; permite `Pending` no material y no convierte conversación en formulario. Jefe de proyecto es el interlocutor normal y consolida las incertidumbres de los especialistas. El contexto solo se persiste ante un delta material bajo su fuente de verdad; la guía [`INTERACCION-HUMANA.md`](documentacion/INTERACCION-HUMANA.md) es canónica para materialidad, ownership y continuidad.

### Guided Project Journey

El Journey es orientación ligera derivada del objetivo actual, implementación real, Project Context, recursos, decisiones ya tomadas y scope autorizado; no es un estado machine ni un lifecycle obligatorio. Las rutas se adaptan a public web, app/SaaS, Existing, mantenimiento y material existente. La ruta recomendada no se convierte en gate y no prevalece sobre una ruta que la persona haya elegido expresamente, salvo imposibilidad, inseguridad o riesgo material que requiera explicación/autorización. Acepta skips, deja `Pending` solo cuando el dato pueda afectar una decisión futura y bloquea únicamente ante dependencia material o gate humano real. `Decide tú` resuelve opciones internas/reversibles dentro del scope; no suplanta una preferencia o autorización humana material.

Después de un hito relevante, Jefe de proyecto puede explicar brevemente lo resuelto, el estado actual y el siguiente mejor paso en lenguaje natural, sin exponer fases/skills/owners internos. Recomendar no equivale a pedir permiso ni a detener: si el scope ya autoriza continuar y no hay gate material, continúa autónomamente bajo Progress Guard y Completion Mode. En recovery, reconciliar primero checkpoint/contexto vigente y retomar el trabajo; no repetir onboarding ni pasos ya resueltos.

Contenido / SEO distingue propuestas creativas de hechos empresariales. Puede construir arquitectura de contenidos, narrativa, copy, CTAs, metadata, enlaces y estrategia SEO, pero nunca inventa datos materiales. Diseñador UI/UX deriva una dirección visual de sector, producto, audiencia, posicionamiento, contenido, assets y uso; evita defaults no justificados y conserva el lenguaje aprobado de proyectos Existing. La paleta puede ser cualquier familia si está fundada; no existe un color prohibido ni una cuota de novedad. Maquetador frontend conserva la intención visual, responsive, estados e interacciones del diseño.

Ante una petición natural de diseño visual de página/interfaz web, si el trabajo crea una experiencia o sistema visual nuevo, BF-046 establece primero el UI Kit visual y su checkpoint de aprobación; una página high-fidelity comienza solo después. Sus páginas se entregan como HTML/CSS/JS responsive bajo `artefactos/diseno/paginas/`; la persona no necesita pedir HTML, UI Kit ni usar el término high-fidelity. Markdown puede documentar Creative Direction y complementar los artefactos visuales, nunca ser el único output cuando aplique alta fidelidad. No se entrega un render rasterizado en sustitución del HTML; los assets visuales siguen permitidos y el diseño en imagen/render se produce solo por petición. En runtime y comparación visual se prefiere evidencia estructural/directa; screenshots se reservan para condiciones visuales que lo requieran, no son logging o paso rutinario.

Mientras el diseño/prototipo espera Human Visual Approval, incluido cuando la persona pide verlo o abrirlo como página responsive, su ownership permanece en artefactos y no es runtime. `producto/` recibe implementación solo después de aprobación visual y un trigger de desarrollo suficiente. No se pregunta si se desea convertir a HTML cuando el diseño high-fidelity ya fue solicitado.

Jefe de proyecto infiere tres niveles internos de fidelidad:

- `Structural`: valida arquitectura, contenido, layout y comportamiento.
- `Visual`: propuesta visual completa, coherente y presentable.
- `Implementation reference`: resultado acabado para guiar fielmente una implementación posterior.

Estas etiquetas no forman un formulario para el usuario. Una solicitud natural de diseñar visualmente una página web infiere `Visual` por defecto salvo que el contexto/scope indique una especificación estructural o que el propio usuario limite el entregable. Antes de alta fidelidad se evalúa si faltan datos materiales. Un proyecto real recibe únicamente preguntas indispensables; uno ficticio o exploratorio puede autorizar en una sola pregunta la creación de marca, contenido, identidad y assets conceptuales. No se degrada silenciosamente el nivel pedido.

## Revisor y Agent Manager

Revisor permanece independiente, de solo lectura y verificación. Su revisión normal se limita al diff, criterios afectados, evidencia válida ya disponible y dependencias directas para probar hipótesis concretas. Emite hallazgos con evidencia/escenario/impacto y se detiene; cero hallazgos es un resultado completo. No ejecuta browser/screenshot, paridad visual, performance measurement, investigación web, auditorías generales ni suites aún válidas; una cuestión de especialidad se enruta aparte solo si Jefe de proyecto determina que aplica. No busca refactors ni mejoras estilísticas no relacionadas.

Solo si un finding suyo `HIGH`/`CRITICAL` es materialmente bloqueante y aún discutible, Jefe de proyecto puede abrir un único task fresco de Revisor para intentar refutarlo y obtener `CONFIRMED`, `REFUTED` o `UNPROVEN`. No se verifican así hallazgos ya demostrados, notas ni severidades menores; no es una cadena ni un gate general.

Para una revisión que bloquea el siguiente paso se usa preferentemente un subagente `task` en primer plano; Agent Manager/worktrees se reservan para una tarea que requiere aislamiento. Revisor inicia solo tras terminar specialists y cuando Jefe de proyecto haya estabilizado/reconciliado implementación y evidencia. La solicitud exige un informe conciso, priorizado y accionable, sin polling ni repetición completa tras cada corrección si basta una revisión incremental.

`task` es el mecanismo predeterminado para una unidad de la tarea actual que no requiere branch, worktree, filesystem aislado ni conversación top-level separada. Agent Manager puede usarse para una única sesión aislada; worktrees no habilitan paralelismo por default.

### Serial Subagent Orchestration / Single-Writer Execution (BF-062)

En cualquier trabajo coordinado del CN Pilot, máximo **un subagente de proyecto activo** a la vez, incluido Agent Manager y Revisor; no hay excepción read-only. Jefe de proyecto no inicia un segundo specialist hasta recibir resultado final/terminación del actual. Cuando se necesitan varios: specialist → termina → Jefe de proyecto reconcilia handoff/working tree/contexto → decide si hace falta el siguiente. No lance varios `task` en una misma respuesta ni deje tasks/background agents ejecutándose mientras continúa delegando. Usa un único owner cuando baste. STRUCTURAL puede pasar por varios owners, pero en serie. Revisor va al final, tras todas las escrituras de implementación y reconciliación de Jefe de proyecto.

La conciliación es ligera: conoce archivos/cambios pertinentes, comprueba diff/status si hace falta, recibe propuestas materiales para Project Context, resuelve/bloquea dependencias y vuelve a decidir alcance/owner. La salida válida del specialist se considera trabajo procesado; no reanalices todo sin contradicción, evidencia insuficiente, riesgo o cambio de estado. No fuerces el siguiente handoff si el resultado anterior ya cubre acceptance.

Antes de editar un archivo cuya lectura pueda estar stale —contexto del proyecto (`PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md`, `README.md`), `package.json`, config o archivo compartido/central del producto, uno modificado en fase anterior o tras un intervalo/cambio de estado— relee su contenido actual pertinente. No es obligación reabrir archivos intactos antes de cada edición.

Clasifica `apply_patch verification failed` primero como posible `STALE CONTEXT / PATCH MISMATCH`: relee archivo/fragmento vigente, comprueba qué cambió y regenera el patch. Un solo retry focalizado contra el contenido fresco; si vuelve a fallar, no repitas a ciegas: usa una edición directa/simple solo si es segura o devuelve bloqueo al owner. No implica automáticamente un fallo de Product.

El CN Pilot define workflow, responsabilidades, criterios de decisión y calidad; Kilo y la configuración del desarrollador definen proveedor, modelos, overrides y esfuerzo de razonamiento. La selección de IA está controlada por el usuario/entorno: Jefe de proyecto decide cuándo delegar y a quién, pero no asigna modelos a subagentes. Todos los agentes y skills deben funcionar con proveedores y modelos distintos sin cambiar el proceso. Una dependencia concreta solo pertenece al proyecto si la exige realmente el producto o un requisito técnico. La calidad se evalúa mediante resultados, evidencia, QA y alcance, no por branding o versión del modelo. Mantén un enfoque cost-aware: usa la vía menos costosa que complete la tarea con fiabilidad, evitando agentes, iteraciones y trabajo duplicado innecesarios.

Por defecto se mantiene **una sola sesión subagent activa en total**, remunerada o no. No se lanza una segunda sesión Agent Manager simultáneamente ni siquiera para read-only, tareas independientes o worktrees separados; no paralelices para ahorrar tiempo. Espera el cierre y reconciliación del agente activo antes de iniciar el siguiente. La selección de modelos permanece en Kilo/el entorno del desarrollador.

Las sesiones separadas de Agent Manager tienen transcript y ciclo de vida propios; no existe garantía del CN Pilot de entregar un resultado a una sesión padre ya terminada. Si el informe sigue accesible, se reutiliza.

El cleanup distingue cuatro estados: sesión finalizada, worktree desregistrado de Git, carpeta física eliminada y carpeta huérfana no registrada. Jefe de proyecto solo declara la limpieza completada después de verificar ausencia de cambios, consultar `git worktree list`, usar mecanismos seguros, ejecutar `git worktree prune` cuando corresponda y volver a comprobar el listado y la ruta. Nunca elimina automáticamente un worktree con cambios no confirmados ni una carpeta huérfana cuya eliminación segura no pueda demostrar. Si Kilo no expone control suficiente, reporta el estado real y la limpieza pendiente en lugar de editar `.kilo/agent-manager.json` o fingir automatización.

## Riesgo

Complejidad y riesgo se evalúan por separado. Un cambio pequeño puede elevarse si afecta producción, DB, autenticación, pagos, DNS, servidor o información sensible.

### Maintenance & Operations (BF-055)

El mantenimiento de sistemas vivos es proporcional al riesgo; los cambios de producción consideran entorno, recuperación y verificación. Incidentes preservan evidencia y limitan scope antes de cambios. La existencia de backup no prueba restore; rollback y restore son distintos. Diagnóstico especializado permanece bajo demanda (`maintenance-operations` coordina lifecycle, no sustituye specialist skills). Un microcambio conocido conserva `DIRECT`; no se instala monitoring ni se fuerza staging por defecto.

`/diagnostico` diagnostica bajo demanda y en solo lectura la integridad local del Core, routing, permisos críticos e inventario de CN Pilot; no es un test del proyecto, no se ejecuta automáticamente ni repara.

## Criterios de aceptación

TASK y STRUCTURAL deben convertir requisitos en condiciones verificables cuando aporte valor.

## Madurez de decisiones arquitectónicas

Discovery es progresivo y proporcional, no un requisito exhaustivo del onboarding. Si decisiones de comportamiento de producto afectan materialmente arquitectura, UX o implementación, acláralas primero sin inventar hechos de negocio; una incógnita no material puede permanecer `Pending`. `web-strategy` conserva estrategia web/content y `product-discovery` solo comportamiento funcional abierto. Persistir según valor durable y fuente de verdad; no imponer PRD ni cuestionarios.

Arquitecto distingue, cuando sea relevante, hechos confirmados, restricciones, supuestos, recomendaciones provisionales y decisiones aprobadas. Si una incógnita pendiente puede cambiar materialmente la arquitectura, la propuesta permanece `PROVISIONAL` e indica razones, alternativas, tradeoffs, información pendiente y qué debe confirmarse antes de implementar.

Cuando requisitos y restricciones son suficientes, Arquitecto puede recomendar con claridad y avanzar. Desarrollador no convierte una recomendación provisional en código si persisten puntos bloqueantes. `DECISIONES.md` y los ADRs se reservan para decisiones aprobadas o suficientemente establecidas.

En WordPress se evalúan primero las capacidades disponibles en Core y el stack existente antes de añadir almacenamiento, infraestructura o dependencias custom; la elección considera, según aplique, volumen, consultas, lifecycle, ownership, retención, relaciones, rendimiento, duplicación, mantenibilidad y portabilidad.

## Memoria del proyecto

- `PROYECTO.md`: contexto relativamente estable.
- `ESTADO.md`: orientación operativa breve sobre situación actual, trabajo en curso, bloqueos/dependencias materiales y siguiente paso recomendado. Solo cambia ante un delta que siga siendo útil en una decisión futura; no es diario ni copia de Git/checkpoint y no registra cada hito/commit/push. Rama u otro dato operativo solo si es una dependencia durable del trabajo.
- `DECISIONES.md`: decisiones importantes.
- `REQUISITOS.md`: requisitos.
- `artefactos/documentacion/funcionalidades/`: specs funcionales greenfield.
- `artefactos/documentacion/arquitectura/`: arquitectura transversal greenfield.
- `artefactos/documentacion/adr/`: ADRs formales greenfield.
- `artefactos/documentacion/auditorias/`: informes durables greenfield.
- `ARTEFACTOS.md`: índice de entregables reales del proyecto.

Los archivos raíz de contexto del proyecto (`README.md`, `PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md`) tienen writer único: Jefe de proyecto. Los especialistas los leen solo según scope y devuelven hechos/cambios materiales propuestos en su entrega; no persisten la memoria global. Mantienen ownership normal de sus artefactos especializados y del producto.

## Onboarding de proyectos

`/nuevo-proyecto` es la puerta de entrada recomendada, no una condición para hablar con Jefe de proyecto ni un mandato de crear producto nuevo. Funciona para proyectos no inicializados y proyectos reales nuevos/existentes; si el contexto ya está inicializado no lo reinicia. Inspecciona primero petición, contexto, recursos pertinentes e implementación; pregunta solo por el primer vacío material actual y reevalúa progresivamente. No exige todos los campos/detalles futuros: `Pending` no material, skips y `Decide tú` son válidos según el Guided Project Journey.

Se considera suficiente cuando están claros el objetivo de ahora, lo que existe y debe preservarse, restricciones materiales y próximo trabajo útil. El comando escribe solo deltas durables bajo ownership en `PROYECTO.md`, `REQUISITOS.md`, `DECISIONES.md`, `ESTADO.md` o `ARTEFACTOS.md`; no ejecuta migraciones de Context ni sobreescribe contenido manual existente. Los acuerdos materiales/irreversibles mantienen su autorización propia. Una invocación explícita ya solicita inicialización local: no se impone confirmación genérica adicional. Si el usuario no ha autorizado trabajo posterior, el cierre recomienda brevemente el siguiente paso; si ya está en scope, se continúa sin volver a pedir permiso. No desarrolles ni publiques producto como efecto implícito del onboarding.

`DECISIONES.md` solo registra decisiones importantes con alternativas razonables, que condicionen arquitectura/desarrollo futuro, sean costosas de cambiar o hayan sido decididas explícitamente por la persona. Requisitos, páginas, alcance y workflow no son decisiones automáticamente. Aplica internamente los gates de seguridad/layout y no traslades reglas operativas a la persona. Durante onboarding no muevas/edites producto, copies originales ni crees containers vacíos. Tras cambios de contexto completos, verifica archivos/diff y crea commit local si corresponde; sin Git continúa sin tratarlo como blocker.

## Contenido

En greenfield, `artefactos/contenido/` puede actuar como fuente editorial versionada para voz de marca, sitemap, metadata y enlazado. Las páginas se guardan en `artefactos/contenido/paginas/`, los artículos en `artefactos/contenido/blog/` y packs opcionales en `artefactos/contenido/estrategia/`. Crea las carpetas solo cuando exista su primer artefacto. `producto/contenido/` pertenece al stack/producto. En existentes conserva las fuentes vigentes. No usar Lorem Ipsum si existe contenido real o puede prepararse.

## Diseño

En greenfield, `artefactos/diseno/` contiene sistemas visuales, componentes, especificaciones y enlaces/IDs de Figma; un UI Kit web compartido puede vivir en `artefactos/diseno/ui-kit/index.html` con fuentes comunes bajo `artefactos/diseno/ui-kit/shared/`; páginas/prototipos se guardan en `artefactos/diseno/paginas/`, referencias en `artefactos/diseno/referencias/` y assets auxiliares creados para diseño en `artefactos/diseno/recursos/{imagenes,ilustraciones,iconos}/`, creando solo las carpetas necesarias. Las páginas importan/reutilizan las fuentes compartidas; no dupliques allí assets existentes ni edites originales de `recursos/`. No confundas diseño con producto implementado en `producto/`; `producto/diseno/` y sus assets pertenecen al stack. En Existing conserva sus rutas/fuentes vigentes.

### Visual Reference Intake & Fidelity (BF-048)

Una referencia visual puede llegar como adjunto, screenshot, URL, Figma, PDF, plantilla, moodboard, vídeo, asset existente o mención natural de la persona. No exijas que conozca rutas internas ni complete campos técnicos. Jefe de proyecto inspecciona las fuentes pertinentes, crea on-demand `recursos/referencias/REFERENCIAS.md` desde la plantilla cuando aparezca la primera referencia material y registra referencias manuales descubiertas; no precrees carpetas vacías. El registro es metadata operativa, no una copia del análisis ni de los originales. Trátalo como entrada original: no lo stages/commitees automáticamente porque puede exponer URLs privadas o provenance; revisa privacidad, tamaño y derechos igual que para el resto de `recursos/`. Los originales permanecen read-only en `recursos/referencias/` o en su source actual; los análisis derivados opcionales viven en `artefactos/diseno/referencias/`. Una URL puede quedar registrada sin descargar un mirror.

Cada referencia material conserva cuatro dimensiones independientes:

- **Source/type:** origen exacto o asset path y si es Figma, screenshot, URL, template, asset u otro medio.
- **Authority:** `INSPIRATION`, `DIRECTIONAL`, `APPROVED VISUAL REFERENCE` o `STRICT IMPLEMENTATION REFERENCE`.
- **Fidelity:** `LOOSE`, `DIRECTIONAL`, `HIGH` o `STRICT`.
- **Scope:** sitio, sistema, página, sección, component, asset, estado/interacción o breakpoint al que aplica.

El registro también indica brevemente qué `preserve` y qué `may adapt`, con notes/status solo si ayudan. Un nivel no fuerza el otro: un diseño aprobado puede requerir fidelidad alta sin exigir reproducción estricta. Inferencia natural: “me gusta” → Inspiration; “en esta dirección” → Directional; “aprobado por el cliente” → Approved; “replicarlo exactamente” → Strict cuando haya autoridad suficiente. Si el usuario declara propiedad/aprobación/licencia suficiente no vuelvas a preguntar en lenguaje jurídico. Si solicita copia exacta de un sitio/template externo de terceros sin aclarar si está autorizado, haz una sola pregunta material; un template comprado/uso autorizado no requiere reconfirmación.

La autoridad visual no implica automáticamente derechos para copiar sus fotos/logos/ilustraciones ni autoridad editorial sobre textos/claims. Respeta BF-044/BF-045: se puede replicar treatment/placement sin descargar un asset de terceros. No copies copy o información de referencia como hechos del proyecto salvo que el contenido también esté autorizado. No descargues sitios o assets indiscriminadamente; usa capability externa solo si existe, el source/scope/derechos bastan y la tarea lo requiere.

Las referencias compuestas se asignan por scope/ID, no se mezclan arbitrariamente. Una authority mayor prevalece solo donde se solapen sus scopes; referencias igual de autorizadas que se contradicen materialmente en el mismo scope requieren una sola pregunta. Una referencia desktop estricta gobierna lo observable en desktop; si falta mobile, dedúcelo con el sistema vigente sin afirmar que fue extraído, y una referencia mobile posterior gobierna ese breakpoint. Existing vigente es referencia de continuidad, no inspiración genérica.

Cuando exista referencia Approved/Strict, BF-046 sigue aplicando: el UI Kit deriva de la referencia y expone la extracción para aprobación humana, sin Creative Direction competidora. Tras aprobarlo, Dev/Design handoffs conservan **reference ID, source, authority, fidelity, scope, preserve, may adapt**. No se pierde esa semántica entre Jefe de proyecto, Diseñador UI/UX, Maquetador frontend, Desarrollador y Revisor. Authority determina si la referencia gobierna como source of truth dentro de su scope; fidelity determina exclusivamente la tolerancia: `LOOSE` no exige paridad visual detallada, `DIRECTIONAL` compara principios, `HIGH` preserva con precisión las relaciones observables y `STRICT` exige la correspondencia más cercana razonable. `APPROVED` no eleva por sí mismo la fidelidad declarada. Inspiration no activa pixel parity. Adaptaciones técnicas justificadas se documentan; drift material no se aprueba silenciosamente.

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

Para recursos representacionales, inspecciona solo assets pertinentes proporcionados por el usuario y la biblioteca vigente del proyecto. Prioriza assets existentes/aprobados o assets finales creados mediante una capacidad disponible y autorizada. Si la composición puede funcionar sin imagen, resuélvela sin simularla. Si la imagen es material para el resultado y no hay fuente apropiada ni capacidad autorizada para preparar un asset final, escala la necesidad/bloqueo a Jefe de proyecto o autor; continúa las partes independientes, pero no declares terminada como final la región que depende de ese recurso ni la rellenes con una representación falsa.

No conviertas la ausencia o falta de validación de un asset, dato o decisión visual en copy dentro de la UI/prototipo. No muestres notas de estado como “imagen conceptual”, “no es fotografía”, “pendiente de aprobación”, “espacio reservado”, “contenido provisional” o equivalentes, salvo solicitud explícita del usuario o que sean contenido editorial final y necesario. Compón con los hechos confirmados; explica la incertidumbre de procedencia, autenticidad, licencia, disponibilidad, aprobación o brief incompleto en el handoff, reporte o contexto fuera del lienzo.

En diseño, guarda únicamente assets auxiliares creados/curados para ese entregable bajo las carpetas on-demand indicadas arriba. `recursos/` sigue siendo entrada original y los assets de proyectos existentes conservan su ubicación/source of truth. En producto, usa la ubicación nativa del proyecto e implementa solo assets aprobados o definidos por el flujo de diseño correspondiente; no conviertas `artefactos/diseno/recursos/` en dependencia de runtime. En Existing, respeta la biblioteca, art direction y convenciones visuales vigentes: no introduzcas recursos vectoriales genéricos ajenos al sistema.

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

Esta es una prioridad de evaluación, no una checklist ni un mandato de agotar fuentes: ningún diseño debe mezclar todos los medios o añadir assets solo por “enriquecerlo”. La presencia visual puede ser sobria, densa, intensa o maximalista según la dirección; su nivel no es un defecto por sí mismo y se evalúa por intención, jerarquía, usabilidad y accesibilidad. Evita repetir la misma fórmula “sin foto → tipografía y whitespace” y también sustituirla por un pattern/SVG genérico recurrente. En Existing, la variedad de medios se subordina a continuidad con su identidad y su biblioteca aprobadas.

### Design System First (BF-046)

Ante una nueva experiencia visual material —sitio, landing, página nueva, ecommerce, SaaS, app, dashboard o rediseño relevante— no empieces directamente construyendo páginas Product. En Greenfield o al establecer una dirección nueva, sigue `Inspect Context → Creative Direction → Visual Asset Strategy → Foundations → Initial UI Kit → Internal System Review → Human Visual Approval`; ninguna página completa ni Product se adelanta al UI Kit aprobado. Después, la ubicación de la página high-fidelity depende del scope BF-057: full implementation puede empezar directamente en Product; Design-only conserva prototype artifacts. Una landing pequeña necesita un kit más compacto, no saltárselo. No aplica a correcciones DIRECT, bugs, hotfixes, mantenimiento localizado o ajustes dentro de un sistema vigente y aprobado.

La construcción del UI Kit, sus foundations/tokens/specimens/primitives y su check pre-aprobación tiene como fuente de verdad `.kilo/skills/ui-kit-construction/SKILL.md`; Diseñador UI/UX la activa obligatoriamente al crear foundations/Kit o ampliarlos materialmente, aunque el usuario no diga «UI Kit». La skill define el baseline operativo sin duplicar su checklist en Core. Creative Direction y decisiones de sistema permanecen en `ui-design-system`.

El Kit es artefacto visual navegable/evaluable bajo `artefactos/diseno/ui-kit/`, no producto/runtime ni Home. En Greenfield centraliza fuentes compartidas solo si tienen función real; el CSS de página se limita a composición/variants exclusivas. Producto implementa/adapta su sistema en la fuente nativa del stack y no depende runtime del Kit/artefactos. Antes de aprobación, se resuelve el check local de la skill; Diseño UI/UX revisa además grounding, autoridad, accesibilidad y proporcionalidad. El gate no amplía scope: en full implementation ya confirmado permite continuar con producto sin una página duplicada en artefactos; Design-only mantiene página/prototipo en artefactos. Human Page Review y publicación siguen siendo gates separados.

Cuando el usuario apruebe el UI Kit, Design-only pages y los Product pages derivados consumen esas foundations/shared files; solo la composición exclusiva tiene estilos locales. Si el primer Product candidate revela un patrón reutilizable coherente, clasifícalo como instance, variant o nuevo shared component, agrégalo al sistema/UI Kit y reutilízalo. Las extensiones naturales que conservan la dirección no requieren rehacer ni volver a aprobar todo el kit. Un cambio material de typography, palette, visual fingerprint, component paradigm o layout foundation sí se presenta a Human Visual Review antes de propagarse.

En Existing primero descubre Figma/tokens/framework/theme/builders/component library vigentes, que permanecen fuente de verdad. Un cambio localizado usa un fast path directo sobre Product/fuente existente, sin reconstruir UI Kit, Creative Direction ni prototipo. Para una página nueva/material, reutiliza el sistema ya aprobado y expón solo la extensión pertinente; una fuente aprobada e inalterada satisface su gate sin reconfirmación. Revisa humanamente cualquier adición material no aprobada.

Design y Product mantienen la misma intención aprobada, pero Product implementa su sistema mediante la solución nativa al stack (Figma/Design source, CSS, framework theme, WordPress/theme.json, Bricks Variables/Global Classes, Elementor Globals u otra fuente vigente); no exige compartir los mismos archivos. Conserva una sola fuente de verdad en cada fase, traduce tokens/variants/states y no introduzcas un sistema paralelo.

Si los permisos impiden escribir una ruta canónica, se reporta el bloqueo y no se reubica el artefacto en otra carpeta.

### Creative Web Experience (BF-066)

En public web Greenfield/rediseño visual material, Diseñador UI/UX activa por default `creative-web-experience` y completa discovery/evidencia antes de `VISUAL INTENT STABILIZED`. Research read-only disponible no pide permiso; un gap ENRICHABLE puede justificar una pregunta agrupada no bloqueante; Jefe de proyecto sigue siendo interlocutor. Las skills existentes conservan ownership de sistema, Kit, composition, media, content, motion e implementación. Application UI/dashboard sigue `application-ui`; Existing localized conserva continuidad; Approved/Strict BF-048 gobierna scope/fidelity. Tras estabilizar, QA conserva BF-063 y no reabre creatividad. No impone effects, research sin acceso, uso de rights no acreditados ni dependencies/tooling del Core.

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

Cuando un trabajo incluye diseño visual de página, sistema o interfaz relevante, aplica proporcionalmente y bifurca por scope:

```text
Inspect Context → Final Content → Creative Direction → Visual Asset Strategy
→ Foundations → Initial UI Kit → Internal System Review → Human Visual Approval (UI Kit)
    ├─ Design-only/prototype → High-Fidelity Design en Project Artifacts → Human Visual Review → Handoff
    └─ Full Implementation in scope → Product first candidate → Product Visual Review/Human Page Approval if material → derived pages
Approved/Strict reference or Existing source → existing approved system/reference fast path, no redundant rebuild
```

El gate inicial de UI Kit y la aprobación visual de página son distintos. La aprobación del kit autoriza el trabajo siguiente dentro del scope aprobado, pero no amplía el scope ni autoriza publicar. En Design-only la revisión de página permanece en Project Artifacts; en full implementation la primera composición puede revisarse sobre Product antes de multiplicar páginas cuando la dirección sea nueva/material. No construyas una copia HTML completa en Artifacts solo para volver a implementarla en Product. No preguntes redundantemente si se desea diseñar páginas o implementar después de un approval cuando eso ya estaba en scope. Estos gates no aplican a cambios DIRECT, bugs, hotfixes ni mantenimiento localizado dentro de un sistema aprobado. El contenido final/aprobado sigue siendo la fuente editorial: reorganizar presentación no autoriza inventar claims, datos, headings comerciales, microcopy ni reescribir el mensaje.

Cuando Design sea el entregable (`Design-only`, handoff o prototype pedido), el prototipo web high-fidelity se entrega como HTML/CSS/JS responsive en Project Artifacts, no como imagen plana; tras su aprobación guía la implementación posterior. Cuando full implementation ya esté en scope, Product es la página high-fidelity evaluable y la fuente que Maquetador frontend valida; el prototipo separado es excepcional (p. ej. la interacción compleja es esencial para elegir/aprobar la dirección). `Structurally valid` no equivale a `visually faithful`.

La prioridad de implementación es `native settings → clean structure → minimal scoped CSS when necessary`. CSS local es válido para detalles aprobados que el builder no resuelva razonablemente, siempre que esté scoped, no afecte recursos globales y no sustituya una arquitectura correcta. No se optimizan métricas artificiales como cero CSS, cero Divs, un Container obligatorio o cien por cien native.

Visual Parity QA compara proporciones, widths, whitespace, prominencia de imágenes, escala tipográfica, botones, relaciones de columnas, posiciones, spacing, ritmo y composición con la referencia aprobada. Ante referencia HTML/CSS/JS prioriza estructura, DOM, estilos y responsive; ante referencia raster/Figma puede requerirse captura representativa. No uses screenshots como logging ni los generes de rutina. Human Visual QA en navegador no se sustituye por render MCP, fragmentos de contenido, inspección del árbol o integridad técnica; si falta evidencia visual fiable, se informa `Technical QA complete; Visual QA pending`. No se exigen estas fases sin referencia visual aprobada y no se mantienen iteraciones de microajustes de bajo retorno indefinidamente.

Para clamps nuevos Greenfield, los endpoints mínimo y máximo usan px (BF-059); el valor fluido puede usar la expresión apropiada. En proyectos Existing/Approved/Strict prevalece la convención vigente si cambiarla afecta fidelidad. Responsive QA valida también jerarquía, orden, spacing, tipografía, proporciones de imagen, colapso del layout, botones, legibilidad y ritmo visual.

## Límite funcional del prototipo

`High-fidelity prototype` no equivale a `production-complete implementation`. Un prototipo debe hacer que el diseño se vea real, responda correctamente y se comporte de forma suficiente para validar UX: presentación, responsive, estados e interacción ligera. Por defecto difiere integraciones productivas, persistencia, backend, servicios externos, autenticación, pagos, email, webhooks, APIs y lógica de producción hasta la implementación final.

En formularios, búsqueda, filtros, login, checkout, newsletter, booking y patrones similares se permiten campos, labels, estados, validación visual, loading, success/error, resultados mock, selección, pasos, calendario o lógica local cuando ayuden a validar UX. No se implementan por defecto envío real, CRM, SMTP, gateways, reservas, sesiones, base de datos, backend, APIs ni servicios externos. `prototype interaction` no equivale a `production functionality`.

Si una calculadora, configurador, simulador, selector dependiente, comparador o flujo condicional es esencial para evaluar UX, puede usar local state, JavaScript simple, lógica determinista y mock data. Antes de añadir API, persistence, backend o integración de terceros, se comprueba que pertenezca a la fase y al scope; una petición explícita de funcionalidad real permite implementarla dentro del alcance autorizado. No se crea infraestructura temporal para simularla si una simulación local basta.

El prototipo aprobado es fuente de diseño, estados, interacción esperada, comportamiento visual, responsive y UX. La implementación final resuelve la funcionalidad una sola vez con el stack real —por ejemplo, un formulario visual puede pasar a una integración nativa de WordPress— y no copia automáticamente la infraestructura técnica provisional del prototipo.

## Benchmark-Driven Visual & Execution Refinement (BF-057)

Refina el workflow BF-046 sin crear gates/aprobaciones redundantes: Greenfield full implementation conserva el gate del UI Kit y, tras aprobación, implementa directamente el primer candidato en Product; la revisión humana de página (cuando sea material) se hace sobre ese Product candidate y no implica publicación. `Design-only` mantiene prototipo/approval en Project Artifacts. `APPROVED/STRICT` gobierna su scope sin Creative Direction/kit/page-artifact repetidos; Existing localizado reutiliza su fuente vigente sin reconstruir el sistema.

Greenfield visual QA evalúa fingerprint/presencia y composición específica del contenido, diversidad entre páginas cuando sus propósitos difieren y consistencia con el sistema; no exige novelty, una galería de componentes ni una fórmula visual. Para flujos full-stack complejos, sincroniza primero el contrato FE/BE y construye un vertical slice representativo antes de ampliar breadth. Ejecuta el check más barato tras un batch material, conserva tests PASS y rerun solo la superficie afectada; Browser/E2E, accessibility y performance permanecen proporcionales a riesgo/beneficio. Product Discovery conserva su activación progresiva y STOP ASKING.

### Execution Proportionality & Bounded Completion (BF-059)

La profundidad de implementación la determinan outcome, acceptance, riesgo real y dependencias reales, no la capacidad máxima del Core. Para cambios pequeños/medianos aplica el mínimo suficiente técnicamente correcto: no añadas capas, estados, lógica, infraestructura, documentación, abstracciones ni checks sin necesidad demostrable. Esto nunca reduce auth, roles, aislamiento, seguridad, persistencia, backend, APIs o integración cuando el outcome los requiere. Existing conserva por defecto globals, rutas y comportamiento no afectados; cambia un global solo por requisito, dependencia, bug, decisión visual aprobada, incompatibilidad real o scope explícito.

DIRECT/TASK cierran sin sincronizar todos los documentos: cada Project Context, README y ARTIFACTS se actualiza solo por un delta material bajo su ownership. No conviertas contexto en bitácora ni prolongues acceptance por housekeeping.

**Product QA tiene límite explícito:** ROUND 1 es una sola ronda proporcional que agrupa findings materiales. Si pasa, Product QA termina. Si hay findings, corrígelos en un batch razonable y haz ROUND 2 solo sobre findings corregidos, superficies directamente afectadas y regresiones relacionadas. BLOCKER significa funcionalidad rota, seguridad, pérdida/corrupción de datos, acceptance incumplido o error runtime material; MATERIAL incluye responsive, accesibilidad, SEO requerido, interacción, contraste o error visual importante. HOUSEKEEPING incluye whitespace/formato/documentación menor/warnings internos y nunca reinicia Product QA. Tras ROUND 2, QA termina salvo BLOCKER real; solo ese blocker permite una iteración 3 acotada a resolverlo y comprobar la superficie afectada, no una nueva ronda completa. Si ROUND 2 no deja blocker, STOP. Microajustes opcionales, curiosidad, capturas adicionales y mejoras de wording no justifican continuar.

Un PASS de Product QA solo queda invalidado por un cambio material en Product o una dependencia de runtime del producto. Documentación, Project Context, README/ARTIFACTS, whitespace, staging, diff, `git diff --check` y commit no lo invalidan. Si `git diff --check` falla, corrige y repite solo ese check; no reinicies browser, Revisor ni responsive. El cierre documental/Git es finito.

Antes de Browser QA clasifica el runtime: **STATIC_PORTABLE** (default para HTML/CSS/JS sencillo; entry HTML abre con `file://`, rutas relativas, multipágina portable, sin fetch local ni módulo/runtime innecesario), **STATIC_HTTP** (solo con razón técnica concreta que requiera HTTP, como modules/fetch/router/service worker; documenta la razón) o **APP_RUNTIME** (backend/API/auth/SSR/sesión/router/servicios; runtime necesario). No levantes servidor por defecto. Un servidor temporal de QA no crea dependencia de entrega; no añadas preview/server helpers salvo que sean parte necesaria del outcome. Para un STATIC_PORTABLE, comprueba desde entry compartible que recursos/enlaces usan rutas portables; evita root-relative paths.

`artefactos/` documenta, demuestra y contiene UI Kit/prototipos/outputs de apoyo; producto funciona y contiene sus dependencias runtime. Producto nunca importa/solicita runtime de `artefactos/` (incluido CSS/JS/UI Kit): traduce/adapta sus tokens y componentes a rutas propias. Verifica esta frontera al implementar, no en una ronda tardía.

Para UI Kit nuevo o ampliación material, aplica los contratos detallados y checks pre-aprobación de `ui-kit-construction`; BF-059 mantiene transversalmente el límite Product/Artifacts y el foco de campos. No dupliques en Core las reglas de construcción de tokens.

Browser QA primero reutiliza tooling del stack o harness/browser disponible; después usa comprobaciones manuales simples y focalizadas. No construyas clientes CDP/WebSocket, mini-frameworks ni cadenas de scripts para validar scripts cuando una opción simple existente resuelve el criterio. Solo una necesidad real no cubierta puede justificar un helper pequeño dentro del tooling existente; no añadas framework/capability CN.

Cuando haya alternativas humanas claras y Kilo ofrezca capacidad nativa de selección, pregunta mediante esa UI con opción custom siempre disponible. Usa texto abierto si la pregunta es abierta, las opciones no son razonablemente predefinibles o la capacidad no existe; no exijas respuestas numeradas ni construyas formularios propios.

### Visual Candidate Preservation / QA Is Not Redesign (BF-063)

**QA verifies; QA does not redesign. Objective defect fixing is autonomous; subjective visual redesign is not QA.** En una página/interfaz nueva o materialmente rediseñada, cuando su owner visual considera suficientemente resueltos composición, jerarquía, sistema, contenido disponible, responsive intent, media, ritmo, componentes y estados visuales materiales, ese candidato presentable queda conceptualmente `VISUAL INTENT STABILIZED`. No significa pixel-perfect ni QA terminado: desde entonces QA preserva el carácter y la composición del candidato salvo autoridad visual aplicable o decisión humana. No se crea una máquina de estados ni un schema nuevo.

Technical QA, Maquetador frontend y Revisor corrigen/verifican defectos demostrables contra comportamiento, acceptance, accessibility, responsive, sistema aprobado o referencia con autoridad; aplican `minimum visual delta`, limitado a la región afectada. Overflow, clipping, layout roto, navegación/interacción defectuosa, contenido ilegible, contraste/foco/teclado incumplido, breakpoint defectuoso, imagen deformada por implementación, regression y desviación real del Kit o referencia son defectos corregibles; conservar el rigor técnico es obligatorio. «Más limpio/consistente/profesional/estándar/simple/equilibrado» sin incumplimiento demostrable es preferencia, no finding. No se aprovechan fixes para limpiar CSS o alterar otras zonas.

Si corregir un defecto exige un cambio visual material —composición u orden, jerarquía, silueta/hero, escala tipográfica expresiva, ritmo/spacing global, densidad, media/crop/art direction, grid, geometría/característica de componentes, color balance, tokens globales, styling o carácter de motion— se documentan defecto y evidencia, scope y por qué un fix localizado no basta; se propone una solución acotada y se devuelve a autoridad visual/`Human Visual Review` antes de aplicar el rediseño. Un blocker real de accessibility, functionality, security, responsive o usability no se abandona: se resuelve según urgencia y scope, pero cualquier solución de impacto visual material vuelve a Human Visual Review antes de considerarse visualmente aprobada. Kit/design system Approved sigue siendo autoridad; un problema sistémico se escala como modificación de sistema, no se cambia globalmente para arreglar una instancia.

Tras alcanzar el candidato coherente y antes de QA, el estado pre-QA debe ser recuperable mediante el checkpoint Git/local seguro ya vigente cuando exista; no se fuerzan commits intermedios ni se añaden ramas, tags, copias o infraestructura. Si no hay checkpoint limpio, la protección es congelar intención, minimizar deltas y no alterar el candidato mientras espera revisión. Tras los fixes, antes de presentarlo, haz una comprobación focal de drift en archivos/regiones afectados, no otra auditoría: sin drift material queda listo; con drift, no lo declares visualmente aprobado y escala la decisión. Después de QA técnico suficiente, la primera dirección/rediseño material/página representativa para la que el flujo exige review se detiene para `Human Visual Review`; mientras espera, el candidato exacto presentado permanece sin modificaciones automáticas ni nuevos refinamientos, y no se multiplican páginas dependientes si aplica ese gate. Esto no añade gate a DIRECT/bug pequeño, copy o metadata localizada, mantenimiento, Existing localizado dentro de sistema aprobado ni derivados sin novedad material. Aprobación humana inequívoca del candidato constituye una referencia visual Approved bajo BF-048, en su scope/fidelity declarados, y baseline a preservar; no implica pixel-perfect. Cambios derivados la respetan; cambio material vuelve a aprobación. `visual-parity-review` conserva su trigger Approved/Strict y nunca se usa sobre candidatos aún no aprobados.

## Lifecycle de capabilities y SEO

Las capabilities MCP son dinámicas. Tras instalar o activar plugins, módulos, licencias, integraciones, servidores o configuraciones, se debe reconectar o refrescar, repetir Discovery y actualizar la comprensión de capabilities antes de declarar una limitación. Prioriza `specialized capability → safe generic capability → low-level workaround only when justified`; capacidad de lectura no implica capacidad de escritura, y capacidad técnica no amplía el scope autorizado. Cuando aporte valor, documenta de forma ligera `capability → provider → read/write → scope → risk`.

### Versioned Core Updates (BF-064)

`.cn-pilot-version` es SemVer distribuible del Core. `/cn-estado` y `/cn-actualizar` son explícitos, sin autocheck. Operación, inventario managed/project-owned, baseline SHA-256, conflicto, legacy y recovery pertenecen a [ACTUALIZACIONES.md](documentacion/ACTUALIZACIONES.md) y `.cn-pilot/update/`; el manifest distribuible generado es la autoridad de archivos y hashes. Updater es instalador de paths allowlisted, nunca Git merge/pull: solo actualiza archivos managed de CN Pilot, excluye `.cn-pilot/runtime/`, contexto del proyecto/README, producto, recursos, artefactos, secrets y configuración mixta. No hay push, auto-update, tags, preview ni Releases. Tracked dirty tree, active task, incompatibilidad, manifest/hash inválido y conflicto detienen writes. La migración mayor 1.x → 2.0 presenta primero un plan, detecta colisiones, protege datos project-owned, conserva Existing compatibility exception y requiere autorización explícita para aplicar; bootstrap legacy sin baseline permanece separado. Cada distribución futura requiere SemVer bump, aunque un cambio interno BF aislado no requiera release.

No hardcodees un builder, plugin o proveedor como requisito del Core: una integración puede exponer elementos, updates, revisions, templates, components, global classes, variables, Theme Styles, design context, import/export o render. Descubre lo realmente disponible y elige la capability específica y segura. Una tool de importación HTML/CSS debe evaluarse en entorno seguro por estructura nativa, editabilidad, wrappers, clases globales, responsive, fidelidad y mantenibilidad; `import successful` no equivale a implementación builder-native limpia.

Las escrituras sobre el mismo recurso remoto que use revisiones, digests, tokens de estado u optimistic concurrency son secuenciales por defecto: `write → reread → verify state/digest → next write`. Ante timeout, reset, conflicto o respuesta incierta: `reconnect → reread → determine what persisted → identify last valid state → continue`; nunca hagas blind retry.

Cuando exista un plugin SEO activo y sus capabilities estén disponibles, el QA SEO debe inspeccionar el estado actual, escribir metadata autorizada, ejecutar el análisis real del plugin, corregir checks relevantes y volver a analizar. El objetivo es la puntuación práctica más alta sin keyword stuffing, contenido antinatural, deterioro de UX ni modificación no autorizada del copy aprobado. Un score es una señal, no una métrica absoluta. Slugs publicados, indexación, schema destructivo y contenido aprobado requieren cautela adicional.

## Security QA basado en riesgo

`security review != universal mandatory audit` y `security review != security theater`. Activa `security-review` según datos, superficie expuesta, privilegios, autenticación, integraciones, capacidad de escritura, entorno e impacto. Auth, autorización, APIs, uploads, formularios con datos reales, persistencia, plugins, WooCommerce, pagos, webhooks, secretos e integraciones sensibles requieren revisión focalizada; copy, CSS trivial y frontend sin superficie sensible normalmente no. Los hallazgos deben distinguir evidencia confirmada, riesgo probable y hardening, y mantener validación/authorization, least privilege, fallbacks seguros y protección de secretos sin añadir scanners o gates universales.

## Git

- Git es una capacidad opcional: el CN Pilot funciona en carpetas sin Git, repositorios locales y repositorios con GitHub u otros remotos.
- Sin Git se omiten comandos, ramas, hashes, worktrees y commits; se verifican los archivos directamente y la ausencia no se trata como bloqueo.
- El CN Pilot nunca ejecuta `git init` salvo solicitud explícita o alcance confirmado.
- Cuando Git existe, Jefe de proyecto crea automáticamente un commit local por defecto cuando una tarea modificó archivos y quedó totalmente terminada y verificada; no pregunta al usuario si quiere hacerlo.
- Para trabajo individual y secuencial, el flujo local por defecto es `main → trabajar → verificar → commit local`; `main` representa normalmente el estado actual y estable del proyecto. Cualquier acción remota requiere la autorización del contrato Git indicada abajo.
- Las ramas son opcionales: solo se crean cuando existe una razón concreta de colaboración/aislamiento por riesgo, experimento descartable, Pull Request o solicitud explícita. No habilitan ejecución paralela de subagentes; no son necesarias para mantenimiento, documentación, mejoras pequeñas o trabajo individual normal.
- No crea commit si la tarea está incompleta, fue solo diagnóstico o exploración, existen errores bloqueantes o el usuario lo prohibió explícitamente.
- Conventional Commits.
- Descripciones siempre en español.
- Mensajes basados en el diff real.
- Stage limitado a la unidad lógica relacionada.
- Nunca hace push automático.
- El cierre por defecto es local: acciones remotas (push, deploy/publicación, PR, merge, tag, release) requieren autorización explícita o un scope ya aprobado que las incluya inequívocamente. Las reglas permanentes se heredan sin repetirlas en cada prompt.
- No se hereda un workflow GitHub Actions de deployment. Se crea uno específico solo cuando el proyecto solicita configurarlo, método/destino están definidos y existe autorización; un trigger automático exige además intención y autorización explícitas.
- Cada tarea completada recibe un informe final breve y proporcional; incluye solo resultado, cambios y verificaciones pertinentes, agentes/Revisor si intervinieron y hash/mensaje exactos si hubo commit. Tras informar, Jefe de proyecto se detiene.
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

Pruebas proporcionales: syntax, lint, unit, integration, browser/e2e, smoke, responsive y accessibility cuando correspondan. Antes de una fase material, plan breve de superficies/riesgos/evidencia mínima/PASS; conserva PASS que el cambio no invalide y rerun dirigido tras fixes. Detente cuando acceptance y riesgo estén suficientemente cubiertos, sin contradicción ni findings materiales. Más métodos/evidencia no implican mayor calidad; no reduzcas profundidad necesaria para el outcome.

## QA ejecutable del Core (BF-051)

`.cn-pilot/qa/core-check.mjs` comprueba de forma read-only, determinística y portable las invariantes estructurales expresas de CN Pilot. Usa solo APIs built-in de Node; no instala dependencias, accede a la red, ejecuta código de Product ni modifica archivos. `--json` produce el contrato machine-readable y los exit codes documentan PASS/WARN/FAIL/runtime error. `node:test` es estable desde Node 20 según la [documentación oficial](https://nodejs.org/api/test.html); la suite se verificó con Node 24.19.0, sin fijar una versión/engine para el Core.

Actívalo para mantenimiento del Core o desde `/diagnostico` cuando Node esté disponible y su ejecución autorizada, no para tareas normales de proyecto. Sin Node/acceso, reporta QA como `UNAVAILABLE` (no `BROKEN`); `/diagnostico` conserva fallback manual read-only. QA puede acelerar la instantánea del diagnóstico, pero no la evaluación contextual ni reemplaza Revisor, behavioral retests, testing del producto o `/diagnostico`. No auto-repair.

## Seguridad

Considerar según aplique: sanitización, escaping, auth, capabilities, nonce/CSRF, XSS, SQL, uploads, REST/AJAX, secretos y exposición de datos.

## Ciclo de vida

`Content → Design → Frontend/Prototype → Handoff → CMS Integration → Deployment`

Las fases son puntos posibles de entrega, no una secuencia obligatoria. Un flujo puede empezar o terminar en cualquiera de ellas y omitir las demás. En sistemas existentes se inspecciona primero la implementación actual y solo se activan las fases necesarias. El destino puede variar por entregable dentro del mismo proyecto. En greenfield, outputs auxiliares de contenido/diseño/documentación van en `artefactos/` y la implementación bajo `producto/`; la raíz no es destino habitual de outputs.

### Automatización e integraciones operativas

La automatización es una capability, no un proveedor: elige el mecanismo nativo más simple que sea fiable para el proyecto; no impongas una plataforma. Para un proceso técnico material define trigger/no-trigger, input y entorno; estado suficiente; concurrencia/tiempo cuando aplique; idempotencia, retry acotado, fallo parcial y recuperación observable. Distingue esta orquestación de backend síncrono, del contrato API (`api-integration`) y de deployment. Mantén efectos externos sujetos a BF-053; detalles version-sensitive de scheduler/proveedor se verifican con fuente primaria actual mediante `source-grounded-development`.

## Principio de contexto

El CN Pilot puede ser completo sin cargarlo entero en cada tarea. Los agentes deben usar solo archivos, skills y documentación relevantes; evitar releer lo ya analizado, rehacer razonamientos correctos del especialista, delegar sin necesidad o activar reviews sin beneficio.

Las skills deben declarar una capability coherente y un trigger claro, ofrecer guía operacional y verificable proporcional a su riesgo, evitar duplicar doctrina del Core y consultar fuentes primarias actuales cuando el comportamiento dependa materialmente de una versión. Se descubren por metadata y se cargan bajo demanda. Antes de incorporar una skill, comprueba que cubra una capability distinta, su routing, profundidad suficiente, límites/ownership y una vía de verificación; no uses el tamaño como proxy de calidad.

## Criterio de éxito

Otro desarrollador debe poder clonar el repo, entender contexto/estado/decisiones y continuar trabajando sin depender del ordenador o memoria del creador.

## Regla final

Si una regla, documento, agente, skill o workflow no aporta valor proporcional a la tarea, no debe activarse.
