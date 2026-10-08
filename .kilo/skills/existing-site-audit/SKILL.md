---
name: existing-site-audit
description: Descubrir en solo lectura el baseline proporcional de un sitio existente cuando su estado, stack o fuentes vigentes son desconocidos y condicionan la intervención; no usar para cualquier edición localizada.
---

# existing-site-audit

## Propósito y límites

Responder, con la profundidad necesaria para la tarea: ¿qué existe?, ¿qué parte importa?, ¿qué se verificó?, ¿qué se desconoce?, ¿qué puede ser riesgoso? y ¿qué procedimiento especializado hace falta después? Es un baseline multistack de **solo lectura**, no una auditoría total, un permiso de intervención ni un diagnóstico profundo de WordPress, SEO, seguridad o rendimiento.

Actívala para intervenir en un sitio heredado cuando el estado actual, el stack, las fuentes vigentes o las dependencias relevantes no están suficientemente claros. Si la fuente exacta de un microcambio ya es conocida, no hace falta activar la skill. Si no lo es, el baseline puede reducirse a localizarla, confirmar el recurso afectado y señalar un riesgo o dependencia mínima; después se devuelve el control a `DIRECT`, sin informe ni otras auditorías.

## Flujo read-only

`objetivo y superficie afectada → fuentes y accesos de lectura disponibles → inventario focalizado → cobertura y confianza → riesgos y dependencias → routing especializado si aporta valor`.

1. Delimita tarea, entorno y punto de entrega. Identifica lo que ya se sabe en el proyecto y lo que sigue siendo fuente activa, incluidos cambios manuales; no reinicies discovery aprobado.
2. Usa solo canales efectivamente disponibles y apropiados de lectura: archivos, documentación, respuestas públicas, herramientas administrativas de consulta o integraciones autorizadas. No ejecutes escrituras, activaciones, pruebas temporales de escritura, PHP genérico ni operaciones que alteren caché o datos para «comprobar» acceso. Un canal de escritura anunciado no equivale a autorización ni a una lectura segura.
3. Si existe MCP, descubre tools/capabilities reales y su alcance, distingue `read` de `write` y elige la capability específica de lectura. Tras cambios de plugin, módulo, licencia, servidor o configuración, refresca y redescubre antes de concluir que falta una capability (BF-019). No uses fallbacks low-level solo para completar casillas del inventario.
4. Inspecciona exclusivamente superficies que puedan cambiar el trabajo: stack/CMS, theme/builder y plugins; modelo de contenido, CPT, taxonomías, custom fields y templates; URLs, SEO, forms y analytics; integraciones; señales de rendimiento o seguridad; hosting, backup y método de deploy; MCP/capabilities; design system y fuentes de verdad. Si el workspace es Blueprint, distingue Existing importado con producto activo bajo `product/` de repository operational adopted con root externo contractual: presencia de código, carpetas source o manifests en root por sí sola no demuestra la excepción. Trata `project-resources/source/` como original/input, no working copy. El baseline no mueve ni adopta código. Inventariar no significa explorar exhaustivamente ni presumir WordPress, PHP, Node o un framework.
5. Cuando aporte valor, marca un hallazgo como `confirmed` (observado), `inferred` (indicio), `declared` (informado por alguien), `unverified` (sin comprobación) o `not_applicable`. Anota fuente, método y límites de acceso cuando afecten la confianza. No declares ausente un recurso solo porque el canal no permite verlo; no expongas credenciales, datos personales ni secretos.
6. Resume solo riesgos y dependencias que afecten alcance, seguridad de una futura intervención o validez del resultado. No conviertas el hallazgo en corrección autorizada: si hace falta modificar algo, define después alcance, entorno, aprobación, verificación y rollback proporcionales.

## Routing progresivo

Selecciona únicamente los agentes y skills necesarios para lo descubierto y el objetivo:

- Cambios de contenido, navegación o URLs: `web-strategy` si hay estrategia abierta, agente `content-seo` con `content-page` cuando haga falta copy y `technical-seo` cuando cambie rastreo o indexación.
- Síntoma de rendimiento medible o solicitud de optimización: `performance-review`; no hagas una auditoría profunda por simple presencia de plugins.
- Autenticación, endpoint custom, datos sensibles, uploads, pagos u otra superficie relevante: `security-review` según BF-023; un rediseño puramente visual no la activa por defecto.
- Implementación WordPress realmente afectada: `wordpress` y solo la skill de stack confirmada (`bricks`, `elementor`, `woocommerce` u otra disponible). Un sitio existente no se presume WordPress.
- Problema de comportamiento en browser/runtime: `webapp-testing`. Desajuste con una referencia visual **aprobada**: `visual-parity-review`; ninguna sustituye a la otra ni al QA visual humano.

No ejecutes automáticamente full SEO audit, security audit, performance audit, browser QA o diagnóstico profundo de WordPress por activar este baseline. Si una superficie no influye en el encargo, no la investigues por rutina. Si falta acceso, declara el límite y selecciona solo el siguiente paso que dependa de resolverlo.

## Resultado y persistencia

Para una tarea pequeña, devuelve en la sesión fuente vigente, cobertura suficiente, riesgos pertinentes y routing o vuelta a `DIRECT`; no crees informe. En greenfield, guarda un baseline en `project-artifacts/docs/audits/` solo si es entregable solicitado, servirá para trabajo posterior, contiene información durable o evita rediscovery significativo; en existentes preserva el destino documental vigente. En cualquier caso registra alcance, entorno, métodos, cobertura, hallazgos con confianza, desconocidos, dependencias y siguiente procedimiento; `dev-lead` indexa un entregable nuevo significativo conforme a `ARTIFACTS.md`. No dupliques `PROJECT.md`, `REQUIREMENTS.md` ni `STATE.md` y no conviertas el baseline en un plan de implementación obligatorio. Crea carpetas solo al persistir el informe real.
