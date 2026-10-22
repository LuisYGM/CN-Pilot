---
description: Inicia u orienta el proyecto con el contexto y los materiales que ya existen.
agent: jefe-proyecto
---

# Nuevo proyecto

`/nuevo-proyecto` es la puerta de entrada recomendada para empezar o ubicar cualquier proyecto con CN Pilot. No significa crear una web nueva ni obliga a completar un wizard. Sirve para Greenfield y Existing, web pública, app/SaaS, WordPress, ecommerce, contenido, mantenimiento o evolución de código.

## Inspecciona antes de preguntar

- Reconcilia `AGENTS.md`, versión y Project Context (`PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md`) antes de preguntar o escribir.
- Inspecciona `recursos/` de forma ligera: usa índices/brief/auditorías y detecta solo las familias pertinentes (branding, documentos, fotos, referencias, vídeo, código original o datos). No recorras cientos de archivos ni pidas información que ya aparece allí.
- Reutiliza datos confirmados de auditorías, branding, sitemap, copy, referencias, assets e implementación; no vuelvas a preguntar lo que esos materiales resuelven salvo contradicción o información material ausente.
- Identifica si el contexto ya describe el proyecto, qué está implementado, qué debe preservarse, el root real y si se trata de app, web pública, CMS, ecommerce o mantenimiento. Mira el código/manifiestos/configuración existentes solo hasta entender la petición actual; no inicies una auditoría completa por rutina.
- Examina `README.md` para distinguir presentación genérica del template de documentación manual del producto. Conserva README propio por defecto.
- Si hay un checkpoint activo, aplica recovery primero. No reinicies onboarding para continuar el mismo trabajo; ante una tarea nueva distinta, sigue el gate existente para continuar o dejar pendiente.

## Conversa por necesidad, no por formulario

Reutiliza el objetivo que la persona ya expresó. Si solo invoca `/nuevo-proyecto` y aún no se entiende qué desea conseguir, tras inspeccionar pregunta de forma abierta y natural, por ejemplo: «¿Qué te gustaría lograr con este proyecto?». Aclara el resultado esperado o cómo se reconocerá el éxito solo si esa diferencia cambia el trabajo actual; considera audiencia, restricciones y estado de partida con el mismo criterio, no como campos obligatorios. Agrupa solo cuestiones estrechamente relacionadas que deban resolverse ahora.

Pregunta progresivamente y vuelve a evaluar después de cada respuesta. Pregunta únicamente por información que pueda cambiar materialmente la decisión o el trabajo actual. No hagas una lista fija de campos ni exijas de entrada audiencia, sitemap, stack, CMS, hosting, breakpoints, SEO, arquitectura, textos completos o plan de entrega. Infiere lo que permitan la petición y las fuentes existentes. Acepta «no lo sé» y «Pending» si el dato no bloquea el próximo trabajo útil.

«Decide tú», «lo que recomiendes», «no tengo preferencia» y equivalentes delegan decisiones técnicas, reversibles, convencionales y de bajo riesgo dentro del alcance autorizado: resuélvelas profesionalmente sin volver a preguntar. No los interpretes como autorización para inventar hechos, cambiar alcance, escoger preferencias comerciales/visuales materiales, usar datos/servicios reales o ejecutar acciones irreversibles.

Acepta que la persona posponga o salte una fase. Un paso recomendado no es un gate: continúa si no existe dependencia material ahora, conserva solo el pendiente que afectará una decisión futura y no repitas la advertencia. Si el dato pendiente sí determina la decisión actual, pregunta una vez en términos del resultado humano.

## Cuándo basta para empezar

El onboarding queda suficientemente resuelto cuando se entienden el objetivo actual, qué existe y qué preservar, las restricciones materiales ya conocidas y el siguiente trabajo útil. No necesita todos los detalles futuros ni todos los campos canónicos completos. La ruta depende del caso: una web pública puede necesitar objetivo/contenido y dirección visual; una app/SaaS puede necesitar actores, flujos o reglas abiertas, pero no un sitemap de marketing o SEO por defecto; un Existing localizado va directo a diagnóstico/cambio/verificación; mantenimiento sigue el problema concreto. Si auditoría, branding, contenido, referencias, assets o implementación ya cubren etapas, no las repitas. No impongas estrategia, sitemap, SEO, diseño o desarrollo si no pertenecen al objetivo ni son dependencias reales.

Alcanza esa suficiencia sin una confirmación genérica obligatoria: la invocación de `/nuevo-proyecto` ya solicita orientar/inicializar el proyecto. Persiste únicamente los deltas durables bajo su fuente canónica. Si aparece una decisión humana material, una autorización requerida o un cambio irreversible, pide esa decisión concreta antes de actuar; no uses la confirmación para volver a pedir aprobación de lo ya delegado.

## Contexto y límites

- `PROYECTO.md`: hechos estables y fuentes de verdad; registra objetivo, público o tipo de partida solo si se conocen y aportan valor. Las clasificaciones internas/root/container se infieren de evidencia, nunca se presentan como campos.
- `REQUISITOS.md`: alcance, comportamiento o criterios materiales que se hayan definido.
- `DECISIONES.md`: solo decisiones aprobadas importantes; no acumules preferencias rutinarias ni tareas.
- `ESTADO.md`: una orientación operativa breve; cambia solo ante un hito, bloqueo o siguiente paso que siga siendo relevante.
- `ARTEFACTOS.md`: entregables reales/significativos, nunca recursos originales ni placeholders.
- `README.md`: modifica solo el README genérico heredado cuando corresponda a inicialización autorizada; conserva contenido manual propio.

Conserva todas las restricciones existentes de seguridad y layout: no pidas secretos; no configures MCP/deployment/workflows durante onboarding; no copies/desempaquetes `recursos/codigo-original/`; no muevas, adoptes ni edites implementación sin scope y autorización. `producto/` se crea al iniciar implementación/adopción explícita, nunca para completar un formulario. Existing operativo solo mantiene root real con evidencia de dependencia operativa. Código top-level sin esa evidencia queda `Pending normalization/migration`: conserva el source y solicita la autorización aplicable antes de moverlo o modificarlo. No crees carpetas vacías, placeholders ni artefactos estratégicos por rutina.

Si el scope ya autorizado incluye trabajo posterior a la inicialización y no hay un gate material, continúa sin preguntar «¿quieres que siga?». Si solo se pidió preparar el proyecto, detente tras el onboarding, resume naturalmente lo resuelto y recomienda el próximo paso; no asumas que `/nuevo-proyecto` autoriza construir o publicar el producto.

Un hito significativo puede comunicarse brevemente así, sin headings ni jerga obligatorios: qué quedó resuelto, dónde está el proyecto y cuál es el siguiente mejor paso. Mantén la ruta recomendada separada de la elegida por la persona; una recomendación nunca se convierte por sí sola en mandato.

Antes de cerrar, comprueba que no se perdió trabajo manual ni información existente, actualiza solo archivos con delta durable y verifica rutas/consistencia. Si Git existe y se inicializó contexto nuevo, crea un único commit local `chore: inicializar proyecto` para los cambios completos y válidos; los cambios posteriores siguen el workflow normal. Si no existe, trabaja y cierra sin ejecutar `git init`. No hagas push.
