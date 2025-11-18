### How to start the program locally

#### Backend Setup (in terminal 1)
Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

Install Python dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

Start the backend server (you need two terminals):
   ```bash
   uvicorn server:app --reload --host 127.0.0.1 --port 8000
   ```

#### Frontend Setup (in another terminal 2)
Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
Install dependencies:
   ```bash
   npm install
   ```
Start the development server:
   ```bash
   npm run dev
   ```

#### Access hi-401k!
- Open your browser to the frontend URL (typically `http://localhost:5173`)
- Make sure both the backend and frontend servers are running
- That's all! Explore the application
