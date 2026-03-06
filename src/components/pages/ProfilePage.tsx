import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem } from '../../lib/types';

export default function ProfilePage() {
    const { user, profile, signOut, openAuthModal } = useAuth();
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
            <button onClick={() => openAuthModal('login')} className="btn btn-primary">Iniciar sesión</button>
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

    const interests = ['Gaming 4K', 'Inteligencia Artificial', 'Fotografía Profesional', 'Audio Hi-Fi', 'Drones & Robótica', 'Smart Home'];

    return (
        <div className="container" style={{ padding: '40px 24px', maxWidth: 1000 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 32, marginBottom: 40 }}>
                {/* User Info Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 800, margin: '0 auto 20px', color: '#fff', border: '4px solid var(--color-surface2)' }}>
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{user.email?.split('@')[0]}</h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14, marginBottom: 16 }}>{user.email}</p>
                        <span className={`badge badge-${statusColor[profile?.role ?? 'user'] ?? 'primary'}`} style={{ padding: '6px 16px', borderRadius: 20 }}>
                            {profile?.role === 'admin' ? '👑 Administrador' : '👤 Cliente VIP'}
                        </span>
                        
                        <div style={{ marginTop: 32, borderTop: '1px solid var(--color-border)', paddingTop: 24, textAlign: 'left' }}>
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Teléfono</p>
                                <p style={{ fontWeight: 600 }}>+34 600 123 456</p>
                            </div>
                            <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Ubicación</p>
                                <p style={{ fontWeight: 600 }}>Madrid, España</p>
                            </div>
                            <div>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Miembro desde</p>
                                <p style={{ fontWeight: 600 }}>Enero 2024</p>
                            </div>
                        </div>
                        
                        <button className="btn btn-ghost btn-sm" onClick={signOut} style={{ color: 'var(--color-danger)', marginTop: 32, width: '100%', fontWeight: 700 }}>
                            Cerrar sesión
                        </button>
                    </div>

                    <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Intereses Tecnológicos</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {interests.map(interest => (
                                <span key={interest} style={{ padding: '6px 12px', background: 'var(--color-surface2)', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid var(--color-border)' }}>
                                    {interest}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Orders Column */}
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                        Mis pedidos <span style={{ fontSize: 14, background: 'var(--color-primary)', color: '#fff', padding: '2px 10px', borderRadius: 10 }}>{orders.length}</span>
                    </h2>

                    {loading ? (
                        <p style={{ color: 'var(--color-text-muted)' }}>Cargando pedidos...</p>
                    ) : orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 60, color: 'var(--color-text-muted)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                            <p>Aún no has realizado ningún pedido.</p>
                            <a href="/products" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>Empezar a comprar</a>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {orders.map(order => (
                                <div key={order.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                                    <button onClick={() => toggleOrder(order.id)} style={{ width: '100%', background: 'none', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', color: 'var(--color-text)', borderBottom: expandedOrder === order.id ? '1px solid var(--color-border)' : 'none', border: 'none', textAlign: 'left' }}>
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
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    {orderItems[order.id].map(item => (
                                                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--color-surface2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                                            <div style={{ width: 44, height: 44, borderRadius: 6, overflow: 'hidden', background: 'var(--color-bg)', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                                                                {(item as any).product?.image_url ? (
                                                                    <img 
                                                                        src={(item as any).product.image_url} 
                                                                        alt={(item as any).product.name} 
                                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                                    />
                                                                ) : (
                                                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>
                                                                )}
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{(item as any).product?.name ?? 'Producto'}</p>
                                                                <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Cantidad: {item.quantity}</p>
                                                            </div>
                                                            <div style={{ textAlign: 'right' }}>
                                                                <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>€{(item.price_at_purchase * item.quantity).toFixed(2)}</p>
                                                            </div>
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
            </div>
        </div>
    );
}
