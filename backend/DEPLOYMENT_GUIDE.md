# 🚀 Career Crafter Backend - Deployment Guide

Complete deployment guide for the Spring Boot backend to production environments.

## 📋 **Deployment Options**

### **1. Render (Recommended)**
- ✅ **Free tier available**
- ✅ **Automatic deployments**
- ✅ **Easy environment management**
- ✅ **Built-in SSL**

### **2. Railway**
- ✅ **Simple deployment**
- ✅ **Good free tier**
- ✅ **Database included**

### **3. Heroku**
- ✅ **Mature platform**
- ✅ **Good documentation**
- ✅ **Add-ons available**

### **4. AWS/GCP/Azure**
- ✅ **Full control**
- ✅ **Scalable**
- ✅ **Enterprise features**

## 🚀 **Option 1: Render Deployment (Recommended)**

### **Step 1: Prepare Your Repository**

1. **Ensure your repository is ready:**
   ```bash
   # Check if all files are committed
   git status
   
   # Push to GitHub if not already done
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify your backend structure:**
   ```
   backend/
   ├── src/main/java/com/careercrafter/
   ├── src/main/resources/application.yml
   ├── pom.xml
   ├── Dockerfile
   ├── render.yaml
   └── env.example
   ```

### **Step 2: Set Up External Services**

#### **A. Neon Database (PostgreSQL)**
1. Go to [neon.tech](https://neon.tech)
2. Create a new account
3. Create a new project
4. Get your connection string:
   ```
   postgresql://username:password@host:port/database
   ```

#### **B. Clerk Authentication**
1. Go to [clerk.com](https://clerk.com)
2. Create a new application
3. Configure OAuth providers (Google, GitHub, etc.)
4. Get your keys:
   - Publishable Key: `pk_test_...`
   - Secret Key: `sk_test_...`
   - Issuer URL: `https://your-app.clerk.accounts.dev`
   - JWK Set URI: `https://your-app.clerk.accounts.dev/.well-known/jwks.json`

#### **C. Groq AI API**
1. Go to [console.groq.com](https://console.groq.com)
2. Create an account
3. Get your API key

#### **D. Cloudinary**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret

### **Step 3: Deploy to Render**

1. **Go to Render Dashboard:**
   - Visit [render.com](https://render.com)
   - Sign up/Login with GitHub

2. **Create New Web Service:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure the Service:**
   ```
   Name: career-crafter-backend
   Environment: Java
   Build Command: cd backend && ./mvnw clean package -DskipTests
   Start Command: cd backend && java -jar target/*.jar
   ```

4. **Set Environment Variables:**
   ```bash
   # Database
   DATABASE_URL=your_neon_connection_string
   
   # Server
   PORT=8080
   SPRING_PROFILES_ACTIVE=production
   
   # Clerk Authentication
   CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
   CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
   CLERK_JWK_SET_URI=https://your-app.clerk.accounts.dev/.well-known/jwks.json
   
   # Groq AI
   GROQ_API_KEY=your_groq_api_key
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # CORS
   CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for build to complete
   - Your service will be available at: `https://your-app-name.onrender.com`

### **Step 4: Verify Deployment**

1. **Health Check:**
   ```bash
   curl https://your-app-name.onrender.com/api/health
   ```

2. **Test API Endpoints:**
   ```bash
   # Test with JWT token
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
        https://your-app-name.onrender.com/api/resumes
   ```

## 🚂 **Option 2: Railway Deployment**

### **Step 1: Prepare for Railway**

1. **Create railway.toml:**
   ```toml
   [build]
   builder = "nixpacks"
   
   [deploy]
   startCommand = "cd backend && java -jar target/*.jar"
   healthcheckPath = "/api/health"
   healthcheckTimeout = 300
   ```

2. **Add to your repository:**
   ```bash
   git add railway.toml
   git commit -m "Add Railway configuration"
   git push origin main
   ```

### **Step 2: Deploy to Railway**

1. **Go to Railway:**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Environment:**
   - Go to "Variables" tab
   - Add all environment variables (same as Render)

4. **Deploy:**
   - Railway will automatically detect Java
   - Build and deploy automatically

## 🐳 **Option 3: Docker Deployment**

### **Step 1: Build Docker Image**

```bash
# Navigate to backend directory
cd backend

# Build the image
docker build -t career-crafter-backend .

# Tag for registry (optional)
docker tag career-crafter-backend your-registry/career-crafter-backend:latest
```

### **Step 2: Run with Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    image: career-crafter-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=jdbc:postgresql://db:5432/careercrafter
      - GROQ_API_KEY=${GROQ_API_KEY}
      - CLERK_SECRET_KEY=${CLERK_SECRET_KEY}
      - CLERK_ISSUER_URL=${CLERK_ISSUER_URL}
      - CLERK_JWK_SET_URI=${CLERK_JWK_SET_URI}
      - CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME}
      - CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
      - CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}
      - CORS_ALLOWED_ORIGINS=${CORS_ALLOWED_ORIGINS}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=careercrafter
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### **Step 3: Deploy**

