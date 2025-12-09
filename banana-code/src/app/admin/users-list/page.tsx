"use client";

import { useEffect, useState } from "react";
import { getUsers } from "./services/user.service";
import { UserResponse } from "./types/userResponse.type";
import RoleBasedRoute from "@/app/components/RoleBasedRoute";
import { Role } from "@prisma/client";

const roles = ["ESTUDIANTE", "PROFESOR_EDITOR", "PROFESOR_EJECUTOR"];

export default function ChangeRole() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, string>>(new Map());
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fillUsers();
  }, []);

  const fillUsers = async () => setUsers(await getUsers());

  const handleRoleSelect = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    setPendingChanges((prev) => {
      const updated = new Map(prev);
      updated.set(userId, newRole);
      return updated;
    });
  };

  const handleConfirmChanges = async () => {
    if (pendingChanges.size === 0) {
      setErrorMessage("No hay cambios pendientes para confirmar");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      setLoadingUserId("confirming");
      const promises = Array.from(pendingChanges.entries()).map(
        async ([userId, newRole]) => {
          const response = await fetch(`/api/users`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, role: newRole }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Error al actualizar el rol");
          }
          return { userId, newRole };
        }
      );

      await Promise.all(promises);
      setSuccessMessage(
        `${pendingChanges.size} cambio(s) aplicado(s) exitosamente`
      );
      setPendingChanges(new Map());
      setTimeout(() => setSuccessMessage(null), 3000);
      await fillUsers();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage("Error al cambiar los roles");
      }
      setTimeout(() => setErrorMessage(null), 5000);
      await fillUsers();
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleCancelChanges = () => {
    setPendingChanges(new Map());
    fillUsers();
  };

  return (
    <RoleBasedRoute allowedRoles={[Role.ADMINISTRADOR]}>
      <div className="space-y-3 mx-5">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Course Header */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                Vista de lista de usuarios
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Gestión de Roles
              </p>
            </div>
            
            {/* Botones de acción */}
            {pendingChanges.size > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelChanges}
                  disabled={loadingUserId === "confirming"}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmChanges}
                  disabled={loadingUserId === "confirming"}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingUserId === "confirming" ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Guardando...
                    </>
                  ) : (
                    <>
                      Confirmar cambios ({pendingChanges.size})
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {/* Mensajes de éxito/error */}
          {successMessage && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              {errorMessage}
            </div>
          )}
          <div className="px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {users.length} usuario{users.length !== 1 ? "s" : ""}
              </h2>
            </div>
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-md"
              >
                {/* Avatar */}
                <div className="flex-shrink-0 mr-4 mt-1 sm:mt-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-lg">
                    {user.name.charAt(0)}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 items-center">
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">Nombre</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700 truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500">Correo</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">Creado</p>
                  </div>

                  <div className="relative">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleSelect(user.id, e.target.value)
                      }
                      disabled={loadingUserId === "confirming"}
                      className="text-xs sm:text-sm px-3 py-1.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                    >
                      {roles.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>
                    {pendingChanges.has(user.id) && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                    )}
                    <p className="text-xs text-gray-500">Rol</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </RoleBasedRoute>
  );
}
