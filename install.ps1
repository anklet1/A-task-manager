Write-Host "Installing Smart Task Manager dependencies..." -ForegroundColor Green

Write-Host "`nInstalling root dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "`nCreating environment files..." -ForegroundColor Yellow

if (!(Test-Path "backend\.env")) {
    @"
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath "backend\.env" -Encoding UTF8
    Write-Host "Created backend/.env file" -ForegroundColor Green
} else {
    Write-Host "backend/.env already exists" -ForegroundColor Blue
}

if (!(Test-Path "frontend\.env")) {
    "REACT_APP_API_URL=http://localhost:5000" | Out-File -FilePath "frontend\.env" -Encoding UTF8
    Write-Host "Created frontend/.env file" -ForegroundColor Green
} else {
    Write-Host "frontend/.env already exists" -ForegroundColor Blue
}

Write-Host "`nInstallation complete!" -ForegroundColor Green
Write-Host "`nTo start the application:" -ForegroundColor Cyan
Write-Host "1. Make sure MongoDB is running" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Open http://localhost:3000" -ForegroundColor White
