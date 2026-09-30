---
name: database-migrations
description: Planificar y ejecutar cambios versionados de esquema, transformaciones persistentes o migraciones de datos con riesgo de parcialidad; no usar para ediciones de registros ordinarias ni deploy solo de código.
---

# database-migrations

## Activación

Actívala ante cambios de esquema, transformación de datos, migración de estado persistente entre versiones, operaciones bulk significativas o cualquier cambio donde una aplicación parcial pueda dejar el sistema inconsistente. No es un flujo para una edición individual por API, post/option ordinario, contenido habitual ni deploy solo de código. Es multistack: descubre el sistema de persistencia y sus herramientas nativas, no presupone framework, DB o CMS.

## Procedimiento proporcional

1. **Inspecciona estado y alcance:** recurso/schema/version actual, volumen, dependencias, datos afectados y entorno; establece el estado objetivo y una forma de distinguir recursos procesados. Reutiliza evidencia existente. No imprimas ni exportes datos sensibles innecesariamente.
2. **Planifica compatibilidad:** comprueba código lector/escritor y orden de deploy, restricciones/relaciones, locks, tiempo, lotes y ventanas de mantenimiento cuando importen. Usa el mecanismo de migraciones/versionado nativo disponible (framework, versión de schema o marker existente); no introduzcas uno nuevo para un one-off de bajo riesgo.
3. **Define fallo y recuperación antes de ejecutar:** determina si hay transacción y qué cubre; ante volumen, datos valiosos, operación destructiva o producción, exige snapshot/backup pertinente, suficientemente reciente y recuperable o una alternativa de forward recovery comprobable. «Existe backup» no significa que cubra o restaure las superficies afectadas. Cambios triviales y reversibles no requieren backup completo.
4. **Controla la ejecución:** delimita autorizaciones, alcance y mecanismo; aplica migración versionada, en lotes o transaccional solo cuando el stack lo soporte y convenga. Hazla idempotente o detecta estado ya aplicado si es razonable, sin ocultar conflictos. No presumas atomicidad ni repitas a ciegas. Una operación destructiva en producción exige aprobación explícita.
5. **Ante timeout, reset o fallo parcial: STOP.** Relee el estado persistido y el marcador/progreso; establece qué partes se aplicaron antes de escoger rollback o forward recovery. Nunca reinicies una migración parcialmente aplicada sin comprobar que es repetible y segura.
6. **Verifica datos y aplicación:** según cambio, contrasta counts, constraints, relaciones, muestras, valores transformados, invariantes e integridad, y compatibilidad del código lector/escritor. Un exit code cero no demuestra consistencia. Registra versión aplicada, resultado, cobertura de verificación y limitaciones durables.

Si afecta datos personales, auth, permisos, pagos, secretos u otra superficie sensible, enruta también a `security-review` por BF-023; no dupliques su checklist aquí. Documenta plan/resultado en un artefacto solo si es entregable, durable o necesario para recuperación posterior.
