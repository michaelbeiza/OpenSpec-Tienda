import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import AdminSidebar from './AdminSidebar';
import ProductForm from './ProductForm';
import { useAuth } from '../../context/AuthContext';

export default function ProductsTable() {
    const { user, role, loading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!loading && !user) window.location.href = '/login';
        if (!loading && role && role !== 'admin') window.location.href = '/';
    }, [loading, user, role]);

    useEffect(() => { if (role === 'admin') loadProducts(); }, [role]);

    async function loadProducts() {
        setLoadingData(true);
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        setProducts(data ?? []);
        setLoadingData(false);
    }

    const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Producto eliminado');
    };

    const openCreate = () => { setEditProduct(null); setShowForm(true); };
    const openEdit = (p: Product) => { setEditProduct(p); setShowForm(true); };

    const handleSaved = () => { setShowForm(false); loadProducts(); showToast(editProduct ? 'Producto actualizado' : 'Producto creado'); };

    if (loading || !user) return <div className="flex-1 flex items-center justify-center text-gray-400">Cargando...</div>;
    if (role !== 'admin') return null;

    return (
        <>
            <AdminSidebar currentPath="/admin/productos" />
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Productos</h1>
                            <p className="text-gray-400 text-sm">{products.length} productos en total</p>
                        </div>
                        <button onClick={openCreate}
                            className="bg-[#7c6bff] hover:bg-[#6b5cee] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                            + Nuevo producto
                        </button>
                    </div>

                    <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl overflow-hidden">
                        {loadingData ? (
                            <div className="p-8 text-center text-gray-400">Cargando productos...</div>
                        ) : products.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-4xl mb-3">📦</div>
                                <p className="text-gray-400">No hay productos. ¡Crea el primero!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-[#2a2a4a]">
                                        <tr className="text-gray-400 text-left">
                                            <th className="px-5 py-4 font-medium">Imagen</th>
                                            <th className="px-5 py-4 font-medium">Nombre</th>
                                            <th className="px-5 py-4 font-medium">ID</th>
                                            <th className="px-5 py-4 font-medium">Precio</th>
                                            <th className="px-5 py-4 font-medium">Stock</th>
                                            <th className="px-5 py-4 font-medium">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a4a]">
                                        {products.map(p => (
                                            <tr key={p.id} className="hover:bg-[#2a2a4a]/30 transition-colors">
                                                <td className="px-5 py-3">
                                                    {p.image_url
                                                        ? <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                                        : <div className="w-10 h-10 rounded-lg bg-[#0d0d1a] flex items-center justify-center">📦</div>}
                                                </td>
                                                <td className="px-5 py-3 font-medium">{p.name}</td>
                                                <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.id.slice(0, 8)}…</td>
                                                <td className="px-5 py-3 text-[#7c6bff] font-bold">€{p.price.toFixed(2)}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${p.inventory > 5 ? 'bg-green-500/10 text-green-400' : p.inventory > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                                                        {p.inventory} uds.
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openEdit(p)}
                                                            className="px-3 py-1.5 rounded-lg bg-[#0d0d1a] hover:bg-[#7c6bff]/20 text-gray-300 hover:text-[#7c6bff] transition-colors text-xs font-medium">
                                                            ✏️ Editar
                                                        </button>
                                                        <button onClick={() => handleDelete(p.id, p.name)}
                                                            className="px-3 py-1.5 rounded-lg bg-[#0d0d1a] hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors text-xs font-medium">
                                                            🗑 Eliminar
                                                        </button>
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

            {showForm && <ProductForm product={editProduct} onClose={() => setShowForm(false)} onSaved={handleSaved} />}

            {toast && (
                <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
                    ✓ {toast}
                </div>
            )}
        </>
    );
}
