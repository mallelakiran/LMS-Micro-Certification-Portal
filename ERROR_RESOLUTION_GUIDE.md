# LMS Micro-Certification Portal - Error Resolution Guide

## 🚨 Common Errors and Solutions

### 1. Database Connection Errors

#### Error: `ECONNREFUSED 127.0.0.1:3306`
**Cause:** MySQL server is not running or wrong connection details

**Solutions:**
```bash
# Check if MySQL is running (Windows)
net start mysql

# Start MySQL service if stopped
net start mysql80  # or your MySQL service name

# Check MySQL status
mysql -u root -p -e "SELECT 1"
```

**Configuration Check:**
- Verify `backend/.env` file exists with correct credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lms_certification
```

#### Error: `ER_BAD_DB_ERROR: Unknown database 'lms_certification'`
**Cause:** Database doesn't exist

**Solution:**
```sql
-- Create database
CREATE DATABASE lms_certification;

-- Import schema
mysql -u root -p lms_certification < backend/database/schema.sql
```

#### Error: `ER_ACCESS_DENIED_ERROR: Access denied for user`
**Cause:** Wrong MySQL credentials

**Solutions:**
1. Reset MySQL password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

2. Update `.env` file with correct credentials

### 2. Port Conflicts

#### Error: `EADDRINUSE: address already in use :::3000` or `:::5000`
**Cause:** Port is already occupied

**Solutions:**
```bash
# Kill processes on specific ports
npx kill-port 3000
npx kill-port 5000

# Or find and kill manually (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Change ports in configuration
# Frontend: package.json scripts or .env
# Backend: .env file PORT=5001
```

### 3. Node.js and npm Issues

#### Error: `Module not found` or `Cannot resolve dependency`
**Cause:** Missing dependencies

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Install specific missing packages
npm install axios react-router-dom

# For backend
cd backend
npm install express mysql2 bcryptjs jsonwebtoken
```

#### Error: `Node version compatibility`
**Cause:** Wrong Node.js version

**Solution:**
```bash
# Check Node version
node --version

# Install Node.js 16+ if needed
# Download from nodejs.org or use nvm
nvm install 18
nvm use 18
```

### 4. Frontend React Errors

#### Error: `Cannot read properties of undefined (reading 'map')`
**Cause:** Data not loaded before rendering

**Solution:**
```javascript
// Add loading state and null checks
const [quizzes, setQuizzes] = useState([]);
const [loading, setLoading] = useState(true);

// In component render
if (loading) return <div>Loading...</div>;
if (!quizzes || quizzes.length === 0) return <div>No quizzes available</div>;

return quizzes.map(quiz => ...)
```

#### Error: `Failed to fetch` or Network errors
**Cause:** Backend not running or wrong API URL

**Solutions:**
1. Ensure backend is running on port 5000
2. Check `frontend/package.json` proxy setting:
```json
"proxy": "http://localhost:5000"
```
3. Verify API endpoints in frontend code

#### Error: `CORS policy` errors
**Cause:** Cross-origin request blocked

**Solution in backend:**
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 5. Authentication Issues

#### Error: `Token expired` or `Invalid token`
**Cause:** JWT token expired or malformed

**Solutions:**
```javascript
// Clear localStorage and redirect to login
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';

// Check token expiration in backend
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

#### Error: `User not authenticated`
**Cause:** Missing or invalid authentication

**Solutions:**
1. Check if token exists in localStorage
2. Verify token format and expiration
3. Ensure protected routes have auth middleware

### 6. PDF Certificate Generation Errors

#### Error: `Cannot generate PDF` or `PDFKit errors`
**Cause:** Missing PDFKit dependencies or file permissions

**Solutions:**
```bash
# Reinstall PDFKit
npm uninstall pdfkit
npm install pdfkit

# Check file permissions for temp directory
# Ensure backend has write permissions
```

#### Error: `Certificate download not working`
**Cause:** Browser popup blocker or server response issues

**Solutions:**
1. Allow popups for localhost
2. Check browser console for errors
3. Verify certificate endpoint returns proper headers:
```javascript
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');
```

### 7. Build and Deployment Errors

#### Error: `Build failed` in React
**Cause:** Code syntax errors or missing dependencies

**Solutions:**
```bash
# Check for syntax errors
npm run build

# Fix common issues
# - Remove unused imports
# - Fix ESLint warnings
# - Ensure all dependencies are installed
```

#### Error: `Vercel deployment failed`
**Cause:** Build configuration or environment variables

**Solutions:**
1. Set correct build commands in Vercel:
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/build`

2. Configure environment variables in Vercel dashboard

3. Check `vercel.json` configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/backend/server.js"
    }
  ]
}
```

### 8. Development Environment Issues

#### Error: `Concurrently not working`
**Cause:** Missing concurrently package or script errors

**Solutions:**
```bash
# Install concurrently
npm install --save-dev concurrently

# Check package.json scripts
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "cd backend && npm run dev",
  "client": "cd frontend && npm start"
}
```

#### Error: `Environment variables not loading`
**Cause:** Missing .env file or wrong location

**Solutions:**
1. Create `backend/.env` file with all required variables
2. Install dotenv: `npm install dotenv`
3. Load in server.js: `require('dotenv').config()`

## 🔧 Quick Troubleshooting Checklist

### Before Starting Development:
- [ ] MySQL server is running
- [ ] Database `lms_certification` exists
- [ ] Schema is imported from `backend/database/schema.sql`
- [ ] `backend/.env` file exists with correct credentials
- [ ] All dependencies installed (`npm run install-deps`)

### If Application Won't Start:
1. Check ports 3000 and 5000 are free
2. Verify Node.js version (16+)
3. Clear npm cache and reinstall dependencies
4. Check for syntax errors in recent changes

### If Database Issues:
1. Test MySQL connection manually
2. Verify database credentials in `.env`
3. Check if database and tables exist
4. Review MySQL error logs

### If Frontend Issues:
1. Check browser console for errors
2. Verify API endpoints are correct
3. Ensure backend is running
4. Check network tab for failed requests

### If Authentication Issues:
1. Clear browser localStorage
2. Check JWT token validity
3. Verify auth middleware is working
4. Test login/register endpoints manually

## 📞 Getting Help

### Debug Commands:
```bash
# Check running processes
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Test API endpoints
curl http://localhost:5000/api/auth/profile
curl http://localhost:5000/api/quizzes

# Check MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# View application logs
# Check browser console
# Check terminal output for backend errors
```

### Log Files to Check:
- Browser Developer Console (F12)
- Terminal output for backend server
- MySQL error logs
- npm debug logs (`npm-debug.log`)

### When to Restart:
- After changing environment variables
- After installing new packages
- After database schema changes
- When experiencing persistent connection issues

Remember: Most issues are related to missing dependencies, wrong configuration, or services not running. Always check the basics first!
