---
name: visual-art-direction
description: Definir la estrategia de medios y dirección de imagen para experiencias visuales nuevas o rediseños donde fotografía, vídeo, ilustración u otros recursos sean materiales. Activar si media art direction puede cambiar el resultado; no activar para assets triviales, trabajo solo copy, cambio local Existing o referencia Approved/Strict que ya define completamente tratamiento y recursos.
---

# visual-art-direction

**Owner:** Diseñador. Resuelve «¿qué medios expresa esta experiencia y cómo?». `ui-design-system` gobierna marca/tokens; `page-composition` placement y ritmo de página; esta skill decide lenguaje visual de medios y provenance. Desarrollador implementa carga/render con los requisitos acordados; no sustituye `performance-review`, `accessibility-review` ni licenciamiento/approval humano.

## Source y autoridad de assets

Esta dirección también cubre producción artística y selección de recursos para otros medios, sin imponer layout web. Ante una capacidad/formato especializado material o incierto activa `tool-discovery` y selecciona herramientas gráficas/generación/librerías por calidad, editabilidad, licencia y compatibilidad reales. Una ilustración compleja, render o recurso audiovisual no se sustituye por SVG/Canvas rudimentario, stock engañoso o un prompt presentado como obra final. Si falta la capacidad imprescindible, informa el gate y una alternativa profesional; no instales ni envíes datos por inferencia. Los apartados de slots, responsive y Public Web conservan su scope web, no se convierten en requisitos universales. Preserva siempre provenance, derechos y originales.

Clasifica cada media material como:

- **PROVIDED:** material entregado por cliente/usuario;
- **EXISTING:** recurso encontrado en librería/producto;
- **APPROVED_EXTERNAL:** asset externo cuya licencia/uso se confirmó para el scope;
- **ORIGINAL_CREATED:** creado para este proyecto con capability disponible y autorización suficiente;
- **PENDING:** no hay fuente/autoridad adecuada aún.

Inspecciona lo existente antes de proponer sustitución. No infieras que una foto externa corresponde a la empresa/persona/producto del cliente, no uses derechos inciertos, no alteres originales y no registres recursos pendientes como aprobados. La autoridad visual de una referencia no concede derechos de asset/copy (BF-044/048). Si la representación real es material y no existe fuente, comunica el gap fuera del canvas y continúa con alternativas honestas.

## Visual media plan proporcional

Para páginas/experiencias visuales materiales decide por región qué medio aporta significado y qué sección debe respirar; asigna función (evidencia, atmósfera, explicación, producto, persona, escala, proceso) y relación con copy/color/type. Selecciona medios antes de cerrar las composiciones que dependen de ellos, no como relleno posterior. Elige la forma necesaria —foto, video, ilustración, chart/diagram, iconografía, screenshot/product imagery, render, map, texture/pattern/shape, macro detail, before/after o composición tipográfica— sin cuota de imágenes/formatos. Verifica continuidad entre recursos cuando la narración la requiera y permite deliberadamente una región sin media.

## No Empty Media Slots (BF-068)

En Concept Studies/Flagship/UI Kit de public web que se entregan como high-fidelity para evaluación, un medio necesario para la composición no se deja como caja gris, `[image here]`, lorem/stock genérico o marcador «pendiente». Resuelve cada slot con PROVIDED/EXISTING autorizado, `APPROVED_EXTERNAL`, `ORIGINAL_CREATED`, otra media gráfica final o una composición deliberada de tipografía/forma sin slot de foto. No Empty Media Slots no obliga a usar fotografía ni se extiende a dashboards, microcambios o un wireframe no final; significa que el artefacto presentado como listo para decisión no depende de un hueco vacío.

Si una persona/foto/producto/espacio auténtico es material y no hay fuente verificable, no lo sustituyas por stock presentado como real ni inventes representación. Informa el gap por Jefe de proyecto; pregunta solo si debe aportar/buscar/crear ese medio o si delega la solución gráfica. Si búsqueda externa fue elegida y la capability está disponible, produce candidatos concretos y registra source/provenance/licencia/uso; si no hay una opción honesta/permitida, declara que esa parte aún no puede considerarse final y continúa lo independiente. Un «sin fotografía» intencional es una solución, no un placeholder.

Cuando se elija imagen/foto concreta, formula primero una búsqueda desde el contenido y el puesto de la imagen: sujeto/acción, punto de vista/distancia, framing, espacio libre para copy si lo necesita, luz, environment, treatment/color y orientación/aspect ratio. Busca por sujeto **y** propiedades compositivas, no por keyword sectorial aislada. Inspecciona el candidato real en el tamaño/relación de aspecto y compón mentalmente su placement con el contenido antes de cerrar el layout; un thumbnail o nombre de archivo no confirma que el crop/tono funcione. Decide contained/full-bleed/overlay con `page-composition`, conserva crop desktop/mobile y verifica que el sujeto y la lectura sobreviven. Evita stock cliché (handshake, laptop, skyline, familia/doctor genéricos) si no demuestra una razón del proyecto. No reutilices una misma foto/crop como decoración repetida.

