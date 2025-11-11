"use client";
import React, { useState, useRef, useEffect } from "react";
import "./styles.css";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { UserInfo } from "./types/userInfo-type";
import { SessionType } from "./types/session-type";
import { Role } from "@prisma/client";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const brandRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isInicio = pathname.startsWith("/inicio");
  const isCurso = pathname.startsWith("/vista_curso");

  useEffect(() => {
    getUserInfoBySession();
  }, []);

  const getUserInfoBySession = async () => {
    const session = await getSession() as SessionType | null;
    if (!session || !session.user) return;
    setUserInfo(session.user);
  };

  const onLoggo = () => {
    router.push("/home");
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header
        className={`px-3 sticky navbar ${
          theme === "light" ? "theme-light" : "theme-dark"
        }`}
      >
        <div className="left-nav">
          <div ref={brandRef} className="brand-wrapper" title="BananaCode logo">
            <div className="brand-emoji" aria-hidden="true" onClick={onLoggo}>
              🍌
            </div>
          </div>
          <Link
            href={"/inicio"}
            className={`px-5 py-2 rounded-2xl text-base font-semibold transition-all duration-200 ${
              isInicio
                ? (theme === "dark"
                    ? "bg-white/15 text-white ring-1 ring-white/10 shadow-sm"
                    : "bg-white/50 text-gray-900 ring-1 ring-white/40 shadow-sm")
                : (theme === "dark"
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-700 hover:bg-black/5 hover:text-gray-900")
            }`}
          >
            Inicio
          </Link>

          {/* Menú para todos los roles autenticados */}
          <Link
            href={"/vista_curso"}
            className={`px-5 py-2 rounded-2xl text-base font-semibold transition-all duration-200 ${
              isCurso
                ? (theme === "dark"
                    ? "bg-white/15 text-white ring-1 ring-white/10 shadow-sm"
                    : "bg-white/50 text-gray-900 ring-1 ring-white/40 shadow-sm")
                : (theme === "dark"
                    ? "text-gray-300 hover:bg-white/10 hover:text-white"
                    : "text-gray-700 hover:bg-black/5 hover:text-gray-900")
            }`}
          >
            Cursos
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
          </Link>

          {/* Menú solo para Administradores */}
          {userInfo?.role === Role.ADMINISTRADOR && (
            <>
              <Link
                href={"/admin/users-list"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit"
              >
                Usuarios
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              <Link
                href={"/admin/courses"}
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit"
              >
                Gestión Cursos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            </>
          )}

          {/* Menú para Profesor Editor */}
          {userInfo?.role === Role.PROFESOR_EDITOR && (
            <Link
              href={"/editor-cursos"}
              className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit"
            >
              Editor Curso
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          )}

          {/* Menú para Estudiante */}
          {userInfo?.role === Role.ESTUDIANTE && (
            <Link
              href={"/estudiante/mis-cursos"}
              className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit"
            >
              Mis Cursos
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>
          )}
        </div>

        <div className="right-nav">
          <button
            className="theme-toggle"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            aria-label="Toggle theme"
            id="themeToggle"
          >
            {theme === "dark" ? (
              <svg
                id="themeIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5"></circle>
                <path d="M12 1v2"></path>
                <path d="M12 21v2"></path>
                <path d="M4.2 4.2l1.4 1.4"></path>
                <path d="M18.4 18.4l1.4 1.4"></path>
                <path d="M1 12h2"></path>
                <path d="M21 12h2"></path>
                <path d="M4.2 19.8l1.4-1.4"></path>
                <path d="M18.4 5.6l1.4-1.4"></path>
              </svg>
            ) : (
              <svg
                id="themeIcon"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
              </svg>
            )}
          </button>

          <div ref={userRef} className="user-container">
            <div className="user" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
              {userInfo === null ? "******" : `${userInfo.name}`}
              <span className="caret">▾</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-user-info">
                  <p className="dropdown-user-name">{userInfo?.name}</p>
                  <p className="dropdown-user-role">
                    {userInfo?.role === Role.ADMINISTRADOR && "Administrador"}
                    {userInfo?.role === Role.PROFESOR_EDITOR && "Profesor Editor"}
                    {userInfo?.role === Role.PROFESOR_EJECUTOR && "Profesor Ejecutor"}
                    {userInfo?.role === Role.ESTUDIANTE && "Estudiante"}
                  </p>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}