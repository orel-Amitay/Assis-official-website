import MaterialIcon from "./MaterialIcon";

export default function ProblemStory() {
  return (
    <section
      id="problem-story"
      className="scroll-mt-24 overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-5 lg:gap-20">
        <div className="lg:col-span-2 max-w-xl">
          <h2 className="font-headline text-4xl font-bold leading-[1.1] tracking-tight text-[hsl(var(--navy-accent))] sm:text-5xl lg:text-6xl">
            Customers leave.{" "}
            <br />
            <span className="text-[hsl(var(--secondary))]">
              And you don&apos;t always know why.
            </span>
          </h2>
          <p className="mt-8 text-xl leading-relaxed text-[hsl(var(--on-surface-variant))]">
            They ask a question and don&apos;t get an answer in time. They hit a problem at
            checkout and give up. Their package is late and no one tells them. Small
            frictions. Invisible losses. By the time you notice, they&apos;re already gone.
          </p>
          <div className="mt-12 inline-flex items-start gap-4 rounded-2xl border border-[hsl(var(--error)/0.1)] bg-[hsl(var(--error-container)/0.2)] p-6">
            <MaterialIcon name="warning" className="mt-0.5 text-[hsl(var(--error))]" />
            <p className="text-sm font-medium text-[hsl(var(--on-surface))]">
              Warning: Every small friction pushes customers away. Most businesses
              don&apos;t see it until it&apos;s too late.
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[600px] items-center lg:col-span-3 lg:h-[700px]">
          <div
            className="pointer-events-none absolute inset-0 -z-10 rounded-[3rem] bg-[hsl(var(--primary)/0.05)] blur-3xl"
            aria-hidden
          />
          <div
            className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-gradient-to-b from-[hsl(var(--error)/0)] via-[hsl(var(--error)/0.2)] to-[hsl(var(--error)/0)] md:block"
            aria-hidden
          />

          <div className="relative z-10 w-full space-y-16 md:space-y-24">
            {/* Phase 1 */}
            <div className="relative flex flex-col items-center justify-start gap-6 md:flex-row md:items-start">
              <div className="relative shrink-0">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--surface-container-high))] text-[10px] font-bold shadow-sm">
                  JD
                </div>
                <div className="absolute left-full top-1/2 hidden h-px w-8 bg-[hsl(var(--outline-variant)/0.3)] md:block" />
              </div>
              <div className="relative">
                <div className="glass-card max-w-[320px] rounded-2xl border border-white/40 p-5 shadow-lg transition-transform hover:-translate-y-1">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--error))]">
                    <span>Phase 1: Pre-Purchase</span>
                    <span className="rounded bg-[hsl(var(--error)/0.1)] px-1.5 py-0.5">
                      No response
                    </span>
                  </div>
                  <p className="text-sm italic leading-relaxed text-[hsl(var(--on-surface-variant))]">
                    &ldquo;Is this vegan leather or genuine leather? I need to know before I
                    order...&rdquo;
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-[hsl(var(--on-surface-variant)/0.4)]">
                    <MaterialIcon name="schedule" className="text-sm" />
                    <span>14 HOURS AGO</span>
                  </div>
                </div>
                <div className="mt-3 whitespace-nowrap rounded-full border border-[hsl(var(--error)/0.1)] bg-white px-3 py-1.5 shadow-sm md:absolute md:left-full md:top-4 md:ml-4 md:mt-0">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--error))]">
                    <MaterialIcon name="trending_down" className="text-sm" /> -$240 Sale Lost
                  </span>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative flex flex-col items-center justify-start gap-6 md:flex-row-reverse md:items-start">
              <div className="relative shrink-0">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--surface-container-high))] text-[10px] font-bold shadow-sm">
                  AK
                </div>
                <div className="absolute right-full top-1/2 hidden h-px w-8 bg-[hsl(var(--outline-variant)/0.3)] md:block" />
              </div>
              <div className="relative flex flex-col items-end">
                <div className="max-w-[320px] space-y-2">
                  <div className="glass-card rounded-2xl border border-white/40 p-4 opacity-60 shadow-lg">
                    <p className="text-xs text-[hsl(var(--on-surface-variant))]">
                      &ldquo;Hi, I tried to use the promo code from the email but it says
                      it&apos;s expired?&rdquo;
                    </p>
                  </div>
                  <div className="glass-card rounded-2xl border border-white/40 p-5 shadow-xl transition-transform hover:-translate-y-1">
                    <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--error))]">
                      <span>Phase 2: Checkout</span>
                      <span className="rounded bg-[hsl(var(--error)/0.1)] px-1.5 py-0.5">
                        Repeating issue
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[hsl(var(--navy-accent))]">
                      &ldquo;Hello? Still waiting. Can I get a working code? I&apos;m trying
                      to buy this now.&rdquo;
                    </p>
                  </div>
                </div>
                <div className="mt-3 whitespace-nowrap rounded-full border border-[hsl(var(--error)/0.1)] bg-white px-3 py-1.5 shadow-sm md:absolute md:right-full md:top-4 md:mr-4 md:mt-0">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--error))]">
                    <MaterialIcon name="remove_shopping_cart" className="text-sm" /> Cart
                    Abandoned
                  </span>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative flex flex-col items-center justify-start gap-6 md:flex-row md:items-start">
              <div className="relative shrink-0">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-[hsl(var(--surface-container-high))] text-[10px] font-bold shadow-sm">
                  MR
                </div>
                <div className="absolute left-full top-1/2 hidden h-px w-8 bg-[hsl(var(--outline-variant)/0.3)] md:block" />
              </div>
              <div className="relative">
                <div className="glass-card max-w-[320px] rounded-2xl border border-white/40 p-5 shadow-lg transition-transform hover:-translate-y-1">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--error))]">
                    <span>Phase 3: Post-Purchase</span>
                    <span className="rounded bg-[hsl(var(--error)/0.1)] px-1.5 py-0.5">
                      Delay detected
                    </span>
                  </div>
                  <p className="mb-2 text-sm font-bold text-[hsl(var(--navy-accent))]">
                    &ldquo;Where is my order? It&apos;s been 5 days and I have no tracking
                    update. This is frustrating.&rdquo;
                  </p>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[hsl(var(--surface-container-high))]">
                    <div className="h-full w-3/4 bg-[hsl(var(--error))]" />
                  </div>
                  <div className="mt-1 flex justify-between text-[8px] font-bold uppercase text-[hsl(var(--on-surface-variant)/0.4)]">
                    <span>Processing</span>
                    <span className="text-[hsl(var(--error))]">Delayed</span>
                  </div>
                </div>
                <div className="mt-3 whitespace-nowrap rounded-full border border-[hsl(var(--error)/0.1)] bg-white px-3 py-1.5 shadow-sm md:absolute md:left-full md:top-4 md:ml-4 md:mt-0">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-[hsl(var(--error))]">
                    <MaterialIcon name="star" className="text-sm" /> Risk: 1-Star Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
