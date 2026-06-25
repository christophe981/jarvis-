# backup.ps1
# Moteur de sauvegarde du Jarvis de Christophe.
# 1. Enregistre une version dans Git (historique)
# 2. Envoie sur GitHub si un remote est configure (recuperable sur un autre PC)
# 3. Copie une version a jour dans OneDrive (securite cloud supplementaire)
#
# Lance par la commande /commit. Peut aussi etre lance a la main :
#   powershell -ExecutionPolicy Bypass -File scripts\backup.ps1 -Message "ce que j'ai fait"

param(
    [string]$Message = ""
)

# Racine du workspace = dossier parent du dossier scripts\
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
if ([string]::IsNullOrWhiteSpace($Message)) {
    $CommitMessage = "Sauvegarde du $timestamp"
} else {
    $CommitMessage = "$Message ($timestamp)"
}

Write-Host "=== Sauvegarde Jarvis ===" -ForegroundColor Cyan

# --- 1. Enregistrement Git (historique local) ---
git add -A
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[Git] Aucun changement depuis la derniere sauvegarde." -ForegroundColor Yellow
} else {
    git commit -m $CommitMessage | Out-Null
    Write-Host "[Git] Version enregistree : $CommitMessage" -ForegroundColor Green
}

# --- 2. Envoi sur GitHub (si configure) ---
$hasRemote = git remote
if ($hasRemote) {
    Write-Host "[GitHub] Envoi en cours..." -ForegroundColor Cyan
    git push origin HEAD
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[GitHub] Sauvegarde envoyee sur GitHub." -ForegroundColor Green
    } else {
        Write-Host "[GitHub] L'envoi a echoue (verifie ta connexion ou ton authentification)." -ForegroundColor Red
    }
} else {
    Write-Host "[GitHub] Aucun depot GitHub configure pour l'instant (etape ignoree)." -ForegroundColor Yellow
}

# --- 3. Copie OneDrive (miroir cloud) ---
if ($env:OneDrive) {
    $dest = Join-Path $env:OneDrive "Jarvis-Backup"
    Write-Host "[OneDrive] Copie vers : $dest" -ForegroundColor Cyan
    robocopy $Root $dest /MIR /XD ".git" /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -lt 8) {
        Write-Host "[OneDrive] Copie cloud a jour." -ForegroundColor Green
    } else {
        Write-Host "[OneDrive] Probleme pendant la copie (code $LASTEXITCODE)." -ForegroundColor Red
    }
} else {
    Write-Host "[OneDrive] OneDrive introuvable sur ce PC (etape ignoree)." -ForegroundColor Yellow
}

Write-Host "=== Sauvegarde terminee ===" -ForegroundColor Cyan
