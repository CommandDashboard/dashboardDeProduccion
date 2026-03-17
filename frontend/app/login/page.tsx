'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '../components/AuthContext';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${api.baseURL}${api.endpoints.auth.login}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.jwt, data.user);
      } else {
        // More human-friendly error messages
        const errorMsg = data?.error?.message === 'Invalid identifier or password' 
          ? 'El usuario o la contraseña no son correctos. Por favor, inténtalo de nuevo.'
          : 'Ha ocurrido un error al intentar iniciar sesión. Verifica tu conexión.';
        setError(errorMsg);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('No se pudo conectar con el servidor. Verifica que el sistema esté en línea.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1c] flex items-center justify-center p-6 font-inter">
      {/* Dynamic background - subtle and professional */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-100 dark:bg-blue-900/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-slate-50 dark:bg-slate-800/20 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-[400px] z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6">
            <Image
              src="/Cosentino-Logo.png"
              alt="Cosentino"
              width={200}
              height={50}
              className="object-contain dark:invert"
              priority
            />
          </div>
          <div className="h-px w-12 bg-slate-200 dark:bg-slate-800 mb-6" />
          <h1 className="text-sm font-bold tracking-[0.2em] text-slate-400 dark:text-slate-500 uppercase text-center">
            Quality Management System
          </h1>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-2xl p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-1">
              Bienvenido
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Introduce tus credenciales para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 px-4 py-3 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400 leading-relaxed font-medium">
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-1.5 font-medium">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5 font-medium">
              <label className="text-[11px] text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-1 focus:ring-slate-300 dark:focus:ring-slate-700 outline-none transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#111827] dark:bg-white dark:text-[#111827] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {loading ? 'Iniciando sesión...' : 'Entrar en el sistema'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-10 text-center">
          <p className="text-[10px] text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] font-medium">
            © {new Date().getFullYear()} Cosentino Group
          </p>
        </div>
      </div>
    </div>
  );
}
