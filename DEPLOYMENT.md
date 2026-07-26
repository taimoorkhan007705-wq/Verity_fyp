# Deployment Guide

Complete guide for deploying Verity to production.

## 🎯 Deployment Overview

This guide covers deploying to:
- **Frontend**: Vercel or Netlify (recommended)
- **Backend**: Railway, Heroku, or AWS
- **Database**: MongoDB Atlas (already cloud-based)
- **Media Storage**: File uploads to backend or cloud storage

## 🚀 Frontend Deployment (Vercel - Recommended)

### Step 1: Prepare Frontend

```bash
cd Verity_FYP

# Update environment variables for production
# Edit .env with production API URLs
# VITE_API_URL=https://your-api-domain.com/api
# VITE_API_BASE=https://your-api-domain.com

# Build for production
npm run build

# Test production build locally
npm run preview
```

### Step 2: Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Choose project name
   - Set `Verity_FYP` as root directory
   - Add environment variables when prompted

4. **Configure Environment Variables**:
   - Go to Vercel dashboard
   - Project Settings → Environment Variables
   - Add: `VITE_API_URL` and `VITE_API_BASE`

5. **Set Production Domain**:
   - Project Settings → Domains
   - Add your custom domain (optional)

### Vercel Alternative: Netlify

1. **Build**:
   ```bash
   cd Verity_FYP
   npm run build
   ```

2. **Deploy**:
   - Drag `dist` folder to https://app.netlify.com
   - Or connect GitHub repo for auto-deploys

3. **Configure**:
   - Site settings → Build & deploy
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Environment variables: Add API URLs

## 🛠️ Backend Deployment (Railway - Recommended)

### Step 1: Prepare Backend

```bash
cd backend

# Ensure .env is in .gitignore (it should be)
# Verify package.json has start script

# Create Procfile if needed
echo "web: npm start" > Procfile
```

### Step 2: Deploy to Railway

1. **Sign up** at https://railway.app

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push
   ```

3. **Connect Repository**:
   - Go to Railway dashboard
   - New Project → Import from GitHub
   - Select Verity repository
   - Select backend folder

4. **Configure Environment Variables**:
   - Go to project settings
   - Variables tab
   - Add all from backend/.env:
     ```
     MONGODB_URI=your-mongodb-uri
     JWT_SECRET=your-secret
     PORT=5001
     NODE_ENV=production
     SIGHTENGINE_USER=your-user
     SIGHTENGINE_SECRET=your-secret
     EMAIL_USER=your-email
     EMAIL_PASSWORD=your-password
     CLIENT_URL=https://your-frontend-url.com
     ```

5. **Deploy**:
   - Railway auto-deploys on push
   - Get deployment URL from project settings

### Backend Alternative: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create verity-backend

# Add environment variables
heroku config:set MONGODB_URI="your-uri"
heroku config:set JWT_SECRET="your-secret"
# ... add all other variables

# Deploy from Git
git push heroku main
```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Go to** https://www.mongodb.com/cloud/atlas

2. **Create Production Cluster**:
   - Choose cloud provider (AWS recommended)
   - Choose region close to users
   - Select M0 (free) or larger tier

3. **Security**:
   - Network Access: Whitelist IPs
   - Add IP of your backend server
   - Database Users: Create dedicated user

4. **Get Connection String**:
   - Clusters → Connect
   - Copy connection string
   - Replace username/password
   - Add to backend env vars

5. **Backup**:
   - Continuous Backups: Enable
   - Point-in-time recovery: Enable

## 🔒 Security Checklist

### Before Going Live

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enabled everywhere
- [ ] CORS configured for your domains
- [ ] Database backups automated
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers enabled
- [ ] MongoDB IP whitelist configured
- [ ] Error messages don't expose sensitive info
- [ ] Password hashing verified (bcrypt)
- [ ] JWT expiration set appropriately

### Post-Deployment

- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Configure error notifications
- [ ] Set up logging
- [ ] Monitor database performance
- [ ] Regular security audits

