# Método de evaluación SEO basado en evidencia

## Elegir profundidad

FOCUSED resuelve una cuestión delimitada y puede terminar con evidencia en la sesión. FORMAL produce una evaluación acordada de varias superficies: define objetivo, URLs/clases/plantillas, entornos, muestra, herramientas/datos disponibles, restricciones de acceso y ventana temporal relevante. No expande una corrección de metadata a una auditoría completa.

Reutiliza baseline y fuentes vigentes. Selecciona controles por necesidad, no por tamaño de un catálogo. En una auditoría transversal, Dev Lead coordina las especialidades; deriva contenido, rendimiento, seguridad o UX sin asumir su QA completo. Un informe puede tener límites declarados y seguir siendo útil.

## Aplicabilidad y resultado son dimensiones distintas

| Aplicabilidad | Uso |
| --- | --- |
| `APPLIES` | El control corresponde a la superficie acordada. |
| `NOT_APPLICABLE` | La condición no existe o no corresponde; explica por qué. |
| `OUT_OF_SCOPE` | Pertenece a otro alcance; no equivale a correcto. |
| `PENDING_DETERMINATION` | Aún no se conoce si corresponde. |

| Resultado | Evidencia necesaria |
| --- | --- |
| `PASS` | Observación suficiente del criterio definido, dentro de la muestra. |
| `FAIL` | Observación que contradice el criterio; identifica casos afectados. |
| `PARTIAL` | Explica qué parte cumple y qué parte no está validada o presenta desviaciones. |
| `NOT_APPLICABLE` | Justificación coherente con aplicabilidad; no cuenta como éxito técnico. |
| `REQUIRES_DATA` | Datos/acceso necesarios ausentes; indica dependencia y siguiente paso. |
| `NOT_VERIFIED` | No se realizó la comprobación; declara la razón cuando importe. |

Un `APPLIES` no admite `NOT_APPLICABLE` como resultado. Para `OUT_OF_SCOPE` o `PENDING_DETERMINATION` no uses PASS/FAIL: usa `NOT_VERIFIED` o `REQUIRES_DATA` según la causa. No conviertas falta de observación en PASS. `PARTIAL` no sustituye una evaluación completamente ausente. Cobertura de controles registrados no es porcentaje de éxito del sitio.

## Contrato de evidencia

Mantén separados:

- **Hecho observado:** URL/plantilla, entorno, fecha, método, estado y observación reproducible; referencia a evidencia redactada cuando contenga datos sensibles.
- **Hipótesis:** explicación y alternativas, con confianza y lo necesario para contrastarla.
- **Decisión autorizada:** estado deseado, aprobación y límites. Aceptar un riesgo no borra un FAIL observado.
- **Estado de implementación:** pendiente, implementado o bloqueado, según hechos reales.
- **Estado de validación:** no verificado, verificado en muestra o regresión pendiente, con evidencia posterior.

No inventes acceso, resultados de herramientas o métricas. Una opción del panel, un score del plugin o un validador sintáctico no acreditan por sí solos el comportamiento servido ni el cierre SEO.

## Muestreo y hallazgos

Explica selección, tamaño cuando aporte valor y limitaciones: clases de URL, plantillas, páginas prioritarias o estados representativos. Incluye excepciones relevantes (paginación, errores, idiomas, datos vacíos) si pueden existir. No declares representatividad estadística sin un diseño que la sustente ni extrapoles PASS de una plantilla a todas las URLs.

Por hallazgo registra identificador, controles afectados, evidencia, impacto, alcance, hipótesis/causa, confianza, recomendación, dependencias, responsable y prueba de cierre. Prioriza considerando impacto, extensión, certeza, esfuerzo y dependencias; no requiere score ni umbrales universales. Agrupa patrones sin perder casos críticos.

## Entrega y revalidación

El informe explica conclusiones y acciones; el registro de cobertura muestra qué se comprobó. Pueden enlazarse por `control_id`/`finding_id`, sin duplicar el contenido del hallazgo. [Informe opcional](../../../../templates/seo/seo-audit-report.md) y [estructura de cobertura](../../../../templates/seo/seo-audit-coverage.csv) solo para entregables que lo necesiten. Conserva informes en `docs/audits/<scope>/` y registra entregables significativos en `docs/ARTIFACTS.md`; `STATE.md` sigue siendo estado operativo, no una segunda matriz de auditoría.

Tras un cambio verifica de nuevo controles afectados y regresiones pertinentes. Conserva el contraste antes/después, fecha y muestra; «implementado» no significa «verificado». No repitas toda la auditoría salvo cambio de alcance, evidencia invalidada o riesgo que lo justifique. Reviewer puede cuestionar muestras y conclusiones de forma independiente; este método no se autoaprueba ni modifica sus permisos.
