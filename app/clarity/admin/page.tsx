import type { Metadata } from "next";
import { auth } from "@/auth";
import AdminAnswers from "@/components/clarity/AdminAnswers";
import { isClarityAdmin } from "@/lib/clarity/admin";
import { COPY } from "@/lib/clarity/copy";

export const metadata: Metadata = {
  title: "Clarity admin",
  robots: { index: false, follow: false },
};

export default async function ClarityAdminPage() {
  const session = await auth();
  if (!isClarityAdmin(session)) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-8">
        <p className="text-[15px] text-muted-foreground">{COPY.he.adminForbidden}</p>
      </main>
    );
  }
  return <AdminAnswers lang="he" />;
}
