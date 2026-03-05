import React from 'react';

export default function HomePage() {
    return (
        <div>
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
                <div className="badge badge-primary" style={{ marginBottom: 24 }}>✨ Nueva colección disponible</div>
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
                    <a href="/products" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)' }}>
                        Ver productos →
                    </a>
                    <a href="/register" className="btn btn-ghost" style={{ fontSize: 16, padding: '14px 32px', borderRadius: 'var(--radius)' }}>
                        Crear cuenta
                    </a>
                </div>
            </section>

            {/* Features */}
            <section className="container" style={{ paddingBottom: 80, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 24 }}>
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
            </section>
        </div>
    );
}
