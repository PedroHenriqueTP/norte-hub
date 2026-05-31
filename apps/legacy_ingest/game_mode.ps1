# 1. Derruba containers do Docker
docker compose down
docker system prune -f

# 2. Fecha instâncias do Node.js
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# 3. Fecha o VS Code / Cursor
Get-Process -Name "code" -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name "cursor" -ErrorAction SilentlyContinue | Stop-Process -Force

# 4. Limpa cache de DNS
ipconfig /flushdns

# 5. Abre o Client do LoL
Start-Process "C:\Riot Games\Riot Client\RiotClientServices.exe" -ArgumentList "--launch-product=league_of_legends", "--launch-patchline=live"
