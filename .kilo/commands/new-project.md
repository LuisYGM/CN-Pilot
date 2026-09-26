---
description: Inicializa un proyecto creado desde el Blueprint y completa su contexto base.
agent: dev-lead
---

# New Project

1. Antes de preguntar o modificar archivos, inspecciona en este orden:
   - `AGENTS.md` y `.blueprint-version`;
   - las plantillas `PROJECT.md`, `REQUIREMENTS.md`, `STATE.md` y `DECISIONS.md`;
   - la estructura e implementación existente: manifiestos, configuración, documentación, código, assets y `.gitignore`;
   - el estado Git y el remote, si existen.
2. Preserva la implementación y los cambios manuales existentes. No preguntes nada que pueda inferirse con fiabilidad de la inspección.
3. Haz una primera ronda breve y natural preguntando únicamente por los temas de esta lista que sigan faltando tras la inspección. No vuelvas a preguntar un dato ya establecido con fiabilidad y no añadas otros temas a esta primera ronda:
   - qué se construirá;
   - qué stack o tecnologías ya se conocen;
   - una descripción breve, el propósito y el público.
4. Acepta «no lo sé» como respuesta válida. No exijas YAML, booleanos, listas ni nombres internos del Blueprint como `profile` o `capabilities`.
5. A partir de la inspección y las respuestas, infiere perfil, capacidades, objetivo y alcance, stack, entornos, restricciones y requisitos. Marca como `Pending` lo que siga sin conocerse.
6. Haz preguntas adicionales solo cuando sean realmente necesarias para inicializar el contexto. Deben ser simples y no exponer conceptos internos salvo que resulte útil para la persona.
7. Tanto en las preguntas como en el resumen, no muestres nombres ni estructuras internas como `profile`, `capabilities` o YAML, salvo que ayuden realmente a tomar una decisión. Traduce las inferencias a lenguaje natural.
8. Nunca solicites secretos, credenciales, tokens ni claves.
9. Antes de modificar cualquier archivo, muestra un resumen breve que distinga:
   - hechos confirmados;
   - inferencias;
   - elementos `Pending`;
   - archivos que se modificarán;
   - recomendaciones justificadas para `.gitignore`, si detectaste alguna, dejando claro que no se editará.
10. Pide confirmación explícita del resumen y de las modificaciones. Si la persona realiza una corrección material, actualiza el resumen y solicita otra confirmación antes de editar.
11. Solo después de la confirmación:
    - actualiza `PROJECT.md`, `REQUIREMENTS.md` y `STATE.md`;
    - actualiza `DECISIONS.md` únicamente cuando existan decisiones iniciales que registrar.
12. Durante la inicialización no desarrolles páginas, componentes ni funcionalidades.
13. Revisa el diff y `git status`; comprueba que no se sobrescribieron cambios manuales ni se incluyeron cambios ajenos. No reescribas la historia Git.
14. Si existen cambios válidos de inicialización, incluye únicamente esos archivos y crea el commit local `chore: inicializar proyecto`.
15. Nunca hagas push.
