---
name: wordpress-theme-development
description: Crear o mantener materialmente themes WordPress Classic, Hybrid o Block con estructura profesional, Template Hierarchy, templates, hooks, assets y límites theme/plugin. No usar para microcambios de contenido/builder ni para migrar Existing por preferencia.
---

# wordpress-theme-development

## Activación y ownership

Actívala para un theme Greenfield, rebuild material o cambio estructural de arquitectura/theme type. `wordpress` sigue gobernando APIs Core, estado/runtime, operaciones e integración; esta skill gobierna la organización del theme. Desarrollador es owner de PHP/bootstrap/hooks/data boundary; Maquetador frontend implementa presentación visual con UI Kit/Flagship aprobados y `frontend-architecture`. No reabre Design ni inicia Product antes del gate BF-066 cuando aplica. No modifiques WordPress Core.

Antes de intervenir, confirma product root en `PROYECTO.md`, WordPress/PHP version si una API depende de ella, theme/child theme y source of truth, builder, capabilities usadas, hosting/deploy y límites de edición. Existing conserva su arquitectura/path; migración de theme/root/type requiere scope explícito, impacto/compatibilidad y aprobación. No cambies un Existing Classic a Block, ni al revés, por preferencia. Para dudas version-sensitive aplica `source-grounded-development` a documentación oficial y a la versión efectiva.

## Product source y tipo de theme

- WordPress Greenfield cuyo código controla CN Pilot: source bajo `producto/wp-content/`; crea solo `themes/<theme-slug>/`, plugins reales y `mu-plugins/` si existe necesidad de bootstrap obligatorio. No incluyas `wp-admin/`, `wp-includes/`, Core, uploads de producción, cache, backups, logs, temporales, secretos ni generated/vendor no requerido por el workflow. Producto fuente no equivale a una instalación/runtime completa.
- Existing importado conserva el layout interno vigente. Existing operational/adopted preserva el root, paths de theme/plugins, document root, hosting, CI/CD, symlinks/imports y tooling que demuestre continuidad. No reorganices para cumplir la convención Greenfield; documenta excepciones reales en Project Context. No borres assets/uploads ni cambies deployment como parte de un refactor de theme.
- Identifica la arquitectura antes de crear archivos:
  - **Classic:** PHP templates y WordPress Template Hierarchy; `header.php`, `footer.php` y `template-parts/` cuando el caso los use.
  - **Block:** templates/parts/patterns y `theme.json` según la arquitectura nativa; no requiere `header.php`/`footer.php` ni una jerarquía PHP clásica.
  - **Hybrid:** combinación deliberada de templates/capacidades clásicas y bloques, con fuente de verdad y ownership claros; no mezcla accidental.
- No elijas por moda. Un Classic/Hybrid moderno es un baseline posible para un custom frontend gobernado por código; usa Block si Site Editor/editabilidad del cliente/alcance lo justifican. Conserva builder o arquitectura Existing cuando ya gobiernan el sitio.

## Estructura proporcional

La estructura es una referencia, no un scaffold obligatorio:

Classic/Hybrid como referencia adaptable:

```text
<theme-slug>/
├── assets/ (css, js, images, fonts solo si existen)
├── inc/ (módulos PHP por responsabilidad, si hay complejidad)
├── template-parts/ (unidades de presentación reutilizables reales)
├── header.php / footer.php / templates PHP (cuando la hierarchy lo requiera)
├── front-page.php / home.php / page.php / single.php / archive.php / 404.php (solo los necesarios)
├── style.css (metadata/header requerido por WordPress; CSS adicional si aplica)
├── theme.json (opcional según necesidades editor/system)
├── functions.php (bootstrap pequeño cuando se necesita)
└── index.php (fallback Classic)
```

Block Theme conserva su layout nativo, sin wrapper Classic obligatorio:

```text
<theme-slug>/
├── style.css
├── theme.json
├── functions.php (solo si necesita setup/capability)
├── templates/
├── parts/
├── patterns/ (si existen)
├── styles/ (si ofrece variaciones reales)
└── assets/ (si existen)
```

No crees directorios vacíos, todos los archivos de la jerarquía, helpers hipotéticos, WooCommerce folders ni patterns ficticios. `style.css` de un theme clásico/híbrido debe incluir el header de metadata de WordPress; no tiene que contener todo el CSS. `screenshot.png` solo cuando corresponda a distribución/handoff real.

