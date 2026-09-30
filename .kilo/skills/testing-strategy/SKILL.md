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
