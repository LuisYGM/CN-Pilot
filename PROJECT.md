# Proyecto

> Completar mediante `/new-project`.

## Identidad

- **Nombre:** CN Pilot
- **Perfil:** Harness human-first para proyectos web con agentes de IA
- **Repositorio o carpeta:** https://github.com/LuisYGM/cn-pilot
- **Control de versiones:** Git con remoto (`origin`)
- **Versión del Blueprint:** 1.1.0

## Objetivo

Coordinar contexto, contenido, diseño, desarrollo, QA y entrega proporcionalmente para proyectos web mediante integración nativa con Kilo Code. Marca madre: Código Nocturno (https://codigonocturno.com/).

## Contexto de partida

- **Tipo:** Sistema existente (repositorio público de CN Pilot)
- **Implementación existente a respetar:** Blueprint Core bajo `.blueprint/` y configuración Kilo en `.kilo/`; preservarlos como conceptos/rutas técnicas internas.

## Alcance del repositorio

### Incluido
- Packaging y documentación pública del harness en `main`; el sitio público se mantiene aparte en la rama huérfana `gh-pages` y no forma parte del template.
- Integración nativa actual con Kilo Code; proveedores/modelos elegidos en Kilo son externos y configurables.

### Fuera de alcance
- Adapters nativos para Claude Code, Codex, Cursor, Gemini u otros runtimes.
- Publicar GitHub Pages, configurar deployment o cambiar settings/metadatos remotos del repositorio.
- Cambiar la versión base `.blueprint-version` por branding.

## Plataforma objetivo y stack
- Harness de configuración/agentes/skills para Kilo Code; documentación en español.

## Estructura del repositorio

> Registra ubicaciones observadas o decididas; estos campos no crean ni exigen carpetas.

- **Baseline/layout policy:** Greenfield / Existing / Pending
- **Workspace/product mode:** Canonical `product/` / Existing compatibility exception / Pending
- **Product container:** `product/` por defecto; en una `Existing compatibility exception`, registra `N/A` si no existe ese container físico.
- **Product root activo:** Pending / N/A / ruta real observada (`product/`, subruta técnica significativa o `.` bajo excepción)
- **Entry point(s):** Pending / N/A
- **Raíces públicas o de assets estáticos (si el stack las define):** Pending / N/A
- **Comandos de instalación/build/ejecución:** Pending / N/A
- **Build output / deployment artifact:** Pending / N/A
- **Ubicación y harness de tests:** Pending / N/A
- **Rutas generadas/cache e ignore:** Pending
- **Project input:** `project-resources/`
- **Project artifacts container:** `project-artifacts/` (on-demand; may not exist yet)
- **Project artifacts:** on-demand; índice `ARTIFACTS.md`

La raíz del repositorio no es el product root canónico ni el destino habitual de outputs. Inputs → `project-resources/`; supporting outputs → `project-artifacts/`; producto activo del workspace → `product/`; Project Context/control → root. Containers on-demand pueden no existir todavía: registrarlos no los crea. En Existing importado a un workspace Blueprint, el producto activo se coloca en `product/` y se preserva su estructura interna sin añadir una capa de wrapper sin significado técnico; adoption/copy requiere scope explícito, nunca onboarding. Código recibido solo en `project-resources/source/` es original/input y no product root; una tarea explícita de adopción prepara conscientemente la working copy en `product/` y preserva el original. Si el workspace Blueprint contiene código o una carpeta source de producto en root/top-level fuera de `product/` —por ejemplo `legacy-site/`, `src/` o `index.html`— sin contratos operativos, registra `Pending normalization/migration`, no lo trates como product root compatible y no comiences cambios allí hasta resolverlo de forma segura. Solo un repositorio operativo previamente adoptado, ligado materialmente a hosting, document root, CI/CD, Composer/npm workspaces, imports, tooling, producción o paths externos, puede declarar `Existing compatibility exception`: registra el product root real (incluido `.` si corresponde), conserva el layout y documenta evidencia/razón aquí. La mera presencia de manifests/config root no demuestra por sí sola esa dependencia. No lo envuelvas ni migres por rutina. `project-artifacts/` y subcarpetas se crean solo con el primer output real.

Ejemplos orientativos: sitio estático → container/root `product/`, entry `product/index.html`; Laravel → container/root `product/`, public root `product/public/`; plugin WordPress → container `product/`, root interno `product/<plugin-slug>/`. Un único sitio suele usar `product/` directamente, sin `product/legacy-site/`; varias roots internas solo para productos/componentes reales. Para un repositorio adoptado con excepción, registra container `N/A` si no existe, root real —por ejemplo `.`— y entry point observado. No son carpetas a crear durante onboarding.

## Modelo de entrega

- **Punto de entrega:** Template/harness desde `main`; sitio público complementario desde `gh-pages`.
- **Implementación:** Configuración Kilo y documentación del harness en `main`; sitio HTML/CSS/JS estático en la raíz de `gh-pages` (sin build obligatorio).
- **Publicación o deployment:** GitHub Pages aún no habilitado; configuración futura prevista para `gh-pages` / root.
- **Destinos específicos por entregable:** El sitio está preparado para `https://luisygm.github.io/cn-pilot/`; URL prevista, aún no publicada.

## Fuentes de verdad

- `.blueprint/BLUEPRINT.md`, documentación vigente de inicio/Kilo, estado del repositorio y contenido real del código; identidad pública del producto CN Pilot by Código Nocturno.

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
