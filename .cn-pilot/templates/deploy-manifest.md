# Manifiesto de despliegue

Completar solo las secciones pertinentes al alcance. Para un deploy pequeño, este plan puede permanecer en la sesión.

## Target

- Entorno / destino:
- Origen:
- Método o canal real:
- Autorización / responsable:

## Alcance de archivos

- Incluidos:
- Excluidos (incluidos secretos y configuración local):
- Borrados remotos y comportamiento del método (si aplica):

## Estado persistente (si aplica)

Indicar solo superficies afectadas y operaciones previstas; no asumir que desplegar archivos las actualiza.

- Database / migraciones:
- Options / contenido / metadata:
- Builder data / plugin configuration:
- Uploads / integraciones externas:

## Caché / CDN (si aplica)

- Capas afectadas y acción acotada:

## Recuperación

- Snapshot/backup/revisión existente, fecha y evidencia de recuperabilidad:
- Superficie cubierta y mecanismo (p. ej., archivos → restaurar archivos; DB → restaurar DB; builder → revisión/export del recurso):
- Superficies no cubiertas / forward recovery:

## Verificación

- Recursos/rutas afectadas:
- Smoke o checks funcionales (formularios, SEO, runtime u otros solo si aplican):
- Evidencia esperada y responsable:

## Preflight y aprobación

- Compatibilidad, secretos/exclusiones y límites pendientes:
- Aprobación requerida / obtenida:

El método ejecutado, sus expansiones (globs/watchers/CI), destino, inclusiones y borrados deben coincidir con este alcance validado. Si cambia el manifiesto o método, revalidar antes de publicar. No declarar rollback completo si alguna superficie queda fuera de cobertura.
