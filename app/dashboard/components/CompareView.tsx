import { TeamStats } from "@/app/lib/api";

export function CompareView({
  ramon,
  dorival,
}: {
  ramon: TeamStats;
  dorival: TeamStats;
}) {
  const metrics = [
    {
      label: "Aproveitamento (%)",
      r: ramon.aproveitamento,
      d: dorival.aproveitamento,
    },
    {
      label: "Média de Gols",
      r: ramon.media_gols,
      d: dorival.media_gols,
    },
    {
      label: "Média Sofridos",
      r: ramon.media_sofridos,
      d: dorival.media_sofridos,
    },
  ];

  return (
    <div className="px-6 pb-10">
      <h2 className="text-white text-xl font-bold mb-4">
        Comparação Direta
      </h2>

      <div className="space-y-4">
        {metrics.map((m) => {
          const better =
            m.label === "Média Sofridos"
              ? m.d < m.r
                ? "dorival"
                : "ramon"
              : m.d > m.r
              ? "dorival"
              : "ramon";

          return (
            <div
              key={m.label}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg"
            >
              <p className="text-sm text-zinc-400 mb-2">{m.label}</p>

              <div className="flex justify-between text-white font-bold">
                <span
                  className={
                    better === "ramon" ? "text-green-400" : ""
                  }
                >
                  Ramón: {m.r}
                </span>

                <span
                  className={
                    better === "dorival" ? "text-green-400" : ""
                  }
                >
                  Dorival: {m.d}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
