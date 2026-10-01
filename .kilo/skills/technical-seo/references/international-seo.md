# Verificación técnica de idiomas y mercados

Strategy conserva mercado, audiencia, intención y arquitectura editorial. SEO técnico verifica URLs servidas y sus señales; no decide abrir mercados, no sustituye localización por traducción ni impone `/es/`, `/en/`, ccTLD o subdominios universales.

## Delimitar el conjunto

Identifica idiomas/regiones reales, URLs propietarias, mecanismo vigente y páginas equivalentes según arquitectura aprobada. No todas las páginas tienen alternativa; una página no relacionada no es equivalente por compartir plantilla. Comprueba muestras por idioma/mercado y casos sin traducción cuando existan.

## Comprobaciones pertinentes

1. Cada versión prevista tiene URL servida estable, respuesta y contenido correctos; comprueba acceso sin depender de redirección geográfica o sesión.
2. La versión que debe indexarse es rastreable/indexable y sus canonical no contradicen el objetivo. Si EN declara alternate de ES pero canonicaliza hacia ES, investiga el conflicto antes de aprobar el conjunto.
3. Hreflang utiliza códigos admitidos, URLs adecuadas y equivalencias coherentes. Verifica autorreferencia y reciprocidad cuando correspondan al conjunto, no solo existencia de tags.
4. `x-default` se usa si hay destino neutral/fallback justificado; no es obligatorio por tener varios idiomas.
5. Inspecciona la fuente de alternates (HTML, cabecera HTTP o XML sitemap). Si coexisten métodos, comprueba concordancia y ownership; no multipliques generadores por rutina.
6. Verifica referencias a URLs finales, indexables y canónicas previstas; evita redirects o versiones retiradas en el conjunto. Revisa sitemap alternatives cuando sea el mecanismo utilizado.
7. Selector y enlaces permiten llegar a versiones reales; registra diferencias móviles, caché o comportamiento por región cuando haya indicios.

Hreflang y canonical cumplen funciones distintas. No añadas hreflang para remediar una decisión editorial inexistente ni asumas que `lang` sustituye alternates. Consulta documentación oficial vigente para reglas específicas del buscador cuando sea necesario.

## Handoff

Entrega matriz acotada de equivalencias/casos, contradicción observada, propietario de emisión y prueba esperada. Cambios de ownership, mercado, URL publicada o contenido localizado vuelven a su owner y requieren aprobación material; implementación usa el stack existente. Revalida conjuntos afectados y sus retornos, sin exigir una auditoría de todos los mercados si el cambio es local.
