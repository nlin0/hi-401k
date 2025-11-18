# Manage Your 401(k) / hi 401k!

Lightweight tool to explore 401(k) contribution scenarios with mock data.

## Run locally

You'll need two terminal windows/tabs—one for the backend and one for the frontend.

### Prerequisites

- Python 3.8+ installed (check with `python --version` or `python3 --version`)
- Node.js 16+ installed (check with `node --version`)
- npm installed (comes with Node.js)

### Step 1: Set up the backend

Open your first terminal window and run:

```bash
# navigate to the backend folder
cd backend

# create a virtual environment (isolates Python dependencies)
python -m venv venv
# on mac/linux:
source venv/bin/activate
# on windows:
# venv\Scripts\activate

# install required Python packages (FastAPI, uvicorn, etc.)
pip install -r requirements.txt

# start the backend server
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

You should see `Uvicorn running on http://127.0.0.1:8000`. Keep this terminal open.

### Step 2: Set up the frontend

Open a second terminal window and run:

```bash
# navigate to the frontend folder
cd frontend

# install required Node.js packages (React, Vite, Tailwind, D3, etc.)
npm install

# start the development server
npm run dev
```

You should see a local URL (usually `http://localhost:5173`). Open this URL in your browser.

### Troubleshooting

- **Backend won't start**: Make sure you activated the virtual environment (you should see `(venv)` in your terminal prompt).
- **Frontend can't connect**: Make sure the backend is running first (check that `http://127.0.0.1:8000` is accessible).
- **Port already in use**: If port 8000 or 5173 is taken, kill the process using that port or change the port in the command.

## How to use

Designed for non-technical users—this is all you need:

1. **Pick contribution type**  
   Toggle between percentage of salary or flat dollars per paycheck.

2. **Adjust the amount**  
   - Slider (0–20%, 0.1% steps) or quick buttons (3/6/10/15%) in percentage mode.  
   - Currency input in dollar mode (auto-shows the implied percentage).

3. **Read the cards**  
   - **Contribution breakdown**: per-paycheck, monthly, and annual totals (/year).  
   - **Employer match donut**: shows employee vs. employer dollars and whether you’re maximizing the match.  
   - **Retirement projection**: estimated nest egg + monthly income (assumes 7% return, 4% withdrawal rule).  
   - **Tax savings**: annual tax benefit estimate (22% marginal rate).  
   - **Year-to-date panel**: mock salary/paychecks/contributions; edit to try other scenarios.

4. **Save or undo**  
   - **Save** stores your choice in `backend/data.json`.  
   - **Revert to saved** snaps back to the last stored percentage/dollar value.

## Notes

- Mock YTD data lives in `backend/ytd_data.json`.  
- IRS 2025 limit warnings fire if projections exceed $23,000 (plus catch-up).  
- Frontend ↔ backend via REST (`/api/contribution`, `/api/ytd`).  
- Data persists locally only (JSON files under `backend/`).
