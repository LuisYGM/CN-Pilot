# Atribuciones y licencias de terceros

Este inventario identifica material derivado externo atribuido en el repositorio. No determina por sí solo la licencia del producto CN Pilot ni constituye asesoría legal. Consulta cada archivo `ATTRIBUTION.md` enlazado para la procedencia y el alcance declarados.

## Material atribuido

| Material | Ubicación | Licencia declarada | Aviso |
|---|---|---|---|
| Heurísticas visuales adaptadas de Impeccable (`impeccable`) | [ui-design-system](.kilo/skills/ui-design-system/ATTRIBUTION.md) | Apache-2.0 | El archivo atribuye heurísticas selectivas y declara que no incorpora el sistema, CLI, engine ni comandos upstream. |
| Conocimiento adaptado de `web-accessibility` de agent-skills | [accessibility-review](.kilo/skills/accessibility-review/ATTRIBUTION.md) | MIT | Conservar atribución y avisos aplicables al material derivado. |
| Conocimiento seleccionado de `wp-performance` de WordPress Agent Skills | [performance-review](.kilo/skills/performance-review/ATTRIBUTION.md) | GPL-2.0-or-later | La atribución limita su adaptación a WordPress/WooCommerce; revisar su efecto al elegir la licencia del conjunto. |
| Ideas seleccionadas de `webapp-testing` de Anthropic | [webapp-testing](.kilo/skills/webapp-testing/ATTRIBUTION.md) | Apache-2.0 | La atribución indica que no se copian scripts, ejemplos, browsers ni dependencias upstream. |

Las atribuciones locales no incluyen copias de las licencias upstream completas. Verifica los avisos originales aplicables y conserva los notices requeridos si se redistribuye material derivado. Las referencias a rutas de snapshots locales describen la procedencia registrada; no forman parte de este repositorio.

## Licencia del repositorio: decisión pendiente

El propietario debe elegir la licencia de CN Pilot antes de añadir un `LICENSE` raíz o presentar el producto como reutilizable bajo una licencia determinada. Opciones que merecen evaluación:

- **GPL-3.0-or-later para el conjunto:** puede ser una opción compatible con el material Apache-2.0 y GPL-2.0-or-later bajo términos GPLv3, sujeto a verificar cada pieza, avisos y forma de distribución. Impone obligaciones copyleft al distribuir obras cubiertas bajo GPLv3.
- **GPL-2.0-only para el conjunto:** el material marcado Apache-2.0 no se debe combinar automáticamente bajo GPLv2-only; la compatibilidad es un obstáculo que exige análisis y posiblemente separar o sustituir el material afectado.
- **Licencia permisiva como MIT o Apache-2.0 para el producto:** no debe aplicarse sin resolver la atribución GPL-2.0-or-later. La opción puede requerir retirar/reimplementar esa adaptación o mantener componentes con licencias y límites claramente separados; la mera creación de un archivo de notices no elimina obligaciones de licencia.
- **Sin licencia pública del producto por ahora:** mantener `LICENSE` pendiente evita conceder una licencia general inadvertidamente. Las obligaciones de redistribución de material de terceros aún se deben respetar si se distribuye el repositorio.

Una distribución podría requerir una combinación de `LICENSE` raíz para el material propio, `THIRD_PARTY_NOTICES.md` para un inventario legible y los avisos/licencias específicos de cada componente derivado. Según el análisis final, podrían ser necesarios textos de licencia por archivo o directorio. No se declara aquí que una combinación concreta resuelva todas las obligaciones legales.

**Estado:** decisión del propietario pendiente. No se ha creado `LICENSE` raíz en esta preparación.
