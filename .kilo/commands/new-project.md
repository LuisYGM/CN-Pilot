---
description: Inicializa un proyecto creado desde el Blueprint y completa su contexto base.
agent: dev-lead
---

# New Project

`/new-project` se ejecuta una sola vez para inicializar el contexto de cada carpeta de proyecto creada desde el Blueprint. No significa crear una web nueva. Si los documentos ya identifican el proyecto real y `STATE.md` ya no indica inicialización, no lo reinicialices aunque queden datos `Pending`; continúa mediante el workflow normal de la tarea solicitada.

1. Antes de preguntar o modificar archivos, inspecciona en este orden:
   - `AGENTS.md` y `.blueprint-version`;
   - el contexto `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` y el índice `ARTIFACTS.md`;
   - si existe y puede afectar el alcance, una lista ligera de los recursos pertinentes en `project-resources/`; no recorras todo el contenido ni preguntes si falta o está vacío;
   - `README.md`, si existe: identifica si presenta el Blueprint heredado o el proyecto real; no deduzcas su propósito solo por el nombre del archivo;
   - la estructura e implementación existente: manifiestos, configuración, documentación, código, assets y `.gitignore`;
   - el estado Git y el remote, solo si existen.
2. Preserva la implementación y los cambios manuales existentes. No preguntes nada que pueda inferirse con fiabilidad de la inspección.
3. Haz una primera ronda breve y natural preguntando únicamente por los temas de esta lista que sigan faltando tras la inspección. No vuelvas a preguntar un dato ya establecido con fiabilidad y no añadas otros temas a esta primera ronda:
   - qué trabajo se realizará o qué se construirá, mejorará o mantendrá;
   - qué stack o tecnologías ya se conocen;
   - una descripción breve, el propósito y el público.
4. Acepta «no lo sé» como respuesta válida. No exijas YAML, booleanos, listas ni nombres internos del Blueprint como `profile` o `capabilities`.
5. A partir de la inspección y las respuestas, infiere perfil, capacidades, objetivo, stack/plataforma objetivo, entornos, restricciones y requisitos. Infiere también, sin pedir campos internos:
   - si el trabajo parte de un proyecto nuevo o de un sitio/sistema existente;
   - el alcance concreto del repositorio;
   - el punto de entrega previsto;
   - si la implementación o publicación será manual, mediante MCP/integración o completa desde el repositorio;
   - las fuentes de verdad relevantes del sistema existente;
   - diferencias de destino entre entregables, si existen;
   - baseline de layout `Existing`/`Greenfield`, raíces y entry points observados/decididos cuando estén disponibles; para existentes preserva el layout y para greenfield determina luego la estructura nativa del stack.
   Marca como `Pending` lo que siga sin conocerse.
   Si la persona indica que quiere publicar/desplegar desde GitHub hacia un servidor, infiere que el modelo de deployment será desde el repositorio y regístralo en `PROJECT.md`; usa `Pending configuration` cuando falten método/destino/stack y menciona GitHub Actions como mecanismo previsto solo si está suficientemente claro. Si no menciona deployment, no lo preguntes. Durante `/new-project` nunca configures `.github/workflows/deploy.yml`, triggers, secrets ni infraestructura, aunque exista intención de automatizar; la configuración real es una tarea posterior explícitamente solicitada.
6. Haz preguntas adicionales solo cuando sean realmente necesarias para inicializar el contexto. Deben ser simples y no exponer conceptos internos salvo que resulten útiles para una decisión del proyecto. No preguntes qué modelo, proveedor o esfuerzo de razonamiento usar ni registres preferencias personales de IA como contexto o decisión de proyecto, salvo dependencia técnica real del producto.
   Si la persona indica que utilizará MCP, explica brevemente el setup, pide solo la configuración faltante, nunca secretos, y deja previsto el discovery/read-only antes de escribir sobre un entorno real. MCP no es una pregunta obligatoria y puede haber varios servidores.
7. Nunca pidas a la persona decidir dónde, en qué archivo, estructura o categoría se guardará la información. No expongas nombres de archivos, estructuras, categorías ni reglas internas del Blueprint salvo que sean realmente útiles para una decisión del proyecto.
8. Nunca solicites secretos, credenciales, tokens ni claves.
9. Antes de modificar cualquier archivo, muestra un resumen breve, simple, natural y centrado en el proyecto que incluya únicamente:
   - qué trabajo se realizará o qué se construirá, mejorará o mantendrá;
   - su propósito y público;
   - el stack conocido;
   - qué trabajo se preparará en el repositorio y hasta qué punto llegará;
   - cómo se entregará o continuará después, cuando sea relevante;
   - las fuentes de verdad existentes que deban respetarse, cuando existan;
   - los pendientes relevantes, expresados naturalmente y marcados como `Pending` cuando corresponda.
   No separes hechos de inferencias ni muestres destinos internos, listas de archivos, reglas operativas o recomendaciones de `.gitignore`.
