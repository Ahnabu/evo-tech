# Activate NVM
source ~/.nvm/nvm.sh

# Use Node 20.19.6
nvm use 20.19.6

# Verify
which node
node -v

# Install PM2
npm install -g pm2

# Start servers
pm2 delete all
cd ~/domains/evo-techbd.com/public_html
pm2 start ecosystem.config.js --name evo-tech-frontend
cd ~/domains/evo-techbd.com/public_html/evobackend
pm2 start ecosystem.config.js --name evo-tech-backend
pm2 save
pm2 list




------------------------------

# Activate Node.js
source ~/.nvm/nvm.sh
export PATH="$HOME/.nvm/versions/node/v20.19.6/bin:$PATH"

# Stop all existing processes
pm2 delete all

# Start frontend server
cd ~/domains/evo-techbd.com/public_html
pm2 start ecosystem.config.js --name evo-tech-frontend

# Start backend server (from the NEW evobackend folder you just uploaded)
cd ~/domains/evo-techbd.com/public_html/evobackend
pm2 start ecosystem.config.js --name evo-tech-backend

# Save configuration
pm2 save

# Show status
pm2 list
pm2 logs --lines 30