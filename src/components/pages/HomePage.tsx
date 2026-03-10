import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addItem } = useCart();
    const [toast, setToast] = useState('');

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .gt('inventory', 0)
                .order('created_at', { ascending: false })
                .limit(4);
            setProducts(data ?? []);
            setLoading(false);
        }
        load();
    }, []);

    const handleAdd = (p: Product) => {
        addItem(p);
        setToast(`"${p.name}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    return (
        <div style={{ overflowX: 'hidden' }}>
            <style>
                {`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-container {
                    overflow: hidden;
                    white-space: nowrap;
                    position: relative;
                    width: 100%;
                    padding: 40px 0;
                    background: var(--color-glass);
                    border-top: 1px solid var(--color-glass-border);
                    border-bottom: 1px solid var(--color-glass-border);
                }
                .marquee-content {
                    display: inline-block;
                    animation: scroll 30s linear infinite;
                }
                .marquee-content:hover {
                    animation-play-state: paused;
                }
                .partner-logo {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 800;
                    margin: 0 40px;
                    color: var(--color-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                    cursor: default;
                }
                .partner-logo:hover {
                    color: var(--color-text);
                    transform: scale(1.05);
                }
                .product-card-hover {
                    transition: all 0.3s ease;
                }
                .product-card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -10px rgba(124,107,255,0.2);
                    border-color: rgba(124,107,255,0.4);
                }
                `}
            </style>

            {/* Hero */}
            <section style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '80px 24px',
                background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(124,107,255,0.15), transparent)',
            }}>
                <div className="badge badge-primary" style={{ marginBottom: 24, padding: '8px 16px', background: 'rgba(124,107,255,0.1)', border: '1px solid rgba(124,107,255,0.3)', color: '#a78bfa' }}>
                    ✨ Nueva colección disponible
                </div>
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, var(--color-text) 40%, var(--color-primary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Tu tienda favorita<br />en un solo lugar
                </h1>
                <p style={{ fontSize: 18, color: 'var(--color-text-muted)', maxWidth: 520, marginBottom: 40, lineHeight: 1.7 }}>
                    Descubre los mejores productos con los mejores precios. Compra seguro, rápido y fácil.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <a href="/products" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)', boxShadow: '0 4px 20px rgba(124,107,255,0.4)' }}>
                        Ver productos →
                    </a>
                    <a href="/register" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                        Crear cuenta
                    </a>
                </div>
            </section>

            {/* Infinite Logo Marquee */}
            <section className="marquee-container">
                <div className="marquee-content">
                    {/* Generamos dos conjuntos de logos idénticos para que el loop infinito sea fluido */}
                    {[1, 2].map((set) => (
                        <span key={set}>
                            <span className="partner-logo" style={{ fontFamily: 'Impact, sans-serif', fontStyle: 'italic' }}>NIKE</span>
                            <span className="partner-logo" style={{ fontFamily: 'Arial Black, sans-serif' }}>ADIDAS</span>
                            <span className="partner-logo" style={{ fontFamily: 'Georgia, serif', textTransform: 'lowercase' }}>amazon</span>
                            <span className="partner-logo" style={{ fontFamily: 'Trebuchet MS, sans-serif', letterSpacing: '4px' }}>ZALANDO</span>
                            <span className="partner-logo" style={{ fontFamily: 'Courier New, monospace', fontWeight: 'bold' }}>SUPREME</span>
                            <span className="partner-logo" style={{ letterSpacing: '1px' }}>PUMA</span>
                            <span className="partner-logo" style={{ fontStyle: 'italic' }}>VANS</span>
                            <span className="partner-logo" style={{ fontWeight: 900 }}>THE NORTH FACE</span>
                        </span>
                    ))}
                </div>
            </section>

            {/* TOP Novedades (Estético) */}
            <section className="container" style={{ padding: '100px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8 }}>🔥 TOP Novedades</h2>
                        <p style={{ color: 'var(--color-text-muted)' }}>Lo más deseado de esta temporada.</p>
                    </div>
                    <a href="/products" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        Ver todo
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 24 }}>
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="card" style={{ height: 400, background: 'var(--color-surface)', border: '1px solid var(--color-border)', animation: 'pulse 1.5s infinite' }}></div>
                        ))
                    ) : (
                        products.map(p => (
                            <div key={p.id} className="card product-card-hover" style={{
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(124,107,255,0.2)';
                                    e.currentTarget.style.border = '1px solid var(--color-primary)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.border = '1px solid var(--color-border)';
                                }}>
                                <a href={`/products/${p.id}`} style={{ display: 'block', position: 'relative', background: 'rgba(0,0,0,0.5)' }}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 260, objectFit: 'cover', transition: 'transform 0.5s' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', background: 'var(--color-glass)' }}>
                                            🛍️
                                        </div>
                                    )}
                                    {p.inventory <= 5 && p.inventory > 0 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            background: '#ef4444',
                                            color: 'white',
                                            padding: '4px 10px',
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: 800,
                                            letterSpacing: 1,
                                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                                        }}>
                                            ¡Quedan {p.inventory}!
                                        </div>
                                    )}
                                </a>
                                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <a href={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <h3 style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>{p.name}</h3>
                                            </a>
                                            <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>
                                                €{p.price.toFixed(2)}
                                            </span>
                                        </div>
                                        <div style={{ marginBottom: 12 }}>
                                            <span style={{
                                                fontSize: 11,
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                padding: '4px 8px',
                                                background: 'var(--color-glass)',
                                                borderRadius: 4,
                                                color: 'var(--color-text-muted)',
                                                border: '1px solid var(--color-glass-border)'
                                            }}>
                                                {p.category}
                                            </span>
                                        </div>
                                        <p style={{
                                            color: 'var(--color-text-muted)',
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            marginBottom: 24
                                        }}>
                                            {p.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(p)}
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: 'var(--radius)',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 4px 15px rgba(124,107,255,0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 8
                                        }}
                                        onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'}
                                        onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Features */}
            <section className="container" style={{ paddingBottom: 100, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
                {[
                    { icon: '🔒', title: 'Pago seguro', desc: 'Transacciones cifradas y protegidas' },
                    { icon: '🚀', title: 'Envío rápido', desc: 'Entregamos en 24–48 horas' },
                    { icon: '↩️', title: 'Devoluciones', desc: '30 días sin preguntas' },
                    { icon: '💬', title: 'Soporte 24/7', desc: 'Siempre aquí para ayudarte' },
                ].map(f => (
                    <div key={f.title} className="card" style={{ padding: 32, textAlign: 'center', border: '1px solid var(--color-glass-border)', background: 'var(--color-glass)', transition: 'transform 0.3s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                        <h3 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{f.title}</h3>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* Escríbenos / Contacto */}
            <section style={{
                padding: '100px 24px',
                background: 'linear-gradient(to bottom, transparent, rgba(124,107,255,0.05))',
                borderTop: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <div className="badge badge-primary" style={{ marginBottom: 16, background: 'rgba(124,107,255,0.1)', color: 'var(--color-primary)', border: '1px solid rgba(124,107,255,0.2)' }}>Soporte</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>¿Tienes alguna duda? <span style={{ color: 'var(--color-primary)' }}>Escríbenos</span></h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>Nuestro equipo te responderá en menos de 24 horas laborables.</p>
                    </div>

                    <div className="card" style={{ padding: 40, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado (Simulado)"); }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Nombre</label>
                                    <input type="text" placeholder="Ej. Ana Pérez" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} />
                                </div>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Email</label>
                                    <input type="email" placeholder="tu@correo.com" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Mensaje</label>
                                <textarea rows={5} placeholder="¿En qué te podemos ayudar?" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-text)', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', border: 'none', color: 'white', cursor: 'pointer', transition: 'filter 0.3s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.2)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </section>
            {/* Toast */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: 32,
                    right: 32,
                    background: 'rgba(34, 197, 94, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    zIndex: 100,
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span style={{ fontWeight: 500 }}>{toast}</span>
                    <style>{`
                        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                    `}</style>
                </div>
            )}
        </div>
    );
}
