---
name: api-integration
description: Implementar o depurar consumo/exposición de APIs, webhooks o servicios externos con contrato, autenticación, paginación, fallos y reintentos seguros. Úsala ante una integración real; no ante una mención incidental de API ni para configurar MCP de Kilo.
---

# api-integration

## Preflight y contrato

- Inspecciona la integración, dependencias, configuración/endpoint, callers y manejo de errores ya existentes; respeta el owner y patrón del sistema. No introduzcas cliente/librería o estructura nueva si el stack vigente ya ofrece una adecuada.
- Define la operación, método, endpoint, versión, request/response, errores, límites/rate limit, paginación y semántica de éxito que requiere el caso. No inventes API. Si firmas/capabilities/versiones o comportamiento externo pueden cambiar la implementación, detecta el entorno instalado y consulta la fuente primaria vigente mediante `source-grounded-development`; no uses `latest` como prueba de compatibilidad.
- Identifica dónde se configura el endpoint y cómo se entrega autenticación. Credenciales solo mediante mecanismo local/secret store autorizado; no pedir, leer, registrar, enviar al cliente ni incluir en artefactos/Git. No dupliques controles generales de `security-review`.

## Implementación

- Usa cliente HTTP/API nativo del stack si es apropiado. Establece timeout explícito por solicitud; valida status, content-type, tamaño/formato esperado y campos antes de usar o persistir datos remotos. Trata respuestas y errores como no confiables.
- Mapea errores del proveedor a fallos tipados/estados recuperables del dominio; no conviertas timeout, auth fallida o respuesta malformada en éxito vacío. Define fallback/degradación y mensajes sin filtrar detalles sensibles.
- Reintenta solo fallos transitorios y operaciones seguras; aplica límite de intentos, backoff exponencial con jitter y respeto de `Retry-After`/rate limit cuando corresponda. No reintentes indiscriminadamente 4xx, pagos o escrituras no idempotentes. Para parcialidad/timeouts inciertos, relee estado remoto/local antes de repetir una escritura.
- Pagina de forma acotada, siguiendo cursor/enlaces y límites del proveedor; detecta cursor repetido y evita descargas ilimitadas. Cachea solo si la frescura, invalidación y privacidad permiten; no uses caché como sustituto de manejo de caída.
- En una integración saliente, una operación externa repetible debe tener clave idempotente estable o deduplicación persistente compatible con el contrato. Define estados/transiciones antes de volver a procesar; la idempotencia no puede basarse solo en una ventana de memoria si hay reintentos distribuidos.
- En webhooks, valida firma/autenticidad sobre el payload raw según documentación vigente, compara de forma segura y aplica timestamp/ventana anti-replay cuando el proveedor lo soporte. Valida esquema, limita tamaño, deduplica event ID, persiste aceptación de forma atómica y responde con el status que el contrato requiera. Procesamiento asíncrono solo con estado/recuperación adecuados; no marques un evento completado antes de persistir el efecto.
- Registra evento/operación, resultado, latencia y correlation ID útiles, redactando tokens, datos personales y payloads sensibles. Instrumenta solo lo suficiente para diagnosticar estados/retries; no registres secretos ni hagas log de todo el body por defecto.

## QA y recuperación

- Prueba con mock/fixture o sandbox oficial; cubre respuesta válida y malformada, auth denegada, timeout, 429/rate limit, 5xx, paginación final/repetida, fallo parcial, callback duplicado y reintento según aplique. Verifica que datos inválidos no se persistan y que secretos no aparecen en logs.
- Usa contract tests cuando el formato o la compatibilidad sean relevantes; pruebas no deben llamar una API real ni producir efectos de pago/producción por rutina. Comprueba fallback y estado observable cuando el proveedor no está disponible.
- Para una respuesta incierta después de escribir, consulta estado antes de retry; para credenciales/configuración defectuosa, falla cerradamente y ofrece diagnóstico que no exponga valores. Define cómo deshabilitar/revertir el caller sin corromper estado local.
- Si hay pagos, datos de cliente, auth, endpoints públicos o webhooks expuestos, añade `security-review` por riesgo; no lo cargues para una lectura API pública sin superficie sensible. `source-grounded-development` resuelve solo las dudas externas/versionadas materiales. El owner técnico continúa siendo el implementador de la integración.
