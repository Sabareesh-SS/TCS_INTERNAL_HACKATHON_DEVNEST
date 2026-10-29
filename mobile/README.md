# Smart Classroom AV Troubleshooting Assistant - Mobile Application (PS 1.5)

Role-based React Native mobile application for Campus AV Incident Management, serving **Faculty** and **Technician** personas with dynamic access control and structured AI troubleshooting.

---

## 1. Architectural Roles & Features

### Role 1: Faculty
- **Secure Authentication:** Dynamic role loading from Supabase `profiles` table.
- **Optical QR Scanning:**
  - Classroom QR (`classroom:<ID>` or JSON) $\rightarrow$ Instantly loads room inventory.
  - Device QR (`device:<ID>` or JSON) $\rightarrow$ Opens exact registered hardware asset.
- **Structured Fault Reporting:** Fast preliminary checks (Power LED, Cable seating) & symptom selection.
- **Deterministic AI Diagnostic Engine:** Sequential step card execution (**strictly non-chatbot**), manual citations, verification prompts, and automated escalation to technician.
- **Incident Audit Trail:** Realtime tracking of reports, attempted checks, and repair statuses.

### Role 2: Technician
- **Field Queue Management:** Categorized tickets (`[NEW]`, `[IN PROGRESS]`, `[AWAITING PARTS]`, `[RESOLVED]`).
- **Pre-Inspection Evidence Viewer:** View all structured checks already executed by faculty to eliminate redundant tests.
- **Repair Checklist:** Hardware inspection checklist with progress metrics and toggles.
- **Repair Logging:** Record root cause, remediation performed, parts required, and inspection photos.
- **Status Progression:** Transition ticket states and notify faculty upon resolution.

---

## 2. Design System & Zero-Emoji Standard

This application strictly complies with an **Executive Minimalist Standard**:
- **Zero Emojis:** Strictly no emojis in titles, buttons, status pills, alerts, or empty states.
- **Deep Slate Palette:** Slate-900 `#0F172A` high-authority base with crisp hairline `#E2E8F0` dividers.
- **Clear Badging:** Uppercase bracketed micro-text status tags (e.g. `[RESOLVED]`, `[IN PROGRESS]`, `[ESCALATED]`, `[CRITICAL]`).
- **Structured Steps:** Cards with step index, directive title, procedural instructions, verification questions, and manual citations.

---

## 3. Directory Structure

```
src/
├── app/
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── FacultyNavigator.tsx
│   │   └── TechnicianNavigator.tsx
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.tsx
│       │   └── ForgotPasswordScreen.tsx
│       ├── shared/
│       │   ├── NotificationsScreen.tsx
│       │   └── ProfileScreen.tsx
│       ├── faculty/
│       │   ├── FacultyHomeScreen.tsx
│       │   ├── QRScannerScreen.tsx
│       │   ├── ClassroomInventoryScreen.tsx
│       │   ├── DeviceDetailsScreen.tsx
│       │   ├── ReportFaultScreen.tsx
│       │   ├── AIDiagnosticScreen.tsx
│       │   ├── MyIncidentsScreen.tsx
│       │   └── IncidentDetailsScreen.tsx
│       └── technician/
│           ├── TechnicianHomeScreen.tsx
│           ├── AssignedTicketsScreen.tsx
│           ├── TicketDetailsScreen.tsx
│           ├── RepairChecklistScreen.tsx
│           ├── RepairNotesScreen.tsx
│           └── UpdateTicketStatusScreen.tsx
├── components/
│   ├── Button.tsx
│   ├── DeviceCard.tsx
│   ├── DiagnosticStepCard.tsx
│   ├── ErrorView.tsx
│   ├── HeaderBar.tsx
│   ├── IncidentCard.tsx
│   ├── LoadingView.tsx
│   ├── StatusBadge.tsx
│   └── TextInputField.tsx
├── services/
│   ├── authService.ts
│   ├── classroomService.ts
│   ├── deviceService.ts
│   ├── diagnosticService.ts
│   ├── incidentService.ts
│   ├── mockData.ts
│   ├── notificationService.ts
│   ├── supabaseClient.ts
│   └── ticketService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useClassroom.ts
│   ├── useIncident.ts
│   └── useNotifications.ts
├── types/
│   ├── auth.ts
│   ├── classroom.ts
│   ├── device.ts
│   ├── diagnostic.ts
│   ├── incident.ts
│   ├── index.ts
│   └── ticket.ts
├── utils/
│   ├── constants.ts
│   ├── qrParser.ts
│   └── validators.ts
└── theme/
    ├── colors.ts
    ├── index.ts
    ├── spacing.ts
    └── typography.ts
```

---

## 4. Setup & Running

### Installation
```bash
npm install
```

### Type Checking & Linting
```bash
npm run typecheck
```

### Running on Android / iOS
```bash
# Start Metro bundler
npm run start

# Launch Android
npm run android

# Launch iOS
npm run ios
```

### Supabase Backend Connection
Configure the following in your environment or `supabaseClient.ts`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```
If not provided, the application runs seamlessly in high-fidelity mock mode for demonstrations and local evaluation.
