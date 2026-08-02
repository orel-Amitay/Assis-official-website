import Image from "next/image";

const LOGO_ASPECT = 963 / 325;

type AssisLogoProps = {
  className?: string;
  height?: number;
  variant?: "default" | "on-dark";
};

export default function AssisLogo({
  className = "",
  height = 20,
  variant = "default",
}: AssisLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Image
      src="/brand/assis-logo-transparent.png"
      alt="Assis"
      width={width}
      height={height}
      unoptimized
      className={className}
      style={{
        width,
        height,
        objectFit: "contain",
        ...(variant === "on-dark" ? { filter: "brightness(0) invert(1)" } : {}),
      }}
      priority
    />
  );
}
