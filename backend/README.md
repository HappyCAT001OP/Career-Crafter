# 🚀 Career Crafter Backend - Spring Boot

A production-ready Spring Boot backend for the AI-Powered Resume Builder application.

## 📋 **Features**

### ✅ **Core Features**
- ✅ **Spring Boot 3.2.0** with Java 17
- ✅ **PostgreSQL** integration with JPA
- ✅ **JWT Authentication** with Clerk
- ✅ **RESTful API** with proper HTTP status codes
- ✅ **Global Exception Handling**
- ✅ **CORS Configuration**
- ✅ **Input Validation**
- ✅ **Health Check Endpoints**

### ✅ **AI Integration**
- ✅ **Groq API** integration for AI-powered content generation
- ✅ **Summary enhancement**
- ✅ **Work experience bullet point generation**
- ✅ **Job matching analysis**
- ✅ **Skill gap identification**

### ✅ **PDF Generation**
- ✅ **iText 7** for professional PDF generation
- ✅ **Multiple resume templates**
- ✅ **Cloudinary integration** for PDF storage
- ✅ **Public sharing URLs**

### ✅ **Database Features**
- ✅ **Complete JPA entities** (User, Resume, WorkExperience, Education, Skills)
- ✅ **Repository pattern** with custom queries
- ✅ **Transactional operations**
- ✅ **Data validation**

## 🏗️ **Architecture**

```
backend/
├── src/main/java/com/careercrafter/
│   ├── CareerCrafterApplication.java    # Main application class
│   ├── config/                          # Configuration classes
│   │   ├── SecurityConfig.java         # Security configuration
│   │   └── CorsConfig.java             # CORS configuration
│   ├── controller/                      # REST controllers
│   │   ├── ResumeController.java       # Resume CRUD operations
│   │   ├── AIController.java          # AI enhancement endpoints
│   │   ├── PDFController.java         # PDF generation endpoints
│   │   └── HealthController.java      # Health check endpoints
│   ├── service/                         # Business logic
│   │   ├── ResumeService.java         # Resume business logic
│   │   ├── AIService.java            # AI integration
│   │   ├── PDFService.java           # PDF generation
│   │   └── CloudinaryService.java    # File storage
│   ├── repository/                      # Data access layer
│   │   ├── UserRepository.java        # User data access
│   │   ├── ResumeRepository.java      # Resume data access
│   │   └── ResumeVersionRepository.java # Version control
│   ├── entity/                          # JPA entities
│   │   ├── User.java                  # User entity
│   │   ├── Resume.java                # Resume entity
│   │   ├── WorkExperience.java       # Work experience
│   │   ├── Education.java            # Education
│   │   ├── Skills.java               # Skills
│   │   └── ResumeVersion.java        # Version control
│   ├── dto/                            # Data transfer objects
│   │   ├── ResumeRequest.java        # Resume creation/update
│   │   ├── ResumeResponse.java       # Resume response
│   │   ├── AIRequest.java           # AI enhancement requests
│   │   └── AIResponse.java          # AI responses
│   ├── security/                        # Security components
│   │   ├── JwtAuthenticationProvider.java # JWT validation
│   │   └── JwtAuthenticationFilter.java  # JWT filter
│   └── exception/                       # Custom exceptions
│       ├── GlobalExceptionHandler.java   # Global error handling
│       ├── ResourceNotFoundException.java
│       ├── UnauthorizedException.java
│       ├── ForbiddenException.java
│       └── ValidationException.java
├── src/main/resources/
│   └── application.yml                  # Application configuration
├── pom.xml                             # Maven dependencies
├── Dockerfile                          # Docker configuration
├── render.yaml                         # Render deployment
└── env.example                         # Environment variables
```

## 🚀 **Quick Start**

### **Prerequisites**
- Java 17 or higher
- Maven 3.6+
- PostgreSQL database
- Groq API key
- Clerk authentication setup
- Cloudinary account

### **1. Clone and Setup**
```bash
# Clone the repository
git clone https://github.com/your-username/career-crafter.git
cd career-crafter/backend

# Install dependencies
mvn clean install
```

### **2. Environment Configuration**
```bash
# Copy environment example
cp env.example .env

# Edit .env with your configuration
nano .env
```

### **3. Database Setup**
```bash
# Create PostgreSQL database
createdb careercrafter

# Run migrations (if using Flyway)
mvn flyway:migrate
```

### **4. Run the Application**
```bash
# Development mode
mvn spring-boot:run

# Or build and run
mvn clean package
java -jar target/career-crafter-backend-1.0.0.jar
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/careercrafter
DB_USERNAME=postgres
DB_PASSWORD=password
DDL_AUTO=validate

# Server Configuration
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_ISSUER_URL=https://clerk.your-domain.com
CLERK_JWK_SET_URI=https://clerk.your-domain.com/.well-known/jwks.json

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://career-crafter.vercel.app
```

