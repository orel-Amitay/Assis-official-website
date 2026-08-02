import Image from "next/image";

export default function DemoWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[45] overflow-hidden"
    >
      <div
        className="absolute inset-[-50%] grid rotate-[-24deg] grid-cols-3 gap-x-16 gap-y-20 opacity-[0.16] sm:grid-cols-4 sm:gap-x-20 sm:gap-y-24 md:grid-cols-5"
        style={{ width: "200%", height: "200%" }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-2.5"
          >
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
              <Image
                src="/brand/assis-heart.png"
                alt=""
                fill
                sizes="112px"
                className="object-contain"
                priority={i < 4}
              />
            </div>
            <span className="select-none rounded-sm bg-black/10 px-2 py-0.5 font-display text-xs font-bold tracking-[0.4em] text-black sm:text-sm">
              DEMO
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
