import { readFile } from "node:fs/promises";
import path from "node:path";

import type {
  GoalkeeperStats,
  MatchResult,
  PlayerStats,
  TeamStats,
} from "./api";

type DashboardApiPayload = {
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

const DATA_DIR = path.join(process.cwd(), "data");

const decodeText = (value: string) => {
  if (!/[ÃÂ�]/.test(value)) {
    return value;
  }

  try {
    return Buffer.from(value, "latin1").toString("utf8");
  } catch {
    return value;
  }
};

const parseBoolean = (value: string) =>
  ["true", "1", "sim", "casa", "home"].includes(value.trim().toLowerCase());

const parseNumber = (value: string) => {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseCsv = async (filename: string) => {
  const raw = await readFile(path.join(DATA_DIR, filename), "utf8");
  const [headerLine, ...rows] = raw.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());

  return rows.map((row) => {
    const values = row.split(",");
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = decodeText(values[index] ?? "");
      return acc;
    }, {});
  });
};

const getResultado = (match: {
  placar_corinthians: number;
  placar_adversario: number;
}): MatchResult["resultado"] => {
  if (match.placar_corinthians > match.placar_adversario) return "V";
  if (match.placar_corinthians === match.placar_adversario) return "E";
  return "D";
};

const normalizeMatch = (row: Record<string, string>): MatchResult => {
  const placarCorinthians = parseNumber(row.placar_corinthians);
  const placarAdversario = parseNumber(row.placar_adversario);

  return {
    match_id: row.match_id,
    data: row.data,
    adversario: row.adversario,
    casa: parseBoolean(row.casa),
    placar_corinthians: placarCorinthians,
    placar_adversario: placarAdversario,
    competicao: row.competicao,
    resultado: getResultado({
      placar_corinthians: placarCorinthians,
      placar_adversario: placarAdversario,
    }),
  };
};

const normalizePlayer = (row: Record<string, string>): PlayerStats => ({
  jogador: row.jogador,
  posicao: row.posicao,
  jogos: parseNumber(row.jogos),
  gols: parseNumber(row.gols),
  assistencias: parseNumber(row.assistencias),
  finalizacoes: parseNumber(row.finalizacoes),
  chutes_no_gol: parseNumber(row.chutes_no_gol),
  faltas_cometidas: parseNumber(row.faltas_cometidas),
  faltas_sofridas: parseNumber(row.faltas_sofridas),
  cartao_amarelo: parseNumber(row.cartao_amarelo),
  cartao_vermelho: parseNumber(row.cartao_vermelho),
});

const normalizeGoalkeeper = (
  row: Record<string, string>,
): GoalkeeperStats => ({
  jogador: row.jogador,
  jogos: parseNumber(row.jogos),
  defesas: parseNumber(row.defesas),
  gols_sofridos: parseNumber(row.gols_sofridos),
  assistencias: parseNumber(row.assistencias),
  faltas_cometidas: parseNumber(row.faltas_cometidas),
  faltas_sofridas: parseNumber(row.faltas_sofridas),
  cartao_amarelo: parseNumber(row.cartao_amarelo),
  cartao_vermelho: parseNumber(row.cartao_vermelho),
});

const calculateTeamStats = (matches: MatchResult[], tecnico: string): TeamStats => {
  const jogos = matches.length;
  const vitorias = matches.filter((match) => match.resultado === "V").length;
  const empates = matches.filter((match) => match.resultado === "E").length;
  const derrotas = matches.filter((match) => match.resultado === "D").length;
  const golsMarcados = matches.reduce(
    (sum, match) => sum + match.placar_corinthians,
    0,
  );
  const golsSofridos = matches.reduce(
    (sum, match) => sum + match.placar_adversario,
    0,
  );
  const cleanSheets = matches.filter(
    (match) => match.placar_adversario === 0,
  ).length;

  return {
    tecnico,
    jogos,
    vitorias,
    empates,
    derrotas,
    aproveitamento:
      jogos > 0 ? Number((((vitorias * 3 + empates) / (jogos * 3)) * 100).toFixed(1)) : 0,
    gols_marcados: golsMarcados,
    gols_sofridos: golsSofridos,
    media_gols: jogos > 0 ? Number((golsMarcados / jogos).toFixed(2)) : 0,
    media_sofridos: jogos > 0 ? Number((golsSofridos / jogos).toFixed(2)) : 0,
    clean_sheets: cleanSheets,
    saldo_gols: golsMarcados - golsSofridos,
  };
};

export async function getDashboardApiPayload(): Promise<DashboardApiPayload> {
  const [ramonRows, dorivalRows, playerRows, goalkeeperRows] = await Promise.all([
    parseCsv("corinthians-stats-2024-2025-ramon.csv"),
    parseCsv("corinthians-stats-2026-dorival.csv"),
    parseCsv("players_stats_2026.csv"),
    parseCsv("goalkeepers-2026.csv"),
  ]);

  const ramonMatches = ramonRows.map(normalizeMatch);
  const dorivalMatches = dorivalRows.map(normalizeMatch);
  const players = playerRows.map(normalizePlayer);
  const goalkeepers = goalkeeperRows.map(normalizeGoalkeeper);

  return {
    compare: {
      ramon: calculateTeamStats(ramonMatches, "Ramón Díaz"),
      dorival: calculateTeamStats(dorivalMatches, "Dorival Júnior"),
    },
    matches: {
      ramon: ramonMatches,
      dorival: dorivalMatches,
    },
    players,
    goalkeepers,
  };
}
