# Catálogo filtrable y paginado

## Requisitos incluidos
- REQ-001: Buscar por texto, sin distinguir mayúsculas/minúsculas.
- REQ-002: Filtrar por categoría; búsqueda y categoría se componen.
- REQ-003: Paginar los resultados combinados con pageSize solicitado.
- REQ-004: Informar total, páginas, página actual y estado vacío.

## Criterios de aceptación
- AC-001: Query vacía devuelve todos los elementos elegibles; query y categoría se combinan con AND.
- AC-002: La página queda dentro del rango; lista vacía reporta page=0/pages=0 y no resultados.
- AC-003: Cada requisito está relacionado a implementación y test/evidencia.
- AC-004: Todos los tests pertinentes pasan; sin dependencias nuevas.

Datos de prueba sintéticos; no servicio/backend.
