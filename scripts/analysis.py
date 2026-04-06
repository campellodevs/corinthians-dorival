import pandas as pd

# ======================
# CARREGANDO OS DADOS
# ======================

ramon = pd.read_csv("../data/corinthians-stats-2024-2025-ramon.csv", sep=";")
dorival = pd.read_csv("../data/corinthians-stats-2026-dorival.csv", sep=";")
goalkeepers = pd.read_csv("../data/goalkeepers-2026.csv", sep=";")
players = pd.read_csv("../data/players_stats_2026.csv", sep=";")

# ======================
# ANÁLISE BÁSICA
# ======================

def resumo_time(df, nome):
    vitorias = (df["placar_corinthians"] > df["placar_adversario"]).sum()
    empates = (df["placar_corinthians"] == df["placar_adversario"]).sum()
    derrotas = (df["placar_corinthians"] < df["placar_adversario"]).sum()

    jogos = len(df)
    aproveitamento = (vitorias * 3 + empates) / (jogos * 3) * 100

    media_gols = df["placar_corinthians"].mean()
    media_sofridos = df["placar_adversario"].mean()

    print(f"\n===== {nome} =====")
    print("Jogos:", jogos)
    print("Vitórias:", vitorias)
    print("Empates:", empates)
    print("Derrotas:", derrotas)
    print("Aproveitamento:", round(aproveitamento, 2), "%")
    print("Gols por jogo:", round(media_gols, 2))
    print("Gols sofridos:", round(media_sofridos, 2))


# ======================
# COMPARAÇÃO
# ======================

resumo_time(ramon, "Ramon Diaz")
resumo_time(dorival, "Dorival")