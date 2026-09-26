# Builds the client and creates deploy/portfolio-cpanel.zip for uploading
# to cPanel. Run from anywhere:  powershell -File scripts/package-cpanel.ps1
#
# The zip deliberately leaves out server/data/db.json, server/uploads,
# node_modules and .env, so re-uploading it never overwrites the live
# site's content, images or secrets.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$deploy = Join-Path $root "deploy"
$stage = Join-Path $deploy "portfolio"
$zip = Join-Path $deploy "portfolio-cpanel.zip"

Write-Host "Building client..."
Push-Location (Join-Path $root "client")
npm ci
if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "client build failed" }
Pop-Location

if (Test-Path $deploy) { Remove-Item -Recurse -Force $deploy }
New-Item -ItemType Directory -Force (Join-Path $stage "server") | Out-Null
New-Item -ItemType Directory -Force (Join-Path $stage "client") | Out-Null

foreach ($f in "package.json", "package-lock.json", "app.cjs", ".env.example") {
  Copy-Item (Join-Path $root "server\$f") (Join-Path $stage "server")
}
Copy-Item -Recurse (Join-Path $root "server\src") (Join-Path $stage "server\src")
Copy-Item -Recurse (Join-Path $root "client\dist") (Join-Path $stage "client\dist")

# Windows' built-in bsdtar writes forward-slash paths; PowerShell 5.1's
# Compress-Archive writes backslashes, which break extraction on Linux.
& "$env:SystemRoot\System32\tar.exe" -a -c -f $zip -C $stage server client
if ($LASTEXITCODE -ne 0) { throw "zip failed" }
Remove-Item -Recurse -Force $stage

Write-Host "Created $zip"
