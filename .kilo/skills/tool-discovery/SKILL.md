---
name: tool-discovery
description: Descubrir, evaluar y activar herramientas para una producción especializada cuando capacidad, disponibilidad o elección sean materiales o inciertas. Cubre cualquier disciplina e interfaz sin catálogo de proveedores; no activar para microcambios con herramientas vigentes verificadas ni como permiso de instalación/conexión.
---

# Descubrimiento profesional de herramientas

Aplica BF-075. El owner del resultado dirige la selección; Jefe coordina autorización y contexto compartido. Arquitecto interviene solo si existe una decisión estructural real. No añade agentes, perfiles obligatorios, proveedores ni permisos. Una habilidad declarada no equivale a una herramienta disponible.

## 1. Resultado y necesidad

Reutiliza brief, recursos y decisiones pertinentes. Identifica resultado, calidad, medio/formato final y editable, compatibilidad con quien lo recibirá, operación necesaria y restricciones materiales. No preguntes detalles ya confirmados ni todas las disciplinas futuras. Distingue producir, editar, exportar, verificar y publicar: una herramienta puede cubrir solo parte del trabajo.

## 2. Evidencia real, de dentro hacia fuera

1. Consulta las herramientas **expuestas en esta sesión**, su descripción/schema y permisos efectivos. No deduzcas funciones por nombre de servidor MCP ni config documentada; no leas configuración protegida o secretos para descubrirlas.
2. Inspecciona solo entorno/dependencias/formatos relevantes: una versión CLI o dependencia local es evidencia de presencia, no de licencia, compatibilidad, conexión o permiso de ejecución. Una aplicación instalada sin interfaz de automatización expuesta puede requerir ejecución humana y handoff; no simules control de escritorio.
3. Si hace falta, realiza un probe mínimo read-only y autorizado (versión/help, capability query o apertura de fixture), sin datos reales ni costes externos. Respeta `ask`/`deny`: denegación = límite, no ausencia física. No pruebes conexiones con envíos, descargas, cuentas ni operaciones facturables por inferencia.
4. Investiga fuentes oficiales externas solo si falta información material sobre formatos, interfaz, licencia, coste o compatibilidad. Una página oficial describe una candidata, no acredita instalación/conexión local. No inventes precios, licencias ni derechos; si son desconocidos, indícalo.

## 3. Clasificación útil

Para las pocas capacidades pertinentes informa necesidad, herramienta/interfaz candidata, evidencia/alcance observado, disponibilidad y gate/límite. No hace falta tabla/archivo si basta el handoff.

| Situación | Evidencia y consecuencia |
|---|---|
| Disponible y utilizable | La función necesaria está expuesta/verificada y su uso concreto está autorizado; indica qué falta verificar de calidad/exportación. |
| Presente sin conexión o autorización | Hay evidencia de presencia/configuración pero falta conexión, función expuesta, acceso o aprobación; no ejecutar hasta resolver el gate. |
| Requiere instalación | La herramienta se identificó pero no está instalada/verificada para esta operación; propone setup solo con autorización aplicable. |
| Requiere cuenta, licencia o pago | Declara el requisito conocido y coste desconocido si corresponde; no crear cuenta, aceptar términos ni comprar. |
| No disponible o no verificada | No hay evidencia suficiente o la función no existe en la sesión; distingue desconocido de ausencia comprobada. |

Estos requisitos pueden coexistir: una CLI instalada puede seguir necesitando licencia y autorización de envío. La presencia nunca elimina esos gates. Revalida evidencia obsoleta antes del uso; no mantengas un inventario global de herramientas supuestamente disponibles.

## 4. Selección y activación

Compara solo alternativas plausibles por idoneidad/calidad, formatos nativos y editabilidad, fidelidad, compatibilidad, mantenibilidad, privacidad, licencia, coste y esfuerzo. No elijas programación por familiaridad con JavaScript/SVG/Python ni una plataforma especializada por moda. Un gráfico sencillo puede ser nativo; una ilustración compleja, presentación editable o render profesional puede exigir una herramienta distinta. Las posibilidades son abiertas: MCP, API, CLI, SDK/librería, aplicación de escritorio/local, servicio web, generación multimedia, motor u otra interfaz futura.

Selecciona una opción suficiente y explica el trade-off material. Usa recursos y herramientas autorizados existentes si son adecuados. Antes de producir verifica formato y una operación representativa en fixture si hay riesgo de incompatibilidad; antes de entregar inspecciona el archivo/resultado real, apertura/exportación cuando esté disponible, editabilidad requerida y límites. Un archivo creado o comando exitoso no prueba calidad profesional.

Activa solo la skill/interfaz necesaria, con los permisos efectivos del owner y gates vigentes. Setup de dependencias usa `environment-dependency-management`; integración real `api-integration`. Para configurar MCP/Kilo, consulta `.cn-pilot/documentacion/CONFIGURACION-KILO.md` (“Configuración MCP por proyecto”) y `.cn-pilot/documentacion/CONFIGURACION.md` (“MCP opcional”); sigue el procedimiento local soportado sin guardar secretos. No cambies permisos, instales, conectes cuentas, compres, publiques ni transmitas datos a servicios externos sin autorización aplicable. No registres credenciales. No recurras a otro agente o herramienta para eludir una denegación.

## 5. Capacidad ausente y entrega honesta

Si la capacidad especializada es imprescindible y falta, **no presentes un sustituto rudimentario como resultado profesional**. Informa qué parte no puede producirse y qué capacidad concreta lo resolvería; recomienda una alternativa profesional (herramienta ya autorizada adecuada, recurso aportado con derechos, producción humana con handoff, o cambio de alcance explícito). Pregunta solo por la autorización/decisión material necesaria. Un brief, prompt o mock puede ser un entregable acordado distinto, nunca la imagen/render/audio/presentación final fingidos. Continúa lo independiente y conserva el bloqueo en el mecanismo existente.

Devuelve resultado observado, interfaz realmente usada, archivos/localización, verificación realizada, gates y límites. Jefe persiste únicamente deltas durables en las fuentes de BF-074; no crees un catálogo, registro de herramientas, expediente ni documento por tarea.
