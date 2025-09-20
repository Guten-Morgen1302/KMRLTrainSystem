# Metro Yukthi - Train Induction Support System

## Overview

Metro Yukthi is a government portal website for KMRL (Kochi Metro Rail Limited) that showcases an AI-powered train induction support system. The application is designed as a modern, professional landing page that presents the train allocation and scheduling solution with government-standard design principles. The system automates the complex process of determining which trains should be inducted for service, placed on standby, or sent for maintenance, replacing manual planning with AI-driven decision making.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend-Only Architecture
The application is built as a pure frontend solution using React with TypeScript, designed for static deployment on platforms like Vercel. The architecture supports both frontend-only mode and full-stack mode, though the current implementation focuses on the presentation layer.

**Core Technologies:**
- **React 18** with TypeScript for component architecture
- **Vite** as the build tool and development server
- **Tailwind CSS** with custom design system for government-standard styling
- **Framer Motion** for professional animations and transitions
- **Radix UI** components for accessible, government-compliant interfaces

### Design System
The application implements a comprehensive design system based on government website standards:

**Color Palette:** Monochrome government standard with teal accent colors
- Primary colors use HSL values for consistent theming
- Support for both light and dark themes
- Professional color scheme suitable for government portals

**Typography:** Inter font family with structured hierarchy
- Conservative weight distribution (400-700)
- Government-style professional presentation
- Optimized for readability and accessibility

**Component Architecture:** Government-standard UI components
- Shadcn/ui component library as the foundation
- Custom Metro-themed loading animations
- Professional card layouts and form controls

### Internationalization Support
Built-in support for multiple languages using react-i18next:
- English (default)
- Malayalam (regional language support)
- Language detection and localStorage persistence
- Comprehensive translation system for all UI elements

### Animation and Motion Design
Professional animation system using Framer Motion:
- Government-appropriate timing and easing curves
- Scroll-triggered section reveals
- Metro-themed visual elements (train movements, route animations)
- Accessibility-conscious with reduced motion support
- Custom loading states with railway-inspired animations

### Responsive Design
Mobile-first responsive design approach:
- Tailwind breakpoint system (sm, md, lg, xl)
- Government accessibility standards (WCAG AA compliance)
- Professional layout patterns suitable for official portals

### State Management
Context-based state management for complex interactions:
- Theme management (light/dark/system)
- Language switching state
- Form state management with React Hook Form
- Dashboard simulation state (for interactive demos)

### Build and Deployment
Multiple build configurations for different deployment scenarios:
- **Frontend-only builds** for static hosting (Vercel)
- **Development servers** with hot module replacement
- **Production builds** with optimized bundles
- Custom build scripts for different deployment targets

## External Dependencies

### Core Framework Dependencies
- **React 18** - Frontend framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first styling framework

### UI and Component Libraries
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation and motion library
- **Lucide React** - Icon system
- **Class Variance Authority** - Component variant management

### Internationalization
- **react-i18next** - Internationalization framework
- **i18next-browser-languagedetector** - Language detection

### Form Management
- **React Hook Form** - Form state and validation
- **Hookform/resolvers** - Form validation resolvers
- **Zod** - Schema validation (for future backend integration)

### Development and Build Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Future Backend Integration (Prepared)
The codebase includes preparation for backend integration:
- **Drizzle ORM** - Database ORM (configured for PostgreSQL)
- **Neon Database** - Serverless PostgreSQL (prepared but not active)
- **TanStack Query** - Server state management (configured for static mode)

### Deployment Platforms
- **Vercel** - Primary deployment target (configured)
- **Replit** - Development environment support
- Static hosting compatibility for government servers