type Props = {
  active: "ramon" | "dorival";
  onToggle: (coach: "ramon" | "dorival") => void;
};

export function CoachBanner({ active, onToggle }: Props) {
  const isRamon = active === "ramon";

  return (
    <div className="bg-black border-b border-zinc-800 px-6 py-5 flex items-center justify-between">
      <div>
        <p className="text-xs text-zinc-400 uppercase tracking-widest">
          Técnico do Corinthians
        </p>
        <h1 className="text-3xl font-black text-white">
          {isRamon ? "Ramón Díaz" : "Dorival Júnior"}
        </h1>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle("ramon")}
          className={`px-4 py-2 text-sm font-bold rounded transition ${
            active === "ramon"
              ? "bg-white text-black"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
        >
          Ramón
        </button>

        <button
          onClick={() => onToggle("dorival")}
          className={`px-4 py-2 text-sm font-bold rounded transition ${
            active === "dorival"
              ? "bg-white text-black"
              : "bg-zinc-800 text-white hover:bg-zinc-700"
          }`}
        >
          Dorival
        </button>
      </div>
    </div>
  );
}
