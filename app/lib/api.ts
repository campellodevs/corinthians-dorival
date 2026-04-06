import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
  timeout: 5000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data ?? error.message);
    return Promise.reject(error);
  },
);

export type TeamStats = {
  tecnico: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  aproveitamento: number;
  gols_marcados: number;
  gols_sofridos: number;
  media_gols: number;
  media_sofridos: number;
  clean_sheets: number;
  saldo_gols: number;
};

export type MatchResult = {
  match_id: string;
  data: string;
  adversario: string;
  casa: boolean;
  placar_corinthians: number;
  placar_adversario: number;
  competicao: string;
  resultado: "V" | "E" | "D";
};

export type PlayerStats = {
  jogador: string;
  posicao: string;
  jogos: number;
  gols: number;
  assistencias: number;
  finalizacoes: number;
  chutes_no_gol: number;
  faltas_cometidas: number;
  faltas_sofridas: number;
  cartao_amarelo: number;
  cartao_vermelho: number;
};

export type GoalkeeperStats = {
  jogador: string;
  jogos: number;
  defesas: number;
  gols_sofridos: number;
  assistencias: number;
  faltas_cometidas: number;
  faltas_sofridas: number;
  cartao_amarelo: number;
  cartao_vermelho: number;
};

export type DashboardApiPayload = {
  compare: {
    ramon: TeamStats;
    dorival: TeamStats;
  };
  matches: {
    ramon: MatchResult[];
    dorival: MatchResult[];
  };
  players: PlayerStats[];
  goalkeepers: GoalkeeperStats[];
};

export async function fetchDashboardPayload(): Promise<DashboardApiPayload> {
  const { data } = await api.get("/api/dashboard");
  return data;
}

