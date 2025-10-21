"use client";
import React, { useState } from "react";

export default function RegistroPage() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nombre || !form.email || !form.password || !form.confirmar) {
      setMsg("Por favor completa todos los campos.");
      return;
    }
    if (form.password !== form.confirmar) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      // 👉 Aquí podrías conectar tu backend
      await new Promise((res) => setTimeout(res, 1000));
      setMsg("¡Registro exitoso! Ahora puedes iniciar sesión.");
    } catch (err) {
      setMsg("Ocurrió un error. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-full px-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-3xl px-16 py-14">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl">
            🍌
          </div>
        </div>

        <h1 className="text-center text-3xl font-extrabold mb-1">Bienvenido</h1>
        <p className="text-center text-gray-500 text-sm mb-10">
          Crea tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre</label>
            <input
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="w-full h-12 border border-gray-200 rounded-2xl px-4 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Email</label>
            <div className="relative">
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full h-12 border border-gray-200 rounded-2xl px-4 pr-10 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ✉️
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 border border-gray-200 rounded-2xl px-4 pr-10 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔒
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirmar contraseña
            </label>
            <input
              name="confirmar"
              type="password"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repite la contraseña"
              className="w-full h-12 border border-gray-200 rounded-2xl px-4 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-amber-500 text-white font-semibold text-lg hover:bg-amber-600 transition disabled:opacity-60"
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>

          {msg && <p className="text-center text-sm text-gray-600">{msg}</p>}

          <p className="text-center text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-amber-600 font-semibold hover:underline">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
