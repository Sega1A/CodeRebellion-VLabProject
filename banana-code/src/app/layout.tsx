"use client";
import { usePathname } from "next/navigation";
import Navbar from "./components/navbar/page";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const routesWithNavbar = ["/home", "/estudiante", "/admin", "/vista_curso"];
  const showNavbar = routesWithNavbar.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
