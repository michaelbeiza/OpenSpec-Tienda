import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

export default function HomePage() {
    const { user, openAuthModal } = useAuth();
    const { addItem } = useCart();
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (user) {
            setLoading(true);
            const fetchProducts = async () => {
                try {
                    const { data, error } = await supabase
                        .from('products')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(8);
                    
                    if (!error) {
                        setFeaturedProducts(data ?? []);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            fetchProducts();
        }
    }, [user]);

    const handleAdd = (p: Product) => {
        addItem(p);
        setToast(`"${p.name}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    return (
        <div>
            {/* Hero */}
            <section style={{
                minHeight: '70vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 24px',
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,107,255,0.15), transparent)',
            }}>
                <div className="badge badge-primary" style={{ marginBottom: 24 }}>✨ Nueva colección disponible</div>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #fff 40%, var(--color-primary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Tu tienda favorita<br />en un solo lugar
                </h1>
                <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
                    Descubre los mejores productos con los mejores precios. Compra seguro, rápido y fácil.
                </p>
                
                {!user && (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <a href="/products" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)' }}>
                            Ver productos →
                        </a>
                        <button onClick={() => openAuthModal('register')} className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)' }}>
                            Crear cuenta
                        </button>
                    </div>
                )}
            </section>

            {/* Featured Products for Authenticated Users */}
            {user && (
                <section className="container" style={{ paddingBottom: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Tu Selección Exclusiva</h2>
                            <p style={{ color: 'var(--color-text-muted)' }}>Hemos seleccionado estos productos especialmente para ti</p>
                        </div>
                        <a href="/products" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Ver todo</a>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>Cargando sugerencias...</div>
                    ) : featuredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius)' }}>
                            Aún no hay productos en la base de datos.
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 24 }}>
                            {featuredProducts.map(p => (
                                <div key={p.id} className="card">
                                    <a href={`/products/${p.id}`} style={{ display: 'block' }}>
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: 200, background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                                        )}
                                    </a>
                                    <div style={{ padding: 20 }}>
                                        <a href={`/products/${p.id}`} style={{ textDecoration: 'none' }}>
                                            <h3 style={{ fontWeight: 700, marginBottom: 6, fontSize: 16 }}>{p.name}</h3>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                                        </a>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-primary)' }}>€{p.price.toFixed(2)}</span>
                                            <button className="btn btn-primary btn-sm" onClick={() => handleAdd(p)}>+ Carrito</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Features */}
            <section className="container" style={{ paddingBottom: 80 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
                    {[
                        { icon: '🔒', title: 'Pago seguro', desc: 'Transacciones cifradas y protegidas' },
                        { icon: '🚀', title: 'Envío rápido', desc: 'Entregamos en 24–48 horas' },
                        { icon: '↩️', title: 'Devoluciones', desc: '30 días sin preguntas' },
                        { icon: '💬', title: 'Soporte 24/7', desc: 'Siempre aquí para ayudarte' },
                    ].map(f => (
                        <div key={f.title} className="card" style={{ padding: 28, textAlign: 'center' }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {toast && <div className="toast toast-success">{toast}</div>}
        </div>
    );
}
