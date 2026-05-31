$hubUrl = "http://localhost:3000"
$guardianLog = "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/core/docs/Obsidian_Vault/20 - Documentacao_Oficial/Log_da_IA/guardian_status.md"

Write-Host ">>> NORTE GUARDIAN 2.0 ATIVO. Monitorando o Pulso do Polvo..." -ForegroundColor Cyan

while($true) {
    try {
        $response = Invoke-WebRequest -Uri $hubUrl -Method Head -TimeoutSec 10 -ErrorAction Stop
        if ($response.StatusCode -ne 200) { throw "Status Code not 200" }
    }
    catch {
        Write-Host "!!! ALERTA DE COLAPSO: Reiniciando Tentculo de Execuo !!!" -ForegroundColor Red
        " [$(Get-Date)] - ALERTA: Hub indisponvel na 3000. Forando Reboot Turbo." | Out-File -FilePath $guardianLog -Append -Encoding utf8
        
        # AO DE EMERGNCIA
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        cd "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/systems/norte-hub"
        npm run dev -- -p 3000
        
        Write-Host ">>> Reanimado. Aguardando estabilizao." -ForegroundColor Green
        Start-Sleep -Seconds 45
    }
    Start-Sleep -Seconds 15
}