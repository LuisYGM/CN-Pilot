# Proyecto

> Completar mediante `/nuevo-proyecto`.

## Identidad

- **Nombre:** Pending
- **Perfil:** Pending
- **Repositorio o carpeta:** Pending
- **Control de versiones:** Git local / Git con remoto / No inicializado / Pending
- **Versión de CN Pilot Core:** 2.5.0

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

## Plataforma objetivo y stack
- Pending.

## Estructura del repositorio

> Registra ubicaciones observadas o decididas; estos campos no crean ni exigen carpetas.

- **Baseline/layout policy:** Greenfield / Existing / Pending
- **Workspace/product mode:** Canonical `producto/` / Existing compatibility exception / Pending
- **Product container:** `producto/` por defecto; en una `Existing compatibility exception`, registra `N/A` si no existe ese container físico.
- **Product root activo:** Pending / N/A / ruta real observada (`producto/`, subruta técnica significativa o `.` bajo excepción)
- **Entry point(s):** Pending / N/A
- **Raíces públicas o de assets estáticos (si el stack las define):** Pending / N/A
- **Comandos de instalación/build/ejecución:** Pending / N/A
- **Build output / deployment artifact:** Pending / N/A
- **Ubicación y harness de tests:** Pending / N/A
- **Rutas generadas/cache e ignore:** Pending
- **Recursos del proyecto:** `recursos/`
- **Container de artefactos:** `artefactos/` (on-demand; puede no existir aún)
- **Artefactos del proyecto:** on-demand; índice `ARTEFACTOS.md`

La raíz del repositorio no es el root de producto canónico ni el destino habitual de outputs. Entradas originales → `recursos/`; outputs auxiliares → `artefactos/`; producto activo del workspace → `producto/`; contexto y control → raíz. Containers on-demand pueden no existir todavía: registrarlos no los crea. En Existing importado a un workspace CN Pilot, el producto activo se coloca en `producto/` y se preserva su estructura interna sin añadir una capa wrapper sin significado técnico; adoptar/copiar requiere scope explícito, nunca onboarding. Código recibido solo en `recursos/codigo-original/` es original/input, no root de producto; una tarea explícita de adopción prepara conscientemente una working copy en `producto/` y preserva el original. Si el workspace CN Pilot contiene código o una carpeta source de producto en root/top-level fuera de `producto/` —por ejemplo `legacy-site/`, `src/` o `index.html`— sin contratos operativos, registra `Pending normalization/migration`, no lo trates como product root compatible y no comiences cambios allí hasta resolverlo de forma segura. Solo un repositorio operativo previamente adoptado, ligado materialmente a hosting, document root, CI/CD, Composer/npm workspaces, imports, tooling, producción o paths externos, puede declarar `Existing compatibility exception`: registra el product root real (incluido `.` si corresponde), conserva el layout y documenta evidencia/razón aquí. La mera presencia de manifests/config root no demuestra por sí sola esa dependencia. No lo envuelvas ni migres por rutina. `artefactos/` y sus subcarpetas se crean solo con el primer output real.

Ejemplos orientativos: sitio estático → container/root `producto/`, entry `producto/index.html`; Laravel → container/root `producto/`, public root `producto/public/`; plugin WordPress → container `producto/`, root interno `producto/<plugin-slug>/`. Un único sitio suele usar `producto/` directamente, sin `producto/legacy-site/`; varias roots internas solo para productos/componentes reales. Para un repositorio adoptado con excepción, registra container `N/A` si no existe, root real —por ejemplo `.`— y entry point observado. No son carpetas a crear durante onboarding.

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
