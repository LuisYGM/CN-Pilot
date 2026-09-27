---
description: Inicializa un proyecto creado desde el Blueprint y completa su contexto base.
agent: dev-lead
---

# New Project

`/new-project` se ejecuta una sola vez para inicializar el contexto de cada repositorio creado desde el Blueprint. No significa crear una web nueva. Si los documentos ya identifican el proyecto real y `STATE.md` ya no indica inicialización, no lo reinicialices aunque queden datos `Pending`; continúa mediante el workflow normal de la tarea solicitada.

1. Antes de preguntar o modificar archivos, inspecciona en este orden:
   - `AGENTS.md` y `.blueprint-version`;
   - las plantillas `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`;
   - la estructura e implementación existente: manifiestos, configuración, documentación, código, assets y `.gitignore`;
   - el estado Git y el remote, si existen.
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
   - diferencias de destino entre entregables, si existen.
   Marca como `Pending` lo que siga sin conocerse.
6. Haz preguntas adicionales solo cuando sean realmente necesarias para inicializar el contexto. Deben ser simples y no exponer conceptos internos salvo que resulten útiles para una decisión del proyecto.
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
11. Solo después de la confirmación, Dev Lead distribuirá internamente la información entre `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`, sin pedir a la persona que elija destino, archivo o clasificación.
12. Genera el contenido humano en el idioma de trabajo definido explícitamente por el proyecto; si no existe uno, usa español. Mantén en inglés nombres de archivos, carpetas, claves, valores e identificadores técnicos.
13. Sustituye o elimina todos los placeholders, ejemplos y mensajes heredados del Blueprint que ya no describan el proyecto real. En particular, no conserves en `STATE.md` textos como `Blueprint created.`, `Project initialization.` o instrucciones para ejecutar `/new-project` después de inicializar.
14. Actualiza `DECISIONS.md` solo para decisiones importantes que cumplan al menos una de estas condiciones:
    - tienen alternativas razonables;
    - condicionan la arquitectura o el desarrollo futuro;
    - son costosas de cambiar posteriormente;
    - fueron decididas explícitamente por la persona.
    Requisitos, páginas, alcance y workflow no son decisiones automáticamente.
15. Aplica internamente las reglas operativas del Blueprint, incluida la prohibición de hacer push. No las traslades a la persona para que las recuerde ni las incluyas como elementos a confirmar.
16. Durante la inicialización no desarrolles páginas, componentes ni funcionalidades.
17. Revisa el diff y `git status`; comprueba que no se sobrescribieron cambios manuales ni se incluyeron cambios ajenos. No reescribas la historia Git.
18. Si existen cambios válidos de inicialización, incluye únicamente esos archivos y crea el commit local `chore: inicializar proyecto`.
19. Nunca hagas push.
