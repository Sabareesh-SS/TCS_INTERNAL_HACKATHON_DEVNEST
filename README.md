# Smart Classroom AV Troubleshooting Assistant — AI Engine & Backend Platform

> **AI-Powered Smart Classroom AV Troubleshooting Assistant**  
> **Branch:** `NithyanandamN-4`  
> **Member 3 & 4:** LLM Diagnostic Engine + Evidence-Grounded RAG + ML Classifier + FastAPI Backend + Supabase Database Integration

The **AI Engine (`av-troubleshooter-ai`)** provides the intelligent diagnostic backbone for the campus AV troubleshooting ecosystem. It ingests physical classroom QR scans, performs deterministic machine learning fault triage, retrieves verified OEM manufacturer benchmark manuals, and guides faculty through interactive step-by-step resolution cards. If an issue cannot be resolved on-site, it automatically compiles technician dossiers and escalates tickets in real-time.

---

## 1. Ecosystem Integration

```
                           +------------------------------------------+
                           |       Member 1: Faculty Mobile App       |
                           |   (Sabareesh - QR Scanner & Step Cards)   |
                           +--------------------+---------------------+
                                                |
                                                | HTTP REST API
                                                v
                           +------------------------------------------+
                           |  Member 3 & 4: AI Engine (`Nithyanandam`) |
                           |  - FastAPI Microservice (:8000)          |
                           |  - Zero-Leakage ML Fault Classifier      |
                           |  - RAG Benchmark Knowledge Base (OEM)    |
                           |  - Gemini LLM Diagnostic Engine          |
                           +--------------------+---------------------+
                                                |
                                                | Realtime Sync & DDL
                                                v
+------------------------------------+          +------------------------------------+
|    Member 2: Web Admin Dashboard   | <======> |      Supabase Cloud PostgreSQL     |
| (Mithun - Live Queue & Dispatch)   |          |  (Incidents, Steps, Tickets, Logs) |
+------------------------------------+          +------------------------------------+
```

- **Member 1 (Sabareesh):** Faculty Mobile App (Classroom Door & Device QR scanning, live interactive diagnostic cards, step outcome submission).
- **Member 2 (Mithun):** Administrator & Field Technician Web Dashboard (Live incident stream, ticket dispatch, RAG citation evidence review, hardware parts logging).
- **Member 3 & 4 (Nithyanandam - this branch):** AI Diagnostic Engine, Genuine ML Classifier, RAG OEM Benchmark Retriever, FastAPI Backend, and PostgreSQL Supabase Schema.

---

## 2. Key Capabilities & System Architecture

### 2.1 Genuine Machine Learning Classifier (Zero Leakage)
- **Trained on Domain Data:** Built with `scripts/train_classifier.py` strictly on the 180 samples in the `TRAIN` partition of `data/av_incidents.csv`.
- **Strict Leakage Prevention:** Uses only pre-diagnostic triage inputs (`symptom`, `device_type`, `power_status`, `cable_status`, `input_source`). All post-diagnosis indicators (`recommended_action_id`, `fix_step`, `resolved`, `escalated`) are strictly excluded.
- **Unseen Test Partition Evaluation (N=60):**
  - **Accuracy:** `100.00% (60/60)`
  - **Macro Precision:** `1.0000`
  - **Macro Recall:** `1.0000`
  - **Macro F1-Score:** `1.0000`
  - **Average Confidence:** `99.86%`
  - **Persisted Artifact:** `app/ml/artifacts/fault_classifier.json`

### 2.2 OEM Benchmark Grounding & Negative Retrieval RAG
All troubleshooting procedures correlate demo asset tags (`DEMO-P01` .. `DEMO-S06`) against official manufacturer service manuals:

| Campus Device Family | Asset Range | Official OEM Benchmark Reference | Verified OEM Manual Citation |
| :--- | :--- | :--- | :--- |
| **Projector** | `DEMO-P01` .. `DEMO-P06` | **Epson PowerLite EB-E01 / EB-X06 3LCD** | *Epson User's Guide (CPD-59263)* |
| **Wireless Microphone** | `DEMO-M01` .. `DEMO-M06` | **Shure BLX24 / PG58 Wireless System** | *Shure BLX Wireless System User Guide* |
| **Smart Board** | `DEMO-S01` .. `DEMO-S06` | **Promethean ActivPanel 9 Series** | *Promethean ActivPanel User Guide* |

- **Grounding Integrity:** Every verified knowledge entry (`data/troubleshooting_knowledge_base.csv`) maps directly to exact manufacturer section names, page numbers, and manual URLs.
- **Negative Retrieval Guarantee:** Queries for unsupported devices or out-of-scope symptoms return empty citations (`[]`) and zero score; fake citations or non-OEM instructions are never hallucinated.

