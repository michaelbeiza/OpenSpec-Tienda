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
        addItem(product, quantity);
        setToast(`${quantity}x "${product.name}" añadido al carrito`);
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

    if (loading) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>Cargando...</div>;
    if (!product) return <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>Producto no encontrado.</div>;

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <a href="/products" style={{ color: 'var(--color-text-muted)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>← Volver</a>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))', gap: 48 }}>
                <div>
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius)', objectFit: 'cover', aspectRatio: '1/1' }} />
                    ) : (
                        <div style={{ width: '100%', aspectRatio: '1/1', background: 'var(--color-surface2)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>📦</div>
                    )}
                </div>

                <div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{product.name}</h1>
                    {avgRating && <div style={{ marginBottom: 12, color: 'var(--color-warning)', fontSize: 14 }}>★ {avgRating} ({reviews.length} reseñas)</div>}
                    <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--color-primary)', marginBottom: 20 }}>€{product.price.toFixed(2)}</p>
                    <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

                    {product.inventory > 0 ? (
                        <>
                            <div className="badge badge-success" style={{ marginBottom: 20 }}>✓ En stock ({product.inventory} unidades)</div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20 }}>
                                <label style={{ fontSize: 13, fontWeight: 500 }}>Cantidad:</label>
                                <input type="number" value={quantity} min={1} max={product.inventory} onChange={e => setQuantity(Math.min(product.inventory, Math.max(1, +e.target.value)))} style={{ width: 80 }} />
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 16 }} onClick={handleAdd}>
                                🛒 Añadir al carrito
                            </button>
                        </>
                    ) : (
                        <div className="badge badge-danger">Sin stock</div>
                    )}
                </div>
            </div>

            {/* Reviews */}
            <div style={{ marginTop: 60 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Reseñas ({reviews.length})</h2>

                {user && (
                    <form onSubmit={handleReview} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 32 }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Dejar una reseña</h3>
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13 }}>Puntuación</label>
                            <select value={rating} onChange={e => setRating(+e.target.value)} style={{ width: 120 }}>
                                {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n}/5</option>)}
                            </select>
                        </div>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Comparte tu opinión..." rows={3} style={{ marginBottom: 12, resize: 'vertical' }} />
                        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>{submitting ? 'Publicando...' : 'Publicar reseña'}</button>
                    </form>
                )}

                {reviews.length === 0 ? (
                    <p style={{ color: 'var(--color-text-muted)' }}>Sin reseñas aún. ¡Sé el primero!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {reviews.map(r => (
                            <div key={r.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 20 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                                    <span style={{ color: 'var(--color-warning)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                                    <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{new Date(r.created_at).toLocaleDateString('es-ES')}</span>
                                </div>
                                {r.comment && <p style={{ fontSize: 14, lineHeight: 1.6 }}>{r.comment}</p>}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {toast && <div className="toast toast-success">{toast}</div>}
        </div>
    );
}
