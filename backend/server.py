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


YTD_FILE = "ytd_data.json"


def load_ytd_data():
    if not os.path.exists(YTD_FILE):
        return {
            "salary": 100000,
            "paychecks_per_year": 26,
            "ytd_contributions": 5200,
            "employer_match_rate": 0.50,  # 50% match
            "employer_match_cap": 6,  # Up to 6% of salary
        }
    with open(YTD_FILE, "r") as f:
        return json.load(f)


def save_ytd_data(data):
    with open(YTD_FILE, "w") as f:
        json.dump(data, f)


@app.get("/api/ytd")
def get_ytd():
    return load_ytd_data()


@app.post("/api/ytd")
def save_ytd(payload: dict):
    save_ytd_data(payload)
    return {"status": "saved", "data": payload}
