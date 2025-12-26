$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Backend Preparation..." -ForegroundColor Cyan

$BackendDir = ".\backend"
$UploadRoot = ".\hostinger_upload"
$UploadDir = "$UploadRoot\public_html\evobackend"

# 1. Build Backend
Write-Host "📦 Building Backend..." -ForegroundColor Yellow
Push-Location $BackendDir
npm install
npm run build
If ($LASTEXITCODE -ne 0) { Throw "Backend build failed" }
Pop-Location

# 2. Prepare Directory
Write-Host "📦 Creating directory structure..." -ForegroundColor Yellow
if (Test-Path $UploadDir) { Remove-Item -Recurse -Force $UploadDir }
New-Item -ItemType Directory -Force -Path $UploadDir | Out-Null
New-Item -ItemType Directory -Force -Path "$UploadDir\logs" | Out-Null

# 3. Install Production Dependencies
Write-Host "📦 Installing Production Dependencies..." -ForegroundColor Yellow
Push-Location $BackendDir
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install --production --omit=dev
Pop-Location

# 4. Copy Files
Write-Host "📦 Copying Files..." -ForegroundColor Yellow
Copy-Item -Recurse -Force "$BackendDir\dist" "$UploadDir\"
Copy-Item -Force "$BackendDir\package.json" "$UploadDir\"
if (Test-Path "$BackendDir\package-lock.json") { Copy-Item -Force "$BackendDir\package-lock.json" "$UploadDir\" }
Copy-Item -Recurse -Force "$BackendDir\node_modules" "$UploadDir\"

# Copy .env if exists
if (Test-Path "$BackendDir\.env.production") {
    Copy-Item -Force "$BackendDir\.env.production" "$UploadDir\.env"
} elseif (Test-Path "$BackendDir\.env") {
    Copy-Item -Force "$BackendDir\.env" "$UploadDir\.env"
} else {
    Write-Warning "No backend .env file found"
}

# 5. Create PM2 Config
Write-Host "📦 Creating PM2 Config..." -ForegroundColor Yellow
$pm2Config = @"
module.exports = {
  apps: [
    {
      name: "evo-tech-backend",
      script: "./dist/server.js",
      cwd: "/home/u379849097/domains/evo-techbd.com/public_html/evobackend",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGODB_URI: "mongodb+srv://evotechbd22:FOJ6Gw1QB07zdsvT@cluster0.yapaiux.mongodb.net/?appName=Cluster0",
        JWT_ACCESS_SECRET: "13242af6503ed5d1e158620ebf0e3432331fe356ea4879af1658893541e0ec67",
        JWT_REFRESH_SECRET: "cb7083cc7f51564a4fe4931a44ecc81f2e8a36e93af9c0126617336f1aa95ade",
        JWT_REFRESH_EXPIRES_IN: "30d",
        BCRYPT_SALT_ROUNDS: "12",
        ADMIN_EMAIL: "admin@evotech.com",
        ADMIN_PASSWORD: "admin123",
        ADMIN_FIRSTNAME: "Admin",
        ADMIN_LASTNAME: "User",
        ADMIN_PHONE: "+1234567890",
        CLOUDINARY_CLOUD_NAME: "evo-tech",
        CLOUDINARY_API_KEY: "931291684898585",
        CLOUDINARY_API_SECRET: "ahnQeDoLp8cTmpVXKbHkg5Mp8W0",
        CORS_ORIGIN: "https://evo-techbd.com",
        FRONTEND_URL: "https://evo-techbd.com",
        BKASH_BASE_URL: "https://tokenized.pay.bka.sh/v1.2.0-beta",
        BKASH_APP_KEY: "your-production-bkash-app-key",
        BKASH_APP_SECRET: "your-production-bkash-app-secret",
        BKASH_USERNAME: "your-production-bkash-username",
        BKASH_PASSWORD: "your-production-bkash-password"
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};
"@
Set-Content -Path "$UploadDir\ecosystem.config.js" -Value $pm2Config

Write-Host "✅ Backend Prepared in $UploadDir" -ForegroundColor Green

# 6. Attempt Upload
Write-Host "🚀 Attempting Upload via SCP..." -ForegroundColor Yellow
Write-Host "Command: scp -P 65002 -r $UploadDir\* u379849097@46.202.161.130:~/domains/evo-techbd.com/public_html/evobackend/"
scp -P 65002 -r "$UploadDir\*" u379849097@46.202.161.130:~/domains/evo-techbd.com/public_html/evobackend/

if ($LASTEXITCODE -ne 0) {
    Write-Warning "Upload failed. Please check your connection or try again later."
} else {
    Write-Host "✅ Upload Complete!" -ForegroundColor Green
}
