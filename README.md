# 401(k) Contribution Management

A web application for managing 401(k) contribution settings with real-time projections and calculations.

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+ and npm

### Running Locally

1. **Start the backend:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn server:app --reload --host 127.0.0.1 --port 8000
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open your browser:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8000`

## Features

- **Contribution Type Selection**: Choose between percentage of salary or fixed dollar amount per paycheck
- **Real-time Calculations**: See how your contribution affects annual totals, tax savings, and employer match
- **Retirement Projections**: View projected savings at age 65 with investment growth
- **IRS Limit Warnings**: Get notified when approaching or exceeding annual contribution limits
- **Year-to-Date Tracking**: View and edit salary, paychecks per year, and YTD contributions

## How to Use

1. **Set Your Contribution:**
   - Select "Percentage" or "Dollar" contribution type
   - Use the slider (percentage) or input field (dollar) to set your amount
   - Quick action buttons (3%, 6%, 10%, 15%) are available for percentage mode

2. **Review Projections:**
   - See your projected retirement savings at age 65
   - View employer match breakdown with visual chart
   - Check tax savings from pre-tax contributions

3. **Save Your Settings:**
   - Click "Save Contribution Settings" to persist your choices
   - The header indicator shows your saved contribution
   - Settings are saved to the backend and persist across sessions

4. **Edit YTD Data:**
   - Click "Edit" in the Year-to-Date Contributions panel
   - Update salary, paychecks per year, or YTD contributions
   - Changes affect all calculations across the app

## API Endpoints

- `GET /api/contribution` - Get current contribution settings
- `POST /api/contribution` - Save contribution settings
- `GET /api/ytd` - Get year-to-date data
- `POST /api/ytd` - Save year-to-date data

## Data Storage

- Contribution settings are saved to `backend/data.json`
- YTD data is saved to `backend/ytd_data.json`
- Both files are created automatically with default values if they don't exist
