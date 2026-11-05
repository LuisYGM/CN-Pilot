---
description: Analiza una tarea o feature y crea un plan proporcional antes de implementar.
agent: jefe-proyecto
---

# Plan

1. Lee únicamente el contexto/fuentes pertinentes; clasifica DIRECT/TASK/STRUCTURAL y evalúa riesgo por separado.
2. DIRECT mantiene cambio/verificación focal sin spec, IDs ni artefactos. TASK define acceptance y evidencia solo cuando comportamiento/riesgo lo necesitan; no crea documentación de rutina.
3. Para STRUCTURAL define alcance, acceptance, dependencias, decisiones/gates y verificaciones proporcionales. Usa trazabilidad en la spec canónica solo si evita omisiones o handoffs ambiguos; no dupliques requisitos ni replantees decisiones aprobadas sin causa nueva.
4. Si STRUCTURAL necesita Arquitectura, consulta a `arquitecto`; identifica owners/skills y unidades verificables. IDs REQ/AC/TASK/TEST son opcionales. Mantén spec+plan en un artefacto cuando sea claro; separa tareas/planes solo si complejidad, paralelismo o mantenimiento lo justifica.
5. Para Greenfield, especificación funcional durable vive en `artefactos/documentacion/funcionalidades/<slug>.md`, arquitectura transversal en `artefactos/documentacion/arquitectura/<slug>.md`, ADR formal en `artefactos/documentacion/adr/`; decisiones aprobadas ligeras en `DECISIONES.md`. Crea carpetas solo al producir el primer artefacto real y preserva layouts existentes; `producto/documentacion/` pertenece al producto.
6. Antes de declarar completa una funcionalidad STRUCTURAL reconcilia requisitos incluidos → acceptance → unidades esenciales → evidencia/estado; criterios sin evidencia quedan incompletos o bloqueados, no DONE. Diferencia OUT OF SCOPE de defectos pendientes y conserva provisionalidad/decisiones.
7. Usa `.cn-pilot/plantillas/especificacion-funcionalidad.md` como referencia condicional, no formulario obligatorio. Specs históricas son compatibles y no requieren migración.
8. «No escribir código todavía» impide implementar, no documentar, salvo que se prohíban cambios al workspace. No implementes salvo petición de implementación inmediata ni hagas push automático.
9. Revisa el artefacto/diff y verifica gates. Commit local solo si scope permite y la planificación está completa/verificada.
