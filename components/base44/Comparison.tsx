import MaterialIcon from "./MaterialIcon";
import { WITHOUT_ASSIS, WITH_ASSIS } from "@/data/base44";

export default function Comparison() {
  return (
    <section className="bg-[hsl(var(--surface-container-low))] px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-[-0.03em] text-[hsl(var(--navy-accent))] sm:text-4xl">
            Without Assis vs. With Assis
          </h2>
          <p className="mt-3 text-base text-[hsl(var(--on-surface-variant))]">
            The difference shows up fast - in tickets, cancellations, and repeat purchases.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-[hsl(var(--outline-variant)/0.3)] bg-white/60 p-6 sm:p-8">
            <h3 className="mb-6 font-headline text-lg font-bold text-[hsl(var(--on-surface-variant))]">
              Without Assis
            </h3>
            <ul className="space-y-4">
              {WITHOUT_ASSIS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[hsl(var(--on-surface-variant))]">
                  <MaterialIcon name="close" className="mt-0.5 shrink-0 text-lg text-[hsl(var(--error))]" />
                  <span className="text-sm leading-relaxed sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-3xl border-2 border-[hsl(var(--primary))] bg-white p-6 shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] sm:p-8">
            <span className="absolute -top-3 left-6 rounded-full bg-[hsl(var(--primary))] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Recommended
            </span>
            <h3 className="mb-6 font-headline text-lg font-bold text-[hsl(var(--primary))]">
              With Assis
            </h3>
            <ul className="space-y-4">
              {WITH_ASSIS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[hsl(var(--on-surface))]">
                  <MaterialIcon
                    name="check_circle"
                    filled
                    className="mt-0.5 shrink-0 text-lg text-[hsl(var(--primary))]"
                  />
                  <span className="text-sm font-medium leading-relaxed sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
