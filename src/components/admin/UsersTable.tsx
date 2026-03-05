import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import UserOrdersModal from './UserOrdersModal';

interface UserProfile { id: string; email: string; role: string; created_at: string; }

export default function UsersTable() {
    const { user, role, loading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [search, setSearch] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [ordersModal, setOrdersModal] = useState<UserProfile | null>(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!loading && !user) window.location.href = '/login';
        if (!loading && role && role !== 'admin') window.location.href = '/';
    }, [loading, user, role]);

    useEffect(() => { if (role === 'admin') loadUsers(); }, [role]);

    async function loadUsers() {
        setLoadingData(true);
        const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        setUsers(data ?? []);
        setLoadingData(false);
    }

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const handleRoleChange = async (userId: string, newRole: string) => {
        await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast('Rol actualizado');
    };

    const handleDelete = async (u: UserProfile) => {
        if (u.id === user?.id) return; // self-delete guard
        const adminCount = users.filter(p => p.role === 'admin').length;
        if (u.role === 'admin' && adminCount <= 1) { showToast('No puedes eliminar el último administrador.'); return; }
        if (!confirm(`¿Eliminar a "${u.email}"? Esta acción no se puede deshacer.`)) return;
        await supabase.from('profiles').delete().eq('id', u.id);
        setUsers(prev => prev.filter(p => p.id !== u.id));
        showToast('Usuario eliminado');
    };

    const filtered = users.filter(u => u.email?.toLowerCase().includes(search.toLowerCase()));

    if (loading || !user) return <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>;
    if (role !== 'admin') return null;

    return (
        <>
            <AdminSidebar currentPath="/admin/usuarios" />
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Usuarios</h1>
                            <p className="text-gray-400 text-sm">{users.length} usuarios registrados</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-4">
                        <input type="text" placeholder="🔍 Buscar por email..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full max-w-sm bg-[#1a1a2e] border border-[#2a2a4a] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors placeholder-gray-600" />
                    </div>

                    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">
                        {loadingData ? (
                            <div className="p-8 text-center text-gray-400">Cargando usuarios...</div>
                        ) : filtered.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-3">👥</div>
                                <p className="text-gray-400">{search ? 'No se encontraron usuarios.' : 'No hay usuarios.'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[#2a2a4a]">
                                        <tr className="text-gray-400 text-left">
                                            <th className="px-5 py-4 font-medium">Usuario</th>
                                            <th className="px-5 py-4 font-medium">Rol</th>
                                            <th className="px-5 py-4 font-medium">Registro</th>
                                            <th className="px-5 py-4 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a4a]">
                                        {filtered.map(u => (
                                            <tr key={u.id} className="hover:bg-[#2a2a4a]/30 transition-colors">
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c6bff] to-[#a855f7] flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                            {u.email?.[0]?.toUpperCase() ?? '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{u.email}</p>
                                                            {u.id === user.id && <p className="text-xs text-[#7c6bff]">Tú</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                                                        disabled={u.id === user.id}
                                                        className="bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#7c6bff] disabled:opacity-50 cursor-pointer">
                                                        <option value="user">Usuario</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="px-5 py-3 text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString('es-ES')}</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => setOrdersModal(u)}
                                                            className="px-3 py-1.5 rounded-lg bg-[#0d0d1a] hover:bg-[#7c6bff]/20 text-gray-300 hover:text-[#7c6bff] transition-colors text-xs font-medium">
                                                            📋 Pedidos
                                                        </button>
                                                        {u.id !== user.id && (
                                                            <button onClick={() => handleDelete(u)}
                                                                className="px-3 py-1.5 rounded-lg bg-[#0d0d1a] hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors text-xs font-medium">
                                                                🗑 Eliminar
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {ordersModal && <UserOrdersModal userId={ordersModal.id} email={ordersModal.email} onClose={() => setOrdersModal(null)} />}

            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
                    ✓ {toast}
                </div>
            )}
        </>
    );
}
