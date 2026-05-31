$basePath = "C:\Users\ACER\norte-hub"
$desktopPath = "C:\Users\ACER\Desktop"

New-Item -ItemType Directory -Force -Path "$basePath\apps\lab\web"
New-Item -ItemType Directory -Force -Path "$basePath\apps\lab\api"
New-Item -ItemType Directory -Force -Path "$basePath\apps\autoshop"
New-Item -ItemType Directory -Force -Path "$basePath\apps\medcura"
New-Item -ItemType Directory -Force -Path "$basePath\apps\agency-os"
New-Item -ItemType Directory -Force -Path "$basePath\packages\database"
New-Item -ItemType Directory -Force -Path "$basePath\packages\crypto"
New-Item -ItemType Directory -Force -Path "$basePath\packages\security"
New-Item -ItemType Directory -Force -Path "$basePath\packages\engine"
New-Item -ItemType Directory -Force -Path "$desktopPath\Desktop_Archive"

if (Test-Path "$desktopPath\norte-cli\norte-hub") {
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\apps\lab\web\*" -Destination "$basePath\apps\lab\web" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\apps\lab\api\*" -Destination "$basePath\apps\lab\api" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\packages\database\*" -Destination "$basePath\packages\database" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\packages\crypto\*" -Destination "$basePath\packages\crypto" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\packages\security\*" -Destination "$basePath\packages\security" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\.nortehub" -Destination "$basePath" -Recurse -Force
    Copy-Item -Path "$desktopPath\norte-cli\norte-hub\package.json" -Destination "$basePath\package.json" -Force
}

if (Test-Path "$desktopPath\NORTE_ECOSYSTEM") {
    Move-Item -Path "$desktopPath\NORTE_ECOSYSTEM" -Destination "$basePath\apps\legacy_ingest" -Force
}

$looseItems = @("norte", "Projeto-Ativacao-ocatadesk", "PROJETO OCTADESK AGENCIA KEEP.pptx", "Projetooctadeskgravação", "dev-claro", "Projetos Digitais", "temp_cleanup", "saves lol", "push_all.sh")
foreach ($item in $looseItems) {
    if (Test-Path "$desktopPath\$item") {
        Move-Item -Path "$desktopPath\$item" -Destination "$desktopPath\Desktop_Archive" -Force
    }
}
