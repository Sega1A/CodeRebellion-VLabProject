"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [message, setMessage] = useState("Verificando...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setMessage("Token no encontrado.");
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => res.text())
      .then((message) => {
        setMessage(message);
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      })
      .catch(() => setMessage("Error al verificar la cuenta."));
  }, [token]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl font-bold mb-4">Verificación de cuenta</h1>
      <p>{message}</p>

      {message.toLowerCase().includes("verificada") && (
        <p className="text-sm mt-2 text-gray-500">Redirigiendo al inicio...</p>
      )}
    </main>
  );
}
