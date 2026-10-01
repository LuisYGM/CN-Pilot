# Datos estructurados: consistencia, ownership y elegibilidad

## Definir qué se evalúa

Identifica página canónica, contenido visible, entidad real y finalidad del marcado. Distingue vocabulario Schema.org de requisitos vigentes de una función de búsqueda. Consulta documentación oficial del tipo y buscador cuando la recomendación dependa de elegibilidad o propiedades cambiantes; registra fuente/fecha o la limitación de no haberla verificado.

No inventes precios, autores, imágenes, rating, reseñas, direcciones o disponibilidad para satisfacer requisitos. Un tipo semánticamente posible no garantiza que exista un rich result aplicable.

## Ownership y emisión

Inspecciona qué componentes producen cada entidad/grafo y la salida real. En WordPress pueden participar plugin SEO, tema, plugin funcional, builder, código manual o tercero. Prefiere un responsable por entidad/salida cuando sea práctico; varias fuentes pueden coexistir si sus límites y relaciones son coherentes.

No elimines schema sin localizar su generador. Configuración persistida no prueba emisión correcta: observa salida servida y renderizada según necesidad, URLs/idiomas/plantillas y efecto de caché. Implementa cambios mediante Developer y APIs del stack dentro de autorización; esta referencia no crea un plugin ni otro owner WordPress.

## Verificación proporcional

- Contenido visible, entidad y propiedades se corresponden con hechos confirmados.
- Tipo y propiedades requeridas/recomendadas cumplen el objetivo; diferencia fallo de requisito y recomendación no bloqueante según documentación vigente.
- JSON-LD u otro formato válido, URLs canónicas y relaciones de grafo consistentes.
- `@id` estable cuando ayude a referenciar la misma entidad, sin identificar páginas distintas como una única entidad por error.
- Generadores no duplican entidades contradictorias, ni mezclan entornos o idiomas indebidamente.
- Resultado emitido coincide con la decisión; prueba plantillas y excepciones afectadas.

**Sintaxis válida ≠ elegibilidad; elegibilidad ≠ aparición garantizada.** Un validador sin errores no acredita contenido, entidad, políticas ni emisión real. Declara resultado por criterio; no otorga PASS global si esas capas están incorrectas o sin verificar. El score de Rank Math u otro plugin es QA adicional, no sustituto de estas comprobaciones.

## Estados negativos reales

Para schema dinámico, prueba datos ausentes que puedan ocurrir: imagen, autor, precio, rating, dirección o campo opcional vacío. Omite propiedades opcionales sin valor; si falta una propiedad requerida para el objetivo, no fabriques datos ni emitas markup engañoso. Define comportamiento (no emitir el tipo no sustentado, usar un tipo válido distinto o reportar pendiente) según contenido y requisitos reales.

Entrega criterio, evidencia, generador, cambios propuestos/autorizados y validación antes/después. Comprueba regresiones de idiomas o plantillas si están afectadas; no prometas mejora de ranking o rich results.
