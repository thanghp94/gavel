# GavelFlow - Toastmasters Club Management Platform

## Overview

GavelFlow is a comprehensive web application designed for managing Toastmasters club activities, member progress tracking, and meeting coordination. The platform provides separate interfaces for regular members and executive committee (ExCo) members, with role-based access control and comprehensive meeting management features.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: React Router for client-side navigation
- **State Management**: TanStack React Query for server state management
- **Build Tool**: Vite for development and production builds
- **UI Components**: Comprehensive shadcn/ui component system with Radix UI primitives

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with role-based authentication
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Middleware**: Custom authentication and authorization middleware

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (via Neon serverless)
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- JWT token-based authentication
- Role-based access control (member/exco)
- Protected routes with middleware validation
- Secure password hashing with bcryptjs

### User Management
- User registration with comprehensive profile data
- Role assignment (member/exco)
- Profile management with personal information
- Activity tracking and last login timestamps

### Meeting Management
- Meeting creation and scheduling
- Role assignments for meetings
- Registration system for member participation
- Meeting status tracking (upcoming/completed)
- Location and theme management

### Role System
- Predefined Toastmasters roles (Toastmaster, General Evaluator, etc.)
- Role content management with multi-language support
- Dynamic role assignment for meetings
- Role-specific guidelines and scripts

### Reflection System
- Post-meeting reflection submissions
- Structured questionnaire system
- Member feedback collection
- Meeting evaluation tracking

### Learning Management
- Learning paths and progress tracking
- Resource management (videos, PDFs, content)
- Material categorization and organization
- Progress tracking and achievements

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates credentials against database
3. JWT token generated and returned to client
4. Token stored in localStorage for session persistence
5. Token included in Authorization header for protected requests

### Meeting Registration Flow
1. ExCo creates meeting with date, time, and details
2. Roles are made available for member registration
3. Members register for meetings and select roles
4. System tracks attendance and role assignments
5. Post-meeting reflections collected from participants

### Content Management Flow
1. ExCo creates and manages learning content
2. Content categorized by type and skill level
3. Members access content based on their learning paths
4. Progress tracked and achievements recorded

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe ORM for database operations
- **bcryptjs**: Password hashing and validation
- **jsonwebtoken**: JWT token generation and verification
- **express**: Web framework for API endpoints

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: Accessible UI component primitives
- **react-hook-form**: Form handling and validation
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Dependencies
- **tsx**: TypeScript execution for development
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **drizzle-kit**: Database migration management

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with TypeScript execution via tsx
- **Database**: PostgreSQL 16 via Replit's managed database
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Vite development server with HMR support

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: esbuild compiles TypeScript to ESM in dist/
- **Database**: Neon serverless PostgreSQL for production
- **Deployment**: Replit Autoscale deployment target

### Environment Configuration
- Database connection via DATABASE_URL environment variable
- JWT secret configuration for token security
- Separate development and production build processes

## Recent Changes
- June 25, 2025: Redesigned task management system with database integration
- June 25, 2025: Added teams, team_members, and tasks tables to support team-based organization  
- June 25, 2025: Created separate dashboards for membership and academic teams
- June 25, 2025: Implemented kanban and list view modes for better task visualization
- June 25, 2025: Made task cards compact and lean with improved priority/status indicators
- June 25, 2025: Added team filtering and task assignment capabilities
- June 25, 2025: Implemented meeting report system for speaker evaluations
- June 25, 2025: Added meeting_report table with evaluation fields (Timer, Ah Counter, Grammarian)
- June 25, 2025: Created report button in participant actions for creating speaker evaluations
- June 25, 2025: Built comprehensive report dialog with time tracking and feedback sections
- June 25, 2025: Fixed authentication issues for content management system
- June 25, 2025: Created working ExCo admin account (demo@admin.com / admin123)
- June 25, 2025: Verified content page saving with rich blocks working correctly
- June 25, 2025: Fixed critical syntax errors in AdminContent.tsx and api.ts files
- June 25, 2025: Updated database schema to support rich content blocks with JSONB storage
- June 25, 2025: Enhanced content pages to store structured content blocks instead of plain text
- June 25, 2025: Added support for title, text, image, video, and attachment content types

## Changelog
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.