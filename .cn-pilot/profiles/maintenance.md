# Perfil: maintenance

## Usar cuando
El proyecto ya está vivo y la solicitud implica un cambio operativo, mantenimiento planificado, incidente o recuperación. Un cambio pequeño con destino y fuente conocidos sigue su fast path `DIRECT`; estar en Existing no activa por sí solo una auditoría o proceso de operaciones.

## Orientación
`Current state/source → scope, environment & risk → evidence → specialist if needed → authorized change or recovery → affected-surface verification → current state / next action`

Reutiliza la fuente vigente y el estado operativo conocido. Haz baseline read-only con `existing-site-audit` solo si una incógnita material del estado/stack/fuente condiciona el trabajo. Dev Lead coordina lifecycle e impacto; el especialista pertinente conserva diagnóstico e implementación. `maintenance-operations` es bajo demanda para incidentes, mantenimiento planificado, cambios de producción o recuperación, no para microcambios conocidos.

Antes de un cambio material, identifica entorno/superficie, autorización, dependencias, prueba y opción de recuperación proporcionales. Producción es una superficie distinta; staging, backup y ventana se usan cuando reducen riesgo material, no por ceremonia. Backup existente no prueba restore; rollback no equivale a restore y datos vivos requieren protección explícita.

Ante incidente, preserva evidencia, limita cambios, correlaciona cambios recientes sin asumir causalidad y enruta diagnóstico especializado. Verifica la superficie real afectada; registra estado, riesgo residual y next action solo si son materiales. La skill especializada no sustituye deploy, debugging, security, performance, SEO, migrations ni automation.
