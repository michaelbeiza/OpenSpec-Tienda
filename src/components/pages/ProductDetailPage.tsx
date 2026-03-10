import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Review } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface Props { productId: string; }

export default function ProductDetailPage({ productId }: Props) {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // UI Enhancements State
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [activeTab, setActiveTab] = useState<'features' | 'reviews'>('features');

    const { addItem } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        async function load() {
            const [{ data: prod }, { data: revs }] = await Promise.all([
                supabase.from('products').select('*').eq('id', productId).single(),
                supabase.from('reviews').select('*, user:profiles(email)').eq('product_id', productId).order('created_at', { ascending: false }),
            ]);
            setProduct(prod);
            setReviews(revs ?? []);
            setLoading(false);
        }
        load();
    }, [productId]);

    const handleAdd = () => {
        if (!product) return;
        addItem(product, quantity); // Modified context handles multiple qtys optionally based on implementation 
        setToast(`"${product.name}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    const handleReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        const { data } = await supabase.from('reviews').insert({ product_id: productId, user_id: user.id, rating, comment }).select('*, user:profiles(email)').single();
        if (data) setReviews(prev => [data, ...prev]);
        setComment('');
        setRating(5);
        setSubmitting(false);
    };

    const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,107,255,0.05), transparent)' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
    );
    if (!product) return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 64 }}>📭</div>
            <h1 style={{ fontSize: 32, fontWeight: 800 }}>Producto no encontrado</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>El artículo que buscas no existe o ha sido retirado.</p>
            <a href="/products" className="btn btn-primary" style={{ padding: '12px 24px' }}>Volver al Catálogo</a>
        </div>
    );

    // Mock gallery variations
    const galleryMocks = [
        { filter: 'none', label: 'Frontal' },
        { filter: 'saturate(1.5)', label: 'Detalle' },
        { filter: 'contrast(1.2) brightness(0.9)', label: 'Lateral' },
        { filter: 'hue-rotate(15deg)', label: 'Trasera' },
        { filter: 'sepia(0.3)', label: 'Interior' }
    ];

    return (
        <div style={{ minHeight: '100vh', padding: '40px 24px', background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,107,255,0.05), transparent)' }}>
            <div className="container" style={{ maxWidth: 1200 }}>
                {/* Breadcrumbs */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 40, color: 'var(--color-text-muted)', fontSize: 14 }}>
                    <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Inicio</a>
                    <span>/</span>
                    <a href="/products" style={{ color: 'inherit', textDecoration: 'none' }}>Catálogo</a>
                    <span>/</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{product.name}</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 60, alignItems: 'start' }}>

                    {/* Left: Gallery Component */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            borderRadius: 'var(--radius)',
                            overflow: 'hidden',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}>
                            {product.image_url ? (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: galleryMocks[activeImageIdx]?.filter,
                                        transition: 'filter 0.4s ease, transform 0.4s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            ) : (
                                <div style={{ fontSize: 100, filter: galleryMocks[activeImageIdx]?.filter, transition: 'all 0.4s' }}>🛍️</div>
                            )}
                            {product.inventory <= 5 && product.inventory > 0 && (
                                <div style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444', color: 'white', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
                                    ¡Últimas {product.inventory} uds!
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
                            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                            {galleryMocks.map((mock, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIdx(idx)}
                                    title={mock.label}
                                    style={{
                                        minWidth: 80,
                                        height: 80,
                                        borderRadius: 'var(--radius)',
                                        border: activeImageIdx === idx ? '2px solid var(--color-primary)' : '2px solid transparent',
                                        background: 'rgba(255,255,255,0.03)',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        padding: 0,
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                                    onMouseOut={e => e.currentTarget.style.opacity = '1'}
                                >
                                    {product.image_url ? (
                                        <img src={product.image_url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: mock.filter }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, filter: mock.filter }}>🖼️</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Details Component */}
                    <div style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', border: '1px solid rgba(255,255,255,0.05)' }}>REF: #{product.id.split('-')[0].toUpperCase()}</div>
                            <div className="badge badge-primary">{product.category}</div>
                        </div>

                        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16, color: 'white' }}>
                            {product.name}
                        </h1>

                        {avgRating && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                                <span style={{ color: 'var(--color-warning)', fontSize: 18 }}>{'★'.repeat(Math.round(Number(avgRating)))}{'☆'.repeat(5 - Math.round(Number(avgRating)))}</span>
                                <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{avgRating} ({reviews.length} reseñas)</span>
                            </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
                            <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--color-primary)' }}>€{product.price.toFixed(2)}</span>
                        </div>

                        <p style={{ color: 'var(--color-text-muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
                            {product.description}
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text)' }}>
                                <span style={{ padding: 8, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', borderRadius: '50%' }}>✓</span>
                                <span style={{ fontWeight: 500 }}>Disponible en stock ({product.inventory} unidades)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text)' }}>
                                <span style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>🚚</span>
                                <span style={{ fontWeight: 500 }}>Envío rápido en 24/48h</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--color-text)' }}>
                                <span style={{ padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}>🛡️</span>
                                <span style={{ fontWeight: 500 }}>3 años de garantía europea</span>
                            </div>
                        </div>

                        <button
                            onClick={handleAdd}
                            style={{
                                width: '100%',
                                padding: '18px 24px',
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                fontSize: 18,
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 10px 30px rgba(124,107,255,0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 12,
                            }}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(124,107,255,0.5)'; }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(124,107,255,0.3)'; }}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            Añadir a la cesta
                        </button>
                    </div>
                </div>

                {/* Additional Content Tabs */}
                <div style={{ marginTop: 80 }}>
                    <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 32, overflowX: 'auto' }}>
                        <button
                            onClick={() => setActiveTab('features')}
                            style={{ padding: '16px 8px', background: 'transparent', border: 'none', borderBottom: activeTab === 'features' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'features' ? 'white' : 'var(--color-text-muted)', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        >
                            Características
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            style={{ padding: '16px 8px', background: 'transparent', border: 'none', borderBottom: activeTab === 'reviews' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'reviews' ? 'white' : 'var(--color-text-muted)', fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                        >
                            Valoraciones ({reviews.length})
                        </button>
                    </div>

                    {activeTab === 'features' && (
                        <div className="card" style={{ padding: 40, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Especificaciones Técnicas</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
                                {[
                                    ['Categoría', 'Producto Comercial'],
                                    ['Material Principal', 'Premium Synthetic / Algodón'],
                                    ['Colección', 'Temporada actual'],
                                    ['Origen', 'Unión Europea'],
                                    ['Cuidado', 'Mantener en lugar seco'],
                                    ['Garantía', 'Life-time limit'],
                                    ['Peso', 'Variable según talla/tipo'],
                                    ['ID Referencia', product.id]
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ color: 'var(--color-text-muted)', width: 140 }}>{k}</span>
                                        <span style={{ fontWeight: 600 }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="card" style={{ padding: 40, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Opiniones de clientes</h3>

                            {user && (
                                <form onSubmit={handleReview} style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 40 }}>
                                    <h4 style={{ fontWeight: 600, marginBottom: 16 }}>Dejar una valoración</h4>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--color-text-muted)' }}>Puntuación</label>
                                        <select value={rating} onChange={e => setRating(+e.target.value)} style={{ padding: '10px 16px', borderRadius: 'var(--radius)', background: 'var(--color-surface)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                                        </select>
                                    </div>
                                    <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comparte tu opinión sobre este producto..." required style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius)', background: 'var(--color-surface)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', marginBottom: 16, resize: 'vertical', minHeight: 100 }} />
                                    <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? 'Enviando...' : 'Publicar reseña'}</button>
                                </form>
                            )}

                            {reviews.length === 0 ? (
                                <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 40 }}>No hay reseñas todavía para este producto.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {reviews.map(r => (
                                        <div key={r.id} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius)', padding: 24 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <span style={{ color: 'var(--color-warning)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                                    <span style={{ fontWeight: 600, color: 'white' }}>{r.user?.email.split('@')[0]}</span>
                                                </div>
                                                <span style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>{new Date(r.created_at).toLocaleDateString('es-ES')}</span>
                                            </div>
                                            {r.comment && <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--color-text)' }}>{r.comment}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span style={{ fontWeight: 500 }}>{toast}</span>
                    <style>{`@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
                </div>
            )}
        </div>
    );
}
