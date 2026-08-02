import MaterialIcon from "./MaterialIcon";
import { HOW_STEPS } from "@/data/base44";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl space-y-4 sm:mb-20">
          <h2 className="font-headline text-4xl font-bold leading-tight tracking-tight text-[hsl(var(--on-surface))] sm:text-5xl md:text-6xl">
            Simple setup.
            <br />
            <span className="text-[hsl(var(--primary))]">Instant results.</span>
          </h2>
          <p className="max-w-xl text-xl leading-relaxed text-[hsl(var(--on-surface-variant))]">
            No developers. No training. No waiting. Your store, connected in minutes.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div
            className="pointer-events-none absolute left-0 top-1/2 z-0 hidden h-[2px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-[hsl(var(--outline-variant)/0.2)] to-transparent md:block"
            aria-hidden
          />

          {HOW_STEPS.map((step, i) => (
            <article
              key={step.step}
              className={`group relative z-10 flex flex-col rounded-2xl border border-[hsl(var(--outline-variant)/0.1)] p-8 shadow-sm transition-all hover:bg-[hsl(var(--surface))] sm:p-10 ${
                i === 1
                  ? "bg-[hsl(var(--surface-container-low))]"
                  : "bg-[hsl(var(--surface-container-lowest))]"
              }`}
            >
              <div className="mb-8">
                <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-[hsl(var(--primary-container))]">
                  {step.step}
                </span>
                <h3 className="mb-4 font-headline text-2xl font-bold text-[hsl(var(--on-surface))]">
                  {step.title}
                </h3>
                <p className="leading-relaxed text-[hsl(var(--on-surface-variant))]">
                  {step.desc}
                </p>
              </div>

              {i === 0 && "icons" in step && (
                <div className="mt-auto flex items-center gap-4 pt-8">
                  {step.icons.map((icon) => (
                    <div
                      key={icon}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--surface-container-low))] p-2.5"
                    >
                      <MaterialIcon
                        name={icon}
                        className="text-[hsl(var(--primary-container))]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {i === 1 && (
                <div className="relative mt-auto flex h-24 items-center justify-center pt-4">
                  <div className="absolute inset-0 rounded-full bg-[hsl(var(--primary)/0.05)] blur-3xl" />
                  <div className="z-20 flex items-center gap-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                      <MaterialIcon
                        name="smart_toy"
                        filled
                        className="text-[hsl(var(--primary-container))]"
                      />
                    </div>
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--primary-container))]" />
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--primary-container))] [animation-delay:75ms]" />
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[hsl(var(--primary-container))] [animation-delay:150ms]" />
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                      <MaterialIcon
                        name="person"
                        filled
                        className="text-[hsl(var(--primary-container))]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {i === 2 && (
                <div className="mt-auto flex items-center gap-3 pt-8">
                  <MaterialIcon
                    name="trending_up"
                    filled
                    className="text-2xl text-[hsl(var(--primary-container))]"
                  />
                  <span className="text-sm font-semibold text-[hsl(var(--on-surface-variant))]">
                    Revenue saved
                  </span>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
