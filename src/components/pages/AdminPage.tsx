import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';

type Tab = 'products' | 'orders';

export default function AdminPage() {
    const { user, role, loading } = useAuth();
    const [tab, setTab] = useState<Tab>('products');
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [form, setForm] = useState({ name: '', description: '', price: '', inventory: '', image_url: '' });
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (role !== 'admin') return;
        if (tab === 'products') loadProducts();
        else loadOrders();
    }, [role, tab]);

    async function loadProducts() {
        setLoadingData(true);
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        setProducts(data ?? []);
        setLoadingData(false);
    }

    async function loadOrders() {
        setLoadingData(true);
        const { data } = await supabase.from('orders').select('*, profiles(email)').order('created_at', { ascending: false });
        setOrders(data ?? []);
        setLoadingData(false);
    }

    const openCreate = () => { setEditProduct(null); setForm({ name: '', description: '', price: '', inventory: '', image_url: '' }); setShowForm(true); };
    const openEdit = (p: Product) => { setEditProduct(p); setForm({ name: p.name, description: p.description, price: String(p.price), inventory: String(p.inventory), image_url: p.image_url ?? '' }); setShowForm(true); };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = { name: form.name, description: form.description, price: parseFloat(form.price), inventory: parseInt(form.inventory), image_url: form.image_url || null };
        if (editProduct) {
            await supabase.from('products').update(payload).eq('id', editProduct.id);
            setToast('Producto actualizado');
        } else {
            await supabase.from('products').insert(payload);
            setToast('Producto creado');
        }
        setShowForm(false);
        setTimeout(() => setToast(''), 2500);
        loadProducts();
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este producto?')) return;
        await supabase.from('products').delete().eq('id', id);
        setProducts(prev => prev.filter(p => p.id !== id));
        setToast('Producto eliminado');
        setTimeout(() => setToast(''), 2500);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>Cargando...</div>;
    if (!user || role !== 'admin') return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🚫</div>
            <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Acceso restringido</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Esta área es solo para administradores.</p>
        </div>
    );

    const statusColor: Record<string, string> = { pending: 'warning', paid: 'primary', shipped: 'success', cancelled: 'danger' };
    const statusLabel: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>Panel de administración</h1>
                    <span className="badge badge-warning">👑 Admin</span>
                </div>
                {tab === 'products' && <button className="btn btn-primary" onClick={openCreate}>+ Nuevo producto</button>}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '1px solid var(--color-border)', paddingBottom: 0 }}>
                {(['products', 'orders'] as Tab[]).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{ padding: '10px 20px', fontWeight: 600, fontSize: 14, background: 'none', cursor: 'pointer', color: tab === t ? 'var(--color-primary)' : 'var(--color-text-muted)', borderBottom: tab === t ? '2px solid var(--color-primary)' : '2px solid transparent', transition: 'all 0.2s' }}>
                        {t === 'products' ? '📦 Productos' : '📋 Pedidos'}
                    </button>
                ))}
            </div>

            {/* Products Tab */}
            {tab === 'products' && (
                loadingData ? <p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                                    {['ID', 'Nombre', 'Precio', 'Inventario', 'Acciones'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontFamily: 'monospace', fontSize: 12 }}>{p.id.slice(0, 8)}…</td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                {p.image_url ? <img src={p.image_url} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} /> : <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📦</div>}
                                                <span style={{ fontWeight: 600 }}>{p.name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>€{p.price.toFixed(2)}</td>
                                        <td style={{ padding: '12px' }}>
                                            <span className={`badge ${p.inventory > 5 ? 'badge-success' : p.inventory > 0 ? 'badge-warning' : 'badge-danger'}`}>{p.inventory} uds.</span>
                                        </td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>✏️ Editar</button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑 Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
                loadingData ? <p style={{ color: 'var(--color-text-muted)' }}>Cargando...</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                            <thead>
                                <tr style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border)' }}>
                                    {['ID Pedido', 'Usuario', 'Estado', 'Total', 'Fecha'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: 12, color: 'var(--color-text-muted)' }}>#{o.id.slice(0, 8)}</td>
                                        <td style={{ padding: '12px', fontSize: 12 }}>{o.profiles?.email ?? '—'}</td>
                                        <td style={{ padding: '12px' }}><span className={`badge badge-${statusColor[o.status] ?? 'primary'}`}>{statusLabel[o.status] ?? o.status}</span></td>
                                        <td style={{ padding: '12px', color: 'var(--color-primary)', fontWeight: 700 }}>€{o.total.toFixed(2)}</td>
                                        <td style={{ padding: '12px', color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('es-ES')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            )}

            {/* Create/Edit Modal */}
            {showForm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={e => e.target === e.currentTarget && setShowForm(false)}>
                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 32, width: '100%', maxWidth: 480 }}>
                        <h2 style={{ fontWeight: 800, marginBottom: 24 }}>{editProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {([['name', 'Nombre', 'text'], ['description', 'Descripción', 'text'], ['price', 'Precio (€)', 'number'], ['inventory', 'Inventario', 'number'], ['image_url', 'URL de imagen (opcional)', 'url']] as [keyof typeof form, string, string][]).map(([field, label, type]) => (
                                <div key={field}>
                                    <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 500 }}>{label}</label>
                                    <input type={type} value={form[field]} onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))} placeholder={label} required={field !== 'image_url'} step={field === 'price' ? '0.01' : undefined} min={field === 'price' || field === 'inventory' ? '0' : undefined} />
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: 12 }} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
                                <button type="button" className="btn btn-ghost" style={{ flex: 1, padding: 12 }} onClick={() => setShowForm(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {toast && <div className="toast toast-success">{toast}</div>}
        </div>
    );
}
