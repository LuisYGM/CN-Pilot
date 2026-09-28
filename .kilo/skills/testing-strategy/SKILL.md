---
name: testing-strategy
description: Determinar y ejecutar una estrategia de pruebas proporcional al cambio y al stack. Úsala para TASK/STRUCTURAL, regresiones importantes o cuando no está claro qué verificar.
---

# testing-strategy

Selecciona por riesgo: syntax, lint, unit, integration, browser/e2e, smoke, responsive, accessibility.

DIRECT: verificación mínima suficiente.
TASK: pruebas del comportamiento afectado.
STRUCTURAL: cobertura por criterios y riesgos.

En revisiones de maquetación, además de sintaxis, render, integridad, headings y responsive, comprueba el árbol de elementos, semántica, responsabilidad de Containers, Blocks como unidades lógicas, wrappers con función real, Grid-first, editabilidad, mantenibilidad y convenciones nativas del stack. En builders inspecciona el árbol y schemas disponibles cuando las tools lo permitan.
