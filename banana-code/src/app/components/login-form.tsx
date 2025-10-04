"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import dynamic from "next/dynamic";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "Ingrese un correo electrónico válido" }),
  password: z
    .string()
    .min(1, { message: "La contraseña es obligatoria" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

function LoginFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<"google" | "microsoft" | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setIsSubmitting(true);
    console.log("Iniciando sesión con:", data);

    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const handleOAuthLogin = (provider: "google" | "microsoft") => {
    setIsOAuthLoading(provider);
    console.log(`Autenticando con ${provider}...`);

    setTimeout(() => {
      setIsOAuthLoading(null);
    }, 2000);
  };

  const isLoading = isSubmitting || isOAuthLoading !== null;

  return (
    <div className="w-full">
      <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl p-6 sm:p-8 relative">

        {/* Loading Overlay con Banana girando */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 flex flex-col items-center shadow-2xl">
              <div className="text-6xl animate-spin">🍌</div>
              <p className="mt-4 text-gray-700 font-medium">
                {isOAuthLoading
                  ? `Autenticando con ${isOAuthLoading === 'google' ? 'Google' : 'Microsoft'}...`
                  : 'Iniciando sesión...'}
              </p>
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 sm:w-12 sm:h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="#1f2937" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#1f2937" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-1">
          Bienvenido
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Inicia sesión para continuar
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="tu@email.com"
                className={`w-full pl-11 pr-4 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 text-sm sm:text-base ${errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400'
                  }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register("password")}
                placeholder="········"
                className={`w-full pl-11 pr-12 py-2.5 sm:py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-gray-50 text-sm sm:text-base ${errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-yellow-400 focus:border-yellow-400'
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2.5 sm:py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Iniciar Sesión
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-xs sm:text-sm text-gray-500 font-medium">O continúa con</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium text-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
            </svg>
            <span className="hidden sm:inline">Continuar con Google</span>
            <span className="sm:hidden">Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('microsoft')}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
          >
            <svg width="20" height="20" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            <span className="hidden sm:inline">Continuar con Microsoft</span>
            <span className="sm:hidden">Microsoft</span>
          </button>
        </div>

        {/* Link de contraseña olvidada */}
        <div className="mt-5 text-center">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}


const LoginForm = dynamic(() => Promise.resolve(LoginFormComponent), { ssr: false });
export default LoginForm;