$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$Dist = Join-Path $Root "dist"
$ZipPath = Join-Path $Dist "msteams-presence.zip"
$PackageItems = @(
  "manifest.json",
  "README.md",
  "src",
  "icons"
) | ForEach-Object { Join-Path $Root $_ }

New-Item -ItemType Directory -Force -Path $Dist | Out-Null

if (Test-Path $ZipPath) {
  Remove-Item $ZipPath
}

Compress-Archive -Path $PackageItems -DestinationPath $ZipPath -Force
Write-Host "Wrote $ZipPath"
