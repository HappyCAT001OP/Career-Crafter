# Career Crafter - Migration Plan

## 🎯 **Current State → Target State**

### Current Architecture:
- **Backend**: Express.js + TypeScript + Drizzle ORM
- **Frontend**: React + Vite + Wouter
- **Auth**: Replit Auth (OpenID Connect)
- **Database**: PostgreSQL (Neon)
- **AI**: Groq API ✅
- **PDF**: Placeholder service

### Target Architecture:
- **Backend**: Spring Boot (Java) + JPA
- **Frontend**: Next.js + Tailwind CSS
- **Auth**: Clerk (OAuth + JWT)
- **Database**: PostgreSQL (Neon) ✅
- **AI**: Groq API ✅
- **PDF**: iText/PDFBox + Cloudinary
- **Deployment**: Render (Backend) + Vercel (Frontend)

## 📋 **Migration Steps**

### Phase 1: Backend Migration (Spring Boot)

#### 1.1 Create Spring Boot Project Structure
```
backend/
├── src/main/java/com/careercrafter/
│   ├── CareerCrafterApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── DatabaseConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ResumeController.java
│   │   ├── AIController.java
│   │   └── PDFController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ResumeService.java
│   │   ├── AIService.java
│   │   ├── PDFService.java
│   │   └── CloudinaryService.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── ResumeRepository.java
│   │   └── ResumeVersionRepository.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── Resume.java
│   │   ├── PersonalInfo.java
│   │   ├── WorkExperience.java
│   │   ├── Education.java
│   │   ├── Skills.java
│   │   └── ResumeVersion.java
│   ├── dto/
│   │   ├── AuthRequest.java
│   │   ├── ResumeRequest.java
│   │   ├── AIRequest.java
│   │   └── PDFRequest.java
│   └── exception/
│       ├── GlobalExceptionHandler.java
│       └── CustomExceptions.java
├── src/main/resources/
│   ├── application.yml
│   └── application-prod.yml
├── pom.xml
└── Dockerfile
```

#### 1.2 Database Schema Migration
- Convert Drizzle schema to JPA entities
- Maintain existing PostgreSQL structure
- Add version control tables

#### 1.3 Authentication Migration
- Replace Replit Auth with Clerk JWT verification
- Implement JWT token validation middleware
- Add user session management

#### 1.4 API Endpoints Migration
- Convert Express routes to Spring Boot controllers
- Implement proper DTOs and validation
- Add comprehensive error handling

### Phase 2: Frontend Migration (Next.js)

#### 2.1 Create Next.js Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── builder/
│   │   ├── auth/
│   │   └── api/
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── resume/
│   │   └── dashboard/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useResume.ts
│   │   └── useAI.ts
│   └── types/
│       ├── auth.ts
│       ├── resume.ts
│       └── api.ts
├── public/
├── next.config.js
├── tailwind.config.js
├── package.json
└── .env.local
```

#### 2.2 Authentication Integration
- Integrate Clerk authentication
- Implement protected routes
- Add user profile management

#### 2.3 Component Migration
- Convert React components to Next.js
- Implement server-side rendering
- Add proper loading states

### Phase 3: Service Integration

#### 3.1 AI Service Enhancement
- Migrate Groq API calls to Java
- Add comprehensive prompt templates
- Implement caching for AI responses

#### 3.2 PDF Generation
- Implement iText/PDFBox for PDF generation
- Create professional resume templates
- Add Cloudinary integration for storage

#### 3.3 Cloudinary Integration
- Image upload functionality
- PDF storage and sharing
- Public link generation

### Phase 4: Deployment Setup

#### 4.1 Backend Deployment (Render)
- Create Dockerfile for Spring Boot
- Configure environment variables
- Set up health checks and monitoring

#### 4.2 Frontend Deployment (Vercel)
- Configure Next.js for Vercel
- Set up Clerk environment variables
- Configure API routes

#### 4.3 Environment Configuration
- Production environment variables
- Database connection strings
- API keys and secrets

## 🔧 **Implementation Priority**

### High Priority (Week 1-2):
1. ✅ Spring Boot backend setup
2. ✅ JPA entity creation
3. ✅ Clerk authentication integration
4. ✅ Basic API endpoints

### Medium Priority (Week 3-4):
1. ✅ PDF generation with iText
2. ✅ Cloudinary integration
3. ✅ Next.js frontend setup
4. ✅ Component migration

### Low Priority (Week 5-6):
1. ✅ Advanced AI features
2. ✅ Performance optimization
3. ✅ Testing and documentation
4. ✅ Production deployment

## 📦 **Dependencies to Add**

### Backend (Spring Boot):
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
    </dependency>
    <dependency>
        <groupId>com.itextpdf</groupId>
        <artifactId>itext7-core</artifactId>
    </dependency>
    <dependency>
        <groupId>com.cloudinary</groupId>
        <artifactId>cloudinary-http44</artifactId>
    </dependency>
</dependencies>
```

### Frontend (Next.js):
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@clerk/nextjs": "^4.0.0",
    "@tanstack/react-query": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "lucide-react": "^0.300.0"
  }
}
```

## 🚀 **Next Steps**

1. **Start with Spring Boot backend** - Create the basic structure and migrate the core functionality
2. **Implement Clerk authentication** - Replace Replit Auth with Clerk JWT verification
3. **Migrate API endpoints** - Convert Express routes to Spring Boot controllers
4. **Set up Next.js frontend** - Create the new frontend structure
5. **Integrate services** - Add PDF generation and Cloudinary
6. **Deploy to production** - Configure Render and Vercel deployments

This migration plan ensures a smooth transition from the current Express.js setup to the production-ready Spring Boot + Next.js architecture while maintaining all existing functionality. 