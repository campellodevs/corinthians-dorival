import clsx from "clsx";
import Image from "next/image";
import type { ReactNode } from "react";
import type { ActiveCoachSummary, CoachKey } from "../../types/dashboard.types";

type DashboardContainerProps = {
  selected: Record<CoachKey, boolean>;
  onToggle: (coach: CoachKey) => void;
  summary: ActiveCoachSummary;
  compareMode: boolean;
  children: ReactNode;
};

const coachButtonStyles = (isActive: boolean) =>
  clsx(
    "rounded-2xl border px-5 py-2.5 text-sm font-black uppercase tracking-[0.2em] transition",
    isActive
      ? "border-yellow-400 bg-yellow-400 text-zinc-950 shadow-[0_0_32px_rgba(234,179,8,0.35)]"
      : "border-yellow-500/40 bg-zinc-950/90 text-zinc-200 hover:border-yellow-300 hover:text-white",
  );

export function DashboardContainer({
  selected,
  onToggle,
  summary,
  compareMode,
  children,
}: DashboardContainerProps) {
  const heroCards = summary.cards.slice(0, 4);

  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="mx-auto flex w-full max-w-[1760px] flex-col gap-3 px-2 py-2 sm:px-3 lg:px-4">
        <section className="relative overflow-hidden rounded-[28px] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(234,179,8,0.14),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(34,211,238,0.14),_transparent_22%),linear-gradient(180deg,_rgba(24,24,27,0.97)_0%,_rgba(9,9,11,0.99)_100%)] shadow-[0_35px_90px_-60px_rgba(0,0,0,0.95)] xl:min-h-[240px] xl:flex-none">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <video
              className="h-full w-full object-cover grayscale brightness-[0.2] contrast-125"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/videocorinthians.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.2)_0%,rgba(9,9,11,0.75)_55%,rgba(9,9,11,0.92)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(234,179,8,0.12),_transparent_22%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_20%)]" />
          </div>
          <div className="relative grid gap-4 p-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)] xl:min-h-[240px] xl:items-stretch">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-yellow-300">
                  Dashboard Corinthians
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => onToggle("ramon")}
                    className={coachButtonStyles(selected.ramon)}
                  >
                    Ramon
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggle("dorival")}
                    className={coachButtonStyles(selected.dorival)}
                  >
                    Dorival
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="mb-1 flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                    <Image
                      src="/Corinthians_simbolo.png"
                      alt="Simbolo do Corinthians"
                      fill
                      className="object-contain p-1 opacity-90"
                      priority
                    />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-zinc-400">
                    Sport Club Corinthians Paulista
                  </div>
                </div>
                <h1 className="max-w-4xl text-2xl font-black uppercase leading-[0.95] tracking-[0.08em] text-yellow-400 md:text-4xl xl:max-w-[820px] xl:text-[2.15rem]">
                  {compareMode
                    ? "Comparativo entre técnicos do Corinthians"
                    : `Painel de desempenho ${summary.shortName === "Dorival" ? "2026" : "Ramon Diaz"}`}
                </h1>
                <p className="max-w-3xl text-sm leading-5 text-zinc-300 xl:max-w-[760px]">
                  {compareMode
                    ? "Modo comparativo ativo: os indicadores individuais dos dois tecnicos aparecem no bloco abaixo para leitura lado a lado."
                    : summary.shortName === "Dorival"
                      ? "Foco total no recorte 2026: produção ofensiva, resultado por jogo e impacto do elenco."
                      : "Leitura isolada do ciclo de Ramón Diaz com KPIs de time e tendência de resultados."}
                </p>
              </div>

              {compareMode ? (
                <div className="rounded-2xl border border-yellow-500/25 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                  Comparação completa ativa: veja os cards de Ramón e Dorival no bloco "Comparação do time".
                </div>
              ) : (
                <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                  {heroCards.map((card) => (
                    <div
                      key={card.label}
                      className="rounded-2xl border border-zinc-800 bg-black/35 p-3.5 backdrop-blur-sm"
                    >
                      <p className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
                        {card.label}
                      </p>
                      <p className="mt-1.5 text-[1.9rem] font-black leading-none text-white">
                        {card.value}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-zinc-400">{card.helper}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative hidden overflow-hidden rounded-[26px] border border-zinc-800 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.42))] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_32%_40%,rgba(234,179,8,0.25),transparent_23%),radial-gradient(circle_at_74%_40%,rgba(34,211,238,0.35),transparent_24%),radial-gradient(circle_at_50%_75%,rgba(234,179,8,0.12),transparent_30%)]" />
              <div className="absolute right-4 top-4 z-30 rounded-full border border-white/10 bg-black/25 p-2 backdrop-blur-sm">
                <Image
                  src="/Corinthians_simbolo.png"
                  alt="Escudo do Corinthians"
                  width={44}
                  height={44}
                  className="h-11 w-11 object-contain opacity-85"
                />
              </div>
              <div
                className={clsx(
                  "absolute left-[11%] top-[18%] h-36 w-36 rounded-full bg-yellow-400/40 blur-[70px] transition",
                  !selected.ramon && "opacity-30",
                )}
              />
              <div
                className={clsx(
                  "absolute right-[12%] top-[16%] h-40 w-40 rounded-full bg-cyan-400/40 blur-[80px] transition",
                  !selected.dorival && "opacity-30",
                )}
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent" />
              <div className="relative flex h-full items-end justify-center px-2 pt-3">
                <div
                  className={clsx(
                    "relative z-10 translate-x-7 transition duration-300",
                    selected.ramon ? "opacity-100 saturate-100" : "opacity-45 saturate-50",
                  )}
                >
                  <Image
                    src="/ramonbg.png"
                    alt="Ramón Diaz"
                    width={320}
                    height={420}
                    className="h-[220px] w-auto object-contain drop-shadow-[0_0_26px_rgba(234,179,8,0.45)] xl:h-[245px]"
                    priority
                  />
                </div>
                <div
                  className={clsx(
                    "relative z-20 -translate-x-5 transition duration-300",
                    selected.dorival ? "opacity-100 saturate-100" : "opacity-45 saturate-50",
                  )}
                >
                  <Image
                    src="/dorivabg.png"
                    alt="Dorival Junior"
                    width={320}
                    height={420}
                    className="h-[225px] w-auto object-contain drop-shadow-[0_0_28px_rgba(34,211,238,0.48)] xl:h-[252px]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div>{children}</div>
      </div>
    </main>
  );
}
