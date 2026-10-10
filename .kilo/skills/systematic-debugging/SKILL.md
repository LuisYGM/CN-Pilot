---
name: systematic-debugging
description: Diagnosticar errores, regresiones, integraciones fallidas o comportamiento inesperado antes de cambiar código. Úsala cuando haya un síntoma real que reproducir y acotar; no por menciones incidentales de bugs ni para implementar una feature sin fallo observado.
---

# systematic-debugging

Usa el ciclo **REPRODUCE → OBSERVE → NARROW → HYPOTHESIS → TEST → FIX → REGRESSION**. No cambies código hasta tener una reproducción o delimitar explícitamente por qué no es posible.

1. **REPRODUCE:** convierte el reporte en resultado esperado vs. observado, pasos, entrada, frecuencia y entorno/versión. Reduce a la mínima reproducción segura; no uses datos sensibles reales. Si es intermitente, registra condiciones y frecuencia, no afirmes que desapareció tras un intento.
2. **OBSERVE:** recoge evidencia directa del caso: mensaje completo, stack/console/network pertinente, logs, estado persistido, configuración efectiva y cambios recientes relevantes. Separa hechos de hipótesis. Inspecciona tanto cliente como servidor/almacenamiento si el síntoma cruza capas.
3. **NARROW:** confirma alcance (usuarios, rutas, versiones, datos, entorno), compara una condición conocida-buena con la mala y divide el flujo en límites observables. Usa búsqueda/binario o una mínima reproducción cuando reduzca candidatos; cambia una variable por experimento.
4. **HYPOTHESIS:** formula una causa falsable y explica qué evidencia la apoya y qué resultado la descartaría. Prioriza explicación que cubra el síntoma completo, cambios recientes y evidencia fuerte; no conviertas correlación o un log cercano en causalidad.
5. **TEST:** realiza la prueba más pequeña que discrimine entre hipótesis antes de editar. Conserva estado/checkpoint cuando el área tenga riesgo. Si no reproduce, declara incertidumbre, amplía observación de manera acotada o informa el bloqueo; no inventes una causa ni enmascares el error.
6. **FIX:** cambia una sola causa demostrada con el parche mínimo. Evita cambios simultáneos no relacionados, reescrituras amplias, capturar/ocultar excepciones, suprimir logs o borrar caches como explicación universal. Cache solo se invalida si la evidencia identifica esa capa.
7. **REGRESSION:** repite exactamente el caso original y prueba regresiones cercanas relevantes; comprueba efectos secundarios, consola/logs y estado final. Si falla, revierte/ajusta solo el cambio causal y vuelve a probar. Reporta evidencia, causa confirmada o incertidumbre pendiente.

Jerarquía práctica de evidencia: estado final reproducible y observación directa > test/log correlacionado > configuración/código estático > suposición por memoria. La documentación externa/versionada solo entra si una incertidumbre material de API, runtime o compatibilidad cambia el diagnóstico: sigue `source-grounded-development` y prueba la conclusión localmente. Si la hipótesis pasa a implicar auth, permisos, datos sensibles, pagos o endpoint expuesto, enruta `security-review` además del owner técnico; no dupliques esa auditoría aquí.