10. La única pregunta de confirmación será: «¿Inicializo el proyecto con esta información?». Una respuesta simple como «Sí» es suficiente. Si la persona realiza una corrección material, actualiza el resumen y repite esa misma pregunta antes de editar.
11. Solo después de la confirmación, Dev Lead distribuirá internamente la información entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md`, `DECISIONS.md` y el `Repository Layout Contract` de `PROJECT.md`, sin pedir a la persona que elija destino, archivo o clasificación. Rellena ubicaciones observadas/decididas; conserva `Pending` si no se conocen y no crees carpetas de código/artifact como placeholders.
12. Genera el contenido humano en el idioma de trabajo definido explícitamente por el proyecto; si no existe uno, usa español. Mantén en inglés nombres de archivos, carpetas, claves, valores e identificadores técnicos.
13. Sustituye o elimina todos los placeholders, ejemplos y mensajes heredados del Blueprint que ya no describan el proyecto real. En particular, no conserves en `STATE.md` textos como `Blueprint created.`, `Project initialization.` o instrucciones para ejecutar `/new-project` después de inicializar.
14. Actualiza `DECISIONS.md` solo para decisiones importantes que cumplan al menos una de estas condiciones:
    - tienen alternativas razonables;
    - condicionan la arquitectura o el desarrollo futuro;
    - son costosas de cambiar posteriormente;
    - fueron decididas explícitamente por la persona.
    Requisitos, páginas, alcance y workflow no son decisiones automáticamente.
15. Aplica internamente las reglas operativas del Blueprint, incluida la prohibición de hacer push. No las traslades a la persona para que las recuerde ni las incluyas como elementos a confirmar.
16. Durante la inicialización no desarrolles páginas, componentes ni funcionalidades ni crees carpetas vacías `content/`, `design/`, `docs/`, `tests/`, `src/`, `app/`, `public/` o `config/` por costumbre. Solo `project-resources/README.md` viene precreada para inputs; subcarpetas y artefactos se añaden cuando existan recursos/outputs reales y el layout del stack lo permita.
17. Conserva `ARTIFACTS.md` como registro base sin secciones vacías ni entregables falsos. No registres Blueprint Core, Project Context ni inputs originales de `project-resources/`; incorpora solo artefactos significativos, reales y verificables que una persona deba poder descubrir si ya existen.
18. Inicializa la presentación del repositorio en `README.md` solo dentro de la inicialización confirmada de un proyecto real, no durante mantenimiento del Blueprint base:
    - Reconoce el README genérico por señales combinadas: título `Web Project Blueprint` y contenido predominantemente de uso del template, setup Kilo, `/new-project` o versión del Blueprint. Un título o una mención aislada no autorizan reemplazar un README propio; ante ambigüedad, consérvalo.
    - Si es el README genérico heredado, sustitúyelo por un resumen del proyecto; si falta, puedes crear uno con el contexto confirmado. Si ya es propio y relevante, consérvalo por defecto: no borres documentación manual ni completes por rutina. Una sustitución o edición material necesita aprobación específica, no se infiere de confirmar la inicialización del contexto.
    - Usa título con el nombre conocido y descripción breve. Resume tipo de proyecto, objetivo y contexto nuevo/existente; adapta a sitio, app, plugin, theme, ecommerce, landing, microsite o contenido sin asumir web corporativa. Incluye mercado/dominio solo si están confirmados y aportan valor.
    - Añade `Stack` solo con tecnologías confirmadas; `Estructura` solo con directorios relevantes que realmente existan y su función real. Omite campos/secciones desconocidos en vez de inventarlos o llenar el README de `Pending`.
    - En `Contexto del proyecto`, enlaza `PROJECT.md` (hechos), `REQUIREMENTS.md` (alcance/aceptación), `STATE.md` (estado), `DECISIONS.md` (decisiones) y `ARTIFACTS.md` (índice). El README es presentación y navegación resumidas: ante discrepancia prevalecen esas fuentes canónicas, no es otra memoria detallada.
    - Una sección breve de desarrollo/atribución al Web Project Blueprint es opcional. No copies bloques de contexto ni el manual del sistema; no conserves instalación/setup Kilo, onboarding `/new-project` ni la versión del Blueprint como versión del proyecto. `.blueprint/BLUEPRINT.md`, `AGENTS.md` y `.kilo/` conservan su función sin duplicarlos ni modificarlos para generar el README.
19. Comprueba siempre los archivos modificados y que no se sobrescribió trabajo manual. Para el README generado verifica título, descripción, tipo nuevo/existente, stack confirmado, estructura existente, links/rutas, ausencia de datos inventados/onboarding heredado y prioridad de fuentes canónicas. Incluye su cambio con el resto de la inicialización; no publiques todavía. Si existe Git, revisa además diff/status y evita cambios ajenos.
20. Si existe Git y la inicialización produjo cambios válidos, incluye únicamente esos archivos y crea el commit local `chore: inicializar proyecto`.
21. Si no existe Git, no ejecutes `git init`, no registres su ausencia como bloqueo y finaliza informando que los cambios quedaron guardados localmente sin commit. Registra «Control de versiones: no inicializado» en `PROJECT.md` solo si aporta contexto.
22. Nunca hagas push.
