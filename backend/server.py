"""
FastAPI backend for 401(k) contribution management.

Provides REST endpoints for saving/loading contribution settings and year-to-date data.
Data is persisted to JSON files in the backend directory.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data.json"
YTD_FILE = "ytd_data.json"


def load_data():
    """load contribution settings from file, return defaults if file doesn't exist"""
    if not os.path.exists(DATA_FILE):
        return {"type": "percentage", "value": 5}
    with open(DATA_FILE, "r") as f:
        return json.load(f)


def save_data(data):
    """save contribution settings to file"""
    with open(DATA_FILE, "w") as f:
        json.dump(data, f)


def load_ytd_data():
    """load ytd data from file, return defaults if file doesn't exist"""
    if not os.path.exists(YTD_FILE):
        return {
            "salary": 100000,
            "paychecks_per_year": 26,
            "ytd_contributions": 5200,
            "employer_match_rate": 0.50,
            "employer_match_cap": 6,
        }
    with open(YTD_FILE, "r") as f:
        return json.load(f)


def save_ytd_data(data):
    """save ytd data to file"""
    with open(YTD_FILE, "w") as f:
        json.dump(data, f)


@app.get("/api/contribution")
def get_contribution():
    """get current contribution settings"""
    return load_data()


@app.post("/api/contribution")
def save_contribution(payload: dict):
    """save contribution settings"""
    save_data(payload)
    return {"status": "saved", "data": payload}


@app.get("/api/ytd")
def get_ytd():
    """get year-to-date data"""
    return load_ytd_data()


@app.post("/api/ytd")
def save_ytd(payload: dict):
    """save year-to-date data"""
    save_ytd_data(payload)
    return {"status": "saved", "data": payload}
