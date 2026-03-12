# ─────────────────────────────────────────────────────────────
#  setup-hosts.ps1
#  Adds nachiket.ux → 127.0.0.1 to Windows hosts file
#  Usage: Run as Administrator in PowerShell
#         .\scripts\setup-hosts.ps1
# ─────────────────────────────────────────────────────────────

$hostsFile = "C:\Windows\System32\drivers\etc\hosts"
$entry = "127.0.0.1    nachiket.ux"
$marker = "# nachiket.ux local domain"

Write-Host ""
Write-Host "  🌐 nachiket.ux — Hosts File Setup (Windows)" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────────"

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal] `
  [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
  [Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
  Write-Host "  ❌ Please run PowerShell as Administrator" -ForegroundColor Red
  Write-Host ""
  exit 1
}

# Check if already added
$content = Get-Content $hostsFile
if ($content -match "nachiket\.ux") {
  Write-Host "  ✅ nachiket.ux is already in hosts file" -ForegroundColor Green
  $content | Where-Object { $_ -match "nachiket" } | ForEach-Object {
    Write-Host "     $_" -ForegroundColor Yellow
  }
  Write-Host ""
  exit 0
}

# Add entry
Add-Content -Path $hostsFile -Value ""
Add-Content -Path $hostsFile -Value $marker
Add-Content -Path $hostsFile -Value $entry

Write-Host "  ✅ Added to hosts file:" -ForegroundColor Green
Write-Host "     $entry" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Now run (as admin):  node server.js" -ForegroundColor Cyan
Write-Host "  Then open:           http://nachiket.ux" -ForegroundColor Cyan
Write-Host ""
