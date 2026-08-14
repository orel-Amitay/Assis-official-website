export default function MaterialIcon({
  name,
  className = "text-[22px]",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}
      aria-hidden
    >
      {name}
    </span>
  );
}
