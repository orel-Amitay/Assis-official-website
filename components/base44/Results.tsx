import MaterialIcon from "./MaterialIcon";
import { RESULT_METRICS } from "@/data/base44";

export default function Results() {
  return (
    <section
      id="results"
      className="scroll-mt-24 overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[hsl(var(--primary))]">
            Results
          </p>
          <h2 className="mt-3 font-headline text-3xl font-bold tracking-[-0.03em] text-[hsl(var(--navy-accent))] sm:text-4xl md:text-5xl">
            The numbers that move a P&amp;L.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[hsl(var(--on-surface-variant))] sm:text-lg">
            Less cancellations. Fewer returns. Faster replies. More repeat buyers.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RESULT_METRICS.map((metric) => (
            <article
              key={metric.label}
              className={`rounded-2xl p-6 sm:p-7 ${
                metric.highlight
                  ? "primary-gradient text-white shadow-[0_20px_50px_-28px_hsl(var(--primary)/0.7)]"
                  : "border border-[hsl(var(--outline-variant)/0.25)] bg-[hsl(var(--surface-container-low))]"
              }`}
            >
              <p
                className={`font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl ${
                  metric.highlight ? "text-white" : "text-[hsl(var(--primary))]"
                }`}
              >
                {metric.value}
              </p>
              <p className="mt-3 text-sm font-bold">{metric.label}</p>
              <p
                className={`mt-1.5 text-xs leading-relaxed ${
                  metric.highlight ? "text-white/75" : "text-[hsl(var(--on-surface-variant))]"
                }`}
              >
                {metric.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
