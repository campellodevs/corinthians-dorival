from pydantic import BaseModel

class TeamStats(BaseModel):
    tecnico: str
    jogos: int
    vitorias: int
    empates: int
    derrotas: int
    aproveitamento: float
    gols_marcados: int
    gols_sofridos: int
    media_gols: float
    media_sofridos: float
    clean_sheets: int
    saldo_gols: int

class MatchResult(BaseModel):
    match_id: str
    data: str
    adversario: str
    casa: bool
    placar_corinthians: int
    placar_adversario: int
    competicao: str
    resultado: str

class PlayerStats(BaseModel):
    jogador: str
    posicao: str
    jogos: int
    gols: int
    assistencias: int
    finalizacoes: int
    chutes_no_gol: int
    cartao_amarelo: int
    cartao_vermelho: int

class GoalkeeperStats(BaseModel):
    jogador: str
    jogos: int
    defesas: int
    gols_sofridos: int
    assistencias: int
    cartao_amarelo: int
    cartao_vermelho: int

class CompareStats(BaseModel):
    ramon: TeamStats
    dorival: TeamStats
