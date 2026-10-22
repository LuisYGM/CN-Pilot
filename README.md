# CN Pilot

**CN Pilot 2.3.0 · Base Spanish-first para proyectos web y aplicaciones con agentes de IA.**

Kilo Code nativo · agnóstico al proveedor/modelo dentro de Kilo

CN Pilot coordina el trabajo de proyectos web con agentes de IA sin convertir a la persona en operadora de una cadena de herramientas. Describe el resultado en lenguaje natural; el sistema inspecciona el contexto, activa solo el proceso necesario y mantiene las decisiones importantes bajo control humano.

[Empieza aquí](.cn-pilot/documentacion/EMPIEZA-AQUI.md) · [Configuración de Kilo](.cn-pilot/documentacion/CONFIGURACION-KILO.md) · [Actualizaciones](.cn-pilot/documentacion/ACTUALIZACIONES.md) · [Documentación](#documentación) · [Repositorio](https://github.com/LuisYGM/cn-pilot)

> **Estado actual:** integración nativa con Kilo Code y estructura Spanish-first. Los identificadores técnicos de herramientas externas se conservan. CN Pilot Core se distribuye bajo [GNU GPL v3.0 or later (`GPL-3.0-or-later`)](LICENSE).

## El problema que resuelve

En un proyecto web asistido por IA, alguien suele tener que traducir cada petición a instrucciones técnicas, elegir manualmente especialistas y herramientas, reconstruir contexto, decidir cuándo revisar y vigilar que el trabajo no avance a producción sin autorización. CN Pilot organiza esas responsabilidades para que la conversación pueda empezar por el objetivo, no por la mecánica interna.

Sirve para proyectos web y aplicaciones nuevos o existentes: sitios estáticos, SaaS, contenido y SEO, WordPress, WooCommerce, plugins, themes, Bricks, Elementor, PHP, APIs y combinaciones de entregables. El stack y el alcance real deciden qué trabajo hace falta; no se presupone que cada proyecto necesite todas las etapas.

## Cómo funciona

```mermaid
flowchart LR
    H[Petición en lenguaje natural] --> D[Jefe de proyecto]
    D --> C[Contexto y alcance]
    C --> S[Especialistas y skills, si hacen falta]
    S --> W[Diseño o implementación, según el objetivo]
    W --> Q[QA proporcional y aprobación humana cuando corresponda]
    Q --> O[Producto, handoff o publicación autorizada]
```

El diagrama representa caminos posibles, no una secuencia obligatoria. Una tarea acotada puede ir directamente a implementación y verificación; otra puede detenerse en contenido, diseño o handoff. La publicación y las operaciones remotas conservan su aprobación.

### Human-first, de principio a fin

- La persona explica qué necesita con sus propias palabras; no requiere prompt engineering ni conocer rutas, agentes o skills.
- Jefe de proyecto inspecciona el contexto y pregunta solo si falta una decisión material.
- Greenfield y Existing parten de sus fuentes reales; en proyectos existentes se preserva la implementación vigente.
- Diseño y desarrollo se separan cuando aporta valor: **Design → aprobación visual → implementación → QA**, sin activar fases posteriores por rutina.
- La profundidad se ajusta al riesgo. Acceso a producción, datos, seguridad, publicación y decisiones costosas permanecen bajo control humano.

## Inicio rápido

1. Usa [`cn-pilot`](https://github.com/LuisYGM/cn-pilot) como template de GitHub, clónalo o copia sus archivos a la carpeta del proyecto. Git no es requisito.
2. Abre la carpeta en VS Code con Kilo Code y configura tu cuenta siguiendo [esta guía](.cn-pilot/documentacion/CONFIGURACION-KILO.md). Si Kilo te pide elegir un agente, selecciona **Jefe de proyecto**.
3. Ejecuta `/nuevo-proyecto`. Jefe de proyecto inspeccionará el contexto, los recursos pertinentes y si ya existe una implementación; hará solo las preguntas materiales que falten.
4. Después, explica en lenguaje natural lo que quieres conseguir. **No necesitas memorizar comandos, fases ni nombres de agentes**: Jefe de proyecto orienta el siguiente paso y coordina el trabajo.

`/nuevo-proyecto` sirve para proyectos nuevos y existentes; no crea por sí solo una web ni obliga a empezar de cero. Si el contexto ya está inicializado, no hace falta repetirlo: continúa hablando con Jefe de proyecto sobre el objetivo actual.

Consulta el [recorrido del primer día](.cn-pilot/documentacion/EMPIEZA-AQUI.md) si quieres una guía breve. Los comandos secundarios son atajos opcionales, no requisitos de uso.

## Diseño, implementación y entrega

- **Greenfield:** contexto del proyecto primero; la implementación activa empieza cuando hay una tarea de desarrollo autorizada.
- **Existing:** se inspeccionan fuentes y estructura vigentes antes de intervenir; no se asume migración ni se sobrescribe trabajo existente.
- **Diseño:** cuando forma parte del alcance, un prototipo puede pasar por aprobación humana antes de implementarlo. Una solicitud solo de diseño se detiene en el entregable visual.
- **Implementación:** se adapta al stack confirmado y a la ubicación de producto registrada.
- **QA:** se seleccionan pruebas y revisiones relevantes, no una batería universal.
- **Entrega:** puede ser código, contenido, diseño, handoff o publicación mediante una integración autorizada. Publicar no está implícito.

## Compatibilidad actual

| Entorno | Estado | Qué significa |
|---|---|---|
| Kilo Code | **Nativo / soportado** | Agentes, comandos y skills están configurados para Kilo Code. |
| Proveedores y modelos dentro de Kilo | **Configurables** | CN Pilot no fija proveedor o modelo; la disponibilidad y configuración dependen de Kilo y de la cuenta de cada persona. |
| Claude Code | Sin adapter nativo actualmente | Algunos archivos podrían inspeccionarse manualmente; no existe una integración equivalente mantenida por el proyecto. |
| Codex | Sin adapter nativo actualmente | El uso manual de archivos no equivale a soporte nativo. |
| Cursor | Sin adapter nativo actualmente | No se declara portabilidad de runtime. |
| Gemini | Sin adapter nativo actualmente | No se declara adapter ni integración nativa. |

CN Pilot **no** afirma funcionar con cualquier agente ni ofrecer portabilidad multi-agent. “Agnóstico al proveedor/modelo” describe las opciones configuradas **dentro de Kilo Code**, no otros runtimes.

## Estructura de trabajo

La estructura ayuda al sistema a conservar límites y contexto; no necesitas aprenderla para pedir trabajo.

| Ubicación | En palabras sencillas |
|---|---|
| `recursos/` | Material original recibido para el proyecto, como referencias o archivos de entrada. |
| `artefactos/` | Entregables auxiliares: contenido, diseños, especificaciones y documentación. |
| `producto/` | Implementación activa real cuando el layout del workspace la ubica allí. |
| `.cn-pilot/` | CN Pilot Core: documentación y estructura técnica interna de CN Pilot. |

La estructura interna del producto depende de su stack; un repositorio existente con contratos operativos puede conservar su root real documentada. Consulta el [layout y ciclo de vida](.cn-pilot/documentacion/CICLO-DE-VIDA.md).

## Agentes, skills y stacks

Jefe de proyecto coordina; agentes especialistas y skills son mecanismos internos que se usan bajo demanda, no una lista de tareas manual que deba dirigir la persona. La colección cubre contenido/SEO, UX y diseño, frontend, desarrollo, WordPress/WooCommerce y revisiones específicas.

Se pueden trabajar proyectos HTML/CSS/JS, PHP, WordPress, Bricks, Elementor, WooCommerce, APIs, contenido y SEO cuando el alcance y las herramientas disponibles lo permiten. Esto no significa que CN Pilot instale o suministre esos stacks, ni que todas sus integraciones estén habilitadas por defecto. MCP y deployment son opcionales.

## Seguridad y proporcionalidad

Se inspecciona el estado vigente antes de editar; el acceso a secretos se limita, las credenciales no se versionan y una escritura sobre servicios reales requiere discovery y autorización. Las acciones destructivas, publicación, push y operaciones de producción no se ejecutan por defecto. La verificación corresponde al impacto del cambio; no es una garantía de seguridad absoluta.

## Documentación

- [Primer día y proyectos Greenfield/Existing](.cn-pilot/documentacion/EMPIEZA-AQUI.md)
- [Configuración de Kilo](.cn-pilot/documentacion/CONFIGURACION-KILO.md)
- [Interacción human-first](.cn-pilot/documentacion/INTERACCION-HUMANA.md)
- [Ciclo de vida y entregas](.cn-pilot/documentacion/CICLO-DE-VIDA.md)
- [Seguridad](.cn-pilot/documentacion/SEGURIDAD.md)
- [Actualizaciones del Core](.cn-pilot/documentacion/ACTUALIZACIONES.md)
- [Configuración, MCP y deployment](.cn-pilot/documentacion/CONFIGURACION.md)
- [Solución de problemas](.cn-pilot/documentacion/SOLUCION-DE-PROBLEMAS.md)
- [Núcleo de CN Pilot](.cn-pilot/NUCLEO.md)
- [Licencia](#licencia)

## Licencia

### Qué cubre la licencia del Core

El CN Pilot Core/harness que ofrece este repositorio se distribuye bajo [GNU GPL v3.0 or later (`GPL-3.0-or-later`)](LICENSE). **Usar CN Pilot, usar sus agentes o compartir repositorio no coloca automáticamente bajo GPL un producto independiente** creado por el usuario. El Core puede modificarse conforme a su licencia; el código, contenido y assets nuevos del usuario pueden tener licencia propia si son obras independientes y sus otras dependencias lo permiten. Así, un producto comercial, privado o bajo otra licencia puede coexistir con el Core cuando su autor tiene esos derechos y no incorpora material sujeto a términos incompatibles. La ubicación en `producto/` o `artefactos/`, o en el mismo repositorio, por sí sola no decide esa relación.

Crear un plugin WordPress con CN Pilot tampoco determina su licencia por el solo uso del harness; el stack, sus dependencias y el material realmente incorporado se evalúan por separado.

La GPL no prohíbe el uso o la venta comerciales: al distribuir material cubierto, sus destinatarios reciben los derechos y condiciones de esa licencia. Para copias/uso GPL privados que no se transmiten a otros, la GPL no exige publicar el código al público. Que un servicio esté alojado en una web no resuelve por sí solo qué archivos cubiertos se transmiten a sus usuarios. Estas notas explican la intención de alcance de CN Pilot, no determinan si un caso concreto es una obra derivada ni son asesoría legal.

`recursos/` conserva las licencias de sus fuentes originales. No se asigna ni pregunta una licencia predeterminada para el producto durante `/nuevo-proyecto`.

La versión SemVer distribuible del CN Pilot Core se registra en `.cn-pilot-version`; no representa por sí sola una versión del producto CN Pilot. En proyectos administrados se puede consultar manualmente con `/cn-estado` y actualizar, tras preflight, con `/cn-actualizar`; véase [actualizaciones y recuperación](.cn-pilot/documentacion/ACTUALIZACIONES.md). Las actualizaciones nunca se ejecutan en background.
