import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { CartProvider } from "./CartProvider";
import CartDrawer from "./CartDrawer";
import DemoWatermark from "./DemoWatermark";
import DemoPitchModal from "./DemoPitchModal";
import AssisPlugin from "@/components/AssisPlugin";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <div className="relative bg-white">
        <DemoWatermark />
        <Header />
        <main className="relative z-10">{children}</main>
        <div className="relative z-10">
          <Footer />
        </div>
        <CartDrawer />
        <AssisPlugin />
        <DemoPitchModal />
      </div>
    </CartProvider>
  );
}
