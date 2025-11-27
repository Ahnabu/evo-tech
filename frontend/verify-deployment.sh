#!/bin/bash

# Deployment Verification Script
# Run this script to verify your Hostinger deployment setup

echo "🔍 Verifying Hostinger Deployment Readiness..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track issues
ISSUES=0
WARNINGS=0

# Check Node.js version
echo "📦 Checking Node.js version..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
    
    # Extract major version
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "${RED}✗${NC} Node.js version should be 18 or higher"
        ISSUES=$((ISSUES + 1))
    fi
else
    echo -e "${RED}✗${NC} Node.js not found"
    ISSUES=$((ISSUES + 1))
fi

# Check PM2
echo ""
echo "🔧 Checking PM2..."
if command -v pm2 &> /dev/null; then
    PM2_VERSION=$(pm2 -v)
    echo -e "${GREEN}✓${NC} PM2 installed: v$PM2_VERSION"
else
    echo -e "${YELLOW}⚠${NC} PM2 not installed globally (will be installed during deployment)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check required files
echo ""
echo "📄 Checking required files..."

FILES=(
    "package.json"
    "next.config.mjs"
    "ecosystem.config.js"
    "deploy.sh"
    ".htaccess"
    ".env.production.example"
    "HOSTINGER_DEPLOYMENT.md"
    "QUICK_START.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ISSUES=$((ISSUES + 1))
    fi
done

# Check if logs directory exists
echo ""
echo "📁 Checking directories..."
if [ -d "logs" ]; then
    echo -e "${GREEN}✓${NC} logs/ directory exists"
else
    echo -e "${YELLOW}⚠${NC} logs/ directory will be created during deployment"
    WARNINGS=$((WARNINGS + 1))
fi

# Check package.json for required dependencies
echo ""
echo "📚 Checking dependencies..."

if grep -q '"sharp"' package.json; then
    echo -e "${GREEN}✓${NC} sharp dependency found"
else
    echo -e "${RED}✗${NC} sharp dependency missing"
    ISSUES=$((ISSUES + 1))
fi

if grep -q '"pm2"' package.json; then
    echo -e "${GREEN}✓${NC} pm2 dependency found"
else
    echo -e "${YELLOW}⚠${NC} pm2 should be in devDependencies"
    WARNINGS=$((WARNINGS + 1))
fi

# Check scripts in package.json
echo ""
echo "🛠️  Checking npm scripts..."

SCRIPTS=(
    "build:hostinger"
    "deploy:hostinger"
    "pm2:start"
    "pm2:stop"
    "pm2:restart"
)

for script in "${SCRIPTS[@]}"; do
    if grep -q "\"$script\"" package.json; then
        echo -e "${GREEN}✓${NC} npm run $script available"
    else
        echo -e "${RED}✗${NC} npm run $script missing"
        ISSUES=$((ISSUES + 1))
    fi
done

# Check .env files
echo ""
echo "🔐 Checking environment files..."

if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env exists (development)"
else
    echo -e "${YELLOW}⚠${NC} .env not found (optional for production)"
fi

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} .env.production exists"
    
    # Check for required variables
    REQUIRED_VARS=(
        "NEXT_PUBLIC_BACKEND_URL"
        "NEXT_PUBLIC_API_URL"
        "NEXTAUTH_SECRET"
        "AUTH_SECRET"
        "NEXTAUTH_URL"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env.production; then
            echo -e "${GREEN}✓${NC} $var is set"
        else
            echo -e "${RED}✗${NC} $var not set in .env.production"
            ISSUES=$((ISSUES + 1))
        fi
    done
else
    echo -e "${YELLOW}⚠${NC} .env.production not found (create from .env.production.example)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check deploy script permissions
echo ""
echo "🔑 Checking script permissions..."
if [ -f "deploy.sh" ]; then
    if [ -x "deploy.sh" ]; then
        echo -e "${GREEN}✓${NC} deploy.sh is executable"
    else
        echo -e "${YELLOW}⚠${NC} deploy.sh needs execute permission (run: chmod +x deploy.sh)"
        WARNINGS=$((WARNINGS + 1))
    fi
fi

# Try to run build (optional, can be slow)
echo ""
echo "🏗️  Build check..."
echo -e "${YELLOW}ℹ${NC} Skipping build test (run 'npm run build:hostinger' manually to verify)"

# Summary
echo ""
echo "═══════════════════════════════════════"
echo "📊 VERIFICATION SUMMARY"
echo "═══════════════════════════════════════"

if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
elif [ $ISSUES -eq 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} warning(s) found, but ready for deployment.${NC}"
else
    echo -e "${RED}✗ ${ISSUES} issue(s) found. Please fix before deploying.${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ ${WARNINGS} warning(s)${NC}"
fi

echo ""
echo "Next Steps:"
echo "1. Create .env.production from .env.production.example"
echo "2. Upload code to your Hostinger server"
echo "3. Run: chmod +x deploy.sh"
echo "4. Run: ./deploy.sh"
echo ""
echo "For detailed instructions, see QUICK_START.md"

exit $ISSUES
