---
name: testing-strategy
description: Determinar y ejecutar una estrategia de pruebas proporcional al cambio y al stack. Úsala para TASK/STRUCTURAL, regresiones importantes o cuando no está claro qué verificar.
---

# testing-strategy

Selecciona por riesgo: syntax, lint, unit, integration, browser/e2e, smoke, responsive, accessibility.

DIRECT: verificación mínima suficiente.
TASK: pruebas del comportamiento afectado.
STRUCTURAL: cobertura por criterios y riesgos.

En un DIRECT de riesgo bajo verifica el resultado afectado y detente: texto en la fuente/render si está disponible; CSS en el breakpoint afectado; metadata mediante relectura y checks del plugin cuando aplique. Un cambio pequeño de slug publicado, redirect, roles o permisos no se vuelve DIRECT solo por su tamaño: evalúa impacto SEO, autorización y seguridad. No dispares suites de seguridad, accesibilidad, browser o paridad visual completas sin superficie o referencia que las justifique. Si una redirección autorizada se verifica, comprueba status y `Location` real.

En revisiones de maquetación, además de sintaxis, render, integridad, headings y responsive, comprueba el árbol de elementos, semántica, responsabilidad de Containers, Blocks como unidades lógicas, wrappers con función real, layout-intent (Grid/Flex), editabilidad, mantenibilidad y convenciones nativas del stack. En builders inspecciona el árbol y schemas disponibles cuando las tools lo permitan.

Distingue la fase: Prototype QA cubre visual, responsive, interacción, estados y comportamiento básico de navegador; Production QA añade integración, funcionalidad, persistencia, APIs, backend, seguridad, manejo real de errores y servicios externos. No exijas pruebas de infraestructura inexistente en un prototipo.

Selecciona evidencias por riesgo y fase, sin convertirlas en gates universales: static/structural validation, browser/runtime validation, visual parity validation, accessibility validation, performance validation y Security QA son capas distintas. `webapp-testing` cubre runtime browser; `visual-parity-review` compara solo contra una referencia aprobada; `accessibility-review` no convierte un automated scan en conformidad; `performance-review` requiere una pregunta o medición; `security-review` se activa por superficie sensible real. Una ausencia de tooling opcional se reporta como límite de evidencia, no como fallo automático.

## BF-039 — Self-test de gates custom

Actívalo únicamente si el proyecto crea o cambia materialmente lógica propia automatizada cuyo `PASS/FAIL` controla una decisión material (cierre, deploy/publicación, configuración crítica, operación insegura o acceptance), o si evidencia concreta cuestiona su detección. No todo test/check es un gate: no self-test rutinario de herramientas maduras de terceros (`npm`, Git, linters, test runners, compiladores, validadores oficiales) ni de tests ordinarios o checks ad-hoc no decisivos. Si un wrapper propio interpreta su resultado y controla la decisión, valida esa lógica propia.

Antes de confiar en el gate, demuestra ambos controles:

- **KNOWN-GOOD → PASS** por la condición/ruta prevista.
- **KNOWN-BAD → FAIL** debido específicamente a la condición que debe detectar, no por syntax error, dependencia ausente, path accidental, permiso u otro fallo ajeno.

Usa fixture/directorio temporal, copia aislada, input simulado o mock según convenga. Separa gate y side-effect protegido: no provoques fallos en producción, datos vivos, secretos o infraestructura activa. El self-test demuestra el gate, no exige ejecutar la publicación protegida. Reutiliza evidencia mientras no cambien semánticamente condición, inputs, paths/globs, parsing, exit-code/error handling, fallback o composición de checks; formato/comentarios/mensajes no lo reactivan. No repitas en cada uso ni generes mutations/casos extra tras evidencia suficiente.

Si el control negativo no puede hacerse de forma segura/proporcional, no lo simules ni declares validado el gate: registra en el contexto de la tarea qué queda no demostrado. Puede seguir usándose exploratoriamente, pero no es evidencia decisiva; Dev Lead juzga si eso bloquea acceptance. No crea un estado global ni framework nuevo. En Completion Mode, el self-test requerido del gate de la tarea es verificación, no discovery; al obtener los dos controles, detente. BF-036 solo se activa aparte si hay una cuestión externa/versionada material. Reviewer puede revisar la evidencia entregada, pero no ejecuta gate ni self-test.
