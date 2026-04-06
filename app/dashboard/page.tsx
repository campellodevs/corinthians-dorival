"use client";

import { useState } from "react";
import { DashboardContainer } from "@/app/ui/dashboard/components/layout/DashboardContainer";
import { useDashboardData } from "@/app/ui/dashboard/hooks/useDashboardData";
import { PerformanceCharts } from "@/app/ui/dashboard/sections/PerformanceCharts";
import { PlayersAnalysis } from "@/app/ui/dashboard/sections/PlayersAnalysis";
import { TeamComparison } from "@/app/ui/dashboard/sections/TeamComparison";
import type { CoachKey } from "@/app/ui/dashboard/types/dashboard.types";

type CoachSelection = Record<CoachKey, boolean>;

export default function Dashboard() {
  const [selected, setSelected] = useState<CoachSelection>({
    ramon: false,
    dorival: true,
  });
  const { data, isLoading, error } = useDashboardData();

  const toggleCoach = (coach: CoachKey) => {
    setSelected((current) => {
      const next = { ...current, [coach]: !current[coach] };
      return next.ramon || next.dorival ? next : current;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-center text-zinc-200">
        Carregando dashboard comparativo...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-6">
        <div className="max-w-lg rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-100">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-red-300">
            Falha na carga
          </p>
          <p className="mt-3 text-lg font-bold">
            Nao foi possivel montar o dashboard.
          </p>
          <p className="mt-2 text-sm text-red-100/80">
            Reinicie o frontend e verifique a rota interna /api/dashboard.
          </p>
          {error ? <p className="mt-3 text-sm text-red-200">{error}</p> : null}
        </div>
      </div>
    );
  }

  const compareMode = selected.ramon && selected.dorival;
  const focusCoach: CoachKey = selected.dorival ? "dorival" : "ramon";
  const visibleCoaches = (["ramon", "dorival"] as CoachKey[]).filter(
    (coach) => selected[coach],
  );
  const comparisonMetrics = compareMode
    ? data.comparisonMetrics
    : data.comparisonMetrics.map((metric) => ({
        metric: metric.metric,
        ramon: selected.ramon ? metric.ramon : 0,
        dorival: selected.dorival ? metric.dorival : 0,
      }));
  const filteredDistribution = data.resultDistribution.filter((distribution) =>
    (selected.ramon && distribution.coach.toLowerCase().includes("ram")) ||
    (selected.dorival && distribution.coach.toLowerCase().includes("dor")),
  );
  const filteredTimelines = {
    ramon: selected.ramon ? data.timelines.ramon : [],
    dorival: selected.dorival ? data.timelines.dorival : [],
  };
  const filteredHighlights = data.matchHighlights.filter((highlight) =>
    (selected.ramon && highlight.coach.toLowerCase().includes("ram")) ||
    (selected.dorival && highlight.coach.toLowerCase().includes("dor")),
  );

  return (
    <DashboardContainer
      selected={selected}
      onToggle={toggleCoach}
      summary={data.activeSummary[focusCoach]}
      compareMode={compareMode}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-2 py-4 pb-12">
        {/* Raio-X */}
        <div>
          <TeamComparison
            activeSummary={data.activeSummary}
            comparisonMetrics={comparisonMetrics}
            resultDistribution={filteredDistribution}
            compareMode={compareMode}
            focusCoach={focusCoach}
          />
        </div>
        {/* Evolução dos Jogos */}
        <div>
          <PerformanceCharts
            timelines={filteredTimelines}
            matchHighlights={filteredHighlights}
            visibleCoaches={visibleCoaches}
          />
        </div>
        {/* Elenco 2026 */}
        {selected.dorival ? (
          <div>
            <PlayersAnalysis
              topScorers={data.topScorers}
              topAssists={data.topAssists}
              offensiveEfficiency={data.offensiveEfficiency}
              goalkeeperEfficiency={data.goalkeeperEfficiency}
              squadMetrics={data.squadMetrics}
              compareMode={compareMode}
            />
          </div>
        ) : null}

        <footer className="mt-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-7 text-center text-sm text-zinc-400">
          Fim do painel. Role para revisar todos os blocos e indicadores.
        </footer>
      </div>
    </DashboardContainer>
  );
}
