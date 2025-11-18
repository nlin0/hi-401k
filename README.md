# Manage Your 401(k) / hi 401k!

Lightweight tool to explore 401(k) contribution scenarios with mock data.

## Run locally

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate   # windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

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
