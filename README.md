# TSCAI — Smart Classroom AV Support Platform (Web Dashboard)

> **AI-Powered Smart Classroom AV Troubleshooting Assistant**  
> **Member 2:** React.js Web Dashboard (Administrator Operations & Field Dispatch)

The TSCAI Web Dashboard provides a centralized, real-time command center for campus AV administrators to monitor smart classrooms, review AI-grounded diagnostics, dispatch field technicians, and govern cryptographic equipment QR registries across the institution.

---

## 1. Key Features

### 1.1 Centralized Incident Queue & Real-Time Telemetry
- **Live Supabase Realtime Feed:** Instantaneous WebSocket ticket synchronization with visual pulse alerts.
- **Multi-Dimensional Filters:** Filter incidents by status (`unassigned`, `in_progress`, `resolved`), priority (`critical`, `high`, `medium`, `low`), device family, and classroom facility.
- **Incident Injection Simulator:** Built-in telemetry simulator to test incoming incident alerts in real time.

### 1.2 AI Diagnostics & Evidence-Grounded Troubleshooting
- **AI Probable Cause Hypothesis:** Instant root-cause identification correlated against OEM benchmarks (Epson, Shure, Crestron, Promethean).
- **Hypothesis Verification Safeguard:** Unverified hypotheses are strictly flagged as provisional until field technician or administrator physical inspection.
- **Diagnostic Evidence Dossier:** Visualizes AI confidence scores, faculty troubleshooting steps already attempted, exact OEM manual citations (with page numbers and sections), and live telemetry metrics.

### 1.3 Administrator Dispatch & Access Control (RBAC)
- **Admin-Only Web Dashboard:** Strictly dedicated to campus AV administrators (`Dr. Sarah Chen, Campus AV Operations Director`).
- **Field Technician Dispatch Roster:** Instant one-click dispatch and reassignment of active tickets to on-duty field technicians (`Alex Rivera`, `Marcus Vance`, `Elena Rostova`).
- **Root Cause & Replacement Parts Logging:** Field audit logging modal capturing verified causes, technician notes, and required hardware components.

### 1.4 Cryptographic QR Code Registry & Label Print Suite
- **Dual Tagging Hierarchy:** High-density vector QR generation for both Classroom Facility Entrance Tags and Device Chassis Tags.
- **Asset URL Resolution:** Generates standard deep links (`/resolve/classroom/{token}` and `/resolve/device/{token}`).
- **Print & Export Ready:** Instant SVG/PNG downloads with formatted sticker templates including asset IDs and instructions.
- **Token Rotation & Revocation:** One-click cryptographic secret token rotation for security lifecycle compliance.

### 1.5 Campus Asset & Facility Telemetry
- **Classroom Directory:** Health status, active fault counts, installed AV matrices, and maintenance history.
- **Device Inventory:** Asset tags, serial numbers, firmware versions, IP addresses, MAC addresses, and uptime telemetry.
- **Recurring Fault Analytics:** Visual breakdown of high-frequency fault rooms, MTTR benchmarks, and recurring failure modes.
- **Verified Troubleshooting Knowledge Base:** Searchable RAG knowledge base of manufacturer-approved procedures.

---

## 2. Technology Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Tooling:** Vite 8
- **Styling:** Tailwind CSS v4 (Light neutral aesthetic, zero linear gradients, solid borders, dark typography)
- **Icons:** Lucide React
- **QR Generation:** `qrcode.react`
- **Backend / Realtime:** Supabase Client & Simulated Realtime Broadcast Channel

---

## 3. Quick Start

### 3.1 Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 3.2 Installation
```bash
# Clone the repository
git clone https://github.com/Sabareesh-SS/TCS_INTERNAL_HACKATHON_DEVNEST.git
cd TCS_INTERNAL_HACKATHON_DEVNEST

# Checkout the Member 2 branch
git checkout MithunRS-1

# Install dependencies
npm install --legacy-peer-deps
```

### 3.3 Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173/`.

### 3.4 Production Build
```bash
npm run build
```
Outputs optimized production assets to the `dist/` directory.

---

## 4. Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DiagnosticEvidence.tsx    # AI confidence, RAG citations, telemetry
│   ├── IncidentTable.tsx         # Incident queue table with quick dispatch
│   ├── LiveIncidentFeedToast.tsx # Real-time alert notifications
│   ├── MetricCard.tsx            # KPI metric cards with monospace counters
│   ├── QRCodePreview.tsx         # Vector QR generator, SVG export, print
│   ├── RecordFindingsModal.tsx   # Root cause, notes & parts modal
│   ├── Sidebar.tsx               # Admin navigation
│   ├── StatusBadge.tsx           # Status, priority & health pill badges
│   └── Topbar.tsx                # Page header, realtime status & simulation
├── context/             # Global React state
│   ├── AuthContext.tsx           # Administrator role session
│   └── IncidentContext.tsx       # Live incident state & real-time sync
├── pages/               # Application views
│   ├── analytics/                # Telemetry & recurring fault reports
│   ├── classrooms/               # Registered halls & facilities
│   ├── dashboard/                # Central administrative command center
│   ├── devices/                  # Equipment & asset inventory
│   ├── incidents/                # Queue list & detailed investigation
│   ├── knowledge-base/           # OEM RAG troubleshooting articles
│   ├── profile/                  # Administrator station & credentials
│   ├── qr-management/            # QR Code Hub & sticker printing
│   ├── settings/                 # Network & security configuration
│   └── users/                    # Admin access & field technician roster
├── services/            # Mock datasets & business logic
│   ├── analyticsService.ts
│   ├── authService.ts
│   ├── classroomService.ts
│   ├── deviceService.ts
│   ├── incidentService.ts
│   ├── knowledgeService.ts
│   ├── qrService.ts
│   └── supabaseClient.ts
├── types/               # TypeScript interfaces & domain models
└── App.tsx              # Main application shell & router
```

---

## 5. Team Integration

- **Member 1 (Sabareesh):** Faculty Mobile App (QR Scanner & Quick Diagnosis)
- **Member 2 (Mithun - this repository):** React Web Dashboard (Administrator & Dispatcher)
- **Member 3 & 4 (Nithyanandam):** LLM Diagnostic Engine & RAG Backend (`av-troubleshooter-ai`)
