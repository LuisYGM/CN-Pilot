# Contenido

Fuente versionada de contenido cuando se necesite.

Ubicaciones canónicas:

```text
content/
├── BRAND-VOICE.md
├── SITEMAP.md
├── strategy/       # Pack editorial/search opcional para proyectos de varias páginas o migraciones
├── pages/
└── blog/
```

`content/strategy/` contiene planificación aprobada de arquitectura editorial/search cuando el alcance lo justifica; no contiene copy final. Para páginas simples puede no existir. El contenido final permanece en `content/pages/` y `content/blog/`.

`content/SITEMAP.md` puede servir de sitemap editorial general cuando no hay pack. Si existe estrategia aprobada, `content/strategy/SITEMAP.md` es la fuente de verdad para la arquitectura propuesta/aprobada; actualiza el sitemap general para reflejarla si el proyecto lo usa, sin mantener dos mapas estratégicos divergentes.
