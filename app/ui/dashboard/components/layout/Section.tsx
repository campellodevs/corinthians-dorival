import clsx from "clsx";
import type { ReactNode } from "react";

type SectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
};

export function Section({
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    <section className={clsx("space-y-4", className)}>
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-yellow-300">
          {eyebrow}
        </p>
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase tracking-[0.08em] text-white xl:text-[1.9rem]">
            {title}
          </h2>
          <p className="max-w-3xl text-sm leading-5 text-zinc-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
