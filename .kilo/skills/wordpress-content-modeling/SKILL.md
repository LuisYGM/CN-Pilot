---
name: wordpress-content-modeling
description: Modelar entidades, tipos, taxonomías, relaciones y fields para contenido/editorial dinámico en un WordPress confirmado. Developer owner; Architect solo para modelado transversal/migración de impacto real. No activar para layout/copy, WordPress no confirmado o cambios locales en un modelo estable.
---

# wordpress-content-modeling

**Owner técnico:** Developer. Architect solo ante decisión de arquitectura, coexistencia/migración de esquemas o múltiples sistemas con tradeoffs materiales. Content/SEO informa necesidades editoriales/URLs confirmadas, no define implementación técnica. `wordpress` conserva lifecycle/API general y `technical-seo` auditoría SEO; esta skill decide modelo de contenido. Builder (Bricks/Elementor/Gutenberg) se confirma y debe poder consumir lo elegido.

## Preflight

Inspecciona modelos/fields/taxonomies/content existentes, templates, query consumers, APIs, roles, builder, plugins y slugs/URLs afectados; limita al contenido en scope. Identifica quién crea/edita, lifecycle editorial, URLs/archive, relationships, filtros, volumen/consulta y compatibilidad. Reusa plugin/modelo instalado (ACF/JetEngine/Meta Box u otro) cuando corresponda; no instales ni migres nada por preferencia. Existing de producción: no remodeles por elegancia; encuentra consumers antes de modificar registro/schema.

## Modela la entidad, no el bloque de página

Por cada concepto, decide si es:

- **Page/Post:** páginas jerárquicas/fijas o contenido editorial temporal/noticias, según lifecycle y jerarquía nativa;
- **CPT:** tipo de entidad con identidad, lifecycle, editor/template/query propio, no solo una sección/URL;
- **Taxonomy/term:** clasificación reusable/queryable para filtros/archives/grouping con vocabulario controlado;
- **Post meta/custom field:** atributos de un objeto; adecuado para datos propios, no para relación o categoría que debe consultarse/contar como entidad;
- **Native parent/relationship:** relación real uno-a-uno/uno-a-varios/varios-a-varios; elige parent, taxonomy o mecanismo existente según query/editor/builder;
- **Options/settings:** configuración global del sitio, no datos por entidad;
- **User/term meta/media:** datos cuyo owner/lifecycle realmente sea el usuario, término o asset.

Pregunta por necesidad/query antes del campo: ¿se filtra, se agrupa, tiene URL/archive, se relaciona, tiene lifecycle/permissions, se actualiza por separado? Una “Categoría” usada para filtro/archive/URLs suele requerir taxonomy; no un texto duplicado en cada post. Un string de etiqueta simple no se convierte automáticamente en taxonomy. Una propiedad con múltiples valores no implica relationship custom.

## CPT, taxonomy, fields y consumo

Un CPT describe singular/plural y lifecycle; define `public`, archive, REST, hierarchy, supports, capability mapping y rewrite solo con justificación concreta, no copia defaults por checklist. Una taxonomy define si hierarchical, public/archive/REST y query/filter semantics necesarias. Field define tipo, multiplicidad, validación, requerido, default, editor context, naming/key y si soporta builder/API/query. Evita guardar el mismo dato simultáneamente en taxonomy/meta/serialized array.

Verifica queries reales previstas: listing, archive, filtro compuesto, relationship lookup, orden/pagination y vacíos. Confirma cómo el builder existente registra el entity/field/query y puede editarlo; un modelo técnicamente correcto pero inaccesible al editor/renderer no cumple outcome. No hardcodees ACF/JetEngine ni suposiciones sobre capabilities no confirmadas.

## URLs, Existing y migración

Comprueba slug uniqueness, public/archive routes, rewrite collision, permalink legacy y SEO implications con Content/SEO. No cambia URL publicada automáticamente; `technical-seo` gobierna auditoría y redirect. Migración de schema/content/relationships usa `database-migrations` cuando altera datos/versiones/parcialidad; no incluye migración escondida en registro de CPT. Antes de migrar registra cardinalidad y ownership mínimo que necesite la operación; backup no prueba rollback. Mantén compatibilidad de consumer/API y un plan reversible/forward-recovery según riesgo. Sin datos/query evidence no introduzcas tabla custom/index/infra.

## Resultado accionable y checks

Produce en sesión matriz compacta solo de entidades/fields materiales: entidad/lifecycle, storage, classification/relationship, fields/requiredness, query consumer, URL/publicity, editor/builder, permissions y migration risk. No escribas schema memo si handoff/implementation inmediata basta.

Antes de cerrar verifica que entidad representa algo independiente; taxonomy realmente clasifica/filtra; meta no sustituye entidad/relación queryable; builder/REST/templates pueden leer/write controlados; no duplica existente; URL/slug no colisionan; tests query/list/filter/archive representativos pasan; migraciones no dañan Existing. Si faltan requirements editoriales, Content aporta sentido; no asignas a Content decisión de schema. Detente al cubrir entidades/páginas requeridas, no remodeles el resto.

**Failure modes:** CPT por cada homepage section; taxonomy para cada atributo; repetir categorías como free-text meta; relaciones serializadas que bloquean filters; cambiar slug o borrar legacy content como cleanup; instalar plugin de campos sin comprobar stack.
