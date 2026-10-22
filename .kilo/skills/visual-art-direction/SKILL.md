---
name: visual-art-direction
description: Definir la estrategia de medios y dirección de imagen para experiencias visuales nuevas o rediseños donde fotografía, vídeo, ilustración u otros recursos sean materiales. Activar si media art direction puede cambiar el resultado; no activar para assets triviales, trabajo solo copy, cambio local Existing o referencia Approved/Strict que ya define completamente tratamiento y recursos.
---

# visual-art-direction

**Owner:** Diseñador UI/UX. Resuelve «¿qué medios expresa esta experiencia y cómo?». `ui-design-system` gobierna marca/tokens; `page-composition` placement y ritmo de página; esta skill decide lenguaje visual de medios y provenance. Maquetador frontend implementa carga/render; no sustituye `performance-review`, `accessibility-review` ni licenciamiento/approval humano.

## Source y autoridad de assets

Clasifica cada media material como:

- **PROVIDED:** material entregado por cliente/usuario;
- **EXISTING:** recurso encontrado en librería/producto;
- **APPROVED_EXTERNAL:** asset externo cuya licencia/uso se confirmó para el scope;
- **ORIGINAL_CREATED:** creado para este proyecto con capability disponible y autorización suficiente;
- **PENDING:** no hay fuente/autoridad adecuada aún.

Inspecciona lo existente antes de proponer sustitución. No infieras que una foto externa corresponde a la empresa/persona/producto del cliente, no uses derechos inciertos, no alteres originales y no registres recursos pendientes como aprobados. La autoridad visual de una referencia no concede derechos de asset/copy (BF-044/048). Si la representación real es material y no existe fuente, comunica el gap fuera del canvas y continúa con alternativas honestas.

## Visual media plan proporcional

Para páginas/experiencias visuales materiales determina sin artefacto separado si aporta valor: visual moment principal; secciones que merecen media o deben respirar sin ella; función (evidencia, atmósfera, explicación, producto, persona, escala, proceso); relación con copy/color/type; variedad y continuidad de recursos. Usa opción nativa/adaptada mínima: foto, video, ilustración, chart/diagram, iconography, screenshot/product imagery, render, map, texture/pattern/shape, macro detail, before/after o composición tipográfica. Ningún tipo/cuota es obligatorio.

Cuando se elija imagen/foto concreta, especifica suficiente art direction accionable: subject, punto de vista/distancia, framing, luz, environment, treatment/color, orientación/aspect ratio y desktop/mobile crop. Decide contained/full-bleed/overlay con `page-composition`. Evita stock cliché (handshake, laptop, skyline, familia/doctor genéricos) si no demuestra una razón del proyecto. No reutilices una misma foto/crop como decoración repetida.

Para public web Greenfield/rediseño material, media discovery es proactivo cuando media mejora materialmente: inspecciona PROVIDED y EXISTING; considera externa licenciada/reputada, original creada/generada solo con capability y autoridad suficientes, brand-derived graphic art direction o no-media intencional. No agotes opciones ni termines en `PENDING` solo porque no dieron fotos. Limita búsqueda a lo pertinente; comunica falta de acceso/licencia, no finjas verificación. Stock/editorial puede aportar atmósfera, nunca presentarse como cliente real, empleados, oficinas, instalaciones, producto o trabajo sin evidencia.

Si faltan medios adecuados y foto/media mejoraría materialmente la dirección, declara `MEDIA GAP = ENRICHABLE` con la función concreta que se beneficiaría e informa a Jefe de proyecto para su única pregunta agrupada. Una exploración read-only puede identificar fuentes/candidatos, pero no equivale a permiso de uso. No saltes por defecto a graphics/text-only antes de resolver la oportunidad. Si la persona elige buscar, crea candidatos desde art direction concreta y verifica source/licensing/provenance; si elige aportar, deja eso pending y avanza lo independiente; si elige no-media/Decide tú, procede honestamente. La generación solo si existe capability real y authority/scope suficiente.

Sin foto adecuada, considera fragmentos de isotipo, geometría, trazos, patterns, typography, masks, color fields, branded shapes, collage o sistema ilustrativo como graphic art direction. No finjas personas/productos/espacios/mapas/datos/arquitectura/instalaciones reales. Handoff conserva source, estado, límites de uso/claims y provenance PROVIDED, EXISTING, APPROVED_EXTERNAL, ORIGINAL_CREATED o PENDING.

## Video, ilustración e iconografía

Video solo si material real o creación autorizada sirve narrativa/atmósfera/demo/testimonial. Elige función, duración/loop, poster/fallback, controles/autoplay/muted/playsinline, mobile y reduced-motion; no inventes que existe un archivo. La producción/video runtime avanzado se escala solo si es necesidad material.

Diagram, chart, map, illustration, texture o pattern deben explicar contenido o expresar identidad. No conviertas SVG abstracto en pseudo-fotografía ni inventes datos/geografía/procesos. Para muchos iconos funcionales, prefiere una familia profesional coherente y selección por necesidad; verifica fuente oficial/licencia/consumo, no instales globalmente ni mezcles packs sin razón. Logos/brand icons pueden usar fuente separada. Custom icons se justifican por identidad, hueco o lenguaje propio; siguen reglas comunes de grid, stroke/fill, weight, esquinas, optical alignment, viewBox, sizing y semántica. Shapes/gradients no sustituyen sin razón media representacional.

## Revisión de riqueza visual

En Greenfield/rediseño, si el candidato acaba siendo casi solo texto, cards y fondos planos, contrasta activamente con brief, contenido y librería si un visual moment/media significativo lo mejoraría. Si sí, propón/integra el medio autorizado dentro del scope; si no hay fuente, no finjas autenticidad y escala PENDING cuando sea material. Sobriedad deliberada es un resultado válido; también lo son intensidad, densidad y color fuertes cuando expresan la dirección. El impacto no depende por sí solo de acumular gradientes aleatorios, imágenes stock irrelevantes, animación gratuita o medios sin foco.

## Producción, responsive y checks

Entrega selección/provenance, función, tratamiento, crop/ratio por viewport, destino/nombre de archivo o requerimiento de producción, estado de derechos/aprobación y fallback cuando ayude al siguiente owner. Usa provided/existing first cuando encajen; no descargues medios por rutina. Maquetador frontend maneja `srcset`/`sizes`, formato, lazy loading fuera del hero, poster y fallback según necesidad; alt depende de si la imagen informa o es decorativa. Motion y video respetan reduced motion y controls; nunca ocultes información esencial.

Antes de handoff comprueba: cada recurso tiene fuente/estado claro y función; selección responde al contenido, no a decoración; crop/treatment se coordina con composición; no se alteraron originales/no se atribuyen claims; mobile conserva sujeto/legibilidad; asset pendiente no se maquilla como del proyecto. Para Existing conserva librería, art direction y treatment salvo cambio de scope aprobado. Detente al quedar una decisión implementable; no produzcas plan visual separado por rutina.

**Fallo común:** usar carencia de foto como motivo para reemplazar todo por typography/pattern genérico, o recomendar fotos/videos sin verificar si existen, pueden crearse o están autorizados.
