# Ciclo de vida del proyecto

CN Pilot adapta el trabajo al objetivo actual: no es una cascada de fases que toda tarea deba completar. El [primer día](EMPIEZA-AQUI.md) explica cómo iniciar una conversación; esta página describe cómo puede avanzar el trabajo.

## Tres escalas de trabajo

- **DIRECT:** petición concreta y de bajo riesgo, como cambiar una etiqueta o corregir un estilo localizado. Inspeccionar la fuente, hacer el cambio mínimo, verificarlo y cerrar.
- **TASK:** resultado funcional o editorial acotado con varias dependencias. Acordar comportamiento/acceptance que falte, implementar y probar las superficies afectadas.
- **STRUCTURAL:** cambio material de arquitectura, datos, seguridad o un proyecto completo. Acordar acceptance y dependencias, trabajar por unidades, checkpoints, pruebas y revisión independiente cuando el riesgo lo justifique.

La escala no depende solo del tamaño del diff. Un cambio corto en permisos, pagos o producción puede requerir un proceso más profundo.

## Recorrido adaptable

Según el objetivo, el trabajo puede incluir contexto y discovery, requisitos, arquitectura, contenido, diseño, frontend/prototipo, desarrollo, QA, handoff, integración CMS, deployment y mantenimiento. Ninguna lista sustituye el scope real. Una etapa se añade solo si ayuda a decidir o entregar el resultado actual.

Un bug conocido suele ir a diagnóstico → fix → retest. Una app puede necesitar entender flujo/estados antes de diseñar; no recibe automáticamente el recorrido de marketing web. Un diseño aprobado se implementa sin rediseño; una solicitud solo de diseño puede terminar en artefactos y handoff.

## Diseño para web pública

Para una web Greenfield o un rediseño visual material con dirección abierta, CN Pilot puede inspeccionar referencias, identidad, contenido y medios; explorar conceptos; revisar la dirección con la persona; sintetizarla en UI Kit y Flagship; y pedir aprobación visual antes de implementar si desarrollo está en scope. Es una colaboración, no una secuencia obligatoria para toda página.

Un **UI Kit** define el sistema visual compartido; no es la Home. La **Flagship** es una página de diseño de alta fidelidad que guía las páginas derivadas. Los artefactos de diseño viven separados del runtime de producto. Una referencia Approved/Strict o el sistema vigente de un Existing puede permitir fast path y evitar repetir exploración.

## Dónde se guardan los resultados

- Inputs originales: `recursos/`.
- Diseño, contenido y otros outputs auxiliares: `artefactos/`, cuando existen entregables.
- Implementación activa: `producto/` si corresponde al layout Greenfield/importado. Existing operativo puede preservar su root por compatibilidad documentada.
- Memoria durable y decisiones: Project Context raíz; cada archivo mantiene su propósito.

Registrar una ubicación no crea una carpeta. No se adopta, mueve ni publica material original por inferencia.

## Prototipo y producción

Un prototipo puede usar estados locales o datos simulados para validar interacción; no equivale a backend, persistencia, autenticación, pagos o integraciones reales. La funcionalidad productiva se implementa solo si el scope la incluye y el stack está confirmado. Las pruebas dependen de qué comportamiento real exista.

## QA, checkpoints y cierre

Las pruebas/revisiones cubren criterios y riesgos afectados; no se corre una batería universal. En cambios visuales aprobados se compara fidelidad sin rediseñar para justificar desviaciones. Las páginas nuevas pueden requerir revisión visual humana; una corrección técnica puntual no reabre una aprobación visual que no afectó.

Las tareas largas pueden guardar un checkpoint local de recuperación. Progress Guard guía a avanzar hacia acceptance: si aparece un error se diagnostica; repetir el mismo fallo no cuenta como progreso y exige cambiar hipótesis/estrategia. No hay un máximo artificial de pasos ni una promesa de trabajo offline. Al completar la unidad verificada, se entrega el resultado y estado siguiente; Git puede añadir un commit local.

## Existing y mantenimiento

En un proyecto existente, inspecciona la implementación y sus fuentes reales; evita repetir discovery ya vigente y conserva todo lo que esté fuera del scope. La migración de raíz, framework, theme, datos o deployment es material y necesita evaluación/decisión apropiada. Mantenimiento sigue síntoma/evidencia → owner técnico → cambio autorizado → verificación y recuperación proporcional.

Para colaboración, Git o despliegue consulta [flujo de equipo](FLUJO-DE-EQUIPO.md), [flujo de Git](FLUJO-GIT.md) y [deployment](CONFIGURACION.md#deployment-mediante-github-actions). La publicación externa conserva autorización propia.
