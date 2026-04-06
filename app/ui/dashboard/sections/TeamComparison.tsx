import { StatCard } from "../components/cards/StatCard";
import { BarChart } from "../components/charts/BarChart";
import { PieChart } from "../components/charts/PieChart";
import { ChartContainer } from "../components/layout/ChartContainer";
import { Section } from "../components/layout/Section";
import type {
  ActiveCoachSummary,
  CoachKey,
  CoachDistributionDatum,
  ComparisonMetricDatum,
} from "../types/dashboard.types";

type TeamComparisonProps = {
  activeSummary: Record<CoachKey, ActiveCoachSummary>;
  comparisonMetrics: ComparisonMetricDatum[];
  resultDistribution: CoachDistributionDatum[];
  compareMode: boolean;
  focusCoach: CoachKey;
};

export function TeamComparison({
  activeSummary,
  comparisonMetrics,
  resultDistribution,
  compareMode,
  focusCoach,
}: TeamComparisonProps) {
  const summary = activeSummary[focusCoach];
  return (
    <Section
      eyebrow={compareMode ? "Comparação do time" : "Leitura do técnico"}
      title={
        compareMode
          ? "Comparativo entre técnicos"
          : `Raio-x de ${focusCoach === "dorival" ? "Dorival Júnior" : "Ramón Diaz"}`
      }
      description={
        compareMode
          ? "Dorival permanece como foco visual, enquanto Ramón entra como camada de referência para contraste de desempenho."
          : "KPIs centrais do técnico selecionado com distribuição de resultados e leitura enxuta para caber inteira na tela."
      }
      className="xl:flex xl:h-full xl:min-h-0 xl:flex-col"
    >
      {compareMode ? (
        <div className="flex flex-col gap-2">
          {(["ramon", "dorival"] as CoachKey[]).map((coach) => {
            const coachSummary = activeSummary[coach];
            const isRamon = coach === "ramon";
            return (
              <div key={coach} className="flex items-stretch gap-2">
                <div
                  className={`flex w-28 shrink-0 items-center justify-center rounded-2xl border px-2 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] ${
                    isRamon
                      ? "border-zinc-700 bg-zinc-800/80 text-zinc-200"
                      : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                  }`}
                >
                  {isRamon ? "Ramón" : "Dorival"}
                </div>
                <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
                  {coachSummary.cards.slice(0, 4).map((card, index) => (
                    <StatCard
                      key={card.label}
                      label={card.label}
                      value={card.value}
                      helper={card.helper}
                      tone={isRamon ? (index === 1 ? "neutral" : "neutral") : "dorival"}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {summary.cards.slice(0, 6).map((card, index) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              helper={card.helper}
              tone={index === 1 ? "accent" : "neutral"}
            />
          ))}
        </div>
      )}

      <div className="grid gap-3 xl:min-h-0 xl:flex-1 xl:grid-cols-[1.6fr_0.9fr] xl:items-stretch">
        <ChartContainer
          title={compareMode ? "Comparação geral" : "Métricas centrais"}
          subtitle={
            compareMode
              ? "Aproveitamento, volume ofensivo, solidez defensiva e taxa de vitórias no mesmo eixo."
              : "Quando apenas um técnico está ativo, a leitura enfatiza os valores absolutos desse recorte."
          }
          className="xl:h-full"
        >
          <BarChart
            data={comparisonMetrics}
            xKey="metric"
            bars={[
              { dataKey: "ramon", name: "Ramón Diaz", color: "#f4f4f5" },
              { dataKey: "dorival", name: "Dorival Júnior", color: "#eab308" },
            ]}
            height={compareMode ? 430 : 185}
            valueFormatter={(value) => `${value.toFixed(1)}`}
          />
        </ChartContainer>

        <div className="grid gap-3 sm:grid-cols-2 xl:min-h-0 xl:grid-cols-1">
          {resultDistribution.map((distribution) => (
            <ChartContainer
              key={distribution.coach}
              title={`Resultados: ${distribution.coach}`}
              subtitle={`${distribution.totalMatches} jogos analisados`}
              className="xl:h-full"
            >
              <PieChart data={distribution.segments} height={155} />
            </ChartContainer>
          ))}
        </div>
      </div>
    </Section>
  );
}
