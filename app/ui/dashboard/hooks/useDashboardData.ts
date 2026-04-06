"use client";

import { useEffect, useState } from "react";
import {
  fetchDashboardPayload,
} from "@/app/lib/api";
import type { GoalkeeperStats, MatchResult, PlayerStats, TeamStats } from "@/app/lib/api";
import type {
  ActiveCoachSummary,
  CoachBundle,
  CoachDistributionDatum,
  CoachKey,
  ComparisonMetricDatum,
  DashboardState,
  DashboardViewModel,
  MatchHighlight,
  PieSegmentDatum,
  SquadMetricCard,
  TimelineDatum,
} from "../types/dashboard.types";

const RESULT_POINTS: Record<MatchResult["resultado"], number> = {
  V: 3,
  E: 1,
  D: 0,
};

const RESULT_COLORS: Record<MatchResult["resultado"], string> = {
  V: "#eab308",
  E: "#f4f4f5",
  D: "#3f3f46",
};

const COACH_META = {
  ramon: {
    key: "ramon" as const,
    name: "Ramón Díaz",
    shortName: "Ramón",
  },
  dorival: {
    key: "dorival" as const,
    name: "Dorival Júnior",
    shortName: "Dorival",
  },
};

const percentage = (value: number, total: number) =>
  total > 0 ? (value / total) * 100 : 0;

const formatDecimal = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);

const formatPercentage = (value: number) => `${formatDecimal(value)}%`;

const sortByDate = (matches: MatchResult[]) =>
  [...matches].sort(
    (left, right) => new Date(left.data).getTime() - new Date(right.data).getTime(),
  );

const getResultDistribution = (
  coach: string,
  stats: TeamStats,
): CoachDistributionDatum => {
  const segments: PieSegmentDatum[] = [
    { name: "Vitórias", value: stats.vitorias, fill: RESULT_COLORS.V },
    { name: "Empates", value: stats.empates, fill: RESULT_COLORS.E },
    { name: "Derrotas", value: stats.derrotas, fill: RESULT_COLORS.D },
  ];

  return {
    coach,
    totalMatches: stats.jogos,
    segments,
  };
};

const getComparisonMetrics = (
  ramon: TeamStats,
  dorival: TeamStats,
): ComparisonMetricDatum[] => [
  { metric: "Aproveitamento", ramon: ramon.aproveitamento, dorival: dorival.aproveitamento },
  { metric: "Média de gols", ramon: ramon.media_gols, dorival: dorival.media_gols },
  { metric: "Média sofrida", ramon: ramon.media_sofridos, dorival: dorival.media_sofridos },
  {
    metric: "% vitórias",
    ramon: percentage(ramon.vitorias, ramon.jogos),
    dorival: percentage(dorival.vitorias, dorival.jogos),
  },
];

const getTimeline = (matches: MatchResult[]): TimelineDatum[] =>
  sortByDate(matches).map((match, index) => ({
    matchId: match.match_id,
    label: `${index + 1}`,
    date: match.data,
    pontuacao: RESULT_POINTS[match.resultado],
    resultado: match.resultado,
    adversario: match.adversario,
    competicao: match.competicao,
    score: `${match.placar_corinthians} x ${match.placar_adversario}`,
    location: match.casa ? "Casa" : "Fora",
  }));

const topPlayersBy = (players: PlayerStats[], key: "gols" | "assistencias") =>
  [...players]
    .sort((left, right) => {
      const byTotal = right[key] - left[key];
      if (byTotal !== 0) return byTotal;

      const leftPerGame = left.jogos > 0 ? left[key] / left.jogos : 0;
      const rightPerGame = right.jogos > 0 ? right[key] / right.jogos : 0;
      const byPerGame = rightPerGame - leftPerGame;
      if (byPerGame !== 0) return byPerGame;

      const byFewerGames = left.jogos - right.jogos;
      if (byFewerGames !== 0) return byFewerGames;

      return left.jogador.localeCompare(right.jogador, "pt-BR");
    })
    .slice(0, 5)
    .map((player) => ({
      jogador: player.jogador,
      posicao: player.posicao,
      valor: player[key],
    }));

