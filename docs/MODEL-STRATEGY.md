# Estrategia de modelos para Kilo

## Principio

El Blueprint es **provider-agnostic**. Los agentes versionados en `.kilo/agents/` definen responsabilidades, permisos y el nivel de capacidad esperado, pero no fijan proveedores ni modelos concretos.

La selección real pertenece a la configuración global o personal de Kilo de cada desarrollador. Por tanto:

- la configuración personal no se hereda al clonar el repositorio;
- cada desarrollador puede utilizar OpenAI, Anthropic, Google u otro proveedor compatible;
- un mismo agente puede apuntar a modelos distintos en cada máquina;
- los modelos, variantes y credenciales locales no se versionan;
- cambiar de proveedor no requiere modificar el Blueprint ni sus agentes.

La configuración compartible del proyecto y la separación entre preferencias locales y secretos se describen en `docs/CONFIGURATION.md`.

## Tiers recomendados

Los tiers expresan capacidad esperada, no nombres comerciales ni contratos con un proveedor.

| Rol o función | Tier recomendado | Criterio |
|---|---|---|
| `dev-lead` | High reasoning / coordinator | Coordinación, decisiones de alcance y síntesis entre especialistas. |
| `architect` | Strong reasoning | Arquitectura, tradeoffs y planificación estructural. |
| `reviewer` | Strong reasoning | Revisión independiente y análisis de riesgos o regresiones. |
| `developer` | Balanced coding | Implementación general con buen equilibrio entre código, razonamiento y coste. |
| `ui-ux-designer` | Balanced creative | Diseño, jerarquía, sistemas visuales y criterio creativo. |
| `frontend-builder` | Balanced/economical | Maquetación y adaptación responsive guiadas por contenido y diseño definidos. |
| `content-seo` | Balanced/economical | Redacción, estructura, SEO y optimización editorial. |
| Subagentes genéricos | Economical | Exploración, búsqueda y tareas auxiliares acotadas. |
| Small model | Fast/economical | Títulos, resúmenes breves y utilidades de baja complejidad. |
| Compaction | Economical | Compactación del contexto sin consumir el modelo principal. |

`Balanced/economical` permite elegir el tier según el impacto de la tarea. Por ejemplo, una implementación frontend novedosa puede justificar `Balanced`, mientras que una adaptación mecánica y bien especificada puede usar `Economical`.

## Nivel de razonamiento

Cuando el proveedor exponga variantes o niveles de razonamiento, `medium` es la recomendación por defecto. Suele ofrecer un equilibrio adecuado entre calidad, latencia y coste.

El nivel `high` debe activarse de forma puntual para trabajo realmente complejo o sensible, como una decisión arquitectónica difícil, una investigación con riesgos materiales o una revisión crítica. No es una obligación permanente para ningún agente. Si el proveedor no ofrece niveles de razonamiento, se omite `variant` y se elige el modelo que mejor represente el tier.

## Control de coste

No se recomienda asignar el modelo más potente a todos los agentes. Los modelos caros aportan más valor en coordinación, arquitectura o revisión compleja; implementación rutinaria, contenido acotado, exploración, títulos y compactación suelen resolverse con tiers `Balanced` o `Economical`.

La asignación debe revisarse cuando cambien los precios, las capacidades o el tipo de trabajo, sin editar las definiciones versionadas de agentes.

## Configuración por desarrollador

Kilo carga la configuración global desde `~/.config/kilo/kilo.jsonc` —o `kilo.json`—. Esta configuración pertenece a la máquina y queda fuera del repositorio.

1. Configura y autentica un proveedor compatible mediante Kilo.
2. Abre `templates/kilo/global-models.example.jsonc` como referencia.
3. Integra sus claves en tu configuración global existente; no sobrescribas otros ajustes personales.
4. Sustituye los placeholders por IDs reales disponibles para tu proveedor.
5. Ajusta u omite `variant` según las variantes que soporte ese modelo.
6. Reinicia o recarga Kilo y comprueba que los agentes del Blueprint estén disponibles.

El template es deliberadamente inactivo: no contiene credenciales, no configura un proveedor y no debe copiarse dentro de la configuración versionada del proyecto. La autenticación se mantiene en Kilo o en el mecanismo seguro admitido por el proveedor.

## Overrides puntuales

La configuración global establece una base, no una restricción. Para una tarea excepcional puede elegirse temporalmente otro modelo o una variante de razonamiento superior desde la sesión de Kilo. Al terminar, la asignación normal sigue siendo la opción económica por defecto.

Si una máquina no dispone de tres tiers distintos, puede reutilizar un mismo modelo para varios roles y conservar la separación conceptual. El Blueprint seguirá funcionando porque ningún archivo de `.kilo/agents/` depende de un ID concreto.