### 2.3 Intelligent Diagnostic State Machine & Safety Fallback
- **Multi-Step Progression:** Sequentially progresses faculty through single, unambiguous actions (`VERIFY_INPUT`, `POWER_CYCLE`, `CHECK_AUDIO_RECEIVER`, etc.).
- **Auto-Resolution Detection:** When a step succeeds, marks incident `RESOLVED` and generates a resolution confirmation card.
- **Automated Technician Escalation:** Automatically triggers when either (a) maximum retry steps (3 failures) are exceeded, (b) a hardware failure is detected, or (c) safety thresholds require certified AV technicians.
- **Technician Dossier:** Generates a structured breakdown containing incident history, attempted actions, root causes, recommended replacement parts, and OEM maintenance guides.
- **LLM Safety & Offline Mode:** Integrated with Google Gemini API with seamless deterministic fallback when offline or when API limits are reached.

### 2.4 Cloud Database & Seed Pipeline (Supabase)
- **PostgreSQL DDL (`scripts/supabase_schema.sql`):** Normalized tables for `classrooms`, `devices`, `incidents`, `diagnostic_steps`, and `escalation_tickets` with Row-Level Security (RLS) enabled.
- **Automated Seed Script (`scripts/seed_supabase.py`):** Ingests CSV inventories and incident datasets directly into Supabase via REST/PostgREST.

---

## 3. Technology Stack

- **Backend Framework:** FastAPI (Python 3.10+)
- **Server:** Uvicorn (ASGI)
- **Validation & Schemas:** Pydantic v2
- **Machine Learning:** Scikit-Learn, NumPy, Custom Multi-Feature Classifier
- **Retrieval-Augmented Generation (RAG):** TF-IDF & Vector Similarity Retriever
- **Generative AI:** Google Gemini API (`google-genai` / REST)
- **Database:** Supabase Cloud PostgreSQL
- **Testing:** Pytest, HTTPX (26 integration & unit tests)

---

## 4. Quick Start

### 4.1 Prerequisites
- Python 3.10, 3.11, or 3.12
- Git

### 4.2 Clone & Checkout Branch
```bash
git clone https://github.com/Sabareesh-SS/TCS_INTERNAL_HACKATHON_DEVNEST.git
cd TCS_INTERNAL_HACKATHON_DEVNEST

# Checkout Member 3 branch
git checkout NithyanandamN-4
```

### 4.3 Setup Virtual Environment & Install Dependencies
```bash
# Navigate to the AI service directory
cd av-troubleshooter-ai

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4.4 Environment Configuration
Create a `.env` file in `av-troubleshooter-ai/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted, the engine automatically operates in deterministic offline fallback mode with 100% test suite compatibility).*

### 4.5 Start the Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- **Interactive API Documentation (Swagger UI):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative Documentation (ReDoc):** [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **System Health Probe:** [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

## 5. Running Tests & Utilities

### 5.1 Run the Full Test Suite (26 Tests)
```bash
pytest
```

### 5.2 Retrain the Fault Classifier
```bash
python scripts/train_classifier.py
```

### 5.3 Seed Supabase Cloud Database
```bash
python scripts/seed_supabase.py
```

---

## 6. API Reference

### 6.1 QR Code Scanning & Inventory Resolution

#### Classroom Door QR Scan: `GET /api/inventory/scan/{qr_id}`
- **Example Classroom QR:** `QR-CLS-AB105`
- **Response:** Returns classroom metadata (Block, Floor, Capacity) and all registered AV devices in that room.

#### Device Chassis Asset QR Scan: `GET /api/inventory/scan/{qr_id}`
- **Example Device QR:** `QR-DEV-AV-AB105-P01`
- **Response:** Returns target device specifications, OEM model, serial number, and room context.

---

### 6.2 Interactive Diagnostics: `POST /api/diagnostics/next-step`

#### Request Payload (Step 1):
```json
{
  "incident_id": "INC-2026-001",
  "device_id": "DEV004",
  "device_type": "Projector",
  "model": "DEMO-P02",
  "classroom_id": "CLS002",
  "room_no": "AB-105",
  "symptom": "Projector is on but displays No Signal",
  "power_status": "ON",
  "input_source": "HDMI1",
  "cable_status": "CONNECTED",
  "previous_action_id": null,
  "previous_step_result": null,
  "step_number": 1
}
```

#### Response Payload (Diagnostic Card):
```json
{
  "incident_id": "INC-2026-001",
  "status": "IN_PROGRESS",
  "fault_category": "INPUT_SOURCE_MISMATCH",
  "probable_cause": "Projector input port selection does not match active HDMI cable input",
  "next_action_id": "VERIFY_INPUT",
  "step_number": 1,
  "instruction": "Confirm the source device is awake and press Source Search on the remote or control panel to select the HDMI port matching the connected cable.",
  "expected_result": "Projector displays active input port and synchronizes incoming video signal.",
  "manual_reference": {
    "title": "Epson EB-E01/EB-X06 User Guide",
    "section": "Selecting an Image Source - Page 38",
    "page": null,
    "source_url": "https://files.support.epson.com/docid/cpd5/cpd59263.pdf"
  },
  "escalation_recommended": false,
  "technician_summary": null
}
```

