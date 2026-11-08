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
- Examina `README.md` para distinguir una copia genérica heredada, un README manual/mixto y el README del Core original. No clasifiques solo por `# CN Pilot` ni por la presencia de `.cn-pilot/`.
- Si existe un checkpoint, sigue la identidad/origen y recovery de BF-047 antes de retomarlo; no importes su contenido o `nextAction` al proyecto nuevo ni lo copies a los documentos. Su ausencia es normal y no justifica crear runtime durante onboarding.

## Conversa por necesidad, no por formulario

Reutiliza el objetivo que la persona ya expresó. Si solo invoca `/nuevo-proyecto` y aún no se entiende qué desea conseguir, tras inspeccionar pregunta de forma abierta y natural, por ejemplo: «¿Qué te gustaría lograr con este proyecto?». Aclara el resultado esperado o cómo se reconocerá el éxito solo si esa diferencia cambia el trabajo actual; considera audiencia, restricciones y estado de partida con el mismo criterio, no como campos obligatorios. Agrupa solo cuestiones estrechamente relacionadas que deban resolverse ahora.

Pregunta progresivamente y vuelve a evaluar después de cada respuesta. Pregunta únicamente por información que pueda cambiar materialmente la decisión o el trabajo actual. No hagas una lista fija de campos ni exijas de entrada audiencia, sitemap, stack, CMS, hosting, breakpoints, SEO, arquitectura, textos completos o plan de entrega. Infiere lo que permitan la petición y las fuentes existentes. Acepta «no lo sé» y «Pending» si el dato no bloquea el próximo trabajo útil.

«Decide tú», «lo que recomiendes», «no tengo preferencia» y equivalentes delegan decisiones técnicas, reversibles, convencionales y de bajo riesgo dentro del alcance autorizado: resuélvelas profesionalmente sin volver a preguntar. No los interpretes como autorización para inventar hechos, cambiar alcance, escoger preferencias comerciales/visuales materiales, usar datos/servicios reales o ejecutar acciones irreversibles.

Acepta que la persona posponga o salte una fase. Un paso recomendado no es un gate: continúa si no existe dependencia material ahora, conserva solo el pendiente que afectará una decisión futura y no repitas la advertencia. Si el dato pendiente sí determina la decisión actual, pregunta una vez en términos del resultado humano.

## Cuándo basta para empezar

El onboarding queda suficientemente resuelto cuando se entienden el objetivo actual, qué existe y qué preservar, las restricciones materiales ya conocidas y el siguiente trabajo útil. No necesita todos los detalles futuros ni todos los campos canónicos completos. La ruta depende del caso: una web pública puede necesitar objetivo/contenido y dirección visual; una app/SaaS puede necesitar actores, flujos o reglas abiertas, pero no un sitemap de marketing o SEO por defecto; un Existing localizado va directo a diagnóstico/cambio/verificación; mantenimiento sigue el problema concreto. Si auditoría, branding, contenido, referencias, assets o implementación ya cubren etapas, no las repitas. No impongas estrategia, sitemap, SEO, diseño o desarrollo si no pertenecen al objetivo ni son dependencias reales.

Alcanza esa suficiencia sin una confirmación genérica obligatoria: la invocación de `/nuevo-proyecto` ya solicita orientar/inicializar el proyecto. Persiste únicamente los deltas durables bajo su fuente canónica. Si aparece una decisión humana material, una autorización requerida o un cambio irreversible, pide esa decisión concreta antes de actuar; no uses la confirmación para volver a pedir aprobación de lo ya delegado.

## README del proyecto al inicializar

En la **primera inicialización de una copia derivada**, el README genérico heredado es un residuo del template, no la presentación del proyecto: convertirlo en un README propio forma parte del cierre del onboarding cuando ya hay identidad y objetivo suficientes. Reconócelo por varias señales del contenido estándar de CN Pilot (encabezado, introducción, navegación y secciones del producto) y ausencia de contenido del proyecto; `# CN Pilot` por sí solo no basta. Conserva intactos los README propios o mixtos/manuales. Si la clasificación no es segura, no reemplaces contenido: inspecciona el delta posible y pregunta solo si hace falta para tomar una decisión material.

Protege el repositorio original del Core: considera que es **CN Pilot Core** solo si el `origin` local coincide con `sourceRepository` de `.cn-pilot/update/manifest.json` y el Project Context/README existente también mantiene la identidad canónica del Core (el mismo criterio de identidad que el Core usa para comprobar su Project Context). Un placeholder `Pending` aislado no confirma identidad. Reevalúa tras recibir hechos nuevos: si la persona identifica otro proyecto aunque el remote provenga del Core, la copia es derivada y el README plantilla se convierte según corresponda. No basta con que una copia contenga `.cn-pilot/`, el manifiesto o un README que empiece «CN Pilot». En el Core original conserva la presentación del producto. Si esa identidad no puede determinarse y sobrescribir sería riesgoso, conserva el README y resuelve solo la ambigüedad necesaria.

