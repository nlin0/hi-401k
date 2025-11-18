# Manage Your 401(k) / hi 401k!

A web application for managing 401(k) contribution settings


### Running Locally
**Start the backend (in terminal1):**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn server:app --reload --host 127.0.0.1 --port 8000
   ```

**Start the frontend (in another terminal2):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```


## Features

- **Contribution Type Selection**: Choose between percentage of salary or fixed dollar amount per paycheck
- **Real-time Calculations**: See how your contribution affects annual totals, tax savings, and employer match
- **Retirement Projections**: View projected savings at age 65 with investment growth
- **IRS Limit Warnings**: Get notified when approaching or exceeding annual contribution limits
- **Year-to-Date Tracking**: View and edit salary, paychecks per year, and YTD contributions

## How to Use

This application helps you manage your 401(k) contribution settings and see how they impact your retirement savings. Follow these simple steps to get started:

1. **Choose Contribution Type:**
   - Click either "Percentage (%)" or "Dollar ($)" button at the top of the page
   - **Percentage mode**: Enter a percentage of your salary (e.g., 6% means 6% of your annual salary goes to your 401(k))
   - **Dollar mode**: Enter a fixed dollar amount per paycheck (e.g., $200 means $200 is contributed each paycheck)

2. **Set Contribution Amount:**
   - **Percentage:**
     - Drag the slider left or right to adjust your percentage (0% to 20%)
     - Or click the quick action buttons (3%, 6%, 10%, 15%) for common contribution rates
     - The large number at the top shows your selected percentage
   - **Dollar:**
     - Type the dollar amount you want to contribute per paycheck in the number field
     - The app automatically calculates what percentage of your salary this represents

3. **Contribution Breakdown:**
   - The "Contribution Breakdown" card shows:
     - How much you'll contribute per paycheck
     - Your monthly contribution amount
     - Your annual total contribution

### Retirement Projections

**Projected Retirement Savings:**
   - This card shows your estimated balance at age 65
   - It shows:
     - Total contributions you'll make over time
     - Investment growth you'll earn
     - Your estimated monthly income in retirement (based on the 4% withdrawal rule)
   - *Note: Assumes 7% annual return and 3% salary increases (for percentage contributions)*

**Employer Match:**
   - View how much "free money" your employer contributes
   - The app shows if you're maximizing your match or leaving money on the table

**Tax Savings:**
   - See how much you'll save in taxes by contributing to your 401(k)
   - *Note: Tax savings are estimates based on a 22% marginal tax rate*

### Saving Contributions
**Save Contribution Setting:**
   - After adjusting your contribution and submitting it, you'll see a confirmation message at the bottom right
   - Your saved contribution will appear in the header at the top of the page

**Reset to Default:**
   - "Reset to Default" button resets to default 5% contribution

### Updating Your Information
**Year-to-Date Contributions:**
   - Click "Edit" in the "Year-to-Date Contributions" panel (bottom right)
   - Update any of the following:
     - **Salary**: Your annual salary
     - **Paychecks per Year**: How many times you get paid per year (e.g., 26 for bi-weekly, 24 for semi-monthly)
     - **YTD Contributions**: How much you've already contributed this year
   - Calculations will update automatically

### Important Notes

- **Contribution Limits**: The app will warn you if your projected contributions exceed IRS limits ($23,000 for 2025, plus catch-up contributions for age 50+)
- **Real-time Updates**: All calculations update automatically as you change your contribution settings
- **Data Persistence**: Your contribution settings and YTD data are saved and will be there when you return to the app

## API Endpoints

- `GET /api/contribution` - Get current contribution settings
- `POST /api/contribution` - Save contribution settings
- `GET /api/ytd` - Get year-to-date data
- `POST /api/ytd` - Save year-to-date data

## Data Storage

- Contribution settings are saved to `backend/data.json`
- YTD data is saved to `backend/ytd_data.json`
- Both files are created automatically with default values if they don't exist
