# Infra Command Center

An **Infrastructure Management Platform** demonstrating AI-powered defect detection, asset management, contractor matching, and contract automation for Vision 2030 compliance.

## 🚀 Features

### Core Modules
- 🧠 **AI Recognition** - Automated infrastructure defect detection with validation workflow
- 🏢 **Asset Management** - Comprehensive asset inventory with digital passports
- 👥 **Contractor Management** - Performance tracking and AI-powered matching
- 📄 **Contract & Tender** - Automated contract generation with approval workflows
- 🔔 **Notifications** - Real-time event stream across all modules
- 📊 **Dashboard** - Executive overview with key metrics and insights

### Technical Features
- ⚡ Next.js 15 with App Router
- 🎨 shadcn/ui components with Tailwind CSS v4
- 🎯 TypeScript (strict mode)
- 🔐 Authentication & protected routes
- 📱 Responsive design
- 🚀 Turbopack for fast development
- 🎭 Mock data layer (easily replaceable with real APIs)

## 🎯 Getting Started

### Prerequisites
- Node.js 20+ (recommended)
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) to access the demo.

### Demo Login
- Navigate to `/login` to authenticate
- Protected routes automatically redirect to login if not authenticated

## 📁 Project Structure

```
├── app/
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main dashboard
│   │   ├── ai-recognition/   # AI detection module
│   │   ├── assets/           # Asset management
│   │   ├── contractors/      # Contractor management
│   │   ├── contracts/        # Contract & tender module
│   │   └── notifications/    # Notification center
│   ├── login/                # Authentication page
│   └── layout.tsx            # Root layout
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── app-sidebar.tsx       # Navigation sidebar
│   └── ...                   # Other components
├── src/
│   ├── features/
│   │   └── auth/             # Authentication feature
│   ├── data/                 # Mock data files
│   ├── types/                # TypeScript type definitions
│   └── lib/                  # API clients & utilities
├── DEMO_OVERVIEW.md          # Detailed demo documentation
└── README.md                 # This file
```

## 🎨 Demo Workflow

The demo showcases a complete end-to-end workflow:

1. **AI Detection** → Defect detected on infrastructure asset
2. **Validation** → Operator validates the detection
3. **Asset Linking** → View full asset passport with history
4. **Contractor Matching** → AI suggests top contractors
5. **Contract Creation** → Auto-generate contract/tender
6. **Approval Flow** → Draft → Pending → Approved → Sent
7. **Notifications** → Real-time updates throughout

## 🔧 Mock Data

All data is simulated using static mock files in `/src/data/`:
- 6 AI detections (various defect types)
- 5 infrastructure assets (roads, bridges, lighting)
- 5 contractors (with performance metrics)
- 4 contracts (in different workflow states)
- 7 notifications (across all modules)

Mock data can be easily replaced with real API calls.

## 🌐 Modules Overview

### Dashboard (`/dashboard`)
- Summary cards with key metrics
- Recent detections and active contracts
- Asset health overview
- Module navigation tabs

### AI Recognition (`/ai-recognition`)
- Detection table with filtering
- Validate detections with one click
- Color-coded severity (Critical/Warning/Normal)
- Confidence scoring

### Assets (`/assets`)
- Asset inventory with status tracking
- Impact score visualization
- Asset Passport modal with:
  - Material information
  - Maintenance history
  - Compliance certifications

### Contractors (`/contractors`)
- Contractor directory with performance metrics
- Performance leaderboard
- AI matching simulation
- SLA compliance tracking

### Contracts (`/contracts`)
- Contract registry
- Create contract form with auto-generation
- Workflow state management
- Approval tracking

### Notifications (`/notifications`)
- Event stream from all modules
- Filter by module type
- Mark as read functionality
- Priority-based highlighting

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- See `DEMO_OVERVIEW.md` for detailed feature documentation

## 🚀 Deployment

The demo can be deployed on:
- **Vercel** (recommended for Next.js)
- **Docker** (containerized deployment)
- **AWS/GCP** (cloud platforms)

```bash
# Build Docker image
docker build -t infra-command-center .
docker run -p 3000:3000 infra-command-center
```

## 📝 Next Steps

For production implementation:
1. Replace mock data with real backend APIs
2. Integrate actual AI/ML models for detection
3. Implement WebSocket for real-time notifications
4. Add bilingual support (English/Arabic)
5. Deploy to production infrastructure

See `DEMO_OVERVIEW.md` for the complete roadmap.