Para public web Greenfield/rediseño material, media discovery es proactivo cuando media mejora materialmente: inspecciona PROVIDED y EXISTING; considera externa licenciada/reputada, original creada/generada solo con capability y autoridad suficientes, brand-derived graphic art direction o no-media intencional. No agotes opciones ni termines en `PENDING` solo porque no dieron fotos. Limita búsqueda a lo pertinente; comunica falta de acceso/licencia, no finjas verificación. Stock/editorial puede aportar atmósfera, nunca presentarse como cliente real, empleados, oficinas, instalaciones, producto o trabajo sin evidencia.

Si faltan medios adecuados y foto/media mejoraría materialmente la dirección, declara `MEDIA GAP = ENRICHABLE` con la función concreta que se beneficiaría e informa a Jefe de proyecto para su única pregunta agrupada. Una exploración read-only puede identificar fuentes/candidatos, pero no equivale a permiso de uso. No saltes por defecto a graphics/text-only antes de resolver la oportunidad. Si la persona elige buscar, crea candidatos desde art direction concreta y verifica source/licensing/provenance; si elige aportar, deja eso pending y avanza lo independiente; si elige no-media/Decide tú, procede honestamente. La generación solo si existe capability real y authority/scope suficiente.

Sin foto adecuada, considera fragmentos de isotipo, geometría, trazos, patterns, typography, masks, color fields, branded shapes, collage o sistema ilustrativo como graphic art direction. No finjas personas/productos/espacios/mapas/datos/arquitectura/instalaciones reales. Handoff conserva source, estado, límites de uso/claims y provenance PROVIDED, EXISTING, APPROVED_EXTERNAL, ORIGINAL_CREATED o PENDING.

## Video, ilustración e iconografía

Video solo si material real o creación autorizada sirve narrativa/atmósfera/demo/testimonial. Elige función, duración/loop, poster/fallback, controles/autoplay/muted/playsinline, mobile y reduced-motion; no inventes que existe un archivo. La producción/video runtime avanzado se escala solo si es necesidad material.

Diagram, chart, map, illustration, texture o pattern deben explicar contenido o expresar identidad. No conviertas SVG abstracto en pseudo-fotografía ni inventes datos/geografía/procesos. Cuando la interfaz necesite iconos funcionales, elige por defecto una sola familia profesional SVG, mantenida y compatible con la identidad y stack; prioriza la librería existente o iconografía aportada por el usuario. Lucide, Phosphor, Tabler u otra fuente legítima son candidatas a verificar, no una obligación de catálogo ni una preferencia universal. No uses emojis ni caracteres Unicode como sustitutos improvisados de iconos. Conserva fuente, licencia y provenance en el handoff/metadata interna; solo muestra atribución si las condiciones verificadas la exigen. Simple Icons se limita a logos/marcas cuando corresponda; una licencia permisiva no elimina trademark/uso de marca. No instales globalmente ni mezcles packs sin necesidad. Custom SVG se permite para artwork/identity/diagram/pattern; un icono funcional a medida requiere un gap/identidad real, no preferencia por inventar. Shapes/gradients no sustituyen sin razón media representacional.

## Revisión de riqueza visual

En Greenfield/rediseño, si el candidato acaba siendo casi solo texto, cards y fondos planos, contrasta activamente con brief, contenido y librería si un visual moment/media significativo lo mejoraría. Si sí, propón/integra el medio autorizado dentro del scope; si no hay fuente, no finjas autenticidad y escala PENDING cuando sea material. Sobriedad deliberada es un resultado válido; también lo son intensidad, densidad y color fuertes cuando expresan la dirección. El impacto no depende por sí solo de acumular gradientes aleatorios, imágenes stock irrelevantes, animación gratuita o medios sin foco.

## Producción, responsive y checks

Entrega una referencia que el implementador pueda localizar (path/id/URL autorizada), provenance/licencia/estado, función, tratamiento, crop/ratio significativo por viewport, destino o requerimiento de producción y fallback cuando ayude. Si la fuente no está disponible o no tiene rights verificados, márcala PENDING y di qué decisión depende de ella; no envíes solo una palabra descriptiva como «premium». Usa provided/existing primero cuando encajen; no descargues medios por rutina. Desarrollador maneja `srcset`/`sizes`, formato, lazy loading fuera del hero, poster y fallback según necesidad; alt depende de si la imagen informa o es decorativa. Motion y video respetan reduced motion y controls; nunca ocultes información esencial.

Antes de handoff comprueba: cada recurso tiene fuente/estado claro y función; selección responde al contenido, no a decoración; crop/treatment se coordina con composición; no se alteraron originales/no se atribuyen claims; mobile conserva sujeto/legibilidad; asset pendiente no se maquilla como del proyecto. Para Existing conserva librería, art direction y treatment salvo cambio de scope aprobado. Detente al quedar una decisión implementable; no produzcas plan visual separado por rutina.

**Fallo común:** usar carencia de foto como motivo para reemplazar todo por typography/pattern genérico, o recomendar fotos/videos sin verificar si existen, pueden crearse o están autorizados.
