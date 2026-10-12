---
name: release-deployment
description: Preparar y coordinar un release/deployment solicitado de una aplicación no WordPress, incluidos artifact, target y método de entrega. Dev Lead owner/coordinador. No activar para desarrollo normal, Git-only ni despliegue WordPress (usa deploy-wordpress).
---

# release-deployment

**Owner/coordinador:** Dev Lead. Developer/Frontend preparan build y artifact de su stack; ejecutan cambios solo dentro de ownership y autorización. `deploy-wordpress` es canónica para publicación WordPress y prevalece. `maintenance-operations` coordina riesgo/incidentes vivos, no sustituye método técnico. `database-migrations` gobierna migraciones persistentes. No hay deploy por el hecho de estar publicado o tener acceso.

## Autorización y clasificación

Activa ante petición real de publicar/releasear una aplicación static, PHP custom, Laravel, Node, React/Vite u otro stack/hosting; confirma el método durante preflight si no está definido. No se activa por commit, push, build de desarrollo, mención incidental de “release” ni mantenimiento local. Separa explícitamente `commit ≠ push ≠ build ≠ release ≠ deploy ≠ migration`: commit local sigue Core; push y deploy requieren autorización propia e inequívoca, sin suponerla del permiso de preparar release. El usuario prefiere push manual; nunca push automático.

## Preflight proporcional

Reutiliza contexto Existing, versión/estado/destino/método ya confirmado; pide una sola decisión material que falta antes de ejecutar un efecto externo. Define en sesión alcance real: environment/target, owner, código/revisión fuente, build y artifact path/hash si disponible, runtime/config requirements, files/data persistent paths, secrets/config storage, permissions, DB changes, cache/restart, maintenance window, verification, backup/recovery y rollback. Sin target/método/autorización no publiques; prepara localmente si tiene valor.

## Artifact y build

Determina qué consume hosting: static output, source+composer/runtime, compiled package/container o release bundle existente. Ejecuta comando/versión local comprobados. Publica solo artifact runtime y archivos allowlisted; nunca subas repo entero por comodidad. Excluye `.git`, CN Pilot Core/config/control, `project-resources/`, `project-artifacts/` si no son runtime, caches, tests/dev deps si canal no los necesita, secret/env local, backups, logs y artefactos no desplegables. No cambies output mode/hosting ni añadas pipeline/infra por defecto. Valida que env config/paths persistentes no se sobreescriban y asset paths/base URL reflejen destino.

## Orden y cambios persistentes

Plan mínimo ajustado al stack: `preflight → build/test checks pertinentes → artifact inspect → snapshot/checkpoint suficiente → deploy autorizado → migration solo si autorizada y necesaria → restart/cache si hace falta → smoke verificación`. No fuerces containers, blue/green, release folders o mantenimiento si hosting no los ofrece/no requiere. Migration/DB, uploads y configuración son superficies separadas; un deploy de archivos no autoriza cambiar datos. Usa `database-migrations` para schema/transformation y aplica su plan. No pidas ni imprimas secretos; obténlos solo del mecanismo autorizado del entorno.

## Recovery, verificación y stop

Antes de publicar en entorno vivo conoce mecanismo y alcance de rollback, cambios no reversibles, datos posteriores al release y forward recovery. Revertir archivos no revierte DB. Si falla, detén lote → reread estado real publicado → decide recovery aprobada → verifica lo recuperado; nunca retry ciego. Tras deploy verifica artifact/version servida, health/key route, carga de assets, errores runtime y solo integrations/flows afectados. No corras QA completo otra vez sin finding/riesgo material. Declara límites si no existe health/read access.

Termina con target/autoridad, artifact/revisión desplegada, operaciones realizadas/no realizadas, smoke results, migration/cache status, rollback/recovery y riesgos residuales; actualiza estado/contexto solo por delta material. Commit local no implica push; solo el usuario ejecuta push manual salvo autorización explícita separada; no automatices publicación. Una solicitud de WordPress se enruta a `deploy-wordpress` sin duplicar preflight/método.

**Failure modes:** publicar checkout de repo entero, `.env` o Project Resources, tomar “build succeeded” por deploy verificado, migrar DB por inferencia, usar push/deploy como secuencia automática tras commit, prometer rollback de datos no restaurables.
