import MaterialIcon from "./MaterialIcon";
import { SCENARIOS } from "@/data/base44";

export default function Scenarios() {
  return (
    <section id="behind-the-scenes" className="scroll-mt-24 overflow-hidden py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
              Real-Time Intelligence
            </p>
            <h2 className="mt-3 max-w-xl font-headline text-3xl font-bold tracking-[-0.03em] text-[hsl(var(--on-surface))] sm:text-4xl">
              What actually happens behind the scenes.
            </h2>
          </div>
          <p className="hidden origin-right rotate-180 text-xs font-bold uppercase tracking-[0.25em] text-[hsl(var(--on-surface-variant)/0.5)] [writing-mode:vertical-rl] md:block">
            Scenario Archive 2026
          </p>
        </div>
      </div>

      <div className="hide-scrollbar flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-10">
        {SCENARIOS.map((scenario) => (
          <article
            key={scenario.num}
            className={`glass-card relative shrink-0 overflow-hidden rounded-3xl p-6 ${scenario.width} ${scenario.mt}`}
          >
            {scenario.bgIcon && (
              <MaterialIcon
                name={scenario.bgIcon}
                className="pointer-events-none absolute -right-4 -top-4 text-[120px] text-[hsl(var(--primary)/0.06)]"
              />
            )}
            <p className="text-xs font-bold text-[hsl(var(--primary))]">{scenario.num}</p>
            <h3 className="mt-2 font-headline text-lg font-bold leading-snug text-[hsl(var(--on-surface))]">
              {scenario.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--on-surface-variant))]">
              {scenario.desc}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <MaterialIcon name={scenario.icon} filled className="text-lg text-[hsl(var(--primary))]" />
              <span className="text-sm font-semibold text-[hsl(var(--on-surface))]">
                {scenario.outcome}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
