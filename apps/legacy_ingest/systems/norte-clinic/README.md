# Medical CRM & Chatbot

A comprehensive SaaS for medical contact management with automated AI triage and Google Calendar integration.

## Features
- **CRM**: Manage patients, contacts, and medical history.
- **AI Chatbot**: Automated triage using Gemini 3 High (via LangChain) to assess urgency and specialty.
- **Smart Scheduling**: Bidirectional sync with Google Calendar.
- **Secure**: JWT Authentication, Role-based access, Audit logs.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS, TanStack Query.
- **Backend**: FastAPI, SQLAlchemy, Pydantic, APScheduler.
- **Database**: PostgreSQL (Data), MongoDB (Logs/Chat), Redis (Queue/Cache).
- **DevOps**: Docker Compose.

## quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.10+

### Setup

1. **Start Databases**
   ```bash
   docker-compose up -d
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API Docs: http://localhost:8000/docs

## Documentation
- [Tech Stack Guide](GUIDE_TECH_STACK.md): Detailed explanation of technologies used.
- [Project Structure](GUIDE_FILES.md): Overview of files and folders.
- [Customization Guide](GUIDE_CUSTOMIZATION.md): Branding and setting changes.
- [Testing Guide](TESTING_GUIDE.md): How to run tests and debug.
- [Deployment Guide](DEPLOYMENT_GUIDE.md): Deploying to production.

## Environment Variables
Create a `.env` file in `backend/` based on `.env.example`.
Required: `GOOGLE_API_KEY` for Chatbot.
