# Infra Command Center - Demo Overview

## Project Description

An **Infrastructure Management Platform** demo showcasing AI-powered defect detection, asset management, contractor matching, and contract automation workflows. Built for Vision 2030 compliance and government/enterprise infrastructure management.

## Tech Stack

- **Frontend**: Next.js 15.4.6 (App Router), React 19.1.0
- **UI**: shadcn/ui, Radix UI, Tailwind CSS v4
- **Icons**: Lucide React
- **State**: React hooks with mock data
- **Auth**: Next.js middleware with cookie-based authentication

## Demo Features Implemented

### ✅ 1. Dashboard (Main Screen)
- **Location**: `/dashboard`
- **Features**:
  - 4 summary cards: Open Detections, Active Contracts, Pending Tenders, SLA Compliance
  - Module navigation tabs
  - Recent detections and active contracts overview
  - Asset health summary with status breakdown
  - Clean, professional UI with color-coded status indicators

### ✅ 2. AI Recognition Module
- **Location**: `/ai-recognition`
- **Features**:
  - Detection table with status, severity, confidence score
  - Color-coded severity badges (Critical: Red, Warning: Orange, Normal: Green)
  - "Validate" button to update detection status from pending → validated
  - Summary cards for critical, warning, and resolved issues
  - Visual workflow diagram showing detection → validation → asset linking → contract creation
  - Mock data: 6 detections with various defect types (crack, pothole, corrosion, etc.)

### ✅ 3. Asset Insight Module
- **Location**: `/assets`
- **Features**:
  - Asset inventory table with category, status, last maintenance, impact score
  - "View Passport" button opens detailed asset modal
  - Asset Passport includes:
    - Material information (primary/secondary materials, manufacturer, installation date)
    - Maintenance history table
    - Compliance indicators (Vision 2030, QCS certification)
    - Related detections linkage
  - Summary cards for operational, maintenance required, and under maintenance assets
  - Mock data: 5 assets (roads, bridges, lighting)

### ✅ 4. Contractors Module
- **Location**: `/contractors`
- **Features**:
  - Contractor directory with scope, SLA compliance, response time, capacity, rating
  - Performance leaderboard showing top 5 contractors
  - "AI Match to Issue" button simulates contractor matching
  - AI matching dialog shows top 3 contractors with:
    - Match score (randomly generated 70-100%)
    - Availability status
    - Estimated response time
    - Estimated cost
  - Summary cards for excellent SLA contractors, avg response time, avg capacity
  - Mock data: 5 contractors with various specializations

### ✅ 5. Contract/Tender Module
- **Location**: `/contracts`
- **Features**:
  - Contract registry table with status tracking
  - "Create Contract" button opens contract creation form
  - Form features:
    - Asset selection dropdown
    - Contractor selection dropdown
    - "Auto Generate" button to populate title/description from asset data
    - SLA terms configuration (response time, completion time)
  - Workflow buttons: Draft → Submit → Approve → Send to Contractor
  - Status-based action buttons (dynamic workflow)
  - Contract details view dialog with full information
  - Visual workflow diagram
  - Mock data: 4 contracts in various states (draft, pending, active, sent)

### ✅ 6. Notifications Panel
- **Location**: `/notifications`
- **Features**:
  - Notification feed with real-time event stream simulation
  - Filter tabs by module (All, AI, Assets, Contractors, Contracts)
  - Priority-based color coding (Urgent: Red, High: Orange, Medium: Blue, Low: Gray)
  - "Mark as Read" individual and bulk actions
  - Unread notification highlighting with blue border
  - Summary cards for unread, urgent, and high priority notifications
  - Notification types info section
  - Mock data: 7 notifications across all modules

## Mock Data Structure

All mock data is located in `/src/data/` with TypeScript types in `/src/types/`:

- **Detections**: `/src/data/mock-detections.ts` (6 entries)
- **Assets**: `/src/data/mock-assets.ts` + asset passports (5 entries)
- **Contractors**: `/src/data/mock-contractors.ts` (5 entries)
- **Contracts**: `/src/data/mock-contracts.ts` (4 entries)
- **Notifications**: `/src/data/mock-notifications.ts` (7 entries)

## Data Flow Simulation

The demo demonstrates the complete workflow:

1. **AI Detection** → New defect detected (e.g., crack on King Fahd Road)
2. **Validation** → Human operator validates detection
3. **Asset Linking** → Detection linked to asset (opens asset passport)
4. **Contractor Matching** → AI suggests top 3 contractors based on scope/performance
5. **Contract Creation** → Auto-generate contract from asset + contractor selection
6. **Approval Workflow** → Draft → Pending Approval → Approved → Sent to Contractor
7. **Notifications** → Real-time updates at each step

## UI/UX Features

- **Clean Design**: White/transparent backgrounds, professional color scheme
- **Color-Coded Status**: Consistent use of colors across modules
  - 🔴 Critical/Destructive: Red (#DC3545)
  - 🟠 Warning/Pending: Orange/Yellow (#FFC107)
  - 🟢 Success/Operational: Green (#28A745)
  - 🔵 In Progress: Blue
- **Responsive Layout**: Mobile-friendly with sidebar collapse
- **Interactive Elements**: Buttons, modals, dialogs, tabs
- **Visual Workflows**: Step-by-step process diagrams
- **Performance Metrics**: Progress bars, ratings, scores

## Bilingual Support (Simulated)

While full bilingual implementation is pending, the structure supports it:
- RTL-ready layout components
- Text can be easily extracted to translation files
- UI components support Arabic text rendering

## Authentication

- Login page at `/login` with form validation
- Protected dashboard routes via middleware
- Session management with cookies
- Auto-redirect to login if not authenticated

## Navigation

Sidebar navigation includes:
- 🏠 Dashboard
- 🧠 AI Recognition
- 🏢 Assets
- 👥 Contractors
- 📄 Contracts
- 🔔 Notifications

## Running the Demo

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

Access the demo at `http://localhost:3000`

## Next Steps for Full Implementation

1. **Backend Integration**:
   - Replace mock data with API calls
   - Implement real-time WebSocket for notifications
   - Database setup (PostgreSQL/MongoDB)

2. **AI Integration**:
   - Computer vision model for defect detection
   - ML-based contractor matching algorithm
   - Predictive maintenance analytics

3. **Bilingual Support**:
   - i18n implementation (English/Arabic)
   - RTL layout finalization
   - Translation management

4. **Advanced Features**:
   - Document upload (images, PDFs)
   - Report generation (PDF export)
   - Analytics dashboard
   - Role-based access control
   - Audit logging

5. **Deployment**:
   - Docker containerization
   - CI/CD pipeline
   - Cloud hosting (Vercel/AWS)
   - Database migration

## Architecture Highlights

- **Feature-based structure**: Auth module in `/src/features/auth`
- **Type safety**: Full TypeScript coverage
- **Reusable components**: shadcn/ui components in `/components/ui`
- **Mock data layer**: Easily swappable with real API
- **Modular routing**: Next.js App Router with route groups

## Demo Compliance

✅ All requirements from the specification implemented:
- AI Recognition with mock detection data ✓
- Asset Insight with asset passports ✓
- Contractor matching with leaderboard ✓
- Contract/Tender creation with workflow ✓
- Notifications panel with filtering ✓
- Dashboard with summary cards ✓
- Clean, professional UI ✓
- Simulated data flow ✓
- Interactive elements ✓

## Contact & Support

For questions or support, refer to the project documentation in `/CLAUDE.md` and `/.cursorrules`.

