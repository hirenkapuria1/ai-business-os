# PINREKI AI - Deployment Guide

Step-by-step guide to deploy PINREKI AI to production.

---

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Free tier available
- ✅ Auto-scales
- ✅ Git integration (auto-deploy on push)
- ✅ Built-in environment variables
- ✅ CDN included
- ✅ Perfect for Next.js

### Step 1: Prepare Your Code

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub account (recommended)
4. Authorize Vercel to access your GitHub

### Step 3: Import Project

1. Click "New Project"
2. Select your GitHub repository `ai-business-os`
3. Click "Import"
4. Configure project settings (defaults are fine)

### Step 4: Add Environment Variables

1. Go to Settings → Environment Variables
2. Add each variable from `.env.local`:

```
DATABASE_URL = postgresql://...
RAZORPAY_KEY_ID = rzp_live_...
RAZORPAY_KEY_SECRET = ...
OPENAI_API_KEY = sk-...
RESEND_API_KEY = re_...
JWT_SECRET = your-secret-key
NEXTAUTH_SECRET = another-secret
NEXT_PUBLIC_APP_URL = https://your-domain.com
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Get your live URL
4. Done! 🎉

### Step 6: Connect Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. Wait 24 hours for DNS propagation

**Now your site is live at:** `https://your-domain.com`

---

## Option 2: Deploy to Railway (Database + Backend)

### Why Railway?
- ✅ Free PostgreSQL included
- ✅ Automatic deployments
- ✅ Simple dashboard
- ✅ Good for full-stack apps

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `ai-business-os` repository

### Step 3: Add PostgreSQL Plugin

1. Click "Add" button
2. Select "PostgreSQL"
3. Connect it to your project

### Step 4: Configure Environment Variables

1. Go to "Variables" tab
2. Railway automatically sets `DATABASE_URL`
3. Add other variables:
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET
   - OPENAI_API_KEY
   - RESEND_API_KEY
   - JWT_SECRET
   - NEXT_PUBLIC_APP_URL

### Step 5: Deploy

1. Click "Deploy"
2. Monitor build logs
3. Your app is live!

---

## Option 3: Deploy to AWS EC2 (Full Control)

### Prerequisites
- AWS account
- SSH knowledge
- Basic Linux commands

### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instances"
3. Choose:
   - **AMI**: Ubuntu 22.04 LTS
   - **Instance Type**: t3.small (free tier eligible)
   - **Storage**: 30GB
4. Configure security group:
   - Allow HTTP (80)
   - Allow HTTPS (443)
   - Allow SSH (22) from your IP
5. Launch and download `.pem` file

### Step 2: Connect to Server

```bash
# Make key file readable
chmod 400 your-key.pem

# SSH into server
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx (web server)
sudo apt install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 4: Clone Repository

```bash
# Navigate to home
cd ~

# Clone your repo
git clone https://github.com/yourusername/ai-business-os.git
cd ai-business-os

# Install dependencies
npm install
```

### Step 5: Setup Database

```bash
# Create database
sudo -u postgres psql

# In PostgreSQL console:
CREATE DATABASE pinreki_ai;
CREATE USER pinreki_user WITH PASSWORD 'strong-password';
ALTER ROLE pinreki_user SET client_encoding TO 'utf8';
ALTER ROLE pinreki_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE pinreki_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE pinreki_ai TO pinreki_user;
\q
```

### Step 6: Setup Environment File

```bash
# Create .env.local
nano .env.local

# Add:
DATABASE_URL="postgresql://pinreki_user:strong-password@localhost:5432/pinreki_ai"
RAZORPAY_KEY_ID="your-key"
RAZORPAY_KEY_SECRET="your-secret"
# ... other variables

# Save: Ctrl+X, Y, Enter
```

### Step 7: Run Migrations

```bash
npm run prisma:migrate
```

### Step 8: Build Application

```bash
npm run build
```

### Step 9: Start with PM2

```bash
# Start application
pm2 start npm --name "pinreki-ai" -- run start

# Make it auto-start on server reboot
pm2 startup
pm2 save
```

### Step 10: Configure Nginx

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/pinreki-ai

# Add:
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/pinreki-ai /etc/nginx/sites-enabled/

# Test nginx
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 11: Setup SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Your app is now live at: `https://your-domain.com`

---

## Option 4: Docker Deployment

### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### Build and Run

```bash
# Build image
docker build -t pinreki-ai .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e RAZORPAY_KEY_ID="..." \
  pinreki-ai
```

---

## Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Switch Razorpay to LIVE keys (not test keys)
- [ ] Set strong JWT_SECRET and NEXTAUTH_SECRET
- [ ] Enable HTTPS/SSL certificate
- [ ] Setup database backups
- [ ] Configure email sending (Resend)
- [ ] Setup error monitoring (Sentry)
- [ ] Enable database connection pooling
- [ ] Setup CDN for static assets
- [ ] Configure rate limiting
- [ ] Setup database indexes for performance
- [ ] Enable security headers

---

## Monitoring & Maintenance

### Monitor Your Application

**Vercel**: Built-in analytics dashboard
**Railway**: Real-time logs and metrics
**AWS**: CloudWatch monitoring

### Backup Database

```bash
# PostgreSQL backup
pg_dump pinreki_ai > backup.sql

# Upload to cloud storage (AWS S3, Google Drive, etc.)
```

### Update Application

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Auto-deploys on Vercel/Railway
# Manually on AWS: git pull && npm run build
```

---

## Troubleshooting

### App won't start
- Check logs: `pm2 logs` (AWS) or dashboard (Vercel/Railway)
- Verify environment variables are set
- Check database connection

### Database connection error
- Verify DATABASE_URL is correct
- Check database credentials
- Ensure database is running

### Payment not working
- Verify Razorpay keys are correct
- Check you're using LIVE keys in production
- Test with test payment flow first

### High database usage
- Add database indexes
- Implement caching
- Optimize queries

---

## Cost Estimates

| Provider | Free Tier | Monthly |
|----------|-----------|----------|
| **Vercel** | 100GB bandwidth | $20-100 |
| **Railway** | $5/month credit | $5-50 |
| **AWS** | 1 year free | $20-100 |
| **PostgreSQL** | Included | $10-50 |
| **Total** | ~$0 | $35-200 |

---

## Next Steps

1. Choose deployment option
2. Follow the steps above
3. Test thoroughly
4. Monitor performance
5. Scale as needed

**Happy deploying!** 🚀
