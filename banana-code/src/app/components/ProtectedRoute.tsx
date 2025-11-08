"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) router.push("/"); 
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-100">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🍌</div>
          <p className="text-gray-700 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; 
  }

  return <>{children}</>;
}
