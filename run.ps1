# Start URL Shortener Application
Write-Host "Starting URL Shortener Application" -ForegroundColor Green
Write-Host "--------------------------------" -ForegroundColor Green
Write-Host ""

Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"
Write-Host ""

Write-Host "Starting frontend development server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"
Write-Host ""

Write-Host "URL Shortener is running!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
