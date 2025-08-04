# 🚀 Career Crafter - Production Deployment Guide

This guide will walk you through deploying the Career Crafter application to production using Render (backend) and Vercel (frontend).

## 📋 **Prerequisites**

Before deploying, ensure you have:

1. **GitHub Account** - For repository hosting
2. **Render Account** - For backend deployment
3. **Vercel Account** - For frontend deployment
4. **Clerk Account** - For authentication
5. **Cloudinary Account** - For file storage
6. **Groq API Key** - For AI features
7. **Neon PostgreSQL Database** - For data storage

## 🔧 **Step 1: Set Up External Services**

### 1.1 Clerk Authentication Setup

1. **Create Clerk Application:**
   - Go to [clerk.com](https://clerk.com)
   - Create a new application
   - Note your `Publishable Key` and `Secret Key`

2. **Configure OAuth Providers:**
   - Enable Google, GitHub, or other providers
   - Set redirect URLs for your domain

3. **Get JWT Configuration:**
   - Note your `Issuer URL` (e.g., `https://clerk.your-domain.com`)
   - Note your `JWK Set URI` (e.g., `https://clerk.your-domain.com/.well-known/jwks.json`)

### 1.2 Cloudinary Setup

1. **Create Cloudinary Account:**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Create a new account
   - Note your `Cloud Name`, `API Key`, and `API Secret`

2. **Configure Upload Settings:**
   - Set up folder structure for resumes
   - Configure CORS settings if needed

### 1.3 Groq API Setup

1. **Get Groq API Key:**
   - Go to [console.groq.com](https://console.groq.com)
   - Create an account and get your API key
   - Note the API key for backend configuration

### 1.4 Neon Database Setup

1. **Create Neon Database:**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Note your connection string

2. **Database Schema:**
   - The application will automatically create tables on first run
   - Ensure your database supports PostgreSQL 15+

## 🚀 **Step 2: Deploy Backend to Render**

### 2.1 Prepare Repository

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit for deployment"
   git push origin main
   ```

2. **Verify Structure:**
   ```
   career-crafter/
   ├── backend/
   │   ├── src/main/java/com/careercrafter/
   │   ├── pom.xml
   │   ├── Dockerfile
   │   └── render.yaml
   ├── frontend/
   │   ├── src/
   │   ├── package.json
   │   └── vercel.json
   └── README.md
   ```

### 2.2 Deploy to Render

1. **Connect Repository:**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service:**
   - **Name:** `career-crafter-backend`
   - **Environment:** `Java`
   - **Build Command:** `cd backend && ./mvnw clean package -DskipTests`
   - **Start Command:** `cd backend && java -jar target/*.jar`
   - **Health Check Path:** `/api/health`

3. **Set Environment Variables:**
   ```
   SPRING_PROFILES_ACTIVE=production
   DATABASE_URL=your_neon_connection_string
   GROQ_API_KEY=your_groq_api_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_ISSUER_URL=https://clerk.your-domain.com
   CLERK_JWK_SET_URI=https://clerk.your-domain.com/.well-known/jwks.json
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for build and deployment to complete
   - Note your backend URL (e.g., `https://career-crafter-backend.onrender.com`)

## 🌐 **Step 3: Deploy Frontend to Vercel**

### 3.1 Prepare Frontend

1. **Update API URL:**
   - Edit `frontend/src/lib/api.ts`
   - Set `NEXT_PUBLIC_API_URL` to your Render backend URL

2. **Set Environment Variables:**
   ```bash
   # In Vercel dashboard or .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   NEXT_PUBLIC_API_URL=https://career-crafter-backend.onrender.com/api
   ```

### 3.2 Deploy to Vercel

1. **Connect Repository:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

3. **Set Environment Variables:**
   - Add all the environment variables listed above
   - Ensure `NEXT_PUBLIC_API_URL` points to your Render backend

4. **Deploy:**
   - Click "Deploy"
   - Wait for build and deployment to complete
   - Note your frontend URL (e.g., `https://career-crafter.vercel.app`)

## 🔗 **Step 4: Configure Cross-Origin Settings**

### 4.1 Update Backend CORS

1. **Update Render Environment Variables:**
   - Go to your Render service dashboard
   - Add/update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://career-crafter.vercel.app,http://localhost:3000
   ```

### 4.2 Update Clerk Settings

1. **Configure Clerk Domains:**
   - Go to your Clerk dashboard
   - Add your Vercel domain to allowed origins
   - Update redirect URLs to include your Vercel domain

## 🧪 **Step 5: Testing Deployment**

### 5.1 Backend Health Check

```bash
curl https://career-crafter-backend.onrender.com/api/health
```

Expected response: `"Backend is running"`

### 5.2 Frontend Health Check

```bash
curl https://career-crafter.vercel.app
```

Should return the landing page HTML.

### 5.3 API Endpoint Test

```bash
curl -X GET https://career-crafter-backend.onrender.com/api/ai/health
```

Expected response: `"AI Service is running"`

## 🔧 **Step 6: Production Configuration**

### 6.1 Database Migration

The application will automatically create tables on first run, but you can also run migrations manually:

```bash
# Connect to your Neon database
psql your_neon_connection_string

# Check if tables exist
\dt

# If needed, run the schema creation
```

### 6.2 SSL Configuration

Both Render and Vercel provide SSL certificates automatically.

### 6.3 Monitoring Setup

1. **Render Monitoring:**
   - Enable logs in Render dashboard
   - Set up alerts for downtime

2. **Vercel Analytics:**
   - Enable Vercel Analytics
   - Monitor performance metrics

## 🚨 **Troubleshooting**

### Common Issues:

1. **Build Failures:**
   - Check Maven dependencies in `backend/pom.xml`
   - Verify Node.js version compatibility
   - Check for missing environment variables

2. **CORS Errors:**
   - Verify `CORS_ALLOWED_ORIGINS` includes your frontend domain
   - Check browser console for specific CORS errors

3. **Authentication Issues:**
   - Verify Clerk keys are correct
   - Check JWT configuration in backend
   - Ensure domain is added to Clerk allowed origins

4. **Database Connection:**
   - Verify Neon connection string
   - Check if database is accessible from Render
   - Ensure SSL is enabled for database connection

### Debug Commands:

```bash
# Check backend logs
curl https://career-crafter-backend.onrender.com/api/health

# Test database connection
curl -X POST https://career-crafter-backend.onrender.com/api/resumes \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Resume"}'

# Check frontend build
curl https://career-crafter.vercel.app/api/health
```

## 📊 **Step 7: Post-Deployment**

### 7.1 Performance Monitoring

1. **Set up monitoring:**
   - Configure Render alerts
   - Set up Vercel Analytics
   - Monitor API response times

2. **Database monitoring:**
   - Monitor Neon database usage
   - Set up connection pooling alerts

### 7.2 Security Checklist

- [ ] All environment variables are set
- [ ] CORS is properly configured
- [ ] SSL certificates are active
- [ ] Database is secured
- [ ] API keys are rotated regularly

### 7.3 Backup Strategy

1. **Database backups:**
   - Neon provides automatic backups
   - Set up manual backup schedule if needed

2. **Code backups:**
   - GitHub provides version control
   - Consider additional backup solutions

## 🎉 **Success!**

Your Career Crafter application is now deployed and ready for production use!

**Production URLs:**
- Frontend: `https://career-crafter.vercel.app`
- Backend: `https://career-crafter-backend.onrender.com`
- API: `https://career-crafter-backend.onrender.com/api`

**Next Steps:**
1. Test all features thoroughly
2. Set up monitoring and alerts
3. Configure custom domain (optional)
4. Set up CI/CD pipeline for automatic deployments
5. Document any custom configurations

---

**Need Help?**
- Check the troubleshooting section above
- Review Render and Vercel documentation
- Contact support if issues persist 