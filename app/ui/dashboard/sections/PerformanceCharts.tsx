import { LineChart } from "../components/charts/LineChart";
import { ChartContainer } from "../components/layout/ChartContainer";
import { Section } from "../components/layout/Section";
import type { MatchResult } from "@/app/lib/api";
import type {
  CoachKey,
  MatchHighlight,
  TimelineDatum,
} from "../types/dashboard.types";

type PerformanceChartsProps = {
  timelines: Record<CoachKey, TimelineDatum[]>;
  matchHighlights: MatchHighlight[];
  visibleCoaches: CoachKey[];
};

const RESULT_LABELS: Record<MatchResult["resultado"], string> = {
  V: "Vitoria",
  E: "Empate",
  D: "Derrota",
};

export function PerformanceCharts({
  timelines,
  matchHighlights,
  visibleCoaches,
}: PerformanceChartsProps) {
  const showRamon = visibleCoaches.includes("ramon");
  const showDorival = visibleCoaches.includes("dorival");

  const renderMatchTooltip = (
    payload?: ReadonlyArray<{ payload?: unknown }> | null,
  ) => {
    const row = payload?.[0]?.payload;
    if (!row || typeof row !== "object") return null;

    const d = row as TimelineDatum;

    return (
      <div className="max-w-72 rounded-2xl border border-zinc-700 bg-zinc-950 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
          Jogo {d.label} • {d.date}
        </p>
        <p className="mt-1.5 text-sm font-bold leading-snug text-zinc-100">
          Corinthians x {d.adversario}
        </p>

        <div className="mt-2.5 grid grid-cols-[auto_1fr] items-start gap-x-2 gap-y-1.5 text-xs">
          <span className="text-zinc-400">Placar</span>
          <span className="font-mono font-semibold text-zinc-100">{d.score}</span>

          <span className="text-zinc-400">Competição</span>
          <span className="text-zinc-200">{d.competicao}</span>

          <span className="text-zinc-400">Local</span>
          <span className="text-zinc-200">{d.location}</span>
        </div>
      </div>
    );
  };

  return (
    <Section
      eyebrow="Desempenho ao longo do tempo"
      title="Evolução de jogos"
      description="Veja o histórico de confrontos: Corinthians x Adversário e placar. Passe o mouse para detalhes."
      className="xl:flex xl:h-full xl:min-h-0 xl:flex-col"
    >
      <div
        className={`grid gap-3 xl:min-h-0 xl:flex-1 ${
          showRamon && showDorival ? "xl:grid-cols-2" : "xl:grid-cols-1"
        }`}
      >
        {showRamon ? (
          <ChartContainer
            title="Linha de confrontos: Ramón Diaz"
            subtitle="Passe o mouse para ver adversário e placar."
            className="xl:h-full"
          >
            <LineChart
              data={timelines.ramon}
              xKey="label"
              lines={[{ dataKey: "pontuacao", name: "Jogo", color: "#f4f4f5" }]}
              height={155}
              customTooltip={({ payload }) => {
                return renderMatchTooltip(payload);
              }}
            />
          </ChartContainer>
        ) : null}

        {showDorival ? (
          <ChartContainer
            title="Linha de confrontos: Dorival Júnior"
            subtitle="Passe o mouse para ver adversário e placar."
            className="xl:h-full"
          >
            <LineChart
              data={timelines.dorival}
              xKey="label"
              lines={[{ dataKey: "pontuacao", name: "Jogo", color: "#eab308" }]}
              height={155}
              customTooltip={({ payload }) => {
                return renderMatchTooltip(payload);
              }}
            />
          </ChartContainer>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {matchHighlights.map((highlight) => (
          <div
            key={highlight.coach}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/85 p-3.5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
                  Último recorte
                </p>
                <h3 className="mt-1.5 text-lg font-black uppercase tracking-[0.08em] text-white">
                  {highlight.coach}
                </h3>
              </div>
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-300">
                {RESULT_LABELS[highlight.resultado]}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-zinc-300">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Adversário
                </p>
                <p className="mt-1.5 font-semibold text-white">{highlight.adversario}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Placar
                </p>
                <p className="mt-1.5 font-semibold text-white">{highlight.score}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Competição
                </p>
                <p className="mt-1.5">{highlight.competicao}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  Contexto
                </p>
                <p className="mt-1.5">
                  {highlight.location} | {highlight.date}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
