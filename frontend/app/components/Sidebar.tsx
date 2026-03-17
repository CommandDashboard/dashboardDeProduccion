'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api';
import Image from 'next/image';
import { useState, useEffect } from 'react';

// Hook para que las páginas puedan pasar el control del sidebar
// y para exportar el botón hamburguesa reutilizable
export function useSidebar() {
  const [open, setOpen] = useState(false);
  return { open, setOpen, toggle: () => setOpen((v) => !v) };
}

export function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden flex items-center justify-center size-10 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Abrir menú"
    >
      <span className="material-symbols-outlined">menu</span>
    </button>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      window.location.href = '/login';
    }
  };

  const navLinks = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    { href: '/defects', icon: 'report_problem', label: 'Registrar Fallo' },
    { href: '/batches', icon: 'inventory_2', label: 'Lotes' },
    { href: '/history', icon: 'history', label: 'Historial' },
  ];

  return (
    <>
      {/* ── Botón hamburguesa (visible sólo en móvil / tablet) ── */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-30 flex items-center justify-center size-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined text-xl">menu</span>
      </button>

      {/* ── Overlay oscuro en móvil ── */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-64
          border-r border-slate-200 dark:border-slate-800
          bg-white dark:bg-slate-900
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-20
        `}
      >
        {/* Header del sidebar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center bg-white dark:bg-white p-3 rounded-lg">
              <Image
                src="/Cosentino-Logo.png"
                alt="Cosentino"
                width={160}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium text-center">
              COSENTINO QUALITY TRACKER
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navLinks.map(({ href, icon, label }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive(href) && (href === '/' ? pathname === '/' : true)
                  ? 'bg-[#1173d4] text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Pie del sidebar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 mb-2">
            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-slate-500 text-sm">person</span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">RICARDO</span>
              <span className="text-[10px] text-slate-500">Turno Indefinido</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-sm font-medium transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}
