type AtmosphereVariant = "dark" | "light" | "soft" | "blue";

const GLOWS: Record<AtmosphereVariant, string> = {
  dark:
    "absolute left-1/2 top-0 h-56 w-[440px] -translate-x-1/2 rounded-full bg-assis-blue/16 blur-3xl",
  light:
    "absolute -top-24 left-1/2 h-[380px] w-[min(100vw,640px)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(29,111,238,0.16)_0%,rgba(29,111,238,0.04)_48%,transparent_72%)] blur-2xl",
  soft:
    "absolute left-1/2 top-1/4 h-48 w-[400px] -translate-x-1/2 rounded-full bg-assis-blue/10 blur-3xl",
  blue:
    "absolute -top-24 left-1/2 h-64 w-[420px] -translate-x-1/2 rounded-full bg-white/12 blur-3xl",
};

const DOT: Record<AtmosphereVariant, string> = {
  dark: "rgba(255,255,255,0.06)",
  light: "rgba(29,111,238,0.14)",
  soft: "rgba(29,111,238,0.12)",
  blue: "rgba(255,255,255,0.12)",
};

export default function SectionAtmosphere({
  variant = "dark",
  className = "",
}: {
  variant?: AtmosphereVariant;
  className?: string;
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      <div className={GLOWS[variant]} />
      {variant === "dark" && (
        <div className="absolute bottom-0 right-0 h-48 w-72 rounded-full bg-assis-blue/10 blur-3xl" />
      )}
      {variant === "soft" && (
        <div className="absolute bottom-8 left-0 h-40 w-56 rounded-full bg-assis-blue/10 blur-3xl" />
      )}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(${DOT[variant]} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          maskImage:
            variant === "light"
              ? "radial-gradient(ellipse 60% 45% at 50% 5%, black, transparent 75%)"
              : "radial-gradient(ellipse 70% 55% at 50% 40%, black, transparent)",
        }}
      />
    </div>
  );
}
