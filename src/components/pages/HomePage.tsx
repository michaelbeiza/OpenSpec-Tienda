import React from 'react';

export default function HomePage() {
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
                    background: rgba(255, 255, 255, 0.02);
                    border-top: 1px solid rgba(255,255,255,0.05);
                    border-bottom: 1px solid rgba(255,255,255,0.05);
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
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                    cursor: default;
                }
                .partner-logo:hover {
                    color: rgba(255,255,255,0.9);
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
                    background: 'linear-gradient(135deg, #fff 40%, var(--color-primary))',
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
                    <a href="/register" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.1)' }}>
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
                    {[
                        { id: 1, name: 'AirMax 2024 Pro', price: 159.99, tag: 'NUEVO', img: '👟', color: 'bg-gradient-to-br from-blue-900/40 to-purple-900/20' },
                        { id: 2, name: 'TechWear Jacket', price: 210.00, tag: 'TENDENCIA', img: '🧥', color: 'bg-gradient-to-br from-emerald-900/40 to-teal-900/20' },
                        { id: 3, name: 'Urban Backpack 45L', price: 85.50, tag: 'TOP VENTAS', img: '🎒', color: 'bg-gradient-to-br from-orange-900/40 to-red-900/20' },
                        { id: 4, name: 'Smartwatch SE2', price: 299.00, tag: 'HOT', img: '⌚', color: 'bg-gradient-to-br from-slate-800/60 to-slate-900/40' },
                    ].map(p => (
                        <div key={p.id} className="card product-card-hover" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className={p.color} style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))' }}>
                                <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--color-primary)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
                                    {p.tag}
                                </div>
                                <span style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.3))' }}>{p.img}</span>
                            </div>
                            <div style={{ padding: 24 }}>
                                <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{p.name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)' }}>€{p.price.toFixed(2)}</span>
                                    <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
                    <div key={f.title} className="card" style={{ padding: 32, textAlign: 'center', border: '1px solid rgba(255,255,255,0.02)', background: 'rgba(255,255,255,0.01)', transition: 'transform 0.3s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
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
                        <div className="badge badge-primary" style={{ marginBottom: 16, background: 'rgba(124,107,255,0.1)', color: '#a78bfa', border: '1px solid rgba(124,107,255,0.2)' }}>Soporte</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>¿Tienes alguna duda? <span style={{ color: 'var(--color-primary)' }}>Escríbenos</span></h2>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 18 }}>Nuestro equipo te responderá en menos de 24 horas laborables.</p>
                    </div>

                    <div className="card" style={{ padding: 40, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado (Simulado)"); }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Nombre</label>
                                    <input type="text" placeholder="Ej. Ana Pérez" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                                </div>
                                <div style={{ flex: '1 1 200px' }}>
                                    <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Email</label>
                                    <input type="email" placeholder="tu@correo.com" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 8 }}>Mensaje</label>
                                <textarea rows={5} placeholder="¿En qué te podemos ayudar?" required style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius)', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', resize: 'vertical' }}></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ padding: '16px', fontSize: 16, fontWeight: 700, borderRadius: 'var(--radius)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', border: 'none', color: 'white', cursor: 'pointer', transition: 'filter 0.3s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.2)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>
                                Enviar mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
