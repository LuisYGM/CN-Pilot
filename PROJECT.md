# Proyecto

> Completar mediante `/new-project`.

## Identidad

- **Nombre:** Pending
- **Perfil:** Pending
- **Repositorio o carpeta:** Pending
- **Control de versiones:** Git local / Git con remoto / No inicializado / Pending
- **Versión del Blueprint:** 1.1.0

## Objetivo

Pending.

## Contexto de partida

- **Tipo:** Proyecto nuevo / Sistema existente / Pending
- **Implementación existente a respetar:** Pending

## Alcance del repositorio

### Incluido
- Pending.

### Fuera de alcance
- Pending.

## Plataforma objetivo y stack
- Pending.

## Estructura del repositorio

> Registra ubicaciones observadas o decididas; estos campos no crean ni exigen carpetas.

- **Baseline/layout policy:** Greenfield / Existing / Pending
- **Product container:** `product/` para implementación nueva greenfield bajo Blueprint 1.1.x; no se crea durante onboarding sin implementación.
- **Product root(s) internos:** Pending / N/A
- **Entry point(s):** Pending / N/A
- **Raíces públicas o de assets estáticos (si el stack las define):** Pending / N/A
- **Comandos de instalación/build/ejecución:** Pending / N/A
- **Build output / deployment artifact:** Pending / N/A
- **Ubicación y harness de tests:** Pending / N/A
- **Rutas generadas/cache e ignore:** Pending
- **Project input:** `project-resources/`
- **Project artifacts:** on-demand; índice `ARTIFACTS.md`

La raíz del repositorio no es el product root. En greenfield, cuando comienza la primera implementación real, crea `product/` y conserva dentro el layout nativo del stack; no impongas subcarpetas universales. No coloques archivos/código de producto en la raíz. En proyectos existentes registra el layout real, marca cualquier incumplimiento material del boundary y no muevas archivos durante onboarding. Una excepción de root requiere que una herramienta o hosting necesite materialmente esa ruta y debe documentarse aquí. Las carpetas de artefactos se crean solo cuando existan entregables reales.

Ejemplos orientativos: sitio estático → container/root `product/`, entry `product/index.html`; Laravel → container/root `product/`, public root `product/public/`; plugin WordPress → container `product/`, root interno `product/<plugin-slug>/`. No son carpetas a crear durante onboarding.

## Modelo de entrega

- **Punto de entrega:** Pending
- **Implementación:** Manual / MCP o integración / Completa desde el repositorio / Pending
- **Publicación o deployment:** Manual / MCP o integración / Desde el repositorio / Fuera de alcance / Pending
- **Destinos específicos por entregable:** Pending

## Fuentes de verdad

- Pending.

## Capacidades

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
