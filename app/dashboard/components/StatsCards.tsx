import { TeamStats } from "@/app/lib/api";

export function StatsCards({ stats }: { stats: TeamStats }) {
  const cards = [
    { label: "Jogos", value: stats.jogos },
    { label: "Vitórias", value: stats.vitorias },
    { label: "Empates", value: stats.empates },
    { label: "Derrotas", value: stats.derrotas },
    { label: "Aproveitamento", value: stats.aproveitamento + "%" },
    { label: "Gols Marcados", value: stats.gols_marcados },
    { label: "Gols Sofridos", value: stats.gols_sofridos },
    { label: "Saldo", value: stats.saldo_gols },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
        >
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            {card.label}
          </p>
          <p className="text-2xl font-bold text-white mt-1">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
