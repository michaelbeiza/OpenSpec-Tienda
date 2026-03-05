import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem } from '../../lib/types';

export default function ProfilePage() {
    const { user, profile, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function load() {
            const { data } = await supabase.from('orders').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
            setOrders(data ?? []);
            setLoading(false);
        }
        load();
    }, [user]);

    if (!user) return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 800, marginBottom: 16 }}>Debes iniciar sesión</h2>
            <a href="/login" className="btn btn-primary">Iniciar sesión</a>
        </div>
    );

    const toggleOrder = async (orderId: string) => {
        if (expandedOrder === orderId) { setExpandedOrder(null); return; }
        setExpandedOrder(orderId);
        if (!orderItems[orderId]) {
            const { data } = await supabase.from('order_items').select('*, product:products(name, image_url)').eq('order_id', orderId);
            setOrderItems(prev => ({ ...prev, [orderId]: data ?? [] }));
        }
    };

    const statusColor: Record<string, string> = { pending: 'warning', paid: 'primary', shipped: 'success', cancelled: 'danger' };
    const statusLabel: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' };

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: 800 }}>
            {/* Header */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 40, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800 }}>
                    {user.email?.[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontWeight: 800, marginBottom: 4 }}>{user.email}</h2>
                    <span className={`badge badge-${statusColor[profile?.role ?? 'user'] ?? 'primary'}`}>{profile?.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={signOut} style={{ color: 'var(--color-danger)' }}>Cerrar sesión</button>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Mis pedidos ({orders.length})</h2>

            {loading ? (
                <p style={{ color: 'var(--color-text-muted)' }}>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)' }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                    <p>Aún no has realizado ningún pedido.</p>
                    <a href="/products" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Empezar a comprar</a>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {orders.map(order => (
                        <div key={order.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                            <button onClick={() => toggleOrder(order.id)} style={{ width: '100%', background: 'none', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', color: 'var(--color-text)', borderBottom: expandedOrder === order.id ? '1px solid var(--color-border)' : 'none' }}>
                                <span style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)', fontSize: 13 }}>#{order.id.slice(0, 8)}</span>
                                <span className={`badge badge-${statusColor[order.status] ?? 'primary'}`}>{statusLabel[order.status] ?? order.status}</span>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>{new Date(order.created_at).toLocaleDateString('es-ES')}</span>
                                <span style={{ marginLeft: 'auto', fontWeight: 700, color: 'var(--color-primary)' }}>€{order.total.toFixed(2)}</span>
                                <span style={{ color: 'var(--color-text-muted)' }}>{expandedOrder === order.id ? '▲' : '▼'}</span>
                            </button>

                            {expandedOrder === order.id && (
                                <div style={{ padding: 24 }}>
                                    <div style={{ marginBottom: 16 }}>
                                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>Dirección de envío</p>
                                        <p style={{ fontSize: 14 }}>{order.shipping_address.name}, {order.shipping_address.address}, {order.shipping_address.city} {order.shipping_address.postal_code}, {order.shipping_address.country}</p>
                                    </div>
                                    {orderItems[order.id] ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {orderItems[order.id].map(item => (
                                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--color-text-muted)' }}>
                                                    <span>{(item as any).product?.name ?? 'Producto'} × {item.quantity}</span>
                                                    <span>€{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Cargando...</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
