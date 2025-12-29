# Build Script for Hostinger Deployment
# This script builds both backend and frontend for production deployment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Evo-Tech for Hostinger" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create hostinger_upload directory if it doesn't exist
$uploadDir = ".\hostinger_upload"
if (Test-Path $uploadDir) {
    Write-Host "Cleaning existing hostinger_upload directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $uploadDir
}
New-Item -ItemType Directory -Path $uploadDir | Out-Null

Write-Host "✓ Created hostinger_upload directory" -ForegroundColor Green
Write-Host ""

# ========================================
# BUILD BACKEND
# ========================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Backend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location backend

# Build TypeScript to JavaScript
Write-Host "Compiling TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Backend compiled successfully" -ForegroundColor Green

# Create evobackend directory
$evobackendDir = "..\hostinger_upload\evobackend"
New-Item -ItemType Directory -Path $evobackendDir | Out-Null

# Copy backend files
Write-Host "Copying backend files..." -ForegroundColor Yellow

# Copy dist folder
Copy-Item -Path "dist" -Destination "$evobackendDir\dist" -Recurse

# Copy package files
Copy-Item -Path "package.json" -Destination "$evobackendDir\package.json"
Copy-Item -Path "package-lock.json" -Destination "$evobackendDir\package-lock.json" -ErrorAction SilentlyContinue

# Copy ecosystem config
Copy-Item -Path "ecosystem.config.js" -Destination "$evobackendDir\ecosystem.config.js"

# Copy .env.example (user will need to create .env)
Copy-Item -Path ".env.example" -Destination "$evobackendDir\.env.example"

# Copy public folder if exists
if (Test-Path "public") {
    Copy-Item -Path "public" -Destination "$evobackendDir\public" -Recurse
}

# Create logs directory
New-Item -ItemType Directory -Path "$evobackendDir\logs" -Force | Out-Null

Write-Host "✓ Backend files copied to hostinger_upload/evobackend" -ForegroundColor Green

Set-Location ..

Write-Host ""

# ========================================
# BUILD FRONTEND
# ========================================
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building Frontend..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location frontend

# Clear .next folder
if (Test-Path ".next") {
    Write-Host "Cleaning .next directory..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# Build Next.js
Write-Host "Building Next.js application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend build failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✓ Frontend built successfully" -ForegroundColor Green

# Copy frontend files to root of hostinger_upload
Write-Host "Copying frontend files..." -ForegroundColor Yellow

# Copy .next folder
Copy-Item -Path ".next" -Destination "..\hostinger_upload\.next" -Recurse

# Copy public folder
Copy-Item -Path "public" -Destination "..\hostinger_upload\public" -Recurse

# Copy package files
Copy-Item -Path "package.json" -Destination "..\hostinger_upload\package.json"
Copy-Item -Path "package-lock.json" -Destination "..\hostinger_upload\package-lock.json" -ErrorAction SilentlyContinue

# Copy ecosystem config
Copy-Item -Path "ecosystem.config.js" -Destination "..\hostinger_upload\ecosystem.config.js"

# Copy .env.example
Copy-Item -Path ".env.example" -Destination "..\hostinger_upload\.env.example"

# Copy next.config.mjs
Copy-Item -Path "next.config.mjs" -Destination "..\hostinger_upload\next.config.mjs"

# Copy .htaccess if exists
if (Test-Path ".htaccess") {
    Copy-Item -Path ".htaccess" -Destination "..\hostinger_upload\.htaccess"
}

Write-Host "✓ Frontend files copied to hostinger_upload" -ForegroundColor Green

Set-Location ..

Write-Host ""

# ========================================
# CREATE DEPLOYMENT INSTRUCTIONS
# ========================================
Write-Host "Creating deployment instructions..." -ForegroundColor Yellow

"Deployment Instructions for Hostinger

Files are ready in hostinger_upload folder

Upload contents to your Hostinger public_html directory
Create .env files as per project documentation
Run npm install --production in both root and evobackend folders
Start services with PM2

" | Out-File -FilePath ".\hostinger_upload\DEPLOYMENT_INSTRUCTIONS.txt" -Encoding UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files are ready in: hostinger_upload/" -ForegroundColor Yellow
Write-Host "Please read: hostinger_upload/DEPLOYMENT_INSTRUCTIONS.txt" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create .env files in both root and evobackend folders" -ForegroundColor White
Write-Host "2. Upload to Hostinger" -ForegroundColor White
Write-Host "3. Install dependencies with npm install --production" -ForegroundColor White
Write-Host "4. Start with PM2" -ForegroundColor White
Write-Host ""