## 📊 Domain Setup

### CloudFlare (Optional but Recommended)

1. **Add site** to CloudFlare
2. **Update DNS** at domain registrar
3. **Enable**:
   - SSL/TLS (Full)
   - Auto HTTPS redirects
   - DDoS protection
   - Caching rules

### Custom Domain Configuration

**For Frontend (Vercel/Netlify)**:
- Add CNAME record pointing to CDN
- SSL certificate auto-configured

**For Backend**:
- Add A record pointing to server IP
- Or use API gateway/load balancer

## 📈 Performance Optimization

### Frontend
```bash
# Analyze bundle size
npm run build -- --analyze

# Use image optimization
# Consider: next/image or similar

# Enable caching headers
# Configure in Vercel/Netlify
```

### Backend
```bash
# Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});

# Use compression
import compression from 'compression';
app.use(compression());
```

### Database
- Create indexes on frequently queried fields
- Monitor slow queries
- Archive old data if needed

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy Frontend
        run: |
          cd Verity_FYP
          npm install
          npm run build
          # Deploy command for your provider
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install
          # Deploy command for your provider
```

## 📱 Mobile Access

### PWA (Progressive Web App)

1. **Create manifest.json**:
   ```json
   {
     "name": "Verity",
     "short_name": "Verity",
     "icons": [...]
   }
   ```

2. **Register service worker**:
   ```javascript
   if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register('/sw.js');
   }
   ```

3. **Enable installability**:
   - HTTPS required
   - Valid manifest
   - App icon
   - Launch URL

## 🧪 Testing Before Production

### Test Checklist

- [ ] User signup/login works
- [ ] Post creation and upload works
- [ ] Image cropping works
- [ ] Voting system works
- [ ] Leaderboard displays correctly
- [ ] Trust scores update
- [ ] Email notifications work
- [ ] All pages load
- [ ] Mobile responsive works
- [ ] Performance acceptable

### Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# Using Artillery
npm install -g artillery
artillery quick --count 100 --num 10 https://your-domain.com/
```

## 📞 Post-Deployment Monitoring

### Essential Tools

1. **Error Tracking**: Sentry
2. **Performance**: New Relic or DataDog
3. **Uptime Monitoring**: UptimeRobot
4. **Log Aggregation**: LogRocket or ELK
5. **Database Monitoring**: MongoDB Atlas

### Setup Sentry (Recommended)

```bash
# Install
npm install @sentry/react @sentry/tracing

# In frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
});
```

## 🆘 Troubleshooting Deployment

### Frontend won't build
- Clear node_modules: `rm -r node_modules && npm install`
- Check for TypeScript errors
- Verify all imports are correct

### Backend connection errors
- Check environment variables
- Verify database connection string
- Test MongoDB connection directly
- Check firewall/IP whitelist

### CORS errors
- Verify backend CORS config
- Check allowed origins in .env
- Ensure frontend URL matches backend config

### Slow performance
- Enable caching
- Optimize database queries
- Use CDN for static assets
- Consider upgrading server tier

## 📊 Scaling Strategy

### Phase 1: Launch
- Single backend server
- MongoDB shared cluster
- CDN for assets

### Phase 2: Growth
- Load balancer for backend
- MongoDB replica set
- Redis caching layer
- S3 for file storage

### Phase 3: Scale
- Microservices architecture
- Kubernetes orchestration
- Global CDN
- Database sharding

## 📋 Deployment Checklist

Before each deployment:

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Rollback plan ready
- [ ] Deployment window scheduled
- [ ] Team notified

## 🎉 Success Criteria

Your deployment is successful when:

✅ Frontend accessible at domain  
✅ Backend API responding  
✅ Database connected  
✅ User can login  
✅ Posts can be created  
✅ Voting works  
✅ Leaderboard updating  
✅ No console errors  
✅ Load times acceptable  
✅ Mobile works  

---

**Congratulations! Verity is live! 🚀**

For ongoing support, keep monitoring and update security patches regularly.
