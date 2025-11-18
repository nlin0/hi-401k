### How to start the program locally

#### Prerequisites
- Python 3.10+ 
- Node.js 16+ and npm

#### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   uvicorn server:app --reload --host 127.0.0.1 --port 8000
   ```

   The backend will be running at `http://localhost:8000`

#### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be running at `http://localhost:5173` (or another port if 5173 is taken)

#### Access the Application
- Open your browser to the frontend URL (typically `http://localhost:5173`)
- Make sure both the backend and frontend servers are running for full functionality
