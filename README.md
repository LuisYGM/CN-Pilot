# CN Pilot

**CN Pilot 3.2.0** es un sistema extensible de coordinación y producción profesional multidisciplinaria con integración nativa para **Kilo Code** y **OpenAI Codex**. Un proyecto puede ser una marca, empresa, producto o iniciativa y reunir distintos entregables, no necesariamente una web, aplicación o repositorio de código.

Tú describes lo que quieres conseguir con tus propias palabras. Jefe de proyecto revisa el contexto, coordina a los especialistas necesarios y verifica el trabajo según su alcance y riesgo. No necesitas programar, diseñar prompts técnicos ni escoger agentes o skills. Tampoco tienes que seguir una fase fija.

[Empieza aquí](.cn-pilot/documentacion/EMPIEZA-AQUI.md) · [Documentación](.cn-pilot/documentacion/README.md) · [Configuración de Kilo](.cn-pilot/documentacion/CONFIGURACION-KILO.md) · [Configuración de Codex](.cn-pilot/documentacion/CONFIGURACION-CODEX.md) · [Actualizaciones](.cn-pilot/documentacion/ACTUALIZACIONES.md) · [Solución de problemas](.cn-pilot/documentacion/SOLUCION-DE-PROBLEMAS.md) · [Repositorio](https://github.com/LuisYGM/cn-pilot)

CN Pilot ayuda a evitar que tengas que traducir cada petición a una especificación técnica, reconstruir el contexto o coordinar por tu cuenta diseño, implementación y QA. Preserva las decisiones aprobadas y no hace push, publica ni modifica producción por defecto. Las acciones externas requieren alcance y autorización adecuados.

## Inicio rápido

Necesitas una copia de CN Pilot abierta como carpeta de trabajo y uno de los runtimes compatibles. Git es recomendable, pero opcional.

1. Usa el repositorio como template, clónalo o copia sus archivos a la carpeta del proyecto.
2. Abre la carpeta en VS Code y usa Kilo Code o inicia Codex en la raíz del repositorio. Sigue la [guía de Kilo](.cn-pilot/documentacion/CONFIGURACION-KILO.md) o la [guía de Codex](.cn-pilot/documentacion/CONFIGURACION-CODEX.md).
3. En Kilo, selecciona **Jefe de proyecto** si el runtime lo solicita y ejecuta `/nuevo-proyecto`. En Codex, el agente raíz es Jefe de proyecto; puedes invocar `$cnp-nuevo-proyecto` para abrir el mismo onboarding.
4. Describe tu objetivo normalmente. Por ejemplo:

   > Quiero crear una web WordPress para un restaurante. Tengo logo, fotos y referencias dentro de recursos.

   > Estoy creando una marca de videojuegos. Primero necesito una landing y después una presentación comercial.

   > Este proyecto ya existe. Quiero rediseñar únicamente la Home sin cambiar el resto del sitio.

5. Jefe de proyecto inspecciona primero el material y el proyecto existente. Responde solo las preguntas materiales que falten; puedes decir «no lo sé», «Pending» o «Decide tú» para decisiones profesionales y reversibles.
6. Sigue conversando con normalidad. No tienes que memorizar comandos, nombres de agentes ni skills.

`/nuevo-proyecto` es una entrada recomendada, no un generador automático de sitios. Si el contexto ya existe, no hace falta repetir onboarding.

## Cómo se adapta al proyecto

CN Pilot trabaja tanto con proyectos nuevos como con sistemas existentes. En un Existing primero identifica lo que está implementado y preserva estructura, stack, contenido, estilos y deployment; **Existing no significa rehacer desde cero**. Una migración o refactor material requiere scope explícito y evaluación de impacto.

Las tareas pequeñas pueden ir directamente a la corrección y su prueba. Un cambio funcional puede requerir descubrimiento, implementación y QA. Para una web pública nueva o un rediseño material con dirección visual abierta, el recorrido puede estudiar referencias y assets, explorar conceptos, sintetizar una dirección, construir un UI Kit y una página Flagship, y pedir aprobación visual antes de implementar. No aplica a cada cambio: un microajuste, una referencia aprobada o una aplicación/dashboard siguen su ruta adecuada. Una aplicación usa diseño de Application UI, no el pipeline de marketing.

Cuando existe un diseño aprobado, Desarrollador lo implementa conservando composición y comportamiento; no rediseña para simplificar la implementación. Prototipo visual e implementación de producto son entregables distintos. Una aprobación de diseño no autoriza deployment.

## Qué puede resolver

El mismo proyecto puede reunir sitios y aplicaciones, identidad y recursos visuales, presentaciones y documentos editables, automatizaciones, audio/video, proyectos 3D, videojuegos, análisis y otros resultados. Son posibilidades abiertas, **no una promesa de tener instaladas todas las herramientas de producción**. CN Pilot conserva identidad, recursos y decisiones comunes y distingue requisitos, dependencias y aprobaciones por entregable. Pedir otro formato no reinicia el proyecto ni exige otro onboarding.

- **Estrategia y contenido:** orientar objetivos pertinentes y producir narrativa, investigación, guiones, documentos, copy y otros formatos publicables; web/SEO cuando corresponde.
- **Diseño y arte:** definir dirección visual y producir recursos, identidad, ilustración, presentaciones y experiencias cuando la capacidad profesional adecuada está disponible.
- **Soluciones técnicas:** implementar software, APIs, automatización, integración, datos y aplicaciones cuando las necesita el entregable; no traducir cualquier disciplina a código.
- **WordPress:** trabajar con custom themes y plugins, modelos de contenido, WooCommerce, Bricks o Elementor cuando el proyecto ya los usa o lo requiere.
- **Calidad y operación:** probar comportamiento, revisar accesibilidad, rendimiento o seguridad ante un scope/síntoma real, depurar bugs, instrumentar analytics cuando se solicita y preparar mantenimiento o deployment autorizado.

El stack, las herramientas disponibles y el alcance real determinan qué se hace. CN Pilot no instala builders, proveedores de analytics, paquetes o MCP por defecto.

### Herramientas adecuadas, disponibilidad real

Antes de una producción especializada, comprueba las funciones realmente expuestas por la sesión y el entorno. Distingue una herramienta utilizable de una candidata documentada, instalada pero sin conexión/autorización, pendiente de instalación, cuenta/licencia/pago o no verificada. El mecanismo admite MCP, API, CLI, SDK, software de escritorio/local, servicios y futuras interfaces, sin catálogo cerrado ni proveedor predeterminado.

La elección responde al resultado, formato editable, calidad, compatibilidad, mantenimiento, privacidad y coste; no intenta resolverlo todo mediante código. Si falta una capacidad imprescindible, explica qué se necesita y propone una alternativa profesional sin fingir ejecución ni entregar un sustituto rudimentario como obra final. Instalar, conectar cuentas, comprar o transmitir datos a servicios externos conserva su autorización propia.

## WordPress

CN Pilot puede crear un custom theme profesional y distinguir arquitecturas **Classic, Hybrid y Block**. La implementación puede aprovechar Template Hierarchy, Header/Footer, template parts, assets y APIs nativas, manteniendo clara la separación entre presentación del theme y funcionalidad durable de plugins.

Para un WordPress Greenfield cuyo source administra CN Pilot, el código propio se organiza bajo `producto/wp-content/`. Eso **no** significa copiar o versionar WordPress Core. Un WordPress existente conserva su instalación, rutas y hosting operativos; no se mueve por esta convención.

Bricks, Elementor y WooCommerce se usan solo cuando están presentes y forman parte del trabajo. No se instalan automáticamente.

## Medición, QA y colaboración

La instrumentación de analytics se crea cuando existe un objetivo de medición acordado. Puede cubrir eventos, formularios, navegación SPA, ecommerce y consentimiento según el stack; no rastrea todo automáticamente ni instala GA4/GTM.

La QA es proporcional: se verifican los riesgos y criterios afectados, no todas las auditorías disponibles en cada tarea. CN Pilot puede paralelizar partes independientes si eso reduce tiempo; trabajar en serie es lo normal, y los archivos compartidos se estabilizan antes de dividir writers. Un Revisor independiente puede revisar cambios estructurales.

Una decisión de negocio, claim, precio, política, uso de producción o cambio difícil de revertir no se delega con «Decide tú». Tampoco se inventan testimonios, cifras, credenciales ni hechos comerciales.

## Dónde va cada cosa

| Ubicación | Para qué sirve |
|---|---|
| `recursos/` | Material original recibido, como briefs, imágenes o referencias; se preserva como input. |
| `artefactos/` | Outputs, exportaciones, entregables autónomos y apoyo como contenido, diseño o documentación. |
| `producto/` | Fuentes de producción activas y editables, con estructura nativa por entregable; incluye software cuando corresponde. |
| `PROYECTO.md`, `REQUISITOS.md`, `ESTADO.md`, `DECISIONES.md`, `ARTEFACTOS.md` | Contexto e índice del proyecto; Jefe de proyecto los mantiene cuando cambia algo durable. |
| `.cn-pilot/` | Core, configuración, documentación y herramientas de CN Pilot. |
| `.kilo/` | Agentes, skills y comandos que Kilo utiliza en el workspace. |

No necesitas crear ni ordenar manualmente estas carpetas para empezar. Las ubicaciones on-demand aparecen cuando hacen falta. Consulta [el mapa del workspace y ciclo de vida](.cn-pilot/documentacion/CICLO-DE-VIDA.md).

### Project Context

- `PROYECTO.md`: identidad y hechos estables compartidos, entregables comprometidos, formatos, raíces/destinos, dependencias y fuentes de verdad; stack solo cuando corresponde.
- `REQUISITOS.md`: alcance y criterios de aceptación vigentes, sin exigir un PRD largo.
- `ESTADO.md`: situación actual y siguiente decisión útil; no es un diario.
- `DECISIONES.md`: decisiones importantes aprobadas, no cada detalle técnico.
- `ARTEFACTOS.md`: índice de entregables significativos, no inventario de todos los archivos.

Puedes dejar información no necesaria como pendiente. No hace falta completar todo el contexto antes de trabajar.

Un único entregable Existing conserva su contexto y rutas sin migración. Los siete perfiles web actuales siguen disponibles como especialización opcional por tarea/entregable, no como clasificación obligatoria de todo proyecto. No se crean carpetas, un documento por tarea ni un tablero paralelo para admitir varios resultados.

## Agentes, skills y comandos

Jefe de proyecto suele ser tu interlocutor. Los otros cinco especialistas intervienen cuando el trabajo lo necesita:

| Agente | Para qué sirve |
|---|---|
| Jefe de proyecto | Entiende la petición, coordina contexto, especialistas, autorizaciones y cierre. |
| Arquitecto | Resuelve decisiones estructurales, integración, compatibilidad y herramientas cuando son materiales, sin imponer software a otros medios. |
| Redactor | Estrategia editorial, investigación, narrativa y comunicación publicable adaptada al medio; SEO solo cuando corresponde. |
| Diseñador | Dirección visual, experiencia y producción artística dentro de capacidades verificadas; conserva revisión visual humana. |
| Desarrollador | Implementación técnica, software full stack, APIs, SDK, CLI e integraciones/automatización cuando el resultado las necesita. |
| Revisor | Revisión independiente de solo lectura, no implementa cambios. |

Las **42 skills** canónicas y los **14 comandos** conservan su contenido compartido bajo `.kilo/`. Kilo expone sus comandos como slash commands; Codex ofrece entradas nativas `$cnp-*` que cargan esas mismas fuentes bajo demanda. Consulta [los comandos](.cn-pilot/documentacion/COMANDOS.md), [el catálogo de capacidades](.cn-pilot/documentacion/SKILLS-Y-CAPACIDADES.md) y [la configuración de Codex](.cn-pilot/documentacion/CONFIGURACION-CODEX.md).

## Git, seguridad y publicación

Git es opcional. Cuando existe, CN Pilot puede crear un commit local al terminar una unidad verificada; el push sigue siendo manual. Tags, releases, PRs, merges y despliegues no se presuponen. Deployment puede prepararse o ejecutarse solo si el método existe, la tarea lo incluye y se cuenta con autorización.

No guardes secretos en el repositorio ni pegues credenciales en el chat. El runtime, proveedor/modelo y la política de permisos se configuran según disponibilidad local. Que una herramienta esté conectada no autoriza a usarla para escribir en un servicio.

## Documentación y compatibilidad

- [Primer día](.cn-pilot/documentacion/EMPIEZA-AQUI.md)
- [Mapa de documentación](.cn-pilot/documentacion/README.md)
- [Flujo de equipo](.cn-pilot/documentacion/FLUJO-DE-EQUIPO.md)
- [Interacción y decisiones humanas](.cn-pilot/documentacion/INTERACCION-HUMANA.md)
- [Git](.cn-pilot/documentacion/FLUJO-GIT.md)
- [Seguridad](.cn-pilot/documentacion/SEGURIDAD.md)
- [Actualizar CN Pilot](.cn-pilot/documentacion/ACTUALIZACIONES.md)
- [Problemas frecuentes](.cn-pilot/documentacion/SOLUCION-DE-PROBLEMAS.md)
- [Referencia Core para mantenedores](.cn-pilot/NUCLEO.md)

La integración nativa de Codex usa `.codex/agents/` y `.agents/skills/`; los adaptadores cargan bajo demanda los contratos compartidos de `.kilo/`. Las instrucciones de agentes no conceden permisos: la sandbox y las aprobaciones efectivas son las de la sesión del runtime. Consulta la [guía de Codex](.cn-pilot/documentacion/CONFIGURACION-CODEX.md) antes de usarlo.

## Licencia

El Core de CN Pilot se distribuye bajo [GNU GPL v3.0 or later (`GPL-3.0-or-later`)](LICENSE). La explicación de alcance y la licencia completa están disponibles aquí: [qué cubre la licencia](#licencia). Esta descripción no es asesoría legal.

### Qué cubre la licencia del Core

Usar CN Pilot, sus agentes o compartir el repositorio no somete automáticamente un producto independiente a GPL. El Core puede modificarse conforme a su licencia; el código, contenido y assets nuevos pueden tener licencia propia si son obras independientes y sus dependencias lo permiten. La ubicación bajo `producto/` o `artefactos/`, o dentro del mismo repositorio, no decide por sí sola esa relación.

La GPL permite uso comercial; al distribuir material cubierto, sus destinatarios reciben los derechos y condiciones de esa licencia. El Core no determina si un caso particular constituye una obra derivada ni ofrece asesoría legal. `recursos/` conserva las licencias de sus fuentes originales.

La versión del Core se registra en `.cn-pilot-version`; no es la versión del producto del proyecto. `/cn-estado` consulta la versión y `/cn-actualizar` ejecuta una actualización solo por invocación explícita. El updater protege Product y Project Context. Más información en [Actualizaciones](.cn-pilot/documentacion/ACTUALIZACIONES.md).
