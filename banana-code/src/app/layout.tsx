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
  const routesWithNavbar = ["/vista_curso", "/home", "/estudiante"];
  const showNavbar = routesWithNavbar.includes(pathname);
  return (
    <html lang="en">
      <body>
        {showNavbar && <Navbar />}
        <main className="mx-5">{children}</main>
      </body>
    </html>
  );
}