Para una copia derivada con README heredado, usa únicamente identidad, objetivo, tipo, alcance, tecnología, estructura, comandos y entregables **confirmados** en la petición, Project Context, recursos o implementación. Adapta la composición al proyecto; escribe el nombre/descriptor real, descripción y objetivo, y solo secciones con datos. El primer encabezado corresponde a ese proyecto, no conserva `# CN Pilot` por ser la marca del Core (salvo que «CN Pilot» sea realmente el nombre del proyecto, sin reutilizar su presentación como template). Añade enlaces solo a documentación/archivos existentes. Sin código no hay sección ni comandos de instalación inventados. El README presenta/navega el proyecto; no repite el Core README, un PRD ni todos los archivos de Context. Si no hay un nombre/objetivo fiable, pregunta una sola vez; no inventes claims ni presentes el README genérico como resultado completo.

La operación es idempotente: en un proyecto ya inicializado no regeneres el README. Si el README existente es del proyecto, conserva su estructura y contenido manual; actualiza solo un delta material y seguro cuando esté dentro del scope. Un README generado debe identificarse como el proyecto en ejecuciones posteriores y no volver a coincidir con la presentación genérica del template.

## Contexto y límites

- `PROYECTO.md`: hechos estables y fuentes de verdad; registra objetivo, público o tipo de partida solo si se conocen y aportan valor. Las clasificaciones internas/root/container se infieren de evidencia, nunca se presentan como campos.
- `REQUISITOS.md`: alcance, comportamiento o criterios materiales que se hayan definido.
- `DECISIONES.md`: solo decisiones aprobadas importantes; no acumules preferencias rutinarias ni tareas.
- `ESTADO.md`: una orientación operativa breve; cambia solo ante un hito, bloqueo o siguiente paso que siga siendo relevante.
- `ARTEFACTOS.md`: entregables reales/significativos, nunca recursos originales ni placeholders.
- `README.md`: aplica la clasificación/idempotencia del apartado anterior; actualiza solo presentación/navegación material, sin convertirlo en diario.

Conserva todas las restricciones existentes de seguridad y layout: no pidas secretos; no configures MCP/deployment/workflows durante onboarding; no copies/desempaquetes `recursos/codigo-original/`; no muevas, adoptes ni edites implementación sin scope y autorización. `producto/` se crea al iniciar implementación/adopción explícita, nunca para completar un formulario. Existing operativo solo mantiene root real con evidencia de dependencia operativa. Código top-level sin esa evidencia queda `Pending normalization/migration`: conserva el source y solicita la autorización aplicable antes de moverlo o modificarlo. No crees carpetas vacías, placeholders ni artefactos estratégicos por rutina.

Si el scope ya autorizado incluye trabajo posterior a la inicialización y no hay un gate material, continúa sin preguntar «¿quieres que siga?». Si solo se pidió preparar el proyecto, detente tras el onboarding, resume naturalmente lo resuelto y recomienda el próximo paso; no asumas que `/nuevo-proyecto` autoriza construir o publicar el producto.

Un hito significativo puede comunicarse brevemente así, sin headings ni jerga obligatorios: qué quedó resuelto, dónde está el proyecto y cuál es el siguiente mejor paso. Mantén la ruta recomendada separada de la elegida por la persona; una recomendación nunca se convierte por sí sola en mandato.

Antes de declarar el onboarding completado, haz una comprobación focal —sin nueva fase/wizard—: Project Context tiene identidad/objetivo estables conocidos; `README.md` presenta ese proyecto, no conserva una plantilla genérica en una copia derivada, y no inventa datos; el README del Core original sigue presentando CN Pilot; `ESTADO.md` refleja la situación real y no afirma que siga sin inicializar; requisitos confirmados, decisiones aprobadas y artefactos existentes están en sus fuentes pertinentes; no se interpretaron placeholders/ejemplos como datos reales; no se perdió contenido manual; no hay contradicciones materiales. Un `README` manual válido puede conservarse intacto. Si algo futuro no bloquea el trabajo útil, déjalo como `Pending`; si falta identidad necesaria para sustituir el README genérico, pregunta o deja ese gate abierto y no declares el cierre completo.

Comprueba que no se crearon carpetas vacías: `artefactos/` sigue siendo on-demand y los checkpoints no van a Project Context. Actualiza solo archivos con delta durable. Si Git existe y se inicializó contexto nuevo, crea un único commit local `chore: inicializar proyecto` para los cambios completos y válidos; los cambios posteriores siguen el workflow normal. Si no existe, trabaja y cierra sin ejecutar `git init`. No hagas push.
