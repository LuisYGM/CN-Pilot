# Changelog

## Sin publicar

### Añadido

- **BF-025 — Estrategia y descubrimiento de sitios existentes:** `web-strategy` conecta negocio, audiencia, conversión e información/URLs cuando hay decisiones abiertas; `existing-site-audit` aporta un baseline multistack de solo lectura y enruta auditorías especializadas únicamente cuando son necesarias. Ambas conservan activación proporcional y no bloquean microcambios.

### Mejorado

- **BF-026 — Operación WordPress y despliegue íntegro:** procedimientos proporcionales para estado real, ownership de mutaciones y verificación persistida; despliegue WordPress por superficies con manifiesto coincidente, QA post-deploy y cobertura de rollback explícita.
- **BF-024 — Configuración de IA agnóstica:** eliminada la estrategia hardcoded de modelos, tiers y reasoning; la selección pasa al runtime/configuración personal de Kilo y agentes y skills permanecen provider/model-agnostic. Se conserva la orquestación cost-aware sin asignaciones por agente.

## [1.0.1] - 2026-09-28

Parche backward-compatible con Blueprint 1.0.0.

### Mejorado

- **BF-014 — Configuración MCP:** configuración MCP activa por proyecto en `.kilocode/mcp.json`, mantenida local e ignorada por Git; `.kilocode/mcp.example.json` versionado, seguro y sin secretos; separación clara entre `kilo.jsonc` como configuración general y la configuración MCP; manejo seguro de secretos y preferencia por OAuth cuando corresponda.
- **BF-015 — Orquestación MCP:** enfoque capability-first con discovery de tools y capabilities reales; flujo `Discovery → Read-only → Plan → Write autorizado → Verification`; fallback legítimo entre integraciones; restricciones reforzadas para producción y verificación posterior a las escrituras.
- **BF-016 — Calidad estructural de maquetación:** convención conceptual `Sección → Contenedor de layout → Bloque lógico → Contenido`; Grid-first como baseline; un Container por Section como default y múltiples Containers solo para regiones de layout independientes; Blocks como unidades/celdas lógicas; wrappers auxiliares únicamente con función real; builder-native; semántica para HTML/custom themes; schema-first; implementación incremental; recuperación segura tras fallos MCP/remotos; y QA estructural además de QA técnico.
- **BF-018 — Flujo visual de alta fidelidad:** dirección creativa, prototipo high-fidelity, aprobación visual humana, implementación builder-native, fidelity pass, parity QA y Human Visual QA proporcionales; contenido aprobado como fuente editorial y CSS scoped mínimo cuando sea necesario.
- **BF-019 — Lifecycle de capabilities MCP:** rediscovery tras cambios de plugins, módulos, licencias, servidores o configuración; capability especializada primero; separación read/write; writes secuenciales por recurso y recuperación segura sin blind retry.
- **BF-020 — SEO plugin-aware:** análisis del plugin antes y después de metadata, puntuación práctica sin keyword stuffing, protección del copy aprobado y cautela con slug publicado, schema e indexación.
- **Skills especializadas y QA progresivo:** nueva `visual-parity-review`, adaptación opcional de `webapp-testing`, mayor profundidad práctica en `accessibility-review` y rendimiento WordPress condicionado al stack, con triggers estrechos y atribución de upstreams.
- **BF-023 — Revisión de seguridad basada en riesgo:** nueva `security-review` con activación proporcional, secure defaults, controles WordPress/WooCommerce/API y fallbacks seguros sin scanners ni gates universales.

## [1.0.0] - 2026-09-28

### Añadido

- Onboarding conversacional mediante `/new-project`, con Dev Lead como interfaz principal y agentes especializados.
- Flujos proporcionales `DIRECT`, `TASK` y `STRUCTURAL`, con Git opcional y enfoque local-first.
- Entregas diferenciadas por artefacto para WordPress, WooCommerce, plugins, themes, proyectos custom, contenido/SEO y UI/UX.
- Responsive con configuración versionada, handoff manual, MCP opcional y deployment opcional.
- Registro de artefactos, documentación de onboarding y continuidad del equipo.
- Estrategia de modelos provider-agnostic y orquestación consciente del coste.
- Seguridad y revisión proporcional al riesgo, incluyendo permisos, worktrees y operaciones sensibles.

### Estado

Primera versión estable del Blueprint, validada mediante pruebas piloto en escenarios de contenido, diseño, frontend, WordPress, WooCommerce, plugins, themes, proyectos custom, handoff, MCP y deployment.