const getOffensiveEfficiency = (players: PlayerStats[]) =>
  [...players]
    .filter((player) => player.finalizacoes > 0)
    .sort((left, right) => right.finalizacoes - left.finalizacoes)
    .slice(0, 8)
    .map((player) => ({
      jogador: player.jogador,
      finalizacoes: player.finalizacoes,
      chutesNoGol: player.chutes_no_gol,
      precisao: percentage(player.chutes_no_gol, player.finalizacoes),
    }));

const getGoalkeeperEfficiency = (goalkeepers: GoalkeeperStats[]) =>
  [...goalkeepers]
    .sort((left, right) => right.defesas - left.defesas)
    .map((goalkeeper) => ({
      jogador: goalkeeper.jogador,
      defesas: goalkeeper.defesas,
      golsSofridos: goalkeeper.gols_sofridos,
    }));

const getLatestHighlights = (coaches: Record<CoachKey, CoachBundle>): MatchHighlight[] =>
  Object.values(coaches).map((coach) => {
    const latestMatch = sortByDate(coach.matches).at(-1);

    if (!latestMatch) {
      return {
        coach: coach.shortName,
        date: "-",
        adversario: "Sem jogos",
        competicao: "-",
        score: "-",
        resultado: "E",
        location: "Casa",
      };
    }

    return {
      coach: coach.shortName,
      date: latestMatch.data,
      adversario: latestMatch.adversario,
      competicao: latestMatch.competicao,
      score: `${latestMatch.placar_corinthians} x ${latestMatch.placar_adversario}`,
      resultado: latestMatch.resultado,
      location: latestMatch.casa ? "Casa" : "Fora",
    };
  });

const createActiveSummary = (key: CoachKey, stats: TeamStats): ActiveCoachSummary => ({
  key,
  name: COACH_META[key].name,
  shortName: COACH_META[key].shortName,
  cards: [
    { label: "Jogos", value: `${stats.jogos}`, helper: `${stats.vitorias}V ${stats.empates}E ${stats.derrotas}D` },
    {
      label: "Aproveitamento",
      value: formatPercentage(stats.aproveitamento),
      helper: `${stats.clean_sheets} ${stats.clean_sheets === 1 ? "jogo sem sofrer gol" : "jogos sem sofrer gols"}`,
    },
    { label: "Ataque", value: `${stats.gols_marcados}`, helper: `${formatDecimal(stats.media_gols)} gols/jogo` },
    { label: "Defesa", value: `${stats.gols_sofridos}`, helper: `${formatDecimal(stats.media_sofridos)} sofridos/jogo` },
    { label: "Saldo de Gols", value: `${stats.saldo_gols}`, helper: "diferença total de gols" },
    { label: "Vitórias", value: formatPercentage(percentage(stats.vitorias, stats.jogos)), helper: "percentual de triunfos" },
  ],
});

