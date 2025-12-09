"use client";

import React, { useState, useEffect } from "react";
import "./styles.css";
import { Plus, ArrowLeft, Save, Check, Menu } from "lucide-react";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { Role } from "@prisma/client";

interface EditorCursoProps {
  onCreateCourse?: () => void;
  // Props para modo edición
  isEditing?: boolean;
  courseTitle?: string;
  onTitleChange?: (title: string) => void;
  onSave?: () => void;
  onBack?: () => void;
  onToggleSidebar?: () => void;
  saveStatus?: '' | 'saving' | 'saved' | 'error';
}

interface UserInfo {
  name?: string;
  role?: string;
}

export default function EditorCurso({
  onCreateCourse,
  isEditing = false,
  courseTitle = '',
  onTitleChange,
  onSave,
  onBack,
  onToggleSidebar,
  saveStatus = ''
}: EditorCursoProps) {
  const [theme] = useState("light");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getSession() as any;
    if (session?.user) {
      setUserInfo(session.user);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      <header className={`px-3 sticky navbar ${theme === "light" ? "theme-light" : "theme-dark"}`}>
        <div className="left-nav">
          <div className="brand-wrapper" title="BananaCode logo">
            <div className="brand-emoji" aria-hidden="true">
              🍌
            </div>
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <button
                onClick={onBack}
                className="p-2 hover:bg-orange-200/50 rounded-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" style={{ color: 'inherit' }} />
              </button>
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 hover:bg-orange-200/50 rounded-lg transition-all"
              >
                <Menu className="w-5 h-5" style={{ color: 'inherit' }} />
              </button>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => onTitleChange?.(e.target.value)}
                className="text-base sm:text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-orange-600 rounded-lg px-2 sm:px-3 py-1 w-full"
                style={{ color: 'inherit' }}
                placeholder="Título del curso"
              />
            </div>
          ) : (
            <>
              <Link
                href="/home"
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit hidden sm:block"
              >
                Inicio
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              
              <Link
                href="/vista_curso"
                className="relative text-gray-700 font-bold hover:text-blue-600 transition-colors duration-300 group py-2 text-inherit hidden sm:block"
              >
                Cursos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
              
              <Link
                href="/editor-cursos"
                className="relative text-gray-700 font-bold text-blue-600 transition-colors duration-300 group py-2 text-inherit"
              >
                Editor Curso
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-blue-600"></span>
              </Link>
            </>
          )}
        </div>

        <div className="right-nav">
          {!isEditing && (
            <div className="user-container relative">
              <div 
                className="user" 
                onClick={() => setShowDropdown(!showDropdown)} 
                style={{ cursor: "pointer" }}
              >
                {userInfo?.name || "Usuario"}
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
          )}
          {isEditing ? (
            <button
              onClick={onSave}
              disabled={saveStatus === 'saving'}
              className={
                'px-3 sm:px-6 py-2 rounded-lg shadow-md flex items-center gap-2 font-medium text-sm ' +
                (saveStatus === 'saved'
                  ? 'bg-green-600 text-white'
                  : saveStatus === 'saving'
                    ? 'bg-gray-400 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600')
              }
            >
              {saveStatus === 'saving' && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {saveStatus === 'saved' && <Check className="w-4 h-4" />}
              {!saveStatus && <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {saveStatus === 'saving' ? 'Guardando' : saveStatus === 'saved' ? 'Guardado' : 'Guardar'}
              </span>
            </button>
          ) : (
            onCreateCourse && (
              <button
                onClick={onCreateCourse}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 flex items-center justify-center gap-2 text-sm font-medium shadow-md transition-all transform hover:-translate-y-0.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Crear Curso</span>
              </button>
            )
          )}
        </div>
      </header>
    </div>
  );
}
