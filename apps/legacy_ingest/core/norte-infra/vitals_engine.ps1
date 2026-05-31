while($true) {
    $cpu = Get-WmiObject Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object -ExpandProperty Average
    $ram = (Get-WmiObject Win32_OperatingSystem).FreePhysicalMemory / 1MB
    $data = @{ cpu = "$cpu%"; ram = "$([math]::Round($ram, 2)) GB"; status = "Elite Performance" }
    $data | ConvertTo-Json | Out-File "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/core/norte-infra/vitals.json"
    Write-Host "Vitals Updated: $cpu% CPU" -ForegroundColor Green
    Start-Sleep -Seconds 2
}
