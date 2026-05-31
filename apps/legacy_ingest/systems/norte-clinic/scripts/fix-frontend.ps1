# scripts/fix-frontend.ps1
Set-Location frontend
Write-Host "--- Limpando caches e modulos antigos ---" -ForegroundColor Cyan
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "--- Instalando dependencias ---" -ForegroundColor Cyan
npm install

Write-Host "--- Iniciando Build Final ---" -ForegroundColor Cyan
npm run build
