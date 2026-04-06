import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parents[3] / "data"

def _calcular_resultado(row) -> str:
    if row["placar_corinthians"] > row["placar_adversario"]:
        return "V"
    elif row["placar_corinthians"] == row["placar_adversario"]:
        return "E"
    return "D"

def _load_matches(filepath: Path) -> pd.DataFrame:
    df = pd.read_csv(filepath)
    df["resultado"] = df.apply(_calcular_resultado, axis=1)
    df["casa"] = df["casa"].astype(str).str.strip().str.upper().isin(["TRUE", "SIM", "1", "CASA"])
    df["data"] = pd.to_datetime(df["data"], dayfirst=True, errors="coerce").dt.strftime("%d/%m/%Y")
    return df

def calcular_stats(df: pd.DataFrame, tecnico: str) -> dict:
    jogos    = len(df)
    vitorias = int((df["resultado"] == "V").sum())
    empates  = int((df["resultado"] == "E").sum())
    derrotas = int((df["resultado"] == "D").sum())
    aprov    = round((vitorias * 3 + empates) / (jogos * 3) * 100, 1) if jogos else 0
    gm       = int(df["placar_corinthians"].sum())
    gs       = int(df["placar_adversario"].sum())
    cs       = int((df["placar_adversario"] == 0).sum())
    return {
        "tecnico": tecnico, "jogos": jogos,
        "vitorias": vitorias, "empates": empates, "derrotas": derrotas,
        "aproveitamento": aprov,
        "gols_marcados": gm, "gols_sofridos": gs,
        "media_gols": round(gm / jogos, 2) if jogos else 0,
        "media_sofridos": round(gs / jogos, 2) if jogos else 0,
        "clean_sheets": cs, "saldo_gols": gm - gs,
    }

def get_stats_ramon() -> dict:
    df = _load_matches(DATA_DIR / "corinthians-stats-2024-2025-ramon.csv")
    return calcular_stats(df, "Ramón Díaz")

def get_stats_dorival() -> dict:
    df = _load_matches(DATA_DIR / "corinthians-stats-2026-dorival.csv")
    return calcular_stats(df, "Dorival Júnior")

def get_matches_ramon() -> list:
    df = _load_matches(DATA_DIR / "corinthians-stats-2024-2025-ramon.csv")
    return df.to_dict(orient="records")

def get_matches_dorival() -> list:
    df = _load_matches(DATA_DIR / "corinthians-stats-2026-dorival.csv")
    return df.to_dict(orient="records")

def get_players() -> list:
    df = pd.read_csv(DATA_DIR / "players_stats_2026.csv")
    df = df.sort_values("gols", ascending=False)
    for col in df.select_dtypes("float").columns:
        df[col] = df[col].fillna(0).astype(int)
    return df.fillna("").to_dict(orient="records")

def get_goalkeepers() -> list:
    df = pd.read_csv(DATA_DIR / "goalkeepers-2026.csv")
    for col in df.select_dtypes("float").columns:
        df[col] = df[col].fillna(0).astype(int)
    return df.fillna("").to_dict(orient="records")
