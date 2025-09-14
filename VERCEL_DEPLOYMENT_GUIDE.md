# Vercel Deployment Guide - LMS Micro-Certification Portal

## 🚀 Complete Vercel Deployment Instructions

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Project pushed to GitHub repository
- Database hosting service (PlanetScale, Railway, or Aiven recommended)

## 📋 Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - LMS Micro-Certification Portal"
git branch -M main
git remote add origin https://github.com/yourusername/lms-certification-portal.git
git push -u origin main
```

2. **Verify all files are included:**
- ✅ `vercel.json` (root directory)
- ✅ `frontend/vercel.json`
- ✅ `backend/vercel.json`
- ✅ All source code files
- ✅ Package.json files with correct scripts

### Step 2: Set Up Database (Choose One Option)

#### Option A: PlanetScale (Recommended)
1. Go to [PlanetScale](https://planetscale.com/)
2. Create free account and new database
3. Create branch (main)
4. Get connection string from "Connect" tab
5. Import schema:
```sql
-- Copy contents from backend/database/schema.sql
-- Execute in PlanetScale console
```

#### Option B: Railway
1. Go to [Railway](https://railway.app/)
2. Create new project → Add MySQL
3. Get connection details from Variables tab
4. Connect and import schema

#### Option C: Aiven
1. Go to [Aiven](https://aiven.io/)
2. Create MySQL service (free tier)
3. Download SSL certificate if required
4. Import schema via MySQL Workbench or CLI

### Step 3: Deploy to Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com/)
   - Click "New Project"
   - Import your GitHub repository
   - Select the LMS project

2. **Configure Build Settings:**
   - Framework Preset: `Other`
   - Root Directory: `./` (leave empty)
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`

3. **Set Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NODE_ENV=production
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=lms_certification
   JWT_SECRET=your_super_secure_jwt_secret_key_change_this
   DB_PORT=3306
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Get your deployment URL

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? N
# - Project name: lms-certification-portal
# - Directory: ./
# - Override settings? N

# Set environment variables
vercel env add NODE_ENV
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
vercel env add JWT_SECRET

# Deploy to production
vercel --prod
```

### Step 4: Configure Frontend API URLs

Update frontend to use production API URLs:

1. **Create environment file** `frontend/.env.production`:
```env
REACT_APP_API_URL=https://your-vercel-app.vercel.app/api
```

2. **Update API calls** in frontend (if not using relative URLs):
```javascript
// In frontend/src/context/AuthContext.js and other API files
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

### Step 5: Test Deployment

1. **Visit your deployed app:**
   - Frontend: `https://your-app-name.vercel.app`
   - API: `https://your-app-name.vercel.app/api`

2. **Test functionality:**
   - User registration/login
   - Quiz taking
   - Certificate generation
   - Results viewing

3. **Check logs:**
   - Vercel Dashboard → Functions tab
   - View function logs for errors

## 🔧 Configuration Files Created

### Root `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/backend/server.js" },
    { "src": "/(.*)", "dest": "/frontend/$1" }
  ],
  "rewrites": [
    {
      "source": "/((?!api/.*).*)",
      "destination": "/frontend/index.html"
    }
  ]
}
```

### Frontend `vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "create-react-app"
}
```

### Backend `vercel.json`
```json
{
  "version": 2,
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/server.js" }],
  "env": { "NODE_ENV": "production" }
}
```

## 🛠️ Troubleshooting Deployment Issues

### Build Failures

#### "Module not found" errors:
```bash
# Ensure all dependencies are in package.json
npm install --save missing-package

# Check for devDependencies that should be dependencies
# Move from devDependencies to dependencies in package.json
```

#### "Build exceeded time limit":
```bash
# Optimize build process
# Remove unused dependencies
# Use .vercelignore to exclude unnecessary files
```

### Runtime Errors

#### Database connection issues:
1. Verify environment variables in Vercel dashboard
2. Check database firewall settings
3. Ensure database accepts connections from 0.0.0.0/0
4. Test connection string manually

#### CORS errors:
```javascript
// Update backend/server.js
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

#### Certificate generation issues:
- Ensure PDFKit works in serverless environment
- Check function timeout limits (10s default)
- Consider using external PDF service for large certificates

### Performance Optimization

#### Frontend optimization:
```bash
# Build optimization
npm run build

# Check bundle size
npx bundlesize

# Enable gzip compression (automatic on Vercel)
```

#### Backend optimization:
```javascript
// Add compression middleware
const compression = require('compression');
app.use(compression());

// Optimize database queries
// Use connection pooling
// Add proper indexes
```

## 🔒 Security Considerations

### Environment Variables:
- Never commit `.env` files
- Use strong JWT secrets (32+ characters)
- Rotate secrets regularly
- Use different secrets for production

### Database Security:
- Enable SSL connections
- Use strong passwords
- Limit database user permissions
- Regular backups

### API Security:
- Rate limiting (consider Vercel Edge Functions)
- Input validation
- SQL injection prevention
- HTTPS only (automatic on Vercel)

## 📊 Monitoring and Maintenance

### Vercel Analytics:
- Enable Web Analytics in Vercel dashboard
- Monitor Core Web Vitals
- Track user engagement

### Error Monitoring:
- Check Vercel function logs
- Set up error alerts
- Monitor database performance

### Updates:
```bash
# Update dependencies regularly
npm update

# Redeploy after updates
vercel --prod
```

## 🎯 Post-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connected and accessible
- [ ] User registration working
- [ ] Quiz functionality operational
- [ ] Certificate generation working
- [ ] Results page displaying correctly
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active (automatic)
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error monitoring set up

## 🌐 Custom Domain (Optional)

1. **Add domain in Vercel:**
   - Project Settings → Domains
   - Add your domain name

2. **Configure DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel IP addresses

3. **SSL Certificate:**
   - Automatic via Let's Encrypt
   - Usually takes 24-48 hours

## 💡 Tips for Success

1. **Test locally first:** Ensure everything works in development
2. **Use staging environment:** Deploy to preview URL before production
3. **Monitor logs:** Check Vercel function logs for issues
4. **Backup database:** Regular backups of production data
5. **Version control:** Tag releases for easy rollbacks
6. **Documentation:** Keep deployment notes updated

Your LMS Micro-Certification Portal is now ready for production deployment on Vercel! 🎉
