import { StatCard } from "../components/cards/StatCard";
import { BarChart } from "../components/charts/BarChart";
import { ChartContainer } from "../components/layout/ChartContainer";
import { Section } from "../components/layout/Section";
import type {
  GoalkeeperEfficiencyDatum,
  OffensiveEfficiencyDatum,
  SquadMetricCard,
  TopPlayerDatum,
} from "../types/dashboard.types";

type PlayersAnalysisProps = {
  topScorers: TopPlayerDatum[];
  topAssists: TopPlayerDatum[];
  offensiveEfficiency: OffensiveEfficiencyDatum[];
  goalkeeperEfficiency: GoalkeeperEfficiencyDatum[];
  squadMetrics: SquadMetricCard[];
  compareMode: boolean;
};

export function PlayersAnalysis({
  topScorers,
  topAssists,
  offensiveEfficiency,
  goalkeeperEfficiency,
  squadMetrics,
  compareMode,
}: PlayersAnalysisProps) {
  return (
    <Section
      eyebrow="Analise individual 2026"
      title={compareMode ? "Dorival em foco: elenco 2026" : "Elenco 2026"}
      description="Painel lateral concentrado em jogadores, com artilharia, assistencias, eficiencia ofensiva e leitura dos goleiros."
      className="xl:flex xl:h-full xl:min-h-0 xl:flex-col"
    >
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-2">
        {squadMetrics.slice(0, 4).map((metric, index) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            helper={metric.helper}
            tone={index === 0 ? "accent" : "positive"}
          />
        ))}
      </div>

      <div className="grid gap-3 xl:min-h-0 xl:flex-1 xl:grid-cols-2">
        <ChartContainer
          title="Top goleadores"
          subtitle="Recorte dos atletas com maior participação direta em gols."
          className="xl:h-full"
        >
          <BarChart
            data={topScorers}
            xKey="jogador"
            bars={[{ dataKey: "valor", name: "Gols", color: "#eab308" }]}
            layout="vertical"
            height={145}
          />
        </ChartContainer>

        <ChartContainer
          title="Top assistências"
          subtitle="Leitura de criação para os nomes mais influentes."
          className="xl:h-full"
        >
          <BarChart
            data={topAssists}
            xKey="jogador"
            bars={[{ dataKey: "valor", name: "Assistências", color: "#f4f4f5" }]}
            layout="vertical"
            height={145}
          />
        </ChartContainer>

        <ChartContainer
          title="Eficiência ofensiva"
          subtitle="Finalizações X Chutes no gol para os principais nomes."
          className="xl:h-full"
        >
          <BarChart
            data={offensiveEfficiency}
            xKey="jogador"
            bars={[
              { dataKey: "finalizacoes", name: "Finalizações", color: "#3f3f46" },
              { dataKey: "chutesNoGol", name: "Chutes no gol", color: "#eab308" },
            ]}
            layout="vertical"
            height={200}
            yAxisWidth={136}
          />
        </ChartContainer>

        <ChartContainer
          title="Goleiros 2026"
          subtitle="Defesas e gols sofridos para toda a rotação da posição."
          className="xl:h-full"
        >
          <BarChart
            data={goalkeeperEfficiency}
            xKey="jogador"
            bars={[
              { dataKey: "defesas", name: "Defesas", color: "#f4f4f5" },
              { dataKey: "golsSofridos", name: "Gols sofridos", color: "#eab308" },
            ]}
            layout="vertical"
            height={180}
          />
        </ChartContainer>
      </div>
    </Section>
  );
}
