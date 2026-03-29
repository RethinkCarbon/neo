import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
  exit: { opacity: 0, y: -8, filter: "blur(4px)", transition: { duration: 0.2 } },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background dot-grid-bg">
      <AppSidebar />
      <main
        className={cn(
          "min-h-screen transition-[margin] duration-300 ease-out",
          collapsed ? "lg:ml-[88px]" : "lg:ml-[264px]",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-col px-5 pb-5 pt-16 md:px-8 md:pb-8 lg:px-10 lg:pb-10 lg:pt-6">
          <DashboardHeader />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
