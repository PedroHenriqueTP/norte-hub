Write-Host ">>> Iniciando Verificao de Sanidade do Beb Norte..." -ForegroundColor Cyan

# 1. Limpeza de Fantasmas
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Check de Estrutura
if (Test-Path "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/systems/norte-hub/.next") {
    Remove-Item -Recurse -Force "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/systems/norte-hub/.next"
    Write-Host ">>> Cache .next purgado para evitar convulses." -ForegroundColor Yellow
}

# 3. Liftoff Estabilizado
cd "c:/Users/ACER/Desktop/NORTE_ECOSYSTEM/systems/norte-hub"
npm run dev -- -p 3000