import type {
  GoalkeeperStats,
  MatchResult,
  PlayerStats,
  TeamStats,
} from "@/app/lib/api";

export type CoachKey = "ramon" | "dorival";

export type CoachBundle = {
  key: CoachKey;
  name: string;
  shortName: string;
  stats: TeamStats;
  matches: MatchResult[];
};

export type ChartDatum = Record<string, string | number>;

export type ComparisonMetricDatum = {
  metric: string;
  ramon: number;
  dorival: number;
};

export type PieSegmentDatum = {
  name: string;
  value: number;
  fill: string;
};

export type CoachDistributionDatum = {
  coach: string;
  totalMatches: number;
  segments: PieSegmentDatum[];
};

export type TimelineDatum = {
  matchId: string;
  label: string;
  date: string;
  pontuacao: number;
  resultado: MatchResult["resultado"];
  adversario: string;
  competicao: string;
  score: string;
  location: "Casa" | "Fora";
};

export type TopPlayerDatum = {
  jogador: string;
  posicao: string;
  valor: number;
};

export type OffensiveEfficiencyDatum = {
  jogador: string;
  finalizacoes: number;
  chutesNoGol: number;
  precisao: number;
};

export type SquadMetricCard = {
  label: string;
  value: string;
  helper: string;
};

export type GoalkeeperEfficiencyDatum = {
  jogador: string;
  defesas: number;
  golsSofridos: number;
};

export type MatchHighlight = {
  coach: string;
  date: string;
  adversario: string;
  competicao: string;
  score: string;
  resultado: MatchResult["resultado"];
  location: "Casa" | "Fora";
};

export type ActiveCoachSummary = {
  key: CoachKey;
  name: string;
  shortName: string;
  cards: SquadMetricCard[];
};

export type DashboardViewModel = {
  coaches: Record<CoachKey, CoachBundle>;
  activeSummary: Record<CoachKey, ActiveCoachSummary>;
  comparisonMetrics: ComparisonMetricDatum[];
  resultDistribution: CoachDistributionDatum[];
  timelines: Record<CoachKey, TimelineDatum[]>;
  matchHighlights: MatchHighlight[];
  topScorers: TopPlayerDatum[];
  topAssists: TopPlayerDatum[];
  offensiveEfficiency: OffensiveEfficiencyDatum[];
  goalkeeperEfficiency: GoalkeeperEfficiencyDatum[];
  squadMetrics: SquadMetricCard[];
  players: PlayerStats[];
  goalkeepers: GoalkeeperStats[];
};

export type DashboardState = {
  data: DashboardViewModel | null;
  isLoading: boolean;
  error: string | null;
};