const createSquadMetrics = (
  players: PlayerStats[],
  goalkeepers: GoalkeeperStats[],
): SquadMetricCard[] => {
  const totalShots = players.reduce((sum, player) => sum + player.finalizacoes, 0);
  const totalShotsOnTarget = players.reduce((sum, player) => sum + player.chutes_no_gol, 0);
  const totalFoulsCommitted = players.reduce(
    (sum, player) => sum + player.faltas_cometidas,
    0,
  );
  const totalFoulsSuffered = players.reduce(
    (sum, player) => sum + player.faltas_sofridas,
    0,
  );
  const totalYellowCards =
    players.reduce((sum, player) => sum + player.cartao_amarelo, 0) +
    goalkeepers.reduce((sum, goalkeeper) => sum + goalkeeper.cartao_amarelo, 0);
  const totalRedCards =
    players.reduce((sum, player) => sum + player.cartao_vermelho, 0) +
    goalkeepers.reduce((sum, goalkeeper) => sum + goalkeeper.cartao_vermelho, 0);
  const goalkeeperLeader = [...goalkeepers].sort((left, right) => right.defesas - left.defesas)[0];
  const assistLeader = [...players].sort((left, right) => right.assistencias - left.assistencias)[0];
  const fouledLeader = [...players].sort(
    (left, right) => right.faltas_sofridas - left.faltas_sofridas,
  )[0];

  return [
    {
      label: "Precisão ofensiva",
      value: formatPercentage(percentage(totalShotsOnTarget, totalShots)),
      helper: `${totalShotsOnTarget}/${totalShots} finalizações no alvo`,
    },
    {
      label: "Líder em assistências",
      value: assistLeader ? assistLeader.jogador : "-",
      helper: assistLeader ? `${assistLeader.assistencias} assistências` : "sem dados",
    },
    {
      label: "Mais faltas sofridas",
      value: fouledLeader ? fouledLeader.jogador : "-",
      helper: fouledLeader ? `${fouledLeader.faltas_sofridas} faltas` : "sem dados",
    },
    {
      label: "Pressão sem bola",
      value: `${totalFoulsCommitted}`,
      helper: `${totalFoulsSuffered} faltas sofridas pelo elenco`,
    },
    {
      label: "Disciplina",
      value: `${totalYellowCards}A / ${totalRedCards}V`,
      helper: "cartões totais em 2026",
    },
    {
      label: "Parede da meta",
      value: goalkeeperLeader ? goalkeeperLeader.jogador : "-",
      helper: goalkeeperLeader ? `${goalkeeperLeader.defesas} defesas` : "sem dados",
    },
  ];
};

const buildDashboardData = ({
  compare,
  ramonMatches,
  dorivalMatches,
  players,
  goalkeepers,
}: {
  compare: { ramon: TeamStats; dorival: TeamStats };
  ramonMatches: MatchResult[];
  dorivalMatches: MatchResult[];
  players: PlayerStats[];
  goalkeepers: GoalkeeperStats[];
}): DashboardViewModel => {
  const coaches: Record<CoachKey, CoachBundle> = {
    ramon: { ...COACH_META.ramon, stats: compare.ramon, matches: ramonMatches },
    dorival: { ...COACH_META.dorival, stats: compare.dorival, matches: dorivalMatches },
  };

  return {
    coaches,
    activeSummary: {
      ramon: createActiveSummary("ramon", compare.ramon),
      dorival: createActiveSummary("dorival", compare.dorival),
    },
    comparisonMetrics: getComparisonMetrics(compare.ramon, compare.dorival),
    resultDistribution: [
      getResultDistribution(COACH_META.ramon.name, compare.ramon),
      getResultDistribution(COACH_META.dorival.name, compare.dorival),
    ],
    timelines: {
      ramon: getTimeline(ramonMatches),
      dorival: getTimeline(dorivalMatches),
    },
    matchHighlights: getLatestHighlights(coaches),
    topScorers: topPlayersBy(players, "gols"),
    topAssists: topPlayersBy(players, "assistencias"),
    offensiveEfficiency: getOffensiveEfficiency(players),
    goalkeeperEfficiency: getGoalkeeperEfficiency(goalkeepers),
    squadMetrics: createSquadMetrics(players, goalkeepers),
    players,
    goalkeepers,
  };
};

export function useDashboardData(): DashboardState {
  const [state, setState] = useState<DashboardState>({
    data: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const payload = await fetchDashboardPayload();

        if (!isMounted) return;

        setState({
          data: buildDashboardData({
            compare: payload.compare,
            ramonMatches: payload.matches.ramon,
            dorivalMatches: payload.matches.dorival,
            players: payload.players,
            goalkeepers: payload.goalkeepers,
          }),
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (!isMounted) return;

        setState({
          data: null,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Não foi possível carregar o dashboard.",
        });
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
