"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@prisma/client";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

export default function RoleBasedRoute({
  children,
  allowedRoles,
  redirectTo = "/home",
}: RoleBasedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session.user as any)?.role as Role | undefined;

    if (userRole && !allowedRoles.includes(userRole)) {
      router.push(redirectTo);
    }
  }, [session, status, router, allowedRoles, redirectTo]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🍌</div>
          <p className="text-gray-700 font-medium">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userRole = (session.user as any)?.role as Role | undefined;

  if (userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
}
