---
name: form-experience
description: Diseñar o implementar la experiencia de un formulario material: selección/orden de fields, validación, estados, recuperación, submit y accesibilidad. UI/UX Designer es owner; Frontend/Developer la consumen para su parte al crear/alterar forms. No activar para un input aislado, copy trivial o prototipo sin flujo de form significativo.
---

# form-experience

**Owner de experiencia:** UI/UX Designer. Frontend implementa interacción visual/browser; Developer datos/validación server-side. Una tarea puede ser completada por un solo owner si el scope lo permite; la skill no crea handoffs automáticos. `auth-access-control` gobierna login/auth; `security-review` cubre riesgos de datos reales. BF-059/BF-060 gobiernan focus visual del campo.

## Preflight y diseño de campos

Identifica formulario (contact, lead/quote, registration/login, account/settings, data-entry, filter/search, upload, multistep), objetivo, actor, riesgo, destino de datos, endpoint/persistencia si existen y source UI/Existing. Reusa datos/config/modelo ya conocidos. En Existing, preserva flujo correcto; Approved/Strict fully specified rige sus campos, orden y estados: resuelve únicamente gaps no cubiertos dentro del scope, no reabre el diseño. Si es mock, mantén mock/local state; no inventes backend. Pregunta a Dev Lead solo por resultado/data/consent que cambie materialmente el flujo.

Por cada field pregunta qué decisión permite y si se necesita ahora; elimina duplicados y “por si acaso”. Agrupa campos por modelo mental; ordena de simple/contexto a dependiente/sensible. Elige label persistente (no placeholder-only), helper cuando evite error, required/optional real (no marques todo required), tipo/autocomplete/inputmode nativo, width según formato, defaults solo seguros, y conditional disclosure si depende de una respuesta. No solicites PII adicional porque sea técnicamente posible. `readonly` y `disabled` no son sinónimos; explica bloqueo si corresponde.

## Validación y recuperación

Escoge on-submit por defecto cuando el usuario necesita poder responder; valida blur/inline si prevenir un error temprano da ayuda sin castigar escritura. Realtime solo para reglas simples/feedback que importe (p. ej. strength meter), no para todo campo. Valida reglas de cliente para UX y revalida autoridad del servidor cuando hay datos/operación real: browser check no reemplaza backend. Mensaje específico explica qué corregir; error va junto al campo, tiene asociación accessible y no borra valor. Error summary/focus al primer error para form extenso o errors dispersos; conserva progreso al volver/corregir. No muestres invalid al cargar sin razón.

Para dependientes define el cambio con la causa: actualizar selector limpia/retiene dependiente según validez, loading y failed options no parecen vacíos, filtros y validation no se contradicen. Un error de red/servidor mantiene datos, identifica retry/next step cuando sea seguro y no repite acción doble.

## Estados, submit y multistep

Modela solo estados aplicables: empty/default, focused, filled, disabled, readonly, invalid/error, valid/success, submitting/loading, completed y network/server failure. Loading bloquea duplicación mientras petición está en vuelo; restaura acción/valores en error. Éxito confirma resultado siguiente (recibo/resumen/navegación) sin claim no confirmado. Double-submit/idempotency se resuelve según endpoint/riesgo, no solo con visual.

Para multistep, crea steps con propósito y progress honesto. Valida al salir del step si permite recuperación; Back preserva inputs válidos; conserva progreso solo si el usuario/privacidad/stack lo requiere; resumen antes de submit si scope/complejidad lo justifica. No conviertas form corto en wizard.

## Responsive y accesibilidad

Usa labels, semantic inputs, `fieldset/legend` para grupos, instrucciones `describedby`, required/error state asociado, controls nativos cuando son adecuados, teclado/tab order y foco visible. Teléfono/email/autocomplete/inputmode facilitan teclado móvil. Reflow no rompe label/field/error, hit target ni agrupación. Los campos con borde mantienen el contrato BF-059/060 de focus y precedencia error/success/disabled; no inventes halos para hacerlo “más accesible”. `accessibility-review` sigue siendo la revisión especializada cuando el riesgo/scope la requiere.

## Handoff y checks

En alcance de diseño, entrega fields/orden/grupos, reglas de required/conditional, copy de helper/error, momentos de validación, estados, submit/recovery y casos móvil. Frontend/Developer consume solo la parte pertinente.

Comprueba: ¿puede eliminarse field? ¿label explica el dato? ¿orden y grouping evitan relectura? ¿errores dejan corregir sin perder valor? ¿server/client rules tienen una autoridad? ¿submit/loading/error/success dan feedback? ¿teclado y mobile input son apropiados? ¿hay duplicación segura ante retry? Detente al cubrir los flujos aceptados; en mocks no simules una producción inexistente.

**Failure modes:** validar antes de que se pueda responder; texto de error genérico; limpiar todo ante un campo inválido; required arbitrario; submit instantáneo sin resultado; hacer multiscreen un form corto.
