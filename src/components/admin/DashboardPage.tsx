import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import AdminSidebar from './AdminSidebar';

interface Stats { products: number; users: number; orders: number; revenue: number; }

export default function DashboardPage() {
    const { user, role, loading } = useAuth();
    const [stats, setStats] = useState<Stats>({ products: 0, users: 0, orders: 0, revenue: 0 });
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!user) return;
        if (role === null) return;
        if (role !== 'admin') { window.location.href = '/'; return; }

        async function loadStats() {
            const [{ count: products }, { count: users }, { data: orders }] = await Promise.all([
                supabase.from('products').select('*', { count: 'exact', head: true }),
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('orders').select('total'),
            ]);
            const revenue = (orders ?? []).reduce((s: number, o: any) => s + (o.total ?? 0), 0);
            setStats({ products: products ?? 0, users: users ?? 0, orders: (orders ?? []).length, revenue });
            setLoadingStats(false);
        }
        loadStats();
    }, [user, role]);

    useEffect(() => {
        if (!loading && !user) window.location.href = '/login';
    }, [loading, user]);

    if (loading || !user || role !== 'admin') return (
        <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>
    );

    const cards = [
        { label: 'Productos', value: stats.products, icon: '📦', color: 'from-violet-500 to-violet-700' },
        { label: 'Usuarios', value: stats.users, icon: '👥', color: 'from-blue-500 to-blue-700' },
        { label: 'Pedidos', value: stats.orders, icon: '🛒', color: 'from-green-500 to-green-700' },
        { label: 'Ingresos', value: `€${stats.revenue.toFixed(2)}`, icon: '💰', color: 'from-amber-500 to-amber-700' },
    ];

    return (
        <>
            <AdminSidebar currentPath="/admin/dashboard" />
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                        <p className="text-gray-400 text-sm">Resumen general de la tienda</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                        {cards.map(c => (
                            <div key={c.label} className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-5">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-lg mb-4`}>{c.icon}</div>
                                {loadingStats
                                    ? <div className="h-7 w-16 bg-[#2a2a4a] rounded animate-pulse mb-1" />
                                    : <p className="text-2xl font-bold mb-1">{c.value}</p>}
                                <p className="text-gray-400 text-sm">{c.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6">
                            <h2 className="font-semibold mb-4">Accesos rápidos</h2>
                            <div className="space-y-2">
                                {[
                                    { href: '/admin/productos', label: 'Gestionar productos', icon: '📦' },
                                    { href: '/admin/usuarios', label: 'Gestionar usuarios', icon: '👥' },
                                ].map(l => (
                                    <a key={l.href} href={l.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0d0d1a] hover:bg-[#2a2a4a] transition-colors text-sm">
                                        <span>{l.icon}</span> {l.label}
                                        <span className="ml-auto text-gray-500">→</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <div className="text-4xl mb-3">🚀</div>
                            <p className="font-semibold mb-1">Panel completo activo</p>
                            <p className="text-gray-400 text-sm">Todos los módulos de administración están funcionando correctamente.</p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
