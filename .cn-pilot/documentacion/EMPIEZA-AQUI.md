# Empieza aquí

Esta guía es el recorrido práctico del primer día. Para una descripción general, vuelve al [README](../../README.md). No hace falta conocer programación, agentes, skills ni prompting especial.

## Lo que necesitas

- VS Code y la extensión Kilo Code.
- Una copia de CN Pilot abierta como carpeta de trabajo.
- Git, si quieres historial y commits; no es obligatorio.
- Briefs, referencias, logos o archivos existentes si ayudan al objetivo. Si los tienes, colócalos en `recursos/`; no alteres los originales para prepararlos.

Consulta [Configuración de Kilo](CONFIGURACION-KILO.md) si todavía no está instalado/configurado. Proveedores y modelos se eligen dentro de Kilo; MCP es opcional.

## Inicia una conversación

1. Abre la carpeta del proyecto en VS Code.
2. Si Kilo solicita un agente, selecciona **Jefe de proyecto**. Es la entrada normal y coordina a los demás.
3. Ejecuta `/nuevo-proyecto` para describir un proyecto nuevo o darle contexto a uno existente.
4. Cuéntale qué quieres conseguir con lenguaje natural. Por ejemplo:

   > Quiero crear una web WordPress para un restaurante. Tengo logo, fotos y referencias dentro de recursos.

   > Este proyecto ya existe. Quiero rediseñar únicamente la Home sin cambiar el resto del sitio.

   > Hay un error al guardar pedidos; quiero encontrar la causa antes de tocar datos.

Después puedes seguir hablando normalmente: no hace falta memorizar comandos ni elegir las skills o agentes para cada tarea. `/nuevo-proyecto` no crea código ni repite el onboarding si el proyecto ya está inicializado.

## Cómo responder

Jefe de proyecto revisa primero el contexto, la implementación y los materiales pertinentes. No hace falta contestar un formulario entero. Puedes:

- responder en una frase o dar más detalle si quieres controlar el resultado;
- decir «no lo sé» o dejar un dato como `Pending` cuando no afecte el trabajo actual;
- decir **«Decide tú»** para decisiones profesionales, técnicas y reversibles dentro del alcance;
- pedir que una pregunta quede para después.

«Decide tú» no autoriza inventar hechos comerciales, precios o políticas, cambiar el alcance, tocar datos sensibles ni hacer operaciones de producción. Ante esas decisiones se pedirá la aprobación correspondiente.

## Si el proyecto ya existe

Existing no significa rehacer desde cero. CN Pilot inspecciona las fuentes vigentes y preserva código, stack, estructura, contenido y deployment fuera del cambio solicitado. Puedes pedir algo localizado, por ejemplo:

> Tengo un WordPress existente con un theme personalizado. Quiero cambiar solo el Header.

No hace falta pedir mover el theme a otra carpeta ni escoger Classic/Hybrid: son decisiones técnicas internas. Una migración o refactor material requiere autorización y verificación de impacto.

## Qué ocurre después

El trabajo sigue el objetivo real, no un waterfall: Un cambio pequeño puede ir directamente a inspección, corrección y prueba; un proyecto visual nuevo puede necesitar estrategia, contenido y aprobación de diseño; una aplicación sigue su propia ruta. Si una decisión no es necesaria todavía, se deja pendiente y se avanza en lo independiente.

Las aprobaciones humanas aparecen ante decisiones visuales materiales, cambios de alcance, producción, publicaciones o acciones difíciles de revertir. QA también es proporcional al riesgo; no todas las tareas necesitan auditorías, browser tests o herramientas externas.

## Qué no ocurre automáticamente

- CN Pilot no hace `push`, deployment ni publicación por defecto.
- No modifica producción, pagos, datos ni integra servicios reales sin el alcance y autorización aplicables.
- No mueve un proyecto Existing ni elimina contenido por cumplir una convención.
- No instala WordPress, Bricks, Elementor, GA4/GTM, MCP u otras dependencias solo por iniciar el proyecto.
- No continúa trabajando en segundo plano cuando la sesión o el runtime no lo hacen.

Una tarea larga puede conservar un checkpoint local para recuperarla tras una interrupción; eso no implica trabajo offline.

## Dónde seguir

- [Mapa de documentación](README.md): elige una guía según lo que necesitas.
- [Comandos opcionales](COMANDOS.md): accesos directos que puedes usar, sin tener que memorizarlos.
- [Capacidades](SKILLS-Y-CAPACIDADES.md): qué especialidades puede activar CN Pilot.
- [Ciclo de vida](CICLO-DE-VIDA.md): diseño, implementación, QA y entrega.
- [Solución de problemas](SOLUCION-DE-PROBLEMAS.md): síntomas frecuentes y qué revisar.
