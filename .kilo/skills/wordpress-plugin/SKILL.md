---
name: wordpress-plugin
description: Diseñar, crear o ampliar plugins WordPress mantenibles. Úsala para nuevos plugins, arquitectura de plugins, activación/desactivación, uninstall, hooks, assets, admin, frontend y compatibilidad.
---

# wordpress-plugin

## Alcance y ownership

Úsala para crear o mantener **plugins propios** cuando el stack aprobado requiere lógica permanente; no crees un plugin vacío ni dupliques funcionalidades del Core o de plugins existentes. Reutiliza `wordpress` para estado real, canal seguro y verificación de recursos. Define qué código, settings, tablas, datos, hooks y tareas son propiedad del plugin y cuáles pertenecen a WordPress, a otro plugin o al sitio; evita cambios colaterales sobre configuración compartida.

## Diseño y lifecycle

1. Comprueba instalación/versiones, dependencias y compatibilidad requerida (WordPress, PHP y plugins relevantes). Delimita funcionalidades, entradas, permisos, datos persistidos y criterios de aceptación antes de elegir una arquitectura proporcional. Usa bootstrap claro y prefijos/namespaces; separa admin/frontend solo cuando ayude. Carga assets únicamente donde se usan y documenta hooks públicos si se ofrece extensibilidad.
2. Registra hooks sin duplicar efectos y ten en cuenta llamadas repetidas. En settings, REST/AJAX y tareas de fondo, define capabilities server-side, validación, sanitización, escaping, nonces/CSRF cuando apliquen, fallos recuperables y ausencia de secretos en logs. Los workers reintentables deben tolerar ejecución repetida cuando el riesgo lo requiera; cron/colas se crean solo por necesidad real.
3. En activación, prepara solo el estado necesario y comprueba reactivación segura; no presupongas que activation hooks sustituyen migraciones futuras. En desactivación, detén tareas programadas y efectos activos propios sin borrar datos por defecto. En uninstall, documenta retención o borrado y solicita decisión explícita antes de eliminar datos; no toques datos de otros owners.
4. Distingue `code deploy` de cambios persistentes. Si la feature requiere migración, versiónala y detecta estado previo; procura idempotencia, compatibilidad durante la transición, ausencia de pérdida accidental, validación posterior y rollback o forward recovery según viabilidad. No introduzcas framework de migraciones por una feature que no migra datos; usa `database-migrations` cuando cambien esquema, estructura o volumen significativo.

## QA y recuperación

Prueba según alcance bootstrap, activación/reactivación, desactivación, uninstall sin pérdida inesperada, permisos, handlers y hooks, estados vacíos, compatibilidad, upgrade y migración cuando existan. Verifica tanto estado persistido como comportamiento real y define qué restaura código, qué restaura datos y qué requiere recuperación hacia adelante. Consulta `security-review` para superficie sensible, `testing-strategy` para cobertura proporcional y `performance-review` ante problema medible o riesgo demostrado; no reproduzcas sus auditorías completas aquí.

Entrega archivos y recursos afectados, ownership, versiones/migraciones aplicadas, pruebas, compatibilidad, pendientes y alcance efectivo del rollback. Un plugin instalado o código desplegado no demuestran que sus datos estén migrados.
