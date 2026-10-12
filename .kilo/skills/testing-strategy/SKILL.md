---
name: testing-strategy
description: Determinar y ejecutar una estrategia de pruebas proporcional al cambio y al stack. Úsala para TASK/STRUCTURAL, regresiones importantes o cuando no está claro qué verificar.
---

# testing-strategy

Selecciona por riesgo: syntax, lint, unit, integration, browser/e2e, smoke, responsive, accessibility.

DIRECT: verificación mínima suficiente.
TASK: pruebas del comportamiento afectado.
STRUCTURAL: cobertura por criterios y riesgos.

Antes de una fase material de QA, define un plan breve (en el task/checkpoint, no un documento nuevo): superficies afectadas, riesgos materiales, evidencia mínima, PASS y checks existentes. La ladder es syntax/static/type/build → unit/domain → integration → browser/E2E → Reviewer; detente en el nivel más bajo que cubra el riesgo. No ejecutes un nivel solo porque existe tooling. QA termina cuando acceptance aplicable tiene evidencia suficiente, checks afectados PASS, no hay finding HIGH/material abierto ni evidencia contradictoria y Reviewer (si aplica) no detecta un gap material. No busques «una comprobación más» tras ese punto.

Una afirmación suele requerir una evidencia adecuada. Reutiliza PASS mientras cambios posteriores no puedan invalidarla; tras un fix repite el check fallido y los directamente relacionados, ampliando solo si el cambio afecta otras superficies. Distingue `QA TOOL FAILURE` (p. ej. syntax/fixture/selector del helper) de `PRODUCT FAILURE`: si el check imprescindible falla, corrígelo una vez de forma focal; si no lo es, descártalo y usa la evidencia simple disponible. No encadenes scripts para validar scripts ni construyas mini-frameworks ad-hoc. Playwright/E2E y suites completas se reservan a evidencia material que no pueda obtenerse razonablemente con checks existentes más simples; nunca rebajes profundidad de backend, auth, permisos, persistencia, seguridad o integración exigida por el outcome.

La revisión humana es evidencia real. QA automatizado prioriza errores menos fiables a simple vista (runtime, rutas, consola/red, estados, lógica, permisos, persistencia, APIs, regresiones y estructura semántica); belleza, presencia, composición y «se siente bien» corresponden a Designer/Human Visual Review cuando aplique, no a baterías de capturas.

Responsive: selecciona viewports por breakpoint real, source Existing, componente y riesgo. Usa la cantidad mínima; **máximo normal 3 viewports representativos por superficie afectada**, nunca una obligación de probar tres ni una matriz fija. Un tercer viewport requiere cambio/layout/tablet behavior/finding/riesgo material. Si el cambio no afecta responsive, usa cero. Capturas no son evidencia obligatoria: prefiere DOM, estado/layout/computed values, overflow, interacción, URL, consola/network. Captura solo ante condición visual material, parity Approved/Strict, solicitud o necesidad de revisión visual; son temporales y se eliminan salvo deliverable/evidencia durable explícita.

En un DIRECT de riesgo bajo verifica el resultado afectado y detente: texto en la fuente/render si está disponible; CSS en el breakpoint afectado; metadata mediante relectura y checks del plugin cuando aplique. Un cambio pequeño de slug publicado, redirect, roles o permisos no se vuelve DIRECT solo por su tamaño: evalúa impacto SEO, autorización y seguridad. No dispares suites de seguridad, accesibilidad, browser o paridad visual completas sin superficie o referencia que las justifique. Si una redirección autorizada se verifica, comprueba status y `Location` real.

En revisiones de maquetación, además de sintaxis, render, integridad, headings y responsive, comprueba el árbol de elementos, semántica, responsabilidad de Containers, Blocks como unidades lógicas, wrappers con función real, layout-intent (Grid/Flex), editabilidad, mantenibilidad y convenciones nativas del stack. En builders inspecciona el árbol y schemas disponibles cuando las tools lo permitan.

Distingue la fase: Prototype QA cubre visual, responsive, interacción, estados y comportamiento básico de navegador; Production QA añade integración, funcionalidad, persistencia, APIs, backend, seguridad, manejo real de errores y servicios externos. No exijas pruebas de infraestructura inexistente en un prototipo.

