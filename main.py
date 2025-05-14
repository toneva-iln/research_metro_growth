from fastapi import FastAPI, Query
import pandas as pd
import requests
from io import StringIO

app = FastAPI()

ZILLOW_CSV_URL = "https://files.zillowstatic.com/research/public_csvs/zhvf_growth/Metro_zhvf_growth_uc_sfrcondo_tier_0.33_0.67_sm_sa_month.csv?t=1741754571"

def load_data():
    response = requests.get(ZILLOW_CSV_URL)
    df = pd.read_csv(StringIO(response.text))
    return df

@app.get("/search")
def search(
    state: str = Query(None),
    last: float = Query(None),
    second_last: float = Query(None),
    third_last: float = Query(None)
):
    df = load_data()
    last_col = df.columns[-1]
    second_last_col = df.columns[-2]
    third_last_col = df.columns[-3]

    if state:
        df = df[df["StateName"].str.lower() == state.lower()]
    if last is not None:
        df = df[df[last_col] == last]
    if second_last is not None:
        df = df[df[second_last_col] == second_last]
    if third_last is not None:
        df = df[df[third_last_col] == third_last]

    return df.to_dict(orient="records")
