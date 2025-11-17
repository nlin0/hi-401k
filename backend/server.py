from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

######### Allow React to call FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data.json"


######## Loading and saving data
def load_data():
    if not os.path.exists(DATA_FILE):
        return {"type": "percentage", "value": 5}
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)



########## ENDPOINTS
@app.get("/api/contribution")
def get_contribution():
    return load_data()


@app.post("/api/contribution")
def save_contribution(payload: dict):
    save_data(payload)
    return {"status": "saved", "data": payload}


@app.get("/api/ytd")
def get_ytd():
    # mock data
    return {
        "salary": 100000,
        "paychecks_per_year": 26,
        "ytd_contributions": 5200,
    }
