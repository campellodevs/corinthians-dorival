import clsx from "clsx";

type StatCardTone = "neutral" | "accent" | "positive";

const toneStyles: Record<StatCardTone, string> = {
  neutral: "border-zinc-800 bg-zinc-900 text-white",
  accent: "border-yellow-500/30 bg-yellow-500/10 text-yellow-100",
  positive: "border-white/15 bg-white/[0.04] text-white",
};

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
  tone?: StatCardTone;
};

export function StatCard({
  label,
  value,
  helper,
  tone = "neutral",
}: StatCardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-3.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]",
        toneStyles[tone],
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-[1.9rem] font-black leading-none tracking-tight">{value}</p>
      {helper ? <p className="mt-1.5 text-sm leading-5 text-zinc-400">{helper}</p> : null}
    </div>
  );
}