Selecciona evidencias por riesgo y fase, sin convertirlas en gates universales: static/structural validation, browser/runtime validation, visual parity validation, accessibility validation, performance validation y Security QA son capas distintas. `webapp-testing` cubre runtime browser; `visual-parity-review` compara solo contra una referencia aprobada; `accessibility-review` no convierte un automated scan en conformidad; `performance-review` requiere una pregunta o medición; `security-review` se activa por superficie sensible real. Una ausencia de tooling opcional se reporta como límite de evidencia, no como fallo automático.

### Full-stack integration churn (BF-057)

Cuando un TASK/STRUCTURAL complejo cruce frontend/backend y un desacuerdo de IDs, API, auth o estado pueda invalidar mucho trabajo, acuerda el contrato mínimo compartido y verifica el camino con más riesgo mediante una vertical slice antes de ampliar el producto. Tras cada batch material ejecuta primero el check existente más barato que pueda detectar errores (type/build/contrato/unit); no instales tooling nuevo por esta pauta. Después de un fix rerun los tests cuya semántica/superficie cambió, conserva los PASS válidos y reserva la suite completa para el scope/riesgo final; no repitas browser/E2E tras una microedición no relacionada. No reduzcas pruebas de seguridad o integración necesarias ni apliques vertical-slice overhead a una web estática sencilla.

## Full-stack flow efficiency (BF-057)

Solo cuando un TASK/STRUCTURAL complejo cruce frontend/backend y un contrato incompatible pueda invalidar mucho trabajo, alinea la interfaz mínima antes de expandir: IDs, API/request-response, estados/tipos y auth si cambia el diseño. Valida primero una vertical slice representativa del outcome antes de ampliar a pantallas/endpoints. Después de cada batch material selecciona el check ya disponible más barato que pueda encontrar fallos tempranos (type/build/contrato/unit); no instales tooling por rutina. Tras un fix, rerun solo las pruebas cuya superficie/semántica cambió o cuyo PASS quedó invalidado; conserva las restantes y reserva integración/browser/E2E/full-suite para el riesgo y criterio pertinente. Nunca reduzcas coverage de backend/security requerida; no impongas este overhead a un sitio estático o cambio independiente.

Reviewer consume este plan, diff y PASS vigentes: comprueba acceptance, alcance, riesgos materiales y gaps/contradicciones; no recrea suites, flujos browser o matrices responsive salvo que el PASS sea inválido o insuficiente. Cero findings es una aprobación completa.

## BF-039 — Self-test de gates custom

Actívalo únicamente si el proyecto crea o cambia materialmente lógica propia automatizada cuyo `PASS/FAIL` controla una decisión material (cierre, deploy/publicación, configuración crítica, operación insegura o acceptance), o si evidencia concreta cuestiona su detección. No todo test/check es un gate: no self-test rutinario de herramientas maduras de terceros (`npm`, Git, linters, test runners, compiladores, validadores oficiales) ni de tests ordinarios o checks ad-hoc no decisivos. Si un wrapper propio interpreta su resultado y controla la decisión, valida esa lógica propia.

Antes de confiar en el gate, demuestra ambos controles:

- **KNOWN-GOOD → PASS** por la condición/ruta prevista.
- **KNOWN-BAD → FAIL** debido específicamente a la condición que debe detectar, no por syntax error, dependencia ausente, path accidental, permiso u otro fallo ajeno.

Usa fixture/directorio temporal, copia aislada, input simulado o mock según convenga. Separa gate y side-effect protegido: no provoques fallos en producción, datos vivos, secretos o infraestructura activa. El self-test demuestra el gate, no exige ejecutar la publicación protegida. Reutiliza evidencia mientras no cambien semánticamente condición, inputs, paths/globs, parsing, exit-code/error handling, fallback o composición de checks; formato/comentarios/mensajes no lo reactivan. No repitas en cada uso ni generes mutations/casos extra tras evidencia suficiente.

Si el control negativo no puede hacerse de forma segura/proporcional, no lo simules ni declares validado el gate: registra en el contexto de la tarea qué queda no demostrado. Puede seguir usándose exploratoriamente, pero no es evidencia decisiva; Dev Lead juzga si eso bloquea acceptance. No crea un estado global ni framework nuevo. En Completion Mode, el self-test requerido del gate de la tarea es verificación, no discovery; al obtener los dos controles, detente. BF-036 solo se activa aparte si hay una cuestión externa/versionada material. Reviewer puede revisar la evidencia entregada, pero no ejecuta gate ni self-test.
