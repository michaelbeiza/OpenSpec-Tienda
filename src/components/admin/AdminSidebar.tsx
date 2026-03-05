import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface Props { currentPath: string; }

const navItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/productos', icon: '📦', label: 'Productos' },
    { href: '/admin/usuarios', icon: '👥', label: 'Usuarios' },
];

export default function AdminSidebar({ currentPath }: Props) {
    const { user, signOut } = useAuth();

    return (
        <aside className="w-64 min-h-screen bg-[#1a1a2e] border-r border-[#2a2a4a] flex flex-col flex-shrink-0">
            {/* Brand */}
            <div className="p-6 border-b border-[#2a2a4a]">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#7c6bff] flex items-center justify-center text-lg">🛒</div>
                    <div>
                        <p className="font-bold text-sm">Tienda Online</p>
                        <p className="text-xs text-gray-500">Panel Admin</p>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => {
                    const active = currentPath === item.href;
                    return (
                        <a key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-[#7c6bff] text-white' : 'text-gray-400 hover:bg-[#2a2a4a] hover:text-white'}`}>
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </a>
                    );
                })}
            </nav>

            {/* User */}
            <div className="p-4 border-t border-[#2a2a4a]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6bff] to-[#a855f7] flex items-center justify-center text-sm font-bold">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{user?.email}</p>
                        <p className="text-xs text-[#7c6bff]">Administrador</p>
                    </div>
                </div>
                <button onClick={signOut}
                    className="w-full text-xs text-gray-400 hover:text-red-400 transition-colors text-left py-1">
                    Cerrar sesión →
                </button>
            </div>
        </aside>
    );
}
