from fastapi import FastAPI, Query
import numpy as np
from fastapi.responses import JSONResponse
import pandas as pd
import requests
from io import StringIO
import operator

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


def parse_filter_expr(expr: str):
    if expr.startswith(">="):
        return operator.ge, float(expr[2:])
    elif expr.startswith("<="):
        return operator.le, float(expr[2:])
    elif expr.startswith(">"):
        return operator.gt, float(expr[1:])
    elif expr.startswith("<"):
        return operator.lt, float(expr[1:])
    elif expr.startswith("=="):
        return operator.eq, float(expr[2:])
    else:
        return operator.eq, float(expr)  # default to exact match


@app.get("/search")
def search(
    state: str = Query(None, description="State name to filter by"),
    last: str = Query(None, description="Value in the last column"),
    second_last: str = Query(None, description="Value in the second to last column"),
    third_last: str = Query(None, description="Value in the third to last column"),
):
    df = load_data()
    df = df.replace({np.nan: None})

    last_col = df.columns[-1]
    second_last_col = df.columns[-2]
    third_last_col = df.columns[-3]

    if state:
        df = df[df["StateName"].str.lower() == state.lower()]

    for search_term, col in [
        (last, last_col),
        (second_last, second_last_col),
        (third_last, third_last_col),
    ]:
        if search_term:
            op, val = parse_filter_expr(search_term)
            df = df[df[col].apply(lambda x: op(x, val) if pd.notnull(x) else False)]

    return JSONResponse(content=df.to_dict(orient="records"))
