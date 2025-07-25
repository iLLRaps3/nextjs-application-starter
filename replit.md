# CrystalMind - AI Scenario Simulator

## Overview

CrystalMind is a full-stack web application that allows users to analyze hypothetical scenarios using AI models. The application provides comprehensive scenario analysis including entity identification, timeline prediction, and research source compilation through integration with Groq's AI models.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **API Integration**: Groq API for AI-powered scenario analysis

### Key Components

#### Database Schema
The application uses a PostgreSQL database with the following main entities:
- **Scenarios**: Stores scenario analyses with title, description, model used, and analysis results
- **Users**: Basic user management (prepared but not fully implemented)

#### AI Integration
- **Groq API**: Primary AI service for scenario analysis
- **Multiple Models**: Support for various Groq models (llama-3.3-70b-versatile, compound-beta, etc.)
- **Analysis Features**: 
  - Entity identification and impact assessment
  - Timeline prediction with likelihood scoring
  - Research source compilation (web search and code analysis)

#### Frontend Components
- **Scenario Analyzer**: Main input interface for scenario submission
- **Results Display**: Comprehensive visualization of analysis results
- **Example Scenarios**: Pre-built scenario templates for quick testing
- **Model Selection**: Interface for choosing AI models

## Data Flow

1. **User Input**: User enters scenario description and selects analysis options
2. **API Validation**: Groq API key is validated before analysis
3. **AI Processing**: Scenario is sent to Groq API for analysis
4. **Result Processing**: AI response is parsed and structured
5. **Database Storage**: Analysis results are optionally stored in PostgreSQL
6. **Frontend Display**: Results are rendered with interactive components

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library

### AI & Analysis
- **Groq API**: External AI service for scenario analysis
- **Zod**: Runtime type validation and schema definition

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot reload and fast refresh
- **TypeScript Compilation**: Real-time type checking
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Frontend**: Vite builds React app to static files
- **Backend**: ESBuild bundles server code to single file
- **Database**: Neon Database provides serverless PostgreSQL
- **Environment Variables**: DATABASE_URL required for database connection

### File Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utility functions and API clients
│   │   └── hooks/          # Custom React hooks
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Database abstraction layer
│   └── vite.ts             # Development server setup
├── shared/                 # Shared TypeScript types and schemas
└── migrations/             # Database migration files
```

## Changelog

```
Changelog:
- July 06, 2025. Initial setup with React frontend and Express backend
- July 06, 2025. Added PostgreSQL database integration with Drizzle ORM
- July 06, 2025. Implemented scenario storage and recent scenarios display
- July 06, 2025. Added local problem analysis with multiple subjects support
- July 06, 2025. Enhanced UI with tabs interface for global vs local scenarios
- July 06, 2025. Updated database schema to support subjects array and problem types
- July 06, 2025. Created comprehensive application critique and improvement roadmap
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```