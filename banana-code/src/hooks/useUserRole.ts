import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export function useUserRole() {
  const { data: session } = useSession();
  
  const userRole = (session?.user as { role?: Role } | undefined)?.role;
  
  const isAdmin = userRole === Role.ADMINISTRADOR;
  const isProfesorEditor = userRole === Role.PROFESOR_EDITOR;
  const isProfesorEjecutor = userRole === Role.PROFESOR_EJECUTOR;
  const isEstudiante = userRole === Role.ESTUDIANTE;
  
  const hasRole = (roles: Role[]) => {
    return userRole ? roles.includes(userRole) : false;
  };
  
  return {
    role: userRole,
    isAdmin,
    isProfesorEditor,
    isProfesorEjecutor,
    isEstudiante,
    hasRole,
  };
}
