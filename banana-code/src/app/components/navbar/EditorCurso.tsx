"use client";

import React, { useState } from "react";
import "./styles.css";
import { Plus, ArrowLeft, Save, Check, Menu } from "lucide-react";

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
            <div>
              <h1 className="text-lg sm:text-xl font-semibold" style={{ color: 'inherit' }}>Editor de Cursos</h1>
              <p className="text-xs sm:text-sm" style={{ color: 'inherit', opacity: 0.8 }}>Gestión Docente</p>
            </div>
          )}
        </div>

        <div className="right-nav">
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
