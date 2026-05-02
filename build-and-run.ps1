# build-and-run.ps1 — Build and test production app locally

Write-Host "🔨 DevTrack Widget - Production Build" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build React app
Write-Host "📦 Building React app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Run production app
Write-Host ""
Write-Host "✅ Build complete! Starting production app..." -ForegroundColor Green
Write-Host ""

# Set NODE_ENV to production
$env:NODE_ENV = "production"

# Run Electron with production build
npx electron .

Write-Host ""
Write-Host "✅ App closed" -ForegroundColor Green
