---
name: application-ui
description: Diseñar interfaces de software con shell, navegación, datos, tablas, roles y estados complejos para SaaS, dashboards, portales o backoffice. Activar para una experiencia de aplicación abierta/material; no para marketing pages/landing, un ajuste UI localizado o una reproducción Approved/Strict completamente especificada.
---

# application-ui

**Owner:** Diseñador UI/UX. Diseña superficies de software, no páginas de marketing (`page-composition`). Consume comportamiento/actores confirmados de `product-discovery`, sistema visual de `ui-design-system` y, si cambia materialmente, `ui-kit-construction`. Maquetador frontend implementa UI; Desarrollador define behavior/data contract. Carga `form-experience` solo cuando forms sean un flujo material. No inventes funcionalidades para llenar un dashboard.

## Descubrimiento y shell

Inspecciona navegación, roles/tasks, data density, UI kit, rutas/estados existentes y responsive. Existing válido es fuente de continuidad; si Approved/Strict especifica pantalla y estado completos, implementa su scope sin reabrir diseño. Resuelve la jerarquía del application shell (sidebar/topbar, espacios de trabajo, section navigation, breadcrumbs/context) por IA real; no añadas shell universal si la app es un feature/pantalla aislada. Mantén posición y activo visibles, titles orientativos y primary action según tarea. Distingue navigation de tabs que cambian contexto local.

Para página cada vez concreta, define page header/context, acción principal, filtros/controls requeridos, content region y estados. Evita “button farm”: primary, secondary, destructive y row actions tienen jerarquía; destructive explica objeto/impacto y confirmación solo si riesgo amerita.

## Dashboard y datos

Un dashboard responde a actor: qué necesita saber, qué debe hacer, qué requiere atención y qué cambia con frecuencia. Prioriza pocos datos que habilitan acción, fuente/period/status y drill-down; no decores por KPI tile, chart ni “recent activity” automáticamente. No grafiques datos sin contrato/fuente. Considera loading/skeleton si la latencia real está confirmada; no uses skeleton como estado base estático.

En table/list define columnas por tarea y prioridad; alinea números; conserva identificadores/values que permitan decidir; ajusta wrap/truncate con acceso al valor completo; sorting/filters/search/pagination solo si sirven dataset/volumen reales. Ubica row actions y bulk selection según ownership de fila y consecuencias. Estados visibles deben distinguir empty (sin datos), no-results (filter), error, partial failure, stale/loading, permission-unavailable y success según behavior existente. No fabriques rows realistas como si fueran producción.

## Responsive, dialogs y densidad

La tabla/dataset móvil puede usar columnas prioritarias, row cards, drilldown o disclosure progressive. Decide según comparación/tareas y preserva acciones/valores importantes; un overflow horizontal solo si es usable y mejor que transformación semántica. Reorganiza shell/controls sin ocultar navegación, filtros o acciones necesarias. Density (comfortable/compact) responde a volumen/escenario, no a estética; no reduzcas targets o legibilidad para encajar desktop.

Tabs agrupan vistas hermanas; filters refinan dataset; drawer/dialog solo usa diálogo cuando interrumpir contexto está justificado. Conserva foco/escape/return cuando sea modal, URL/back solo si el estado/ruta debe compartirse, y estados vacíos/fallo con siguiente acción real. No añadas charts, modal, sidebar, notifications o settings hipotéticos.

## Roles y contrato

Usa actores/capabilities/ownership definidos por requisitos. La UI refleja acciones disponibles y estados de permiso para orientar; no crea roles ni convierte «hidden» en autorización. Comportamiento de enforcement pertenece a `auth-access-control` y Desarrollador. En handoff describe un permiso/action solo como confirmado, y separa UI (visible/disabled/unavailable) de la regla server-side esperada.

## Checks y handoff

Comprueba: el usuario sabe dónde está; tarea siguiente y acción principal son claras; densidad/columnas se ajustan al uso; filtros/sort/bulk actúan sobre el dataset correcto; empty/error/partial/loading/permission states responden a condiciones verdaderas; móvil conserva lectura y acción; roles en UI corresponden a requisitos; tabla/dialogs se operan con teclado. Devuelve flujos, componentes, jerarquía, estados y restricciones responsive concisamente a Maquetador frontend/Desarrollador sin mini-PRD. Si behavior material falta, informa a Jefe de proyecto; no lo inventes. Detente al cubrir task/risk confirmados.

**Failure modes:** cuatro metric cards + chart + activity por receta; una tabla gigante recortada en móvil; disabled sin explicación; gráfica ornamental; mezclar filtros con navegación; añadir role-based UI como sustituto de server policy.