```bash
# Create .env file
cp env.example .env
# Edit .env with your values

# Run with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

## ☁️ **Option 4: Cloud Deployment (AWS/GCP/Azure)**

### **AWS Deployment**

#### **Using AWS Elastic Beanstalk:**

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB:**
   ```bash
   cd backend
   eb init
   ```

3. **Create application:**
   ```bash
   eb create career-crafter-backend
   ```

4. **Set environment variables:**
   ```bash
   eb setenv DATABASE_URL=your_db_url GROQ_API_KEY=your_key
   ```

5. **Deploy:**
   ```bash
   eb deploy
   ```

#### **Using AWS ECS:**

1. **Create ECR repository:**
   ```bash
   aws ecr create-repository --repository-name career-crafter-backend
   ```

2. **Push image:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker tag career-crafter-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/career-crafter-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/career-crafter-backend:latest
   ```

3. **Create ECS service with Fargate**

### **Google Cloud Platform**

#### **Using Cloud Run:**

1. **Build and push:**
   ```bash
   gcloud builds submit --tag gcr.io/your-project/career-crafter-backend
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy career-crafter-backend \
     --image gcr.io/your-project/career-crafter-backend \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

## 🔧 **Environment Configuration**

### **Production Environment Variables**

```bash
# Database
DATABASE_URL=jdbc:postgresql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
DDL_AUTO=validate

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=production

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
CLERK_JWK_SET_URI=https://your-app.clerk.accounts.dev/.well-known/jwks.json

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app

# Logging
LOG_LEVEL=INFO
SECURITY_LOG_LEVEL=WARN
SQL_LOG_LEVEL=WARN
```

### **Development Environment Variables**

```bash
# Database
DATABASE_URL=jdbc:postgresql://localhost:5432/careercrafter
DB_USERNAME=postgres
DB_PASSWORD=password
DDL_AUTO=update

# Server
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_ISSUER_URL=https://your-app.clerk.accounts.dev
CLERK_JWK_SET_URI=https://your-app.clerk.accounts.dev/.well-known/jwks.json

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Logging
LOG_LEVEL=DEBUG
SECURITY_LOG_LEVEL=DEBUG
SQL_LOG_LEVEL=DEBUG
```

## 🧪 **Testing Your Deployment**

### **Health Check**
```bash
curl https://your-app-domain.com/api/health
```

### **API Testing**
```bash
# Test with JWT token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-app-domain.com/api/resumes

# Test CORS
curl -H "Origin: https://your-frontend-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://your-app-domain.com/api/resumes
```

### **Database Connection**
```bash
# Test database connectivity
psql "your_database_connection_string" -c "SELECT 1;"
```

## 📊 **Monitoring and Logs**

### **Application Logs**
```bash
# Render
# View logs in Render dashboard

# Railway
railway logs

# Docker
docker-compose logs -f backend

# AWS
aws logs tail /aws/elasticbeanstalk/your-app-name/var/log/web.stdout.log
```

### **Health Monitoring**
- **Health Check URL**: `/api/health`
- **Expected Response**: `{"status":"UP","timestamp":"...","service":"Career Crafter API"}`

### **Performance Monitoring**
- **Response Time**: < 500ms for API calls
- **Memory Usage**: < 512MB for basic deployment
- **CPU Usage**: < 50% under normal load

## 🔒 **Security Checklist**

### **✅ Security Measures**
- ✅ **HTTPS enabled** (automatic on Render/Railway)
- ✅ **JWT token validation**
- ✅ **CORS properly configured**
- ✅ **Input validation**
- ✅ **SQL injection protection**
- ✅ **Environment variables secured**

### **🔒 Additional Security**
- **Rate limiting** (consider adding)
- **API key rotation** (for external services)
- **Database backups** (enable on Neon)
- **Monitoring alerts** (set up notifications)

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   ```bash
   # Check Maven dependencies
   mvn clean install
   
   # Check Java version
   java -version
   ```

2. **Database Connection Issues**
   ```bash
   # Test database connection
   psql "your_connection_string" -c "SELECT 1;"
   
   # Check environment variables
   echo $DATABASE_URL
   ```

3. **JWT Validation Issues**
   ```bash
   # Verify Clerk configuration
   curl https://your-app.clerk.accounts.dev/.well-known/jwks.json
   
   # Check JWT token format
   echo "YOUR_JWT_TOKEN" | cut -d. -f2 | base64 -d
   ```

4. **CORS Issues**
   ```bash
   # Test CORS preflight
   curl -H "Origin: https://your-frontend.com" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS https://your-backend.com/api/resumes
   ```

### **Debug Commands**

```bash
# Check application status
curl -I https://your-app-domain.com/api/health

# Test database connectivity
psql "your_db_url" -c "SELECT version();"

# Check environment variables
echo $DATABASE_URL
echo $GROQ_API_KEY

# View application logs
# (Use platform-specific commands)
```

## 📚 **Additional Resources**

- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [AWS Elastic Beanstalk](https://docs.aws.amazon.com/elasticbeanstalk)
- [Google Cloud Run](https://cloud.google.com/run/docs)

---

**🎉 Your Spring Boot backend is now ready for production deployment!** 