# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Infra Command Center** is an Infrastructure Management Platform demonstrating AI-powered defect detection, asset management, contractor matching, and contract automation workflows. Built with Next.js 15, the platform showcases Vision 2030-compliant infrastructure monitoring and maintenance capabilities with a modern, interactive dashboard interface.

### Core Modules
1. **AI Recognition** - Automated infrastructure defect detection with validation
2. **Asset Management** - Digital asset passports with maintenance history
3. **Contractor Management** - Performance tracking and AI-powered matching
4. **Contract & Tender** - Automated contract generation with approval workflows
5. **Notifications** - Real-time event stream across all modules
6. **Dashboard** - Executive overview with key metrics

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Tech Stack

### Core
- **Next.js 15.4.6** with App Router and Turbopack
- **React 19.1.0** with Server Components (RSC)
- **TypeScript 5** with strict mode

### UI & Styling
- **Tailwind CSS v4** - Uses new `@import "tailwindcss"` syntax
- **shadcn/ui** - Component system with "new-york" style
- **Radix UI** - Headless component primitives
- **Lucide React** - Icon library
- **Motion (Framer Motion)** - Animations
- **next-themes** - Theme system (default: dark mode)

### Color System
- Uses OKLCH color space for consistent color rendering
- CSS custom properties for theming
- Full dark/light mode support with system detection

## Architecture

### Route Structure

The application uses Next.js 15 App Router with route groups:

```
app/
├── layout.tsx                    # Root layout (theme provider, fonts)
├── page.tsx                      # Landing page
├── login/                        # Authentication page
├── globals.css                   # Tailwind + theme variables
└── (dashboard)/                  # Protected route group for authenticated pages
    ├── layout.tsx                # Dashboard layout (sidebar + auth check)
    ├── dashboard/                # Main dashboard with summary cards
    ├── ai-recognition/           # AI defect detection module
    ├── assets/                   # Asset management with passports
    ├── contractors/              # Contractor management & matching
    ├── contracts/                # Contract & tender creation
    └── notifications/            # Notification center
```

**Key Patterns**: 
- The `(dashboard)` route group provides consistent sidebar navigation and authentication protection
- All dashboard routes are protected by middleware (redirect to `/login` if not authenticated)
- Mock data files in `/src/data/` simulate backend APIs

### Data & Type Organization

**Mock Data Layer** (`/src/data/`):
- `mock-detections.ts` - AI detection records
- `mock-assets.ts` - Infrastructure assets and passports
- `mock-contractors.ts` - Contractor profiles
- `mock-contracts.ts` - Contract/tender records
- `mock-notifications.ts` - System notifications

**Type Definitions** (`/src/types/`):
- `detection.ts` - AI detection types
- `asset.ts` - Asset and passport types
- `contractor.ts` - Contractor and matching types
- `contract.ts` - Contract and tender types
- `notification.ts` - Notification types

### Component Organization

Follow the **feature-based organization** pattern (see `.claude/docs/file-structure-guidelines.md`):

**Use feature-based structure when:**
- Feature has 3+ components
- Feature has custom hooks or specific business logic
- Feature is relatively self-contained
- Feature has its own API endpoints

**Recommended structure:**
```
src/features/[feature-name]/
├── components/       # Feature-specific components
├── hooks/           # Feature-specific hooks
├── services/        # API calls and business logic
├── stores/          # Feature state
├── utils/           # Feature utilities
├── types/           # Feature types
└── index.ts         # Public API exports
```

**Global directories** (use only for truly shared code):
- `components/ui/` - Reusable shadcn/ui components
- `components/` - Shared feature components (AppSidebar, NavMain, etc.)
- `lib/utils.ts` - Utility functions like `cn()`

### Styling Approach

- **Tailwind v4**: Uses new architecture with `@theme inline` directive
- **CSS Variables**: Extensive theming via custom properties
- **Component Variants**: Type-safe variants with `class-variance-authority`
- **Utility Function**: Use `cn()` from `@/lib/utils` for className merging

### Current Features

**Dashboard Interface:**
- `AppSidebar` - Collapsible sidebar with navigation
- `NavMain` - Main navigation items
- `NavUser` - User profile display
- Two admin sections: Early Access Users and Waitlist

**Landing Page:**
- Hero section with call-to-action buttons
- Links to dashboard and waitlist sections

## shadcn/ui Configuration

Components use "new-york" style with these conventions:
- RSC-compatible (use `"use client"` directive when needed)
- CSS variables for theming (`--color-*` tokens)
- Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`
- Base color: neutral
- Icon library: lucide-react

## Custom Slash Commands

This project has custom Claude Code commands in `.claude/commands/`:

- `/generate-commit` - Generate commit messages with JIRA ticket format
- `/do-commit` - Execute git commit using generated message
- `/generate-pr-summary` - Create PR title and description following project conventions

### PR Naming Convention

Format: `Keyword $JIRA-TICKET [FeatureName] Short summary`

**Keywords:** Add, Remove, Refactor, Bugfix, Bump, Build, Document, Localize, Revert

Example: `Add VE-1234 [AdminDashboard] Early access user management page`

See `.claude/docs/pr-title-guidelines.md` for complete guidelines.

### JIRA Integration

- JIRA tickets follow format: `VE-XXXX`
- Branch naming: `ve-1234/feature/description`
- JIRA URLs: `https://volindo-software.atlassian.net/browse/VE-XXXX`
- Staging URLs: `https://{branch-suffix}.app.bookorp.com/`

See `.claude/docs/jira-and-staging-links-schema.md` for URL patterns.

## Development Patterns

### Creating Components

```tsx
// Use cn() for className merging
import { cn } from "@/lib/utils"

export function Component({ className, ...props }) {
  return (
    <div className={cn("base-classes", className)} {...props} />
  )
}
```

### Theme-Aware Components

```tsx
// Components automatically adapt to theme via CSS variables
<div className="bg-background text-foreground border-border">
  Content adapts to light/dark theme
</div>
```

### Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Components will be added to `components/ui/` with proper configuration.

### Sidebar Navigation

The `AppSidebar` component (app-sidebar.tsx:44-73) manages navigation state. To add new pages:

1. Add route in `app/(dashboard)/[page-name]/page.tsx`
2. Update navigation data in `AppSidebar` component
3. Import appropriate Lucide icon

## TypeScript Configuration

- Strict mode enabled
- Path mapping: `@/*` maps to project root
- Target: ES2017
- Module resolution: bundler

## Important Notes

- **Hydration Warning Suppressed**: Root layout uses `suppressHydrationWarning` for theme switching
- **Font Loading**: Geist Sans and Geist Mono loaded via `next/font`
- **Default Theme**: Dark mode with system detection enabled
- **Merge Strategy**: Project uses "Squash & Merge" for PRs
- **Development Server**: Uses Turbopack for faster builds
