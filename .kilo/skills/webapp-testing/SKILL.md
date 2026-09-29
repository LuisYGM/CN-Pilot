---
name: webapp-testing
description: Verificar comportamiento browser/runtime de una aplicación web mediante navegación, interacción, estados, consola y capturas representativas. Úsala para bugs o QA de runtime; no para comparar una implementación con una referencia visual aprobada ni para cualquier tarea frontend.
license: Apache-2.0 (adaptación de webapp-testing, Anthropic; upstream snapshot, commit unknown)
---

# webapp-testing

Esta es una adaptación reducida de `webapp-testing` del snapshot local de Anthropic. Responde: **Does the implementation actually work correctly in a browser/runtime?** La fidelidad frente a una referencia aprobada pertenece a `visual-parity-review`.

## Capacidad opcional

Playwright y browser tooling son opcionales. Si están disponibles, úsalos cuando aporten evidencia; si no, la tarea no falla únicamente por su ausencia. No asumas Node, Python, React/SPA, un servidor local ni una arquitectura concreta. No vendorices browsers, `node_modules`, caches, virtual environments ni infraestructura externa.

## Procedimiento proporcional

1. Define el comportamiento y el estado que debe verificarse, el entorno y los viewports representativos. Para tareas pequeñas, usa la verificación mínima suficiente.
2. Si la aplicación es estática, inspecciona el HTML o abre el recurso local. Si es dinámica, detecta si existe un servidor disponible y cómo indica readiness. No asumas `networkidle` como señal universal: espera la señal de la aplicación, un selector/estado observable o una condición de red adecuada.
3. Haz reconnaissance-then-action: navega, inspecciona DOM/estado renderizado y selectores, después interactúa. Usa selectores descriptivos y espera estados reales, no pausas arbitrarias salvo que sean la única evidencia disponible.
4. Comprueba la interacción afectada: navegación, formularios y validación visual, dropdowns, tabs, modales, menús, loading, error, success, empty, disabled y recuperación cuando correspondan.
5. Captura screenshots solo como evidencia de estado/runtime o apoyo a otra revisión. Para comparación contra una referencia aprobada activa `visual-parity-review`.
6. Registra errores de consola, errores de browser, fallos de red y resultado por estado. Cierra cualquier navegador/servidor iniciado por la prueba.

## Señales y límites

Browser/runtime QA puede demostrar navegación, interacción, estados y errores observados en un entorno concreto; no demuestra paridad visual, accesibilidad completa, seguridad productiva ni disponibilidad de servicios externos. Si no se puede ejecutar browser tooling, reporta la evidencia alternativa y el límite, sin inventar un PASS.

No convierte un prototipo en producción: los formularios, búsquedas, filtros o checkout mock de BF-021 pueden verificarse como comportamiento local intencional sin exigir backend, persistencia o integraciones fuera de scope.

## Dependencias opcionales

El upstream usa scripts Python y Playwright. Esta adaptación no exige scripts auxiliares ni una instalación universal. Si el proyecto ya dispone de Playwright/Python y un runner seguro, puede reutilizarse; documenta versión, navegador, URL/archivo, viewports, estados y comandos usados. Si se incorpora un helper del upstream en el futuro, debe ejecutarse como herramienta acotada y no como requisito del Blueprint.
