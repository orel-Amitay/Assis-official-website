import Link from "next/link";
import AssisLogo from "@/components/AssisLogo";

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[#f7f8fa] px-5 text-center">
      <AssisLogo height={22} />
      <h1 className="font-display mt-10 text-4xl font-bold tracking-[-0.04em] text-foreground">
        404
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        This page could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-assis-blue px-6 text-sm font-semibold text-white transition hover:bg-assis-blue-deep"
      >
        Back to home
      </Link>
    </div>
  );
}