`functions.php` es un bootstrap/orquestador conciso: conecta setup/módulos necesarios. No acumula indiscriminadamente enqueue, CPTs, AJAX, SEO, admin, WooCommerce, endpoints ni business logic. Usa `inc/` cuando hay responsabilidades distinguibles; nombres como `setup.php`, `enqueue.php`, `menus.php`, `images.php` o `woocommerce.php` son ejemplos, no obligación. Evita un archivo por función trivial, capas enterprise, namespaces, autoloaders, Composer/Node/build o framework si el theme no lo necesita. Namespaces, build y dependencies se justifican por complejidad y workflow reproducible.

## Setup, shell y Template Hierarchy

Registra soportes/menus/setup en el hook WordPress apropiado (normalmente `after_setup_theme` para theme supports) y solo capabilities realmente implementadas: title-tag, post thumbnails, HTML5, custom-logo, responsive embeds, menus, editor styles, align-wide/block styles o WooCommerce cuando apliquen. Usa `register_nav_menus()`/`wp_nav_menu()` cuando la navegación deba administrarse; la navegación estática es válida si scope/IA así lo definen. No configures soporte en ejecución demasiado temprana ni declares APIs que el theme no ofrece.

En Classic/Hybrid, la shell global es limpia: `header.php` maneja doctype, `<html <?php language_attributes(); ?>>`, head y apertura del body/site header; la metadata y charset se integran sin competir con Core/plugins. Incluye `wp_head()` antes de `</head>`, `body_class()` en `<body>` y `wp_body_open()` tras abrirlo. `footer.php` cierra la shell y ejecuta `wp_footer()` antes de `</body>`. Conserva landmarks, un único `main` apropiado, skip link cuando corresponda y Header/Footer aprobados; no metas el hero/sections de Home dentro del shell global. No elimines hooks Core/plugins como limpieza cosmética. Block Theme sigue su estructura nativa.

Deja que la Template Hierarchy decida primero. En Classic, `index.php` es fallback; distingue `front-page.php` (portada) de `home.php` (posts index/blog). `page.php`, `single.php`, `single-{post_type}.php`, `archive.php`, `archive-{post_type}.php`, taxonomy/category/tag, search y 404 se añaden solo para comportamiento/layout requerido y según la jerarquía; templates por slug o IDs no son default. Un custom page template es apropiado para un layout reutilizable/seleccionable que la jerarquía estándar no expresa. Child themes preservan parent/stylesheet/template paths y deben usar el helper de path/URI que corresponda.

`template-parts/` contiene units semánticas/reutilizables (navegación, content loop, card, section realmente repetida), no cada `<div>` ni mini-controllers. En Classic/Hybrid prefiere `get_template_part()` con argumentos simples cuando la versión lo permita; no dupliques el mismo markup entre templates ni parametrices genéricos sin necesidad. Main query se consume como main query; ajusta con `pre_get_posts` solo cuando esa sea la capa correcta y no uses `query_posts()`. Para consulta secundaria usa `WP_Query` cuando aporte valor, restaura estado global si corresponde y evita repetir queries o ejecutar negocio en templates/parts.

## Data ownership, theme/plugin y edición

El theme presenta/estructura contenido. Usa la regla: si la funcionalidad debe sobrevivir al cambio de theme, normalmente no es responsabilidad del theme. APIs, persistencia/business logic, integraciones, workflows, endpoints y datos durables se resuelven en plugin o capa apropiada. No registres CPT/taxonomy de negocio en el theme por defecto; decide lifecycle/ownership con `wordpress-content-modeling`. Un CPT editorial estrechamente ligado puede ser decisión específica, no presunción. El plugin propio conserva su arquitectura/ownership mediante `wordpress-plugin`; `mu-plugins` solo para código real mandatory, no como cajón.

Editabilidad es proporcional: menus/Media Library/featured images cuando el cliente debe gestionarlos; contenido estático puede quedar en código si así se aprobó y protege el diseño. No hagas todo dinámico ni dupliques fields; no hardcodees datos de negocio que cambian ni inventes fallbacks. Opciones globales, logo, idioma, Customizer, patterns, Site Editor y field frameworks solo si cubren una necesidad confirmada. No instales ACF ni otro plugin por defecto. El editor debe reflejar el sistema y exponer solo la libertad que el proyecto necesita.

## Assets, theme.json y Frontend 2.6.1

CSS/JS normales se registran/cargan desde `wp_enqueue_scripts` con `wp_enqueue_style()`/`wp_enqueue_script()` o API vigente apropiada, no `<link>`/`<script>` pegados en templates como estrategia normal. Usa helpers nativos para URL/path de theme/plugins/media; no hardcodees `/wp-content/themes/<slug>/...` ni dominio. Distingue template vs stylesheet directory y child theme. Carga assets globales cuando son globales y assets de página condicionalmente solo si simplifica/ahorra carga de modo material. Versionado usa theme version, `filemtime` o build manifest según workflow; no desactives cache para resolverlo. Inline pequeño/critical puede tener motivo; evita bloques grandes de CSS/JS inline y globals JS innecesarios.

