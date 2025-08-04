# 🚀 Career Crafter - AI-Powered Resume Builder

A production-ready, full-stack web application for building AI-powered resumes with professional PDF generation and job matching analysis.

## 📊 **Current Project Status**

### ✅ **What's Already Implemented:**

**Backend (Express.js - 80% Complete):**
- ✅ Express.js server with TypeScript
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Complete database schema (users, resumes, work experience, education, skills)
- ✅ Authentication with Replit Auth (OpenID Connect)
- ✅ AI service integration with Groq API
- ✅ REST API endpoints for CRUD operations
- ✅ Basic PDF service (placeholder)

**Frontend (React + Vite - 70% Complete):**
- ✅ React 18 with TypeScript
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Client-side routing with Wouter
- ✅ TanStack Query for state management
- ✅ Authentication flow
- ✅ Resume builder interface
- ✅ Dashboard and landing pages

**AI Integration (90% Complete):**
- ✅ Groq API integration
- ✅ Summary enhancement
- ✅ Work experience bullet point generation
- ✅ Job matching analysis
- ✅ Skill gap analysis

### ❌ **What's Missing for Production:**

1. **Authentication Migration** (Critical):
   - ❌ Migrate from Replit Auth to Clerk
   - ❌ JWT verification in Spring Boot backend
   - ❌ OAuth flow with Clerk

2. **Backend Migration** (Critical):
   - ❌ Migrate from Express.js to Spring Boot (Java)
   - ❌ REST API endpoints in Java
   - ❌ Database integration with Spring Data JPA

3. **PDF Generation** (High Priority):
   - ❌ Proper PDF generation with iText or PDFBox
   - ❌ Professional resume templates
   - ❌ Cloudinary integration for PDF storage

4. **Frontend Migration** (Medium Priority):
   - ❌ Migrate from Vite to Next.js
   - ❌ Server-side rendering setup
   - ❌ Clerk authentication integration

5. **Deployment Setup** (High Priority):
   - ❌ Render deployment configuration
   - ❌ Vercel deployment setup
   - ❌ Environment variable management

## 🏗️ **Target Architecture**

### **Production Stack:**
- **Backend**: Spring Boot (Java) + JPA
- **Frontend**: Next.js + Tailwind CSS
- **Authentication**: Clerk (OAuth + JWT)
- **Database**: PostgreSQL (Neon) ✅
- **AI**: Groq API ✅
- **PDF**: iText/PDFBox + Cloudinary
- **Deployment**: Render (Backend) + Vercel (Frontend)

## 🚀 **Quick Start (Current Express.js Version)**

### Prerequisites:
- Node.js 18+
- PostgreSQL (Neon)
- Groq API key

### Installation:

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/career-crafter.git
cd career-crafter
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp backend/env.example backend/.env
# Edit backend/.env with your configuration
```

4. **Set up database:**
```bash
npm run db:push
```

5. **Start development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔧 **Migration to Production Stack**

### Phase 1: Spring Boot Backend

The Spring Boot backend is already created in the `backend/` directory with:

- ✅ Maven configuration (`pom.xml`)
- ✅ Spring Boot application class
- ✅ Security configuration with JWT
- ✅ AI service with Groq integration
- ✅ PDF service with iText
- ✅ Cloudinary integration
- ✅ Docker configuration

**To deploy the Spring Boot backend:**

1. **Build the application:**
```bash
cd backend
./mvnw clean package
```

2. **Run with Docker:**
```bash
docker build -t career-crafter-backend .
docker run -p 8080:8080 career-crafter-backend
```

### Phase 2: Next.js Frontend

**To create the Next.js frontend:**

1. **Create Next.js project:**
```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
```

2. **Install Clerk:**
```bash
npm install @clerk/nextjs
```

3. **Configure environment variables:**
```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## 📁 **Project Structure**

