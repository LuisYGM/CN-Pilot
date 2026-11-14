# Proyecto

> Contexto canónico del proyecto. Jefe de proyecto registra aquí hechos estables verificados; no es diario ni especificación completa. Completar progresivamente mediante `/nuevo-proyecto`.

## Identidad

- **Nombre:** Pending
- **Perfil especializado (opcional, por entregable si procede):** Pending / N/A
- **Repositorio o carpeta:** Pending
- **Control de versiones:** Git local / Git con remoto / No inicializado / Pending
- **Versión de CN Pilot Core:** 3.2.1

## Objetivo

- **Resultado deseado:** Pending

- **Público prioritario (si es relevante):** Pending

No hace falta definir el público en el onboarding si no cambia el siguiente trabajo útil.

## Contexto de partida

- **Tipo:** Proyecto nuevo / Sistema existente / Pending
- **Implementación existente a respetar:** Pending

## Alcance del repositorio

### Incluido
- Pending.

### Fuera de alcance
- Pending.

## Entregables

Registra solo entregables comprometidos que necesiten distinguirse. No crees filas de ejemplo ni documentos por tarea trivial. El proyecto puede ser una marca, empresa o iniciativa sin software. Una sola implementación existente sigue siendo válida sin convertir su contexto.

Para cada entregable material: nombre/referencia estable, objetivo y formato (incluida fuente editable si se necesita), owner, ubicación nativa o destino real y dependencias con su condición. Reutiliza identidad, recursos y decisiones comunes; añade solo diferencias. Los requisitos viven en `REQUISITOS.md` o spec pertinente; los outputs y sus estados en `ARTEFACTOS.md`; las aprobaciones durables con scope en `DECISIONES.md`. Mientras no haya output, `ESTADO.md` puede conservar el bloqueo/próximo paso material. No dupliques datos entre fuentes.

## Plataforma, herramientas y formatos por entregable
- Pending.

## Estructura del repositorio

> Registra ubicaciones observadas o decididas; estos campos no crean ni exigen carpetas.

Los campos de runtime/stack que siguen son opcionales y solo corresponden a software; usa N/A para otros medios. Fuentes de producción editables pueden vivir en `producto/` con su estructura nativa; documentos autónomos/exportaciones en `artefactos/`. Conserva ubicaciones nativas existentes con razón documentada sin wrappers/migraciones de software (BF-074). Con varios entregables registra sus raíces significativas, no un único stack universal.

- **Baseline/layout policy:** Greenfield / Existing / Pending
- **Workspace layout mode:** containers canónicos / Existing compatibility exception documentada (software) / Pending
- **Container de fuentes de producción (si aplica):** `producto/` por defecto; para formatos autónomos puede ser N/A.
- **Raíz de fuentes activas:** Pending / N/A / ubicación nativa observada (no normalizar por convención)
- **Entry point(s):** Pending / N/A
- **Raíces públicas o de assets estáticos (si el stack las define):** Pending / N/A
- **Comandos de instalación/build/ejecución:** Pending / N/A
- **Build output / deployment artifact:** Pending / N/A
- **Ubicación y harness de tests:** Pending / N/A
- **Rutas generadas/cache e ignore:** Pending
- **Recursos del proyecto:** `recursos/`
- **Container de artefactos:** `artefactos/` (on-demand; puede no existir aún)
- **Artefactos del proyecto:** on-demand; índice `ARTEFACTOS.md`

La raíz no es destino preventivo de outputs. Entradas originales → `recursos/`; outputs y entregables autónomos → `artefactos/`; fuentes de producción editables cuando corresponda → `producto/`; contexto y control → raíz. Para un proyecto de software aplican el Product/Repository Layout Contract de `NUCLEO.md`: existing importado reside en `producto/`; una fuente top-level exige conservar o resolver su contrato antes de editarla. Solo un repositorio operativo de software adoptado con dependencias externas materiales puede declarar `Existing compatibility exception`, registrando root real y evidencia. Estos contratos de hosting/runtime/migración no se imponen a otros formatos; conservan su ubicación nativa. No envuelvas ni migres por rutina. Containers on-demand pueden no existir: registrarlos no los crea; `artefactos/` nace con el primer output real.

Ejemplos orientativos: sitio estático → container/root `producto/`, entry `producto/index.html`; Laravel → container/root `producto/`, public root `producto/public/`; plugin WordPress → container `producto/`, root interno `producto/<plugin-slug>/`. Un único sitio suele usar `producto/` directamente, sin `producto/legacy-site/`; varias roots internas solo para productos/componentes reales. Para un repositorio adoptado con excepción, registra container `N/A` si no existe, root real —por ejemplo `.`— y entry point observado. No son carpetas a crear durante onboarding.

## Modelo de entrega

- **Punto de entrega:** Pending
- **Implementación:** Manual / MCP o integración / Completa desde el repositorio / Pending
- **Publicación o deployment:** Manual / MCP o integración / Desde el repositorio / Fuera de alcance / Pending
- **Destinos específicos por entregable:** Pending

## Fuentes de verdad

- Pending.

## Capacidades

Las claves siguientes son compatibilidad web opcional, no catálogo cerrado ni evidencia de herramientas instaladas/conectadas. Añade únicamente capacidades requeridas por entregables reales. Si una selección especializada es material, aplica BF-075 y conserva solo la decisión durable y la evidencia no sensible pertinente; revalida disponibilidad antes del uso.

```yaml
content: false
seo: false
design: false
wordpress: false
woocommerce: false
multilingual: false
membership: false
custom-api: false
```

## Entornos

```yaml
local: true
staging: false
production: false
```

## Restricciones
- Pending.

## URLs importantes

- Local: Pending
- Staging: Pending
- Production: Pending

No incluir credenciales.
