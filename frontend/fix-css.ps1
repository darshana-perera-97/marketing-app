# PowerShell script to fix CSS issues
Write-Host "Fixing CSS setup..." -ForegroundColor Green

# Stop any running processes
Write-Host "`n1. Stopping any running dev servers..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Clear cache
Write-Host "`n2. Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Remove node_modules and package-lock
Write-Host "`n3. Removing node_modules and package-lock.json..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
}

# Reinstall
Write-Host "`n4. Reinstalling dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps

Write-Host "`n✅ Setup complete! Now run: npm start" -ForegroundColor Green