`theme.json` es opcional en Classic/Hybrid y útil para alinear settings/tokens/editor; no lo impongas si crea sistema paralelo. Block Theme lo usa según su arquitectura. Coordina colores, tipografía, spacing y layout entre `theme.json`, CSS custom properties y editor con una sola source of truth; editor styles/blocks restringen opciones solo cuando el diseño/cliente lo requiera.

Preserva Frontend Architecture/Fidelity y Frontend Media Strategy 2.6.1. Para media de contenido usa `<img>`/primitive semántico; `background-image` para decoración/background real; no conviertas Existing. Si la imagen viene de Media Library, attachment ID + API responsive nativa (por ejemplo `wp_get_attachment_image()` cuando corresponda) conserva alt, metadata y `srcset`/sizes. Registra tamaños con `add_image_size()` solo si un consumer real los usa; no generes un set genérico. Assets propios de theme usan el helper nativo apropiado. Conserva crop/ratio/object-position aprobados y sizing/layout stability; Hero/LCP no recibe lazy global y lazy below-fold es contextual. `theme.json`/templates no autorizan simplificar media, motion, Header/Footer ni composición aprobados.

## Seguridad, accesibilidad y rendimiento

Escape late por contexto (`esc_html`, `esc_attr`, `esc_url`, etc.); valida/sanitiza input según datos; nonces aplican a acciones/CSRF, no reemplazan capabilities/autorización. Comprueba capabilities en mutaciones; no confíes en UI oculta. No uses templates para procesar formularios/APIs/pagos, no metas secretos, no imprimas SVG no confiable ni hagas SQL ad hoc; si una consulta directa es necesaria, `$wpdb->prepare()` y security review según riesgo. Sanitization no sustituye escaping. No silencies errores con `@` ni dejes debug output.

Conserva landmarks, headings, nombres accesibles, skip link cuando corresponda, navegación por teclado, foco visible, estados, responsive y reduced motion del sistema aprobado. Menú mobile requiere apertura/cierre, estado semántico, teclado/foco y touch; un icono hamburger sin interacción completa no basta. No elimines outlines ni inventes WCAG certification.

Carga lo necesario: evita CSS/JS/fonts duplicados, scripts innecesarios, imágenes enormes y queries repetidas. No impongas budgets, caching custom, table, CDN o build sin evidencia/alcance. Usa `source-grounded-development` si una decisión depende materialmente de WordPress/PHP/WooCommerce version. No conviertas esta skill en una auditoría SEO/performance universal.

## WooCommerce y Existing

WooCommerce solo se activa cuando está confirmado y dentro del scope. Declara support/capabilities reales. Prefiere hooks para ajustes legibles; copia únicamente overrides de templates necesarios, documenta razón y compatibilidad y no dupliques toda la carpeta. Si WooCommerce falta, no crees archivos/integraciones shop; si está activo, valida compatibilidad cuando el override dependa de versión. Business logic/payment/order persiste en plugin/stack apropiado. Child themes, builders y conventions Existing se preservan; no migres Theme type, Customizer a `theme.json`, media backgrounds, paths ni assets a Greenfield por rutina.

## Shared surfaces, QA y handoff

`functions.php`/bootstrap, `inc/setup`, enqueue, `theme.json`, CSS/tokens globales, Header/Footer, shared template parts, menu/query conventions y plugin bootstrap son superficies compartidas single-writer mientras cambian. Estabiliza contrato/source primero; después páginas/templates derivados pueden implementarse en worktrees distintos solo si consumen surfaces estables y sus scope es independiente bajo BF-062. Si una página requiere tocar globales/part compartido, reporta dependencia y serializa; DB/uploads/runtime/ports pueden seguir siendo recursos compartidos entre worktrees.

QA proporcional a lo implementado: type/theme; PHP lint si está disponible; build/comandos reales; Template Hierarchy/empty states; hooks de shell según theme type; enqueue/rutas; media/responsive; seguridad solo si hay superficie sensible; UI Kit/reference fidelity si aprobados; un pase de consolidación PHP/CSS focal sin alterar resultado. No exijas Browser QA a una skill/Core-only ni PHPUnit/Node a todo theme. Reporta theme type/root, source of truth, módulos/templates/assets creados u omitidos, APIs/versiones cuando relevantes, tests/evidencia y limitaciones. No despliegues/publicas.
