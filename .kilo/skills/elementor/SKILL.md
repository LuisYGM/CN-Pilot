---
name: elementor
description: Crear o modificar páginas, plantillas, Theme Builder, widgets, estilos globales o contenido dinámico en un sitio existente Elementor/Elementor Pro. Úsala solo con ese builder confirmado; no para cualquier frontend WordPress ni para alojar lógica de negocio backend.
---

# elementor

## Preflight: estado existente primero

- Confirma Elementor y, si aplica, Elementor Pro/licencia y versiones instaladas; inspecciona la página/plantilla, tipo de editor, dependencias, condiciones, Site Settings, Global Colors/Fonts, breakpoints, widgets/addons y fuente de estilos actual. La instalación/configuración del sitio prevalece sobre defaults de documentación.
- Identifica si el alcance es contenido visual, plantilla, widget custom, formulario o lógica de negocio. Mantén el ownership en Elementor para presentación editable; lógica compleja, persistencia, permisos e integraciones pertenecen a plugin/tema/API/Developer según arquitectura vigente.
- No migres builder, estructura, globals ni extensiones existentes para seguir una receta. Si algo depende de API interna, documentación/versiones, confirma fuentes oficiales actuales antes de custom-code.

## Implementación builder-native

- Construye/edita con editor visual nativo, Containers/layout actual del sitio y widgets disponibles. Usa **Elementor** vs **Elementor Pro** conforme a capacidades realmente instaladas; no asumas Theme Builder, Forms, Dynamic Tags Pro ni widgets de addon por nombre.
- Reutiliza primero Site Settings, Global Colors, Global Fonts, estilos globales y templates/componentes existentes. No introduzcas valores globales nuevos ni dupliques CSS si el sistema vigente cubre la necesidad. Crea/reutiliza templates y Theme Builder solo con condiciones precisas, revisando colisiones/prioridad con templates actuales.
- Para contenido dinámico, confirma fuente/campo y contexto (post, query, user) y evita datos vacíos o incorrectos. Forms usan acciones/validación nativas solo cuando estén instaladas y dentro del scope; envío, consentimiento, datos sensibles e integración requieren revisión de seguridad cuando el riesgo real lo justifique.
- Responsive respeta breakpoints definidos por el proyecto/builder. Ajusta layout intrínseco, spacing y tipografía con tokens existentes; no copies desktop ciegamente ni cambies breakpoints globales por resolver una sección.
- CSS custom debe estar scoped a una clase/instancia estable y tener función que no pueda lograrse con controles nativos/globales. Evita selectores por estructura generada, IDs internos frágiles, `!important` de cobertura amplia y reglas duplicadas. Custom Code/PHP no es un contenedor para lógica de negocio; usa extensiones/hook/plugin compatible cuando la lógica material lo requiera.

## Persistencia, compatibilidad y verificación

- Trabaja en la fuente editable del builder, no en HTML renderizado/cache como fuente de verdad. Guarda/publica solo si ese es el scope autorizado; ante una operación incierta, relee el recurso antes de repetir cambios.
- Verifica la edición en Elementor editor y frontend real: contenido/estructura editable, template match/conditions, estados dinámicos, links/forms relevantes, consola/errores, y desktop + breakpoints afectados. Distingue bug de editor, frontend, caché o CSS generado antes de regenerar CSS/limpiar caché; solo ejecuta regeneración cuando la evidencia lo requiere y vuelve a comprobar editor/frontend.
- Comprueba que no hay CSS duplicado, layout overflow, templates competidores o regresión de componentes compartidos. Rendimiento medible → `performance-review`; responsive como problema principal → `frontend-responsive`; sistema global incoherente → `ui-design-system`; capacidad/código de extensión Elementor version-sensitive → `source-grounded-development` y Developer si implica PHP/backend. No actives toda la cadena para una edición visual sencilla.
