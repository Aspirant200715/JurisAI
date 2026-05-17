# LexGuard 🛡️
**AI-Powered Contract Intelligence & Multi-Agent Legal Analysis Platform**

---

## 📖 Project Overview

**LexGuard** is an advanced, enterprise-grade legal technology platform designed to democratize contract analysis. By leveraging a multi-agent generative AI workflow powered by **Google Cloud Vertex AI (Gemini 1.5 Flash)**, LexGuard acts as an elite legal team, instantly identifying hidden risks, assessing liability exposure, defending corporate interests, translating dense legalese into plain English, and auditing statutory privacy compliance.

Built with a high-performance **FastAPI** backend and a sleek, responsive **Next.js (App Router)** frontend, LexGuard is engineered for seamless local development and robust, scalable cloud deployment on **Google Cloud Run**.

---

## 🏛️ System Architecture & Multi-Agent Pipeline

LexGuard replaces single-prompt AI wrappers with a sophisticated **LangGraph** state machine. When a contract is uploaded, it is systematically processed by five distinct AI personas working in synergy:

```
┌────────────────────────────────────────────────────────┐
│                   Upload Contract                      │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│         Agent 1: The Extractor (Clause Mining)         │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│       Agent 2: The Risk Assessor (Liability Score)     │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│      Agent 3: The Devil's Advocate (Corporate Defense) │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│     Agent 4: The Translator (Plain English Guide)      │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│    Agent 5: The Privacy Scanner (Statutory Audit)      │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│          Consolidated Enterprise Risk Report           │
└────────────────────────────────────────────────────────┘
```

### 🤖 The Five AI Personas
1. **The Extractor**: Scans the raw contract text to identify and isolate potentially exploitative, ambiguous, or one-sided clauses (focusing on Liability, IP, Auto-Renewal, Termination, and Payment terms).
2. **The Risk Assessor**: Evaluates each extracted clause against legal standards, assigning a quantitative risk score (0-10) and providing a detailed justification of liability exposure.
3. **The Devil's Advocate**: Acts as opposing corporate counsel, rigorously defending the contract's terms to determine if they align with industry standards and establishing corporate fairness.
4. **The Translator**: Demystifies complex legal jargon, converting clauses into plain English, explaining real-world financial/personal impacts, and offering actionable negotiation counter-strategies.
5. **The Privacy Scanner**: Conducts a strict statutory compliance audit against data protection frameworks (GDPR, CCPA, HIPAA), flagging unauthorized data sharing, third-party tracking, and data retention violations.

---

## 🗂️ Repository Structure

```text
lexguard/
├── backend/
│   ├── Dockerfile              # Production Dockerfile (Cloud Run optimized)
│   ├── main.py                 # FastAPI application, CORS middleware, upload/health endpoints
│   ├── workflow.py             # LangGraph state machine & Vertex AI Gemini integration
│   ├── agents.py               # Standalone GenAI agent definitions
│   ├── models.py               # Pydantic structured output schemas
│   ├── utils.py                # Document parsing utilities (PDF, DOCX, TXT)
│   ├── requirements.txt        # Python dependency manifest
│   └── data/
│       └── standards.json      # Legal standards database
└── frontend/
    ├── Dockerfile              # Production multi-stage Dockerfile (Standalone Next.js)
    ├── package.json            # Node.js dependency manifest
    ├── next.config.ts          # Next.js configuration (Standalone output mode)
    └── src/
        └── app/
            ├── page.tsx        # Main application dashboard & upload interface
            ├── globals.css     # Tailwind CSS styling utilities
            ├── api/
            │   └── upload/
            │       └── route.ts # Runtime API Route proxying requests to FastAPI
            └── workflow/
                └── page.tsx    # Interactive Multi-Agent Workflow documentation
```

---

## 💻 Local Development Guide

### Prerequisites
- Python 3.10+
- Node.js 20+
- Google Cloud CLI (`gcloud`) installed and configured

### 1. Backend Setup
Navigate to the `backend` directory, create a virtual environment, install dependencies, and start the FastAPI server:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

# Start the local development server
uvicorn main:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000` (Health check: `http://localhost:8000/health`).

### 2. Frontend Setup
Navigate to the `frontend` directory, install dependencies, and start the Next.js development server:

```bash
cd frontend
npm install

# Start the Next.js frontend
npm run dev
```
The application will be accessible in your browser at `http://localhost:3000`.

---

## ☁️ Google Cloud Run Deployment Guide

LexGuard is fully optimized for containerized deployment on Google Cloud Run. Follow these steps in Google Cloud Shell or your local terminal configured with GCP credentials.

### Step 1: Set Up GCP Project & Authentication
Ensure your GCP project is selected and enable the necessary Vertex AI and Cloud Run APIs:

```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud services enable run.googleapis.com cloudbuild.googleapis.com aiplatform.googleapis.com
```

### Step 2: Grant Vertex AI Permissions to Cloud Run
To allow your FastAPI backend to invoke Gemini models on Vertex AI, bind the `roles/aiplatform.user` IAM role to your Cloud Run default compute service account:

```bash
PROJECT_NUMBER=$(gcloud projects describe YOUR_GCP_PROJECT_ID --format="value(projectNumber)")

gcloud projects add-iam-policy-binding YOUR_GCP_PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

### Step 3: Deploy the Backend Service
Deploy the FastAPI backend container directly from source:

```bash
gcloud run deploy lexguard-backend \
  --source backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=YOUR_GCP_PROJECT_ID,GCP_LOCATION=us-central1
```
*Note the deployed service URL generated upon completion (e.g., `https://lexguard-backend-xxxx.a.run.app`).*

### Step 4: Deploy the Frontend Service
Deploy the Next.js frontend container, passing your active backend service URL as a runtime environment variable:

```bash
gcloud run deploy lexguard-frontend \
  --source frontend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars BACKEND_URL="https://lexguard-backend-xxxx.a.run.app"
```

Once the frontend deployment completes, open the provided Cloud Run URL in your browser to experience LexGuard in production!

---

## 🛡️ License & Disclaimer

**Disclaimer**: LexGuard is an AI-powered contract analysis tool designed for educational, informational, and preliminary risk screening purposes. It does not constitute formal legal advice, nor does it establish an attorney-client relationship. Always consult a qualified attorney for formal legal representation and contract execution.
