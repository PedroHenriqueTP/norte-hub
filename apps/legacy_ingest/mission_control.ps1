$missionPath = "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/missions"
mkdir -p $missionPath
mkdir -p "$missionPath/done"

Write-Host ">>> NORTE MISSION CONTROL ATIVO. Pode ir pro LoL, Pedrão." -ForegroundColor Green

while($true) {
    $nextMission = Get-ChildItem -Path $missionPath -Filter "*.todo" | Select-Object -First 1
    if ($nextMission) {
        Write-Host ">>> Executando Missão: $($nextMission.Name)" -ForegroundColor Cyan
        # Aqui o Aider ou a CLI do Gemini entra em ação
        # (Simulação de execução automática)
        Start-Sleep -Seconds 5
        Move-Item $nextMission.FullName "$missionPath/done/"
        Write-Host ">>> Missão Concluída." -ForegroundColor Magenta
    }
    Start-Sleep -Seconds 10
}