```
career-crafter/
├── server/                    # Express.js backend (current)
│   ├── services/
│   │   ├── aiService.ts      # Groq AI integration
│   │   └── pdfService.ts     # PDF generation
│   ├── routes.ts             # API endpoints
│   └── index.ts              # Server entry point
├── client/                   # React frontend (current)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Application pages
│   │   └── hooks/           # Custom hooks
│   └── index.html
├── shared/                   # Shared types and schemas
│   └── schema.ts            # Database schema
├── backend/                  # Spring Boot backend (new)
│   ├── src/main/java/
│   │   ├── config/          # Security and CORS config
│   │   ├── controller/      # REST controllers
│   │   ├── service/         # Business logic
│   │   ├── entity/          # JPA entities
│   │   └── dto/            # Data transfer objects
│   ├── pom.xml             # Maven configuration
│   └── Dockerfile          # Docker configuration
├── frontend/                # Next.js frontend (new)
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # UI components
│   │   └── lib/           # Utilities and config
│   ├── package.json
│   └── next.config.js
└── README.md
```

## 🔐 **Authentication Flow**

### Current (Replit Auth):
1. User clicks "Sign In"
2. Redirected to Replit OAuth
3. User authenticates with Replit
4. JWT token returned and stored
5. API calls include JWT in Authorization header

### Target (Clerk):
1. User clicks "Sign In"
2. Clerk OAuth modal opens
3. User authenticates with Google/GitHub/etc.
4. Clerk JWT token returned
5. Spring Boot validates JWT with Clerk
6. User session established

## 🧠 **AI Integration**

The application uses Groq API for:

- **Summary Enhancement**: Generate professional summaries
- **Work Experience**: Create impactful bullet points
- **Job Matching**: Analyze resume against job descriptions
- **Skill Suggestions**: Recommend relevant skills

**Example AI prompts:**
```java
// Summary enhancement
"Based on the following information, write a professional summary (2-3 sentences) that would be perfect for a resume. Focus on key achievements, skills, and career highlights."

// Job matching
"Analyze the following resume against the job description and provide a detailed match analysis. Return a JSON object with matchScore, missingSkills, strengths, and suggestions."
```

## 📄 **PDF Generation**

The PDF service uses iText 7 to generate professional resumes with:

- **Professional Layout**: Clean, ATS-friendly design
- **Multiple Sections**: Personal info, experience, education, skills
- **Cloudinary Storage**: Automatic upload and sharing
- **Public Links**: Shareable resume URLs

## 🚀 **Deployment**

### Backend (Render):
1. Connect GitHub repository
2. Set build command: `cd backend && ./mvnw clean package`
3. Set start command: `java -jar target/*.jar`
4. Configure environment variables
5. Deploy

### Frontend (Vercel):
1. Connect GitHub repository
2. Set framework preset: Next.js
3. Configure environment variables
4. Deploy

## 🔧 **Environment Variables**

### Backend (.env):
```bash
# Database
DATABASE_URL=jdbc:postgresql://...
DB_USERNAME=postgres
DB_PASSWORD=password

# Clerk
CLERK_SECRET_KEY=sk_test_...
CLERK_ISSUER_URL=https://clerk.your-domain.com

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env.local):
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# API
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## 🧪 **Testing**

### API Testing:
```bash
# Test AI endpoints
curl -X POST http://localhost:8080/api/ai/enhance-summary \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"personalInfo": "...", "workExperience": "..."}'

# Test PDF generation
curl -X POST http://localhost:8080/api/pdf/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{"resumeId": "...", "personalInfo": {...}}'
```

## 📈 **Performance Optimization**

- **Caching**: AI responses cached for 10 minutes
- **Database**: Connection pooling with HikariCP
- **PDF**: Async generation with progress tracking
- **Frontend**: React Query for server state management

## 🔒 **Security**

- **JWT Validation**: Clerk JWT tokens verified on every request
- **CORS**: Configured for production domains
- **Input Validation**: All inputs validated with Bean Validation
- **SQL Injection**: Protected with JPA parameterized queries

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

## 🆘 **Support**

For support, please open an issue on GitHub or contact the development team.

---

**Current Status**: Express.js version is functional and ready for testing. Spring Boot migration is prepared and ready for deployment. Next.js frontend migration is the next priority. 