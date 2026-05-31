while($true) {
    $cpu = (Get-WmiObject win32_processor | Measure-Object -Property LoadPercentage -Average).Average
    $mem = (Get-WmiObject win32_operatingSystem).FreePhysicalMemory
    $gitStatus = git remote show origin | Select-String "up to date"
    
    $vitalData = @{
        cpu = "$cpu%"
        memory = "$mem KB Free"
        status = if ($gitStatus) { "Protected" } else { "Syncing" }
        timestamp = Get-Date -Format "HH:mm:ss"
    }
    $vitalData | ConvertTo-Json | Out-File "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/core/norte-infra/vitals.json"
    Start-Sleep -Seconds 5
}
