# 🚀 Career Crafter - AI-Powered Resume Builder

A production-ready, full-stack web application for building AI-powered resumes with professional PDF generation and job matching analysis.

## 📁 **Project Structure**

```
career-crafter/
├── backend/                 # Spring Boot Java Backend
│   ├── src/main/java/com/careercrafter/
│   │   ├── controller/     # REST API Controllers
│   │   ├── service/        # Business Logic
│   │   ├── repository/     # Data Access Layer
│   │   ├── entity/         # JPA Entities
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── config/        # Configuration Classes
│   │   ├── security/      # JWT Authentication
│   │   └── exception/     # Exception Handlers
│   ├── src/main/resources/
│   │   └── application.yml # Spring Configuration
│   ├── pom.xml            # Maven Dependencies
│   ├── Dockerfile         # Container Configuration
│   └── render.yaml        # Render Deployment
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/          # Next.js App Router
│   │   ├── components/   # React Components
│   │   ├── lib/          # Utilities & Config
│   │   └── types/        # TypeScript Types
│   ├── public/           # Static Assets
│   ├── package.json      # Node.js Dependencies
│   └── vercel.json       # Vercel Deployment
├── DEPLOYMENT_GUIDE.md   # Production Deployment Guide
└── README.md            # This File
```

## 📊 **Current Implementation Status**

### ✅ **Backend (Spring Boot - 90% Complete):**
- ✅ Spring Boot application with Java
- ✅ PostgreSQL database with JPA/Hibernate
- ✅ Complete database schema (users, resumes, versions)
- ✅ REST API endpoints for CRUD operations
- ✅ AI service integration with Groq API
- ✅ PDF generation service
- ✅ Cloudinary integration for file storage
- ✅ JWT authentication with Clerk
- ✅ CORS configuration
- ✅ Exception handling and validation

### ✅ **Frontend (Next.js - 85% Complete):**
- ✅ Next.js 14 with TypeScript
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Clerk authentication integration
- ✅ Resume builder interface
- ✅ Dashboard and landing pages
- ✅ PDF preview and download
- ✅ Job matching analysis UI

### ✅ **AI Integration (95% Complete):**
- ✅ Groq API integration
- ✅ Summary enhancement
- ✅ Work experience bullet point generation
- ✅ Job matching analysis
- ✅ Skill gap analysis
- ✅ Resume generation from structured data

### ✅ **Deployment Ready:**
- ✅ Render configuration for backend
- ✅ Vercel configuration for frontend
- ✅ Environment variable setup
- ✅ Docker configuration
- ✅ Health check endpoints

## 🚀 **Quick Start**

### Prerequisites:
- Java 17+
- Node.js 18+
- PostgreSQL (Neon)
- Groq API key
- Clerk account
- Cloudinary account

### Backend Setup:

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

3. **Run the application:**
```bash
./mvnw spring-boot:run
```

### Frontend Setup:

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

4. **Run the development server:**
```bash
npm run dev
```

## 🔧 **Environment Configuration**

### Backend (.env):
```env
# Database
DATABASE_URL=your_neon_connection_string

# AI Service
GROQ_API_KEY=your_groq_api_key

# Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_ISSUER_URL=https://clerk.your-domain.com
CLERK_JWK_SET_URI=https://clerk.your-domain.com/.well-known/jwks.json

# File Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.vercel.app
```

### Frontend (.env.local):
```env
# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# API
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 🚀 **Deployment**

For production deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 📚 **API Documentation**

### Core Endpoints:

- `POST /api/resumes` - Create new resume
- `GET /api/resumes` - Get user's resumes
- `GET /api/resumes/{id}` - Get specific resume
- `PUT /api/resumes/{id}` - Update resume
- `DELETE /api/resumes/{id}` - Delete resume
- `POST /api/ai/generate` - Generate AI content
- `POST /api/ai/analyze-job` - Analyze job description
- `POST /api/pdf/generate` - Generate PDF resume
- `GET /api/health` - Health check

## 🛠️ **Tech Stack**

- **Backend**: Spring Boot, Java 17, JPA/Hibernate
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **Authentication**: Clerk
- **AI**: Groq API
- **File Storage**: Cloudinary
- **Deployment**: Render (Backend), Vercel (Frontend)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License. 