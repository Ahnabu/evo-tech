# Build Script for Hostinger Deployment

Write-Host "Building Evo-Tech for Hostinger" -ForegroundColor Cyan
Write-Host ""

# Create hostinger_upload directory
$uploadDir = ".\hostinger_upload"
if (Test-Path $uploadDir) {
    Write-Host "Cleaning existing hostinger_upload directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $uploadDir
}
New-Item -ItemType Directory -Path $uploadDir | Out-Null
Write-Host "Created hostinger_upload directory" -ForegroundColor Green
Write-Host ""

# BUILD BACKEND
Write-Host "Building Backend..." -ForegroundColor Cyan
Set-Location backend

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

$evobackendDir = "..\hostinger_upload\evobackend"
New-Item -ItemType Directory -Path $evobackendDir | Out-Null

Copy-Item -Path "dist" -Destination "$evobackendDir\dist" -Recurse
Copy-Item -Path "package.json" -Destination "$evobackendDir\package.json"
Copy-Item -Path "package-lock.json" -Destination "$evobackendDir\package-lock.json" -ErrorAction SilentlyContinue
Copy-Item -Path "ecosystem.config.js" -Destination "$evobackendDir\ecosystem.config.js"
Copy-Item -Path ".env.example" -Destination "$evobackendDir\.env.example"

if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "$evobackendDir\public" -Recurse
}

New-Item -ItemType Directory -Path "$evobackendDir\logs" -Force | Out-Null

Write-Host "Backend files copied" -ForegroundColor Green
Set-Location ..
Write-Host ""

# BUILD FRONTEND
Write-Host "Building Frontend..." -ForegroundColor Cyan
Set-Location frontend

if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Copy-Item -Path ".next" -Destination "..\hostinger_upload\.next" -Recurse
Copy-Item -Path "public" -Destination "..\hostinger_upload\public" -Recurse
Copy-Item -Path "package.json" -Destination "..\hostinger_upload\package.json"
Copy-Item -Path "package-lock.json" -Destination "..\hostinger_upload\package-lock.json" -ErrorAction SilentlyContinue
Copy-Item -Path "ecosystem.config.js" -Destination "..\hostinger_upload\ecosystem.config.js"
Copy-Item -Path ".env.example" -Destination "..\hostinger_upload\.env.example"
Copy-Item -Path "next.config.mjs" -Destination "..\hostinger_upload\next.config.mjs"

if (Test-Path ".htaccess") {
    Copy-Item -Path ".htaccess" -Destination "..\hostinger_upload\.htaccess"
}

Write-Host "Frontend files copied" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Create instructions file
$instructionsText = @"
HOSTINGER DEPLOYMENT INSTRUCTIONS

Files are ready in hostinger_upload folder!

STEPS:
1. Upload all files from hostinger_upload to your Hostinger public_html
2. Create .env files (see .env.example in both root and evobackend)
3. SSH into Hostinger and run: npm install --production (in both folders)
4. Start services with PM2: pm2 start ecosystem.config.js

Structure:
public_html/
  .next/                  (frontend build)
  public/                 (frontend static)
  evobackend/            (backend folder)
    dist/                (compiled backend)
    public/              (backend static)
    logs/
  package.json
  ecosystem.config.js
  .htaccess
"@

$instructionsText | Out-File -FilePath ".\hostinger_upload\README.txt" -Encoding UTF8

Write-Host "BUILD COMPLETED!" -ForegroundColor Green
Write-Host "Files are in: hostinger_upload/" -ForegroundColor Yellow
Write-Host ""
