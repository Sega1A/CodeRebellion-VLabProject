"use client";
import React from "react";

type NavItem = {
  label: string;
  href: string;
};

interface NavbarProps {
  brand?: string; // Texto de marca ("Banana Code")
  items?: NavItem[]; // Links centrales ("Inicio", "Curso")
  isAuthenticated?: boolean; // Estado: antes/después de iniciar sesión
  userName?: string; // Nombre del usuario autenticado (opcional)
  onSignIn?: () => void; // Handler para iniciar sesión
  onSignOut?: () => void; // Handler para cerrar sesión
}

export default function Navbar({
  brand = "Banana Code",
  items = [
    { label: "Inicio", href: "#inicio" },
    { label: "Curso", href: "#curso" },
  ],
  isAuthenticated = false,
  userName = "",
  onSignIn,
  onSignOut,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* IZQUIERDA: Logo + Marca */}
        <a href="#" className="flex items-center gap-3">
          <span className="rounded-xl border px-3 py-1 text-sm font-medium shadow-sm">logo</span>
          <span className="text-base font-semibold tracking-tight">{brand}</span>
        </a>

        {/* CENTRO: Items */}
        <ul className="hidden items-center gap-6 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <a
                href={it.href}
                className="text-sm font-medium text-gray-700 transition hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 rounded"
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        {/* DERECHA: Sesión */}
        <div className="flex items-center gap-2">
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={onSignIn}
              className="rounded-xl border px-4 py-1.5 text-sm font-semibold shadow-sm transition hover:shadow focus:outline-none focus:ring-2 focus:ring-black/20"
              aria-label="iniciar sesión"
            >
              iniciar sesión
            </button>
          ) : (
            <div className="relative group">
              <button
                type="button"
                className="rounded-xl border px-3 py-1.5 text-sm font-semibold shadow-sm"
                aria-haspopup="menu"
                aria-expanded="false"
              >
                {userName || "Mi cuenta"}
              </button>
              {/* Menú flotante simple */}
              <div className="invisible absolute right-0 mt-2 w-44 divide-y overflow-hidden rounded-xl border bg-white opacity-0 shadow-md transition group-hover:visible group-hover:opacity-100">
                <a
                  href="#perfil"
                  className="block px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Mi perfil
                </a>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}

          {/* Menú móvil (hamburguesa) - solo muestra los links */}
          <details className="md:hidden">
            <summary className="list-none rounded-xl border px-3 py-1.5 text-sm font-semibold shadow-sm cursor-pointer select-none">
              ☰
            </summary>
            <div className="absolute right-4 mt-2 w-56 overflow-hidden rounded-xl border bg-white shadow-md">
              <ul className="p-1">
                {items.map((it) => (
                  <li key={it.href}>
                    <a
                      href={it.href}
                      className="block rounded px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {it.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}