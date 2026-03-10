import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

interface CategoryPageProps {
    category: string;
}

export default function CategoryPage({ category }: CategoryPageProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { addItem } = useCart();
    const [toast, setToast] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            console.log('Fetching products for category:', category);

            const { data, error: dbError } = await supabase
                .from('products')
                .select('*')
                .eq('category', category)
                .gt('inventory', 0)
                .order('created_at', { ascending: false });

            if (dbError) {
                console.error('Supabase Error:', dbError);
                setError(dbError.message);
            } else {
                setProducts(data ?? []);
            }
            setLoading(false);
        }
        load();
    }, [category]);

    const handleAdd = (p: Product) => {
        addItem(p);
        setToast(`"${p.name}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    return (
        <div style={{
            minHeight: '80vh',
            padding: '40px 24px',
            background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,107,255,0.1), transparent)',
            position: 'relative'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div className="badge badge-primary" style={{ marginBottom: 16 }}>Explorar categoría</div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 16,
                        background: 'linear-gradient(135deg, var(--color-text) 40%, var(--color-primary))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {category}
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                        Selección exclusiva de productos en la categoría {category.toLowerCase()}.
                    </p>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '3px solid var(--color-glass-border)',
                            borderTopColor: 'var(--color-primary)',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{ color: 'var(--color-text-muted)' }}>Cargando {category.toLowerCase()}...</span>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : error ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 24px',
                        background: 'rgba(239, 68, 68, 0.05)',
                        borderRadius: 'var(--radius)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444'
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Error al cargar productos</h3>
                        <p style={{ opacity: 0.8, maxWidth: 500, margin: '0 auto' }}>{error}</p>
                        <p style={{ marginTop: 16, fontSize: 13, opacity: 0.6 }}>
                            Asegúrate de haber ejecutado las migraciones SQL en Supabase (especialmente la de "category").
                        </p>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 24px',
                        background: 'var(--color-glass)',
                        borderRadius: 'var(--radius)',
                        border: '1px dashed var(--color-glass-border)'
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📭</div>
                        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No hay productos aún</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Vuelve pronto para ver las novedades en {category.toLowerCase()}.</p>
                        <a href="/products" className="btn btn-outline" style={{ marginTop: 24 }}>Ver todos los productos</a>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 32
                    }}>
                        {products.map(p => (
                            <div key={p.id} className="card" style={{
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface)',
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow)';
                                    e.currentTarget.style.border = '1px solid var(--color-primary)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.border = '1px solid var(--color-border)';
                                }}>
                                <a href={`/products/${p.id}`} style={{ display: 'block', position: 'relative', background: 'rgba(0,0,0,0.5)' }}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 240, objectFit: 'cover', transition: 'transform 0.5s' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: 'var(--color-glass)' }}>
                                            🛍️
                                        </div>
                                    )}
                                </a>

                                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                            <a href={`/products/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <h3 style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>{p.name}</h3>
                                            </a>
                                            <span style={{
                                                fontSize: 20,
                                                fontWeight: 800,
                                                color: 'var(--color-primary)'
                                            }}>
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
                                        className="btn btn-primary"
                                        style={{ width: '100%', gap: 8 }}
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                                        </svg>
                                        Añadir al carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 11 15 8 12"></polyline>
                    </svg>
                    <span style={{ fontWeight: 500 }}>{toast}</span>
                    <style>{`@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
                </div>
            )}
        </div>
    );
}