---

### 6.3 Field Dispatch & Telemetry (Web Dashboard Contracts)

- **`GET /api/diagnostics/incidents`**: Returns live telemetry feed of all active, resolved, and escalated incidents.
- **`GET /api/diagnostics/session/{incident_id}`**: Returns the full step-by-step audit trail, timestamps, user inputs, and technician escalation summary.

---

## 7. Verification Test Suite Matrix (26 Passing Tests)

| Test Suite File | Test Objective | Status |
| :--- | :--- | :---: |
| `tests/test_end_to_end.py` | Full multi-step Projector (Resolved), Microphone (Escalated), Smart Board (Touch) | **3 / 3 PASS** |
| `tests/test_concurrency.py` | Simultaneous multi-classroom troubleshooting sessions & state isolation | **1 / 1 PASS** |
| `tests/test_diagnostics.py` | Step progression logic, resolution detection, escalation thresholds, audit trails | **5 / 5 PASS** |
| `tests/test_inventory.py` | Door QR and Device QR resolution, multi-device lookups | **3 / 3 PASS** |
| `tests/test_ml_adapter.py` | Pre-trained classifier inference, feature extraction across all fault categories | **5 / 5 PASS** |
| `tests/test_rag.py` | OEM benchmark retrieval, precision scoring, negative retrieval guarantee | **5 / 5 PASS** |
| `tests/test_llm_safety.py` | Graceful timeout recovery, offline deterministic fallback verification | **2 / 2 PASS** |
| `tests/test_health.py` | System health probe, API root endpoint status | **2 / 2 PASS** |
| **Total** | **All integration & unit tests passing** | **26 / 26 PASS** |

---

## 8. Repository Structure

```
TCS_INTERNAL_HACKATHON_DEVNEST/
├── README.md                               # Root project documentation (this file)
├── .gitignore                              # Root Git ignore rules
└── av-troubleshooter-ai/                   # Member 3 & 4 AI Backend Service
    ├── README.md                           # AI engine component documentation
    ├── requirements.txt                    # Python dependencies
    ├── pytest.ini                          # Test configuration
    ├── .env.example                        # Template environment variables
    ├── app/
    │   ├── main.py                         # FastAPI application entrypoint
    │   ├── config.py                       # Settings & environment variables
    │   ├── api/
    │   │   ├── diagnostics.py              # Diagnostic card & incident endpoints
    │   │   ├── inventory.py                # QR scan & equipment lookup endpoints
    │   │   └── health.py                   # Service health & readiness probes
    │   ├── core/
    │   │   ├── state_machine.py            # Troubleshooting step engine & escalation
    │   │   └── inventory.py                # Classroom & device registry manager
    │   ├── ml/
    │   │   ├── ml_adapter.py               # ML classifier wrapper
    │   │   └── artifacts/
    │   │       ├── fault_classifier.json   # Trained model weights & parameters
    │   │       └── model_metadata.json     # Model training metadata & metrics
    │   ├── rag/
    │   │   └── retriever.py                # Knowledge base TF-IDF & vector retriever
    │   ├── llm/
    │   │   ├── client.py                   # Gemini LLM caller with offline fallback
    │   │   └── prompts.py                  # Grounded prompt templates
    │   ├── db/
    │   │   └── supabase_client.py          # Supabase REST client
    │   └── schemas/
    │       ├── diagnostic.py               # Diagnostic request & response Pydantic models
    │       └── common.py                   # Shared data schemas
    ├── data/
    │   ├── classrooms.csv                  # Classroom registry
    │   ├── device_inventory.csv            # Device registry with OEM benchmark mapping
    │   ├── av_incidents.csv                # 240 incidents (180 train / 60 test)
    │   ├── troubleshooting_knowledge_base.csv # Grounded OEM troubleshooting steps
    │   ├── fault_prediction_results.csv    # Evaluated test set predictions
    │   └── ml_model_evaluation.csv         # ML evaluation metrics report
    ├── scripts/
    │   ├── train_classifier.py             # Script to train & evaluate ML model
    │   ├── seed_supabase.py                # Script to seed Supabase PostgreSQL
    │   └── supabase_schema.sql             # Supabase PostgreSQL DDL schema & RLS
    └── tests/                              # Comprehensive test suite (26 tests)
```

---

## 9. Contributors

- **Member 1:** Sabareesh ([Sabareesh-SS](https://github.com/Sabareesh-SS)) — Faculty Mobile App
- **Member 2:** Mithun ([MithunRS](https://github.com/MithunRS)) — Admin & Technician Web Dashboard
- **Member 3 & 4:** Nithyanandam ([NithyanandamN](https://github.com/NithyanandamN)) — AI Diagnostics Engine, RAG, ML & Backend Platform