## 📡 **API Endpoints**

### **Health Check**
```
GET /health                    # Application health
GET /api/health               # API health check
```

### **Resume Management**
```
POST   /api/resumes           # Create new resume
GET    /api/resumes           # Get user resumes
GET    /api/resumes/{id}      # Get specific resume
PUT    /api/resumes/{id}      # Update resume
DELETE /api/resumes/{id}      # Delete resume
GET    /api/resumes/paginated # Get resumes with pagination
GET    /api/resumes/search    # Search resumes
GET    /api/resumes/statistics # Get resume statistics
```

### **AI Enhancement**
```
POST /api/ai/enhance-summary     # Enhance resume summary
POST /api/ai/generate-bullets    # Generate work experience bullets
POST /api/ai/analyze-job         # Analyze job description
POST /api/ai/skill-gap           # Identify skill gaps
```

### **PDF Generation**
```
POST /api/pdf/generate           # Generate PDF resume
POST /api/pdf/upload             # Upload PDF to Cloudinary
GET  /api/pdf/{id}/download      # Download PDF
GET  /api/pdf/public/{shareUrl}  # Public PDF access
```

### **Version Control**
```
GET /api/resumes/{id}/versions   # Get resume versions
POST /api/resumes/{id}/versions  # Create new version
GET /api/resumes/{id}/versions/{versionId} # Get specific version
```

## 🔐 **Authentication**

The application uses **Clerk** for authentication with JWT tokens:

1. **Frontend** authenticates users with Clerk
2. **JWT tokens** are sent in Authorization header
3. **Backend** validates tokens using Clerk's JWK set
4. **User information** is extracted from JWT claims

### **JWT Token Format**
```
Authorization: Bearer <jwt_token>
```

## 🗄️ **Database Schema**

### **Core Entities**
- **User**: User information and authentication
- **Resume**: Main resume data
- **PersonalInfo**: Personal information
- **WorkExperience**: Work history
- **Education**: Educational background
- **Skills**: Skills and competencies
- **ResumeVersion**: Version control for resumes

### **Relationships**
- User → Resume (One-to-Many)
- Resume → PersonalInfo (One-to-One)
- Resume → WorkExperience (One-to-Many)
- Resume → Education (One-to-Many)
- Resume → Skills (One-to-Many)
- Resume → ResumeVersion (One-to-Many)

## 🐳 **Docker Deployment**

### **Build Docker Image**
```bash
# Build the image
docker build -t career-crafter-backend .

# Run the container
docker run -p 8080:8080 \
  -e DATABASE_URL=your_db_url \
  -e GROQ_API_KEY=your_groq_key \
  career-crafter-backend
```

### **Docker Compose**
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=jdbc:postgresql://db:5432/careercrafter
      - GROQ_API_KEY=${GROQ_API_KEY}
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=careercrafter
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🚀 **Production Deployment**

### **Render Deployment**
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### **Environment Variables for Production**
```bash
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

## 🧪 **Testing**

### **Run Tests**
```bash
# Run all tests
mvn test

# Run specific test
mvn test -Dtest=ResumeControllerTest

# Run with coverage
mvn jacoco:prepare-agent test jacoco:report
```

### **API Testing**
```bash
# Health check
curl http://localhost:8080/api/health

# Get resumes (with JWT token)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8080/api/resumes
```

## 📊 **Monitoring**

### **Health Checks**
- `/health`: Application health
- `/api/health`: API health with detailed status

### **Logging**
- Application logs: `com.careercrafter`
- Security logs: `org.springframework.security`
- SQL logs: `org.hibernate.SQL`

### **Metrics**
- Spring Boot Actuator endpoints
- Custom business metrics
- Performance monitoring

## 🔧 **Development**

### **IDE Setup**
1. Import as Maven project
2. Set Java 17 as project SDK
3. Configure environment variables
4. Run `CareerCrafterApplication.java`

### **Hot Reload**
```bash
# Enable devtools for hot reload
mvn spring-boot:run
```

### **Database Migrations**
```bash
# Generate migration
mvn flyway:migrate

# Rollback migration
mvn flyway:rollback
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **Database Connection**
   ```bash
   # Check database connectivity
   psql -h localhost -U postgres -d careercrafter
   ```

2. **JWT Validation**
   ```bash
   # Verify Clerk configuration
   curl https://clerk.your-domain.com/.well-known/jwks.json
   ```

3. **CORS Issues**
   ```bash
   # Check CORS configuration
   curl -H "Origin: http://localhost:3000" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS http://localhost:8080/api/resumes
   ```

## 📚 **Additional Resources**

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [JPA Documentation](https://spring.io/projects/spring-data-jpa)
- [Clerk Documentation](https://clerk.com/docs)
- [Groq API Documentation](https://console.groq.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

**🎉 Your Spring Boot backend is production-ready and follows best practices!** 