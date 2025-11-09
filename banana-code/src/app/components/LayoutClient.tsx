"use client";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Navbar from "./navbar/page";
import HydrationErrorSuppressor from "./HydrationErrorSuppressor";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const routesWithNavbar = ["/home", "/estudiante", "/admin", "/vista_curso", "/vista_prof_editor", "/editor-cursos"];
  const showNavbar = routesWithNavbar.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <SessionProvider>
      <HydrationErrorSuppressor />
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </SessionProvider>
  );
}
