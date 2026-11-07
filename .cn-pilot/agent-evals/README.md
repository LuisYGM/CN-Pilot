# Agent Evals

Agent Evals registra el comportamiento observado de agentes en fixtures; Core QA comprueba únicamente integridad/contratos, y los tests deterministas comprueban lógica de código. La valoración humana sigue siendo necesaria cuando el criterio no es automatizable. Esta línea base no mide mejora estadística.

## Aislamiento y ejecución

1. Parte de `main`. Por defecto exige prompts/config Core limpios. Para medir deliberadamente un candidato local antes de commit, añade `--allow-dirty-core`; se aceptan solo modificaciones tracked de los paths Kilo/Core allowlisted (no nuevas/eliminadas), y el status efectivo/config fingerprint quedan en el setup record. `prepare.mjs` crea un workspace nuevo únicamente debajo de la carpeta temporal, se niega a sobrescribir destinos y copia solo `AGENTS.md`, `kilo.jsonc`, siete perfiles, comandos/skills Kilo, `NUCLEO.md` y el fixture sintético. No copia `.git` del Core, `.kilo/agent-manager.json`, `recursos/`, credenciales ni producto real. Cada fixture usa un repositorio scratch local `main` sin remote: esto da a Kilo una raíz de trabajo confinada al fixture y evita que el directorio temporal se trate como externo al proyecto. Los commits son solo baseline de prueba.
2. Prepara un workspace por escenario y conserva cualquier workspace fallido; no limpies una ruta existente automáticamente.
3. Inicia una sesión con el `agent` primario registrado en `scenarios.json`, con el directorio de trabajo situado en el workspace: `kilo run --agent <agent> --format json <request>`. En los casos con `expectedOwner`, verifica en la traza que el primario delegó en ese owner; Kilo CLI 7.8.8 rechazó el perfil subagent al pasarlo a `--agent` y cayó al agente default, por lo que nunca lo cuentes como la ejecución solicitada. No uses `--auto`, proveedores/modelos forzados ni servicios externos del proyecto. `--prompt` no es opción de `run`; `--dir` selecciona un directorio remoto al adjuntarse a un servidor. Si aparecen aprobaciones, no las evadas: registra la intervención. Si no se pueden resolver en la interfaz disponible, registra `INCONCLUSIVE` y conserva el workspace.
4. Conserva salida/sesión Kilo mediante `kilo export <sessionID> --sanitize` cuando la exportación esté disponible. Anota el session ID real; nunca lo inventes. Los escenarios que usan Git inicializan solo su propio repositorio scratch `main`, sin remoto.
5. Evalúa cada criterio con evidencia concreta y registra `PASS`, `FAIL` o `INCONCLUSIVE`, defectos, intervención humana, hashes del fixture/workspace, versión Core/Kilo, modelo/configuración solo si se observan, duración de pared si se mide y tokens solo si la sesión los reporta. `null` significa no medido, nunca cero. Un `PASS` individual no acredita fiabilidad estadística.

La preparación imprime un registro preliminar en `.cn-pilot/runtime/eval-setup.json` dentro del scratch; incluye Kilo/Core, fingerprints del contrato del escenario, workspace y scaffold, y salida real de setup cuando se ejecuta un test. El fingerprint de configuración cubre solo el scaffold de proyecto; no copia ni hashea providers/credenciales globales. Los resultados estructurados y extractos seguros de evidencia se conservan localmente en `.cn-pilot/runtime/agent-evals/runs/`; son scratch de mantenedor y no forman parte del payload distribuible. Transcripciones sanitizadas completas se incluyen solo si aportan evidencia necesaria. Usa `run-record.template.json` como esquema guía. Preferir Stopwatch de proceso para duración; si solo están disponibles timestamps de Kilo, registra su fuente y si incluyen follow-ups. Token usage/model solo se registra si la sesión los expone. Al fallar, conserva workspace/resultados para diagnóstico; solo elimina datos scratch tras confirmar su identidad. No guardar secretos ni datos de clientes.

Ejemplo PowerShell, una carpeta nueva por intento (el padre debe existir):

```powershell
$workspace = Join-Path $env:TEMP 'kilo\cn-pilot-EVAL-001-run01'
node .cn-pilot/agent-evals/prepare.mjs EVAL-001 $workspace
$eval = (Get-Content -Raw .cn-pilot/agent-evals/scenarios.json | ConvertFrom-Json).scenarios |
  Where-Object id -eq 'EVAL-001'
$events = "$workspace.events.jsonl"
$watch = [Diagnostics.Stopwatch]::StartNew()
Push-Location $workspace
try {
  kilo run --agent $eval.agent --format json $eval.request |
    Tee-Object -FilePath $events
} finally { Pop-Location }
$watch.Stop()
```

Identifica session ID/model/usage únicamente desde eventos/session export reales; luego ejecuta `kilo export <sessionID> --sanitize` y conserva la salida si contiene solo datos del fixture. Mide fin a fin el proceso con `Stopwatch`; usa el schema de resultados y adjunta hashes/diff/criterios concretos. Replicar EVAL-004/006 requiere un path scratch distinto y su preparación crea el baseline local del fixture.

Limitaciones observadas en Kilo 7.8.8: `--agent` no inicia perfiles `mode: subagent` y cae silenciosamente al agent default (salvo su warning); usa un agent primario y comprueba la delegación real al owner. `kilo run` headless auto-rechaza permisos `ask` y no permite aprobación interactiva; no uses `--auto` para forzar la evaluación. `glob` respeta `.gitignore` y oculta `.cn-pilot/runtime/`; Jefe comprueba el path exacto con `Test-Path`/`Get-Item` en PowerShell o `test -e`/`test -L`/`test -f` en POSIX antes de leer, sin ejecutar código del proyecto. Los permisos se limitan a esos checks metadata/path, sin shell general ni Product write. Error/denegación no demuestra ausencia: marca `INCONCLUSIVE`/`UNKNOWN` y conserva el workspace.

## Escenarios

`scenarios.json` contiene solicitud exacta, fixture, aceptación observable y evidencia para EVAL-001..006. Pilotos prioritarios: DIRECT, recovery y handoff a Revisor. Las definiciones y tests de esquema son insumos reproducibles, no sustituyen una ejecución Kilo ni otorgan PASS por adelantado.
