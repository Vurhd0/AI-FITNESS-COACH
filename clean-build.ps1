Write-Host "Cleaning Next.js build cache..." -ForegroundColor Yellow

if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
    Write-Host ".next folder deleted" -ForegroundColor Green
}

if (Test-Path node_modules\.cache) {
    Remove-Item -Recurse -Force node_modules\.cache
    Write-Host "node_modules\.cache deleted" -ForegroundColor Green
}

Write-Host "Build cache cleaned!" -ForegroundColor Green
Write-Host "Starting dev server..." -ForegroundColor Cyan
npm run dev

