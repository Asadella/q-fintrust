# Q-FinTrust Frontend

A modern React-based dashboard application for managing SME (Small and Medium Enterprise) and Investor interactions in the FinTrust lending ecosystem.

## Features

- **SME Dashboard**: Comprehensive view of SME profiles and readiness assessments
- **Investor Dashboard**: Portfolio management and loan matching interface
- **Readiness Score Panels**: Visual representation of SME readiness metrics
- **ESG Panel**: Environmental, Social, and Governance compliance tracking
- **12-Month Forecast Chart**: Financial projections and trends
- **Status Cards**: Fraud detection, anomaly detection, blockchain, and RBAC status indicators
- **Loan Matching Table**: Intelligent matching of loans to borrowers
- **Investor Matching Table**: Connection of investors to opportunities
- **Mock Data**: Placeholder data for development (replaceable with real module outputs)

## Tech Stack

**Frontend:**
- React 18
- Vite (fast build tool)
- Recharts (charting library)
- Lucide React (icon library)

**Backend:**
- Python 3
- FastAPI
- Uvicorn (ASGI server)
- Pydantic (data validation)

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── AddSmeForm.jsx
│   │   ├── InvestorDashboard.jsx
│   │   ├── KpiCard.jsx
│   │   ├── SmeDashboard.jsx
│   │   └── Table.jsx
│   ├── data/                # Mock data and profiles
│   │   ├── backendProfiles.json
│   │   └── mockData.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── styles.css           # Global styles
├── backend/                 # Python backend
│   ├── app.py               # FastAPI application
│   ├── scoring.py           # Scoring logic
│   ├── generate_backend_profiles.py
│   └── requirements.txt
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
└── package.json             # Frontend dependencies
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- Git

### Installation

**Frontend:**
```bash
# Install dependencies
npm install
```

**Backend:**
```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

## Running the Application

### Development Mode

**Start the Frontend (in project root):**
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Start the Backend (in project root):**
```bash
cd backend
# Ensure virtual environment is activated
python -m uvicorn app:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`

### Production Build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Components

- **SmeDashboard.jsx** - Main SME interface
- **InvestorDashboard.jsx** - Main Investor interface
- **KpiCard.jsx** - KPI metric display cards
- **Table.jsx** - Reusable data table component
- **AddSmeForm.jsx** - Form for adding new SME profiles

## Development Notes

- Mock data is currently used for development and can be replaced with real API responses
- The backend provides scoring and profile generation endpoints
- Components use Recharts for data visualization and Lucide React for icons

## License

Proprietary - Q-FinTrust Project