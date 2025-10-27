"use client";

import { useEffect, useState } from "react";
import { getUsers } from "./services/user.service";
import { UserResponse } from "./types/userResponse.type";

const roles = ["ESTUDIANTE", "PROFESOR_EDITOR", "PROFESOR_EJECUTOR"];

export default function ChangeRole() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  useEffect(() => {
    fillUsers();
  }, []);

  const fillUsers = async () => setUsers(await getUsers());

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    try {
      setLoadingUserId(userId);
      const user = {
        id: userId,
        role: newRole,
      };
      const response = await fetch(`/api/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al actualizar el rol");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message ?? "Error al cambiar el rol del usuario");
      }
      fillUsers();
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Course Header */}
        <div className="border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                Vista de lista de usuarios
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Profesor Ejecutor
              </p>
            </div>
          </div>
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

                  <div>
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      disabled={loadingUserId === user.id}
                      className="text-xs sm:text-sm p-1 border rounded"
                    >
                      {roles.map((roleOption) => (
                        <option key={roleOption} value={roleOption}>
                          {roleOption}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500">Rol</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
