---
name: auth-access-control
description: Implementar o modificar autenticación, sesiones, identidad, roles, capabilities, ownership y autorización server-side en una app/backend. Owner Desarrollador; Arquitecto solo para decisión estructural real. No activar para login mock de prototipo ni para un UI-only change sin cambio de policy.
---

# auth-access-control

**Owner:** Desarrollador. Implementa el control; `security-review` evalúa riesgo y hace revisión focalizada independiente cuando superficie/riesgo lo requieran. No la sustituye ni requiere Arquitecto automáticamente. Arquitecto interviene solo si elección real de identidad/tenancy/provider/session boundary impacta arquitectura. `application-ui`/`form-experience` gobiernan presentación y UX, no autorización.

## Preflight y scope

Confirma stack/proveedor/session framework, entrypoints (pages/actions/API/jobs), actor, recursos, acciones, requisitos/estado existente y tests. No reinventa flow, identity store o roles. Separa authentication (quién eres) de authorization (qué puedes hacer con este objeto/operación). Prototipo local no pide auth backend sin scope explícito. Revisa `security-review` por risk real (auth siempre es superficie sensible) y toma las fuentes del stack como versión local; no implementes una criptografía/sesión propia si el framework ofrece mecanismo soportado.

## Contrato de autorización

Para cada acción material deriva regla `actor → resource → action → condition/ownership`, incluyendo deny/default. Construye la matriz compacta solo cuando existan varias combinaciones; p. ej. Admin edit any project, Member read/update assigned project. No crees RBAC/ABAC/permission-engine para dos reglas directas. Determina el boundary de confianza: API handler/server action/CMS capability/data query, no botón/component.

1. Authentication: implementa solo login/logout/registration/invite/verification/password reset/session expiry/revocation exigidos. Reusa provider/framework y password hashing soportado; nunca almacenes password plaintext, reversible ni con hash custom. Restringe registration pública si no confirmada; reset usa token one-time/expirable y no filtra credenciales ni revela existencia de cuenta materialmente. Mitiga brute force según superficie (rate/lockout progresivo que no permita DoS fácil). Controla invalidation al logout/revoke/role change según stack.
2. Sesión/token: usa almacenamiento/mecanismo nativo recomendado. Para cookie session verifica Secure/HttpOnly/SameSite/domain/path, rotación tras login/privilege change, expiry y CSRF en operaciones que lo requieran. No persistas access tokens sensibles en Web Storage por comodidad. No implementes crypto/password storage propia ni un refresh protocol duplicado.
3. Authorization: aplica policy en cada request/server-side, access deny por defecto en operaciones sensibles. Comprueba role/capability y objeto/tenant/ownership en el server/data lookup; evita check-then-use desincronizado cuando el stack ofrezca atomic guard.
4. Ownership/object access: request usa identity del contexto autenticado, no owner/user/tenant suministrado como autoridad por browser. Para multi-tenant deriva tenant de sesión/relación verificada, limita query dentro de ese tenant en cada path y prueba tenant cross-over. Filtra collections y lectura/edición/delete/export/bulk/action/attachments igual que endpoints. Identificadores no son permisos.
5. Estados UX: expón errores de auth sin revelar cuenta/datos; invalida sesión si requisito. Hidden/disabled UI guía experiencia pero no es security boundary.

## Verificación focal

Prueba mínimo: acción permitida por actor; misma acción prohibida; recurso propio/permitido; recurso ajeno/foreign tenant denegado; URL directa/request manual y alteración de ID; mismatch de role/capability; sesión expirada/revocada si forma parte del cambio. Para una regla simple puede bastar un permitido + negación crítica, amplía según superficies/API. Verifica que deny no muta datos, respuesta no filtra recursos ajenos y route/page/API comparten regla. Reutiliza tests vigentes; no crea test matrix completa si policy no la necesita.

## Handoff, blockers y stop

Reporta action/resource/actor policy, enforcement point, regla ownership, flows de auth y tests ejecutados a caller/security reviewer. Si actor/ownership/cross-tenant behavior no está definido y cambia acceso real, no inventes permissive behavior: consulta a Jefe de proyecto y bloquea solo esa ruta. Si auth/requisitos están claros, implementa y verifica cada boundary afectado, no hagas refactor de roles fuera de scope.

**Failure modes:** confiar en ocultar el control, aceptar owner/tenant desde request, proteger GET y dejar action/API sin guard, authorization after data leak/mutation, permitir registration/roles/admin por default, invalidar sesión de terceros innecesariamente.
