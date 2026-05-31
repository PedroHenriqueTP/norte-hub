# quick_check.ps1
# Script de Verificacao Rapida

Write-Host "Iniciando Protocolo de Teste Rapido - MedCura" -ForegroundColor Cyan
Write-Host "--------------------------------------------------------"

# 1. Verificar Node.js
Write-Host "`nVerificando Dependencias do Frontend..." -ForegroundColor Yellow
if (Test-Path "frontend/node_modules") {
    Write-Host "node_modules encontrado." -ForegroundColor Green
}
else {
    Write-Host "node_modules ausente." -ForegroundColor Red
}

# 2. Teste de Lint
Write-Host "`nExecutando Verificacao Estatica (Lint)..." -ForegroundColor Yellow
Set-Location frontend
try {
    npm run lint
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Frontend Lint: APROVADO" -ForegroundColor Green
    }
    else {
        Write-Host "Frontend Lint encontrou problemas." -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Falha ao executar lint." -ForegroundColor Red
}
Set-Location ..

# 3. Teste de API
Write-Host "`nTestando Conectividade com Backend..." -ForegroundColor Yellow
if (Test-Path "scripts/verify_api.js") {
    node scripts/verify_api.js
}
else {
    Write-Host "Script 'scripts/verify_api.js' nao encontrado." -ForegroundColor Red
}

Write-Host "`n--------------------------------------------------------"
Write-Host "Teste Rapido Finalizado." -ForegroundColor Cyan
