---
name: testing-strategy
description: Determinar y ejecutar una estrategia de pruebas proporcional al cambio y al stack. Úsala para TASK/STRUCTURAL, regresiones importantes o cuando no está claro qué verificar.
---

# testing-strategy

Selecciona por riesgo: syntax, lint, unit, integration, browser/e2e, smoke, responsive, accessibility.

DIRECT: verificación mínima suficiente.
TASK: pruebas del comportamiento afectado.
STRUCTURAL: cobertura por criterios y riesgos.

En revisiones de maquetación, además de sintaxis, render, integridad, headings y responsive, comprueba el árbol de elementos, semántica, responsabilidad de Containers, Blocks como unidades lógicas, wrappers con función real, layout-intent (Grid/Flex), editabilidad, mantenibilidad y convenciones nativas del stack. En builders inspecciona el árbol y schemas disponibles cuando las tools lo permitan.

Distingue la fase: Prototype QA cubre visual, responsive, interacción, estados y comportamiento básico de navegador; Production QA añade integración, funcionalidad, persistencia, APIs, backend, seguridad, manejo real de errores y servicios externos. No exijas pruebas de infraestructura inexistente en un prototipo.

Selecciona evidencias por riesgo y fase, sin convertirlas en gates universales: static/structural validation, browser/runtime validation, visual parity validation, accessibility validation y performance validation son capas distintas. `webapp-testing` cubre runtime browser; `visual-parity-review` compara solo contra una referencia aprobada; `accessibility-review` no convierte un automated scan en conformidad; `performance-review` requiere una pregunta o medición. Una ausencia de tooling opcional se reporta como límite de evidencia, no como fallo automático.
