---
name: webapp-testing
description: Verificar comportamiento browser/runtime de una aplicación web mediante navegación, interacción, DOM/estados, URL, consola y network pertinente. Úsala para bugs o QA de runtime; no para comparar una implementación con una referencia visual aprobada ni para cualquier tarea frontend.
---

# webapp-testing

Responde: **Does the implementation actually work correctly in a browser/runtime?** La fidelidad frente a una referencia aprobada pertenece a `visual-parity-review`.

Browser/runtime QA responde «¿funciona?» —navegación, interacción, estados, DOM, URL, consola y red pertinente—, no «¿cómo hacerlo ver mejor?». Conforme a BF-063, findings de estética no basada en una regla/autoridad aprobada no son defects. QA técnico conserva toda su profundidad y corrige defectos objetivos; cambios visuales materiales se devuelven a decisión/review, sin usar una prueba funcional como permiso de rediseño.

## Capacidad opcional

Playwright y browser tooling son opcionales. Si están disponibles, úsalos cuando aporten evidencia; si no, la tarea no falla únicamente por su ausencia. No asumas Node, Python, React/SPA, un servidor local ni una arquitectura concreta. No vendorices browsers, `node_modules`, caches, virtual environments ni infraestructura externa.

## Procedimiento proporcional

1. Define el comportamiento y el estado que debe verificarse, el entorno y los viewports representativos. Para tareas pequeñas, usa la verificación mínima suficiente. Antes de navegación material, Maquetador termina el gate source-only de `frontend-architecture`; Browser no es el mecanismo para descubrir errores determinísticos legibles en CSS/markup recién escrito.
2. Clasifica runtime según BF-059 antes de navegar: `STATIC_PORTABLE` abre el entry HTML directamente y conserva rutas/recursos relativos; `STATIC_HTTP` requiere una razón técnica concreta documentada; `APP_RUNTIME` depende de backend/API/auth/SSR/sesión/router/servicios. No levantes servidor local por defecto. Para static, primero abre `file://` cuando el delivery debe ser portable. Si una comprobación exige HTTP, un server temporal de QA es solo herramienta y no debe introducir un requisito de entrega.
3. Haz reconnaissance-then-action: navega, inspecciona DOM/estado renderizado y selectores, después interactúa. Usa selectores descriptivos y espera estados reales, no pausas arbitrarias salvo que sean la única evidencia disponible.
4. Comprueba la interacción afectada: navegación, formularios y validación visual, dropdowns, tabs, modales, menús, loading, error, success, empty, disabled y recuperación cuando correspondan.
5. No generes screenshots por defecto: son evidencia, no logging. Prefiere DOM/árbol, estado, URL/routing, consola, network/respuestas y atributos/estilos/computed/layout/overflow pertinentes. Captura solo si una pregunta visual material no puede comprobarse con evidencia más directa, hay revisión/parity o la persona lo solicita. Cada captura responde una pregunta; no captures por sección, viewport o fix. Si solo se valida mobile genérico, usa un viewport de 360px; desktop, si requiere QA, usa uno representativo. Añade tablet/otros anchos solo por breakpoint/layout/finding/authority/acceptance. Browser resize/computed styles puede revisar continuidad entre breakpoints sin guardar capturas. Para referencia Approved activa `visual-parity-review` y usa solo viewports/estados definidos por scope.
6. Registra errores de consola, errores de browser, fallos de red y resultado por estado. Cierra cualquier navegador/servidor iniciado por la prueba. Reutiliza el runner/harness/browser disponible antes de scripts; no construyas CDP/WebSocket ad-hoc, mini-frameworks ni cadenas de scripts si un check simple existente basta.

## Estados condicionados por el producto

Cuando el flujo existente tenga sesión/roles, verifica solo los estados pertinentes: sesión expirada, role view, URL directa no autorizada y redirect/return behavior si la aceptación los cubre. La observación browser no implementa auth ni activa por sí sola `auth-access-control`.

Prefiere data/fixtures determinísticas seguras cuando ya existan; no tomes datos productivos por comodidad. Network slow/timeout, malformed response, 4xx/5xx, retry, offline o degraded states se prueban cuando forman parte del scope/riesgo, no todos por rutina. Si comportamiento depende del tiempo, delimita clock/timezone, expiry, scheduled UI o relative dates que lo afectan; reutiliza time controls existentes y no inventes fake-timer infrastructure.

Selección de QA sigue BF-059: una ronda cohesionada; si hay findings, batch de correcciones y ronda focalizada; después STOP salvo blocker material real, cuya iteración adicional queda limitada a ese blocker. PASS termina QA. Cambios documentales/Git/whitespace no lo invalidan. Usa el mínimo de viewports: un 360px mobile cuando ese es el scope visual genérico; un desktop representativo cuando también se necesita; máximo normal **3 por superficie afectada** es techo, no mínimo/matriz fija. Otros anchos solo ante breakpoint/layout/tablet behavior, finding, autoridad o acceptance concretos; omite responsive si no está afectado. Completa la inspección Round 1 y agrupa findings antes de editar; no screenshot después de cada fix. Una evidencia adecuada basta; no añadas simulador/script/captura equivalente. Helper ad-hoc fallido es `QA TOOL FAILURE`, no Product Failure; corrígelo una vez si imprescindible, o descártalo. Capturas temporales se eliminan salvo deliverable/evidencia durable solicitada. Tras acceptance y sin contradicción/findings materiales, detente.

## Señales y límites

Browser/runtime QA puede demostrar navegación, interacción, estados y errores observados en un entorno concreto; no demuestra paridad visual, accesibilidad completa, seguridad productiva ni disponibilidad de servicios externos. Si no se puede ejecutar browser tooling, reporta la evidencia alternativa y el límite, sin inventar un PASS.

No convierte un prototipo en producción: los formularios, búsquedas, filtros o checkout mock de BF-021 pueden verificarse como comportamiento local intencional sin exigir backend, persistencia o integraciones fuera de scope.

## Dependencias opcionales

Playwright y Python son opcionales. Esta skill no exige scripts auxiliares ni una instalación universal. Si el proyecto ya dispone de un runner seguro, puede reutilizarse; documenta versión, navegador, URL/archivo, viewports, estados y comandos usados. Si se incorpora un helper en el futuro, debe ejecutarse como herramienta acotada y no como requisito del CN Pilot.
