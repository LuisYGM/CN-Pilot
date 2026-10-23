# Comandos opcionales

La conversación normal con **Jefe de proyecto** es suficiente para la mayoría del trabajo. Los comandos son accesos directos; no son etapas obligatorias ni tienes que memorizarlos. El cuerpo y el comportamiento de cada uno permanecen en su archivo `.kilo/commands/`.

| Comando | Para qué sirve |
|---|---|
| `/cn-actualizar` | Actualizar explícitamente CN Pilot Core tras comprobar el plan y los conflictos. No migra Product. |
| `/cn-estado` | Consultar la versión instalada y el estado de actualización del Core. |
| `/commit` | Preparar un commit local cuando el trabajo ya esté revisado; requiere Git. |
| `/contenido` | Iniciar trabajo de contenido dentro del scope acordado. |
| `/depurar` | Atajo para diagnosticar un bug; también puedes decir «algo dejó de funcionar». |
| `/desplegar-pruebas` | Desplegar a pruebas cuando existe un entorno y el trabajo lo autoriza. |
| `/diagnostico` | Ejecutar el diagnóstico documentado que corresponda al proyecto. |
| `/diseno` | Entrar directamente al trabajo de diseño cuando ese es el objetivo. |
| `/entrega` | Preparar el handoff o cierre del entregable actual. |
| `/nuevo-proyecto` | Iniciar u orientar el contexto de un proyecto nuevo o existente. |
| `/plan` | Preparar un plan de trabajo cuando sea útil o se solicite. |
| `/preparar-despliegue` | Preparar el método de deployment acordado; no implica publicar. |
| `/punto-control` | Verificar una unidad lógica y guardar checkpoint/commit local si corresponde. |
| `/revision` | Solicitar una revisión independiente de solo lectura cuando sea pertinente. |

Los comandos existentes pueden requerir capacidades del stack o acceso local. Push, publicación, deployment, tags, releases y acciones de producción no se autorizan por el nombre de un comando.
