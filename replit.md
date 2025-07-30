# AI-Powered Resume Builder

## Overview

This is a full-stack web application for building AI-powered resumes. The system allows users to create, edit, and manage professional resumes with AI assistance for content generation and job matching analysis. The application features a modern React frontend with Express.js backend, using PostgreSQL for data persistence and integrating with external AI services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Design
- **Database**: PostgreSQL (Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Tables**: Users, resumes, personal info, work experience, education, skills, job descriptions, resume versions, AI suggestions, and sessions

## Key Components

### Authentication System
- **Provider**: Replit Auth using OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Authorization**: JWT-based user verification with middleware protection
- **User Management**: Automatic user creation and profile management

### Resume Builder Features
- **Personal Information**: Contact details, summary, and social links
- **Work Experience**: Job history with achievements and date ranges
- **Education**: Academic background with achievements
- **Skills**: Categorized skills with proficiency levels
- **Date Handling**: Month/year picker with "present" option for ongoing positions

### AI Integration
- **Service**: Groq API for AI-powered content generation
- **Features**: Resume summary enhancement, job matching analysis, skill gap identification
- **Content Types**: Professional summaries, achievement bullet points, skill recommendations

### PDF Generation
- **Service**: Custom PDF service for resume export
- **Format**: Professional resume layouts with HTML-to-PDF conversion
- **Features**: Download and share functionality

### User Interface
- **Design System**: Custom design with gold/black theme
- **Components**: Reusable UI components from shadcn/ui
- **Responsive**: Mobile-first responsive design
- **Interactions**: Floating action button, modal dialogs, and smooth animations

## Data Flow

### Resume Creation Process
1. User authenticates via Replit Auth
2. User creates new resume or selects existing one
3. User fills out resume sections (personal info, experience, education, skills)
4. System validates and stores data using Drizzle ORM
5. Real-time preview updates as user makes changes
6. AI suggestions generated based on user input and job descriptions

### AI Enhancement Flow
1. User provides job description for analysis
2. System sends resume data and job description to Groq API
3. AI analyzes skill gaps and provides enhancement suggestions
4. Results displayed with actionable recommendations
5. User can apply suggestions to improve resume match

### Export Process
1. User requests PDF generation
2. System compiles resume data into formatted structure
3. PDF service generates professional resume layout
4. File made available for download or sharing

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless connection
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **wouter**: Lightweight React router

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Authentication
- **openid-client**: OpenID Connect implementation
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **typescript**: Type safety
- **vite**: Build tool and dev server
- **tsx**: TypeScript execution
- **esbuild**: Fast bundling for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution
- **Database**: Neon PostgreSQL with connection pooling
- **Environment**: Replit-optimized with specific plugins

### Production Build
- **Frontend**: Vite build to static assets in dist/public
- **Backend**: esbuild bundling to dist/index.js
- **Database**: Migrations via drizzle-kit push
- **Deployment**: Single Node.js process serving both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **GROQ_API_KEY**: AI service authentication
- **REPLIT_DOMAINS**: Authentication domain configuration
- **NODE_ENV**: Environment mode (development/production)

The application follows a modern full-stack architecture with clear separation of concerns, type safety throughout, and production-ready deployment capabilities.