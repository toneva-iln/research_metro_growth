from fastapi import FastAPI, Query
import numpy as np
from fastapi.responses import JSONResponse
import pandas as pd
import requests
from io import StringIO

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or ["*"] for all origins (use with caution)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


ZILLOW_CSV_URL = (
    "https://files.zillowstatic.com/research/public_csvs/zhvf_growth/"
    "Metro_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv?t=1741754571"
)

def load_data():
    response = requests.get(ZILLOW_CSV_URL)
    response.raise_for_status()
    df = pd.read_csv(StringIO(response.text))
    return df

@app.get("/search")
def search(
    state: str = Query(None, description="State name to filter by"),
    last: float = Query(None, description="Value in the last column"),
    second_last: float = Query(None, description="Value in the second to last column"),
    third_last: float = Query(None, description="Value in the third to last column")
):
    df = load_data()
    df = df.replace({np.nan: None})

    last_col = df.columns[-1]
    second_last_col = df.columns[-2]
    third_last_col = df.columns[-3]

    print("*** state", state)
    print()

    if state:
        df = df[df["StateName"].str.lower() == state.lower()]
    if last is not None:
        df = df[df[last_col] == last]
    if second_last is not None:
        df = df[df[second_last_col] == second_last]
    if third_last is not None:
        df = df[df[third_last_col] == third_last]

    return JSONResponse(content=df.to_dict(orient="records"))
