# precommit-guard.ps1
# Garde-fou anti-secret execute AVANT la sauvegarde (/commit -> backup.ps1).
# Le depot est PUBLIC : ce script echoue FERME (exit non-zero) si un secret probable
# fait partie des fichiers CANDIDATS AU COMMIT.
# Il ne doit JAMAIS imprimer la valeur complete d'un secret.
# Compatible Windows PowerShell 5.1+.
#
# Perimetre : uniquement les fichiers que Git pourrait committer, c'est-a-dire
# les fichiers SUIVIS (tracked) + les NON-SUIVIS NON-IGNORES. Un fichier `.env`
# local correctement ignore par Git n'est PAS candidat au commit : il ne bloque pas.
# En revanche un `.env` / *.pem / *.key / secret SUIVI ou STAGE bloque toujours.
#
# Lance a la main :
#   powershell -ExecutionPolicy Bypass -File scripts\precommit-guard.ps1

$ErrorActionPreference = "Stop"

# Racine du workspace = dossier parent du dossier scripts\
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

$selfRel = "scripts/precommit-guard.ps1"

# Extensions binaires ignorees (contenu non scanne)
$binaryExt = @(".pptx", ".docx", ".xlsx", ".pdf", ".png", ".jpg", ".jpeg", ".gif",
               ".zip", ".exe", ".dll", ".ico", ".woff", ".woff2", ".ttf", ".mp4", ".mp3")

# Valeurs placeholder acceptees (faux positifs documentaires)
$placeholderRegex = '(?i)^(<[^>]*>|your[_-]?\w*|x{3,}|changeme|placeholder|example|dummy|sample|test|redacted|\*{3,}|-{3,}|env\([A-Z0-9_]+\)|process\.env\.[A-Z0-9_]+|\$\{[A-Z0-9_]+\}|\$env:[A-Z0-9_]+)$'

# Motifs de secrets reels (valeurs a forte entropie / formats connus)
$patterns = @(
    @{ Name = "Private key block"; Regex = '-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----' },
    @{ Name = "GitHub token";      Regex = 'ghp_[A-Za-z0-9]{20,}' },
    @{ Name = "Slack token";       Regex = 'xox[baprs]-[A-Za-z0-9-]{10,}' },
    @{ Name = "OpenAI-like key";   Regex = 'sk-[A-Za-z0-9]{20,}' },
    @{ Name = "AWS access key";    Regex = 'AKIA[0-9A-Z]{16}' },
    @{ Name = "Google API key";    Regex = 'AIza[0-9A-Za-z_\-]{35}' }
)

# Assignation d'une cle sensible a une valeur reelle
$assignRegex = '(?i)\b(password|passwd|pwd|api[_-]?key|secret|token|access[_-]?key)\b\s*[:=]\s*(["''])([^"'']{6,})\2'

# --- Enumeration des fichiers CANDIDATS AU COMMIT via Git ---
# git ls-files -c -o --exclude-standard = suivis (cached) + non-suivis non-ignores.
# Un .env ignore par .gitignore n'apparait pas ici (donc ne bloque pas).
$relFiles = @()
$gitOk = $false
try {
    $gitOut = & git ls-files -c -o --exclude-standard 2>$null
    if ($LASTEXITCODE -eq 0) {
        $relFiles = @($gitOut | Where-Object { $_ -and $_.Trim().Length -gt 0 })
        $gitOk = $true
    }
} catch { $gitOk = $false }

# Repli si Git indisponible : scan filesystem (hors .git), fail-safe.
if (-not $gitOk) {
    $relFiles = Get-ChildItem -Path $Root -Recurse -File -Force |
        Where-Object { ($_.FullName.Substring($Root.Length) -split '[\\/]') -notcontains ".git" } |
        ForEach-Object { $_.FullName.Substring($Root.Length).TrimStart('\', '/') -replace '\\', '/' }
}

$findings = New-Object System.Collections.ArrayList
function Add-Finding($file, $line, $label) {
    [void]$findings.Add(("{0}:{1} -- {2}" -f $file, $line, $label))
}

foreach ($rel in $relFiles) {
    $relNorm = $rel -replace '\\', '/'
    $full = Join-Path $Root ($relNorm -replace '/', [System.IO.Path]::DirectorySeparatorChar)
    if (-not (Test-Path -LiteralPath $full -PathType Leaf)) { continue }

    $name = Split-Path -Leaf $relNorm
    $ext = [System.IO.Path]::GetExtension($name).ToLower()

    # Ne pas se scanner soi-meme (contient volontairement les motifs)
    if ($relNorm -eq $selfRel) { continue }

    # Noms de fichiers = secrets par nature (uniquement s'ils sont candidats au commit)
    if ($name -eq ".env") { Add-Finding $relNorm 0 "fichier .env candidat au commit"; continue }
    if ($ext -eq ".pem") { Add-Finding $relNorm 0 "fichier *.pem candidat au commit"; continue }
    if ($ext -eq ".key") { Add-Finding $relNorm 0 "fichier *.key candidat au commit"; continue }

    # .env.example / *.example : ignores (documentaires)
    if ($name -like "*.example") { continue }
    # Binaires : ignores
    if ($binaryExt -contains $ext) { continue }

    try {
        $content = Get-Content -LiteralPath $full -ErrorAction Stop
    } catch { continue }

    $lineNo = 0
    foreach ($line in $content) {
        $lineNo++
        foreach ($p in $patterns) {
            if ($line -match $p.Regex) { Add-Finding $relNorm $lineNo $p.Name }
        }
        $m = [regex]::Match($line, $assignRegex)
        if ($m.Success) {
        $val = $m.Groups[3].Value
            if ($val -notmatch $placeholderRegex) {
                Add-Finding $relNorm $lineNo ("assignation sensible: " + $m.Groups[1].Value + "=")
            }
        }
    }
}

if ($findings.Count -gt 0) {
    Write-Host "STOP — POTENTIAL SECRET DETECTED" -ForegroundColor Red
    Write-Host "Secrets probables parmi les fichiers candidats au commit (valeurs masquees) :" -ForegroundColor Red
    foreach ($x in $findings) { Write-Host ("  - " + $x) -ForegroundColor Red }
    exit 1
}

Write-Host "precommit-guard: PASS (aucun secret probable parmi les fichiers candidats au commit)" -ForegroundColor Green
exit 0
