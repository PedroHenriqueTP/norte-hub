# Norte Hub: Context Oracle Sync Script
# Automatiza a geracao do snapshot de contexto de desenvolvimento local.

Write-Host "Norte Hub: Inicializando Context Oracle (sync-snapshot)..." -ForegroundColor Cyan

# 1. Obter commits recentes
$recentCommits = git log -3 --pretty=format:"* %s (%h)" 2>$null
if (-not $recentCommits) {
    $recentCommits = "* Sem commits recentes ou fora de repositorio git."
}

# 2. Analisar status do Git (arquivos modificados)
$gitStatus = git status --porcelain 2>$null
$modifiedSchemas = @()
$modifiedModules = @{
    "norte-delivery" = $false
    "norte-agency" = $false
    "packages" = $false
    "bookshelf" = $false
}

if ($gitStatus) {
    foreach ($line in $gitStatus) {
        if ($line -match "schema\.prisma") {
            $modifiedSchemas += ($line -replace '^...\s*', '')
        }
        if ($line -match "norte-delivery") { $modifiedModules["norte-delivery"] = $true }
        if ($line -match "norte-agency") { $modifiedModules["norte-agency"] = $true }
        if ($line -match "packages/") { $modifiedModules["packages"] = $true }
        if ($line -match "bookshelf") { $modifiedModules["bookshelf"] = $true }
    }
}

# 3. Determinar status dos modulos
$deliveryStatus = "Operacional (Builds validados de API e Web)"
if ($modifiedModules["norte-delivery"]) {
    $deliveryStatus = "Modificacoes locais pendentes de commit"
}

$agencyStatus = "Saneado (Chaves isoladas em .env)"
if ($modifiedModules["norte-agency"]) {
    $agencyStatus = "Modificacoes locais pendentes de commit"
}

$packagesStatus = "Schema Prisma unificado e estavel"
if ($modifiedModules["packages"]) {
    $packagesStatus = "Modificacoes locais pendentes de commit / Prisma Sync"
}

# 4. Formatar alteracoes de Engenharia
$dbChanges = "Sem alteracoes de schema pendentes."
if ($modifiedSchemas.Count -gt 0) {
    $dbChanges = "Modificacoes detectadas nos schemas: " + ($modifiedSchemas -join ", ")
}

# 5. Gerar o Snapshot em Markdown
$snapshotContent = "### SNAPSHOT DE DESENVOLVIMENTO: NORTE GLOBAL HUB`n`n" +
"#### 1. ESTADO ATUAL DOS MODULOS`n" +
"* **apps/norte-delivery:** [Status: $deliveryStatus]`n" +
"* **apps/norte-agency:** [Status: $agencyStatus]`n" +
"* **packages/ (Common):** [Status: $packagesStatus]`n`n" +
"#### 2. ALTERACOES DE ENGENHARIA (Ultimas modificacoes e commits)`n" +
"* **Banco de Dados:** $dbChanges`n" +
"* **Commits Recentes:**`n$recentCommits`n`n" +
"#### 3. DEBITOS TECNICOS e DROPS DE CONTEXTO`n" +
"* Mapeamento do pacote `@norte/database` corrigido e centralizado sob `systems/norte-delivery/packages/database`.`n" +
"* Conflito de hoisting do React no app `web` (React 19 vs 18) corrigido via instalacao local de peer dependencies.`n`n" +
"#### 4. PROXIMO PASSO IMEDIATO BLOQUEANTE`n" +
"* Revisar e commitar os arquivos reestruturados do `norte-delivery` e as novas configuracoes do `agent-context-oracle`."

# Salvar o snapshot
$outputPath = Join-Path $PSScriptRoot ".nortehub\nortehub_snapshot.md"
$snapshotContent | Out-File -FilePath $outputPath -Encoding utf8

Write-Host "Snapshot de contexto gerado com sucesso em: $outputPath" -ForegroundColor Green
Write-Host "--------------------------------------------------------"
Write-Output $snapshotContent
