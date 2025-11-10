"use client";

import RoleBasedRoute from "@/app/components/RoleBasedRoute";
import { Role } from "@prisma/client";

export default function MisCursosPage() {
  return (
    <RoleBasedRoute allowedRoles={[Role.ESTUDIANTE]}>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Mis Cursos</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Aquí irán los cursos del estudiante */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">Curso de ejemplo</h2>
              <p className="text-gray-600 mb-4">
                Descripción del curso para estudiantes
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Progreso: 45%</span>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleBasedRoute>
  );
}
