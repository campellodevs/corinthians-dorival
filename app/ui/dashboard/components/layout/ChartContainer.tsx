import clsx from "clsx";
import type { ReactNode } from "react";

type ChartContainerProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
}: ChartContainerProps) {
  return (
    <div
      className={clsx(
        "overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/85 p-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      <div className="mb-3 space-y-1">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.2em] text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-xs leading-5 text-zinc-400">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}
