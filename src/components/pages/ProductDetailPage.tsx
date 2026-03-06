import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Review } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface Props { productId: string; }

export default function ProductDetailPage({ productId }: Props) {
    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);
    const [toast, setToast] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    
    const { addItem } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                // Fetch product from Supabase
                const { data: prod } = await supabase.from('products').select('*').eq('id', productId).single();
                
                if (prod) {
                    setProduct(prod);
                    
                    // Load reviews from Supabase
                    const { data: revs } = await supabase
                        .from('reviews')
                        .select('*, profile:profiles(email)')
                        .eq('product_id', productId)
                        .order('created_at', { ascending: false });
                    
                    setReviews(revs?.map(r => ({
                        ...r,
                        userName: (r as any).profile?.email?.split('@')[0] || 'Usuario'
                    })) ?? []);

                    // Load Related Products from Supabase
                    const { data: related } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category', prod.category)
                        .neq('id', productId)
                        .limit(4);
                    
                    setRelatedProducts(related ?? []);
                }
            } catch (err) {
                console.error('Error loading product details:', err);
            } finally {
                setLoading(false);
            }
        }
        load();
        window.scrollTo(0, 0);
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
        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert({ 
                    product_id: productId, 
                    user_id: user.id, 
                    rating, 
                    comment 
                })
                .select('*, profile:profiles(email)')
                .single();
            
            if (error) throw error;
            if (data) {
                const newRev: Review = {
                    ...data,
                    userName: (data as any).profile?.email?.split('@')[0] || 'Tú'
                };
                setReviews(prev => [newRev, ...prev]);
                setComment('');
                setRating(5);
            }
        } catch (e) {
            console.error('Error submitting review:', e);
            alert('No se pudo publicar la reseña. ¿Tienes la tabla "reviews" creada?');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <div className="loader">Cargando experiencia premium...</div>
        </div>
    );
    
    if (!product) return (
        <div style={{ textAlign: 'center', padding: 80 }}>
            <h2 style={{ marginBottom: 16 }}>Producto no encontrado en la base de datos</h2>
            <a href="/products" className="btn btn-primary">Volver a la tienda</a>
        </div>
    );

    const iva = product.price * 0.21;
    const basePrice = product.price - iva;
    const images = product.images && product.images.length > 0 ? product.images : [product.image_url || ''];
    const installmentPrice = (product.price / 3).toFixed(2);

    return (
        <div className="container" style={{ padding: '60px 24px', animation: 'fadeIn 0.5s ease-out' }}>
            {/* Breadcrumbs */}
            <nav style={{ marginBottom: 32, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <a href="/" style={{ color: 'inherit' }}>Inicio</a> / 
                <a href="/products" style={{ color: 'inherit', margin: '0 8px' }}>Productos</a> / 
                <span style={{ color: 'var(--color-primary)', fontWeight: 600, marginLeft: 8 }}>{product.name}</span>
            </nav>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 64, marginBottom: 80 }}>
                {/* Left Col: Carousel */}
                <div>
                    <div 
                        className="card" 
                        style={{ 
                            padding: 0, 
                            overflow: 'hidden', 
                            position: 'relative', 
                            border: '1px solid var(--color-border)',
                            cursor: 'zoom-in'
                        }}
                        onClick={() => setShowFullImage(true)}
                    >
                        <img 
                            src={images[activeImage]} 
                            alt={product.name} 
                            style={{ 
                                width: '100%', 
                                aspectRatio: '1/1', 
                                objectFit: 'cover', 
                                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} 
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <div style={{ position: 'absolute', top: 20, left: 20 }}>
                            <div className="badge badge-primary">{product.category}</div>
                        </div>
                        <div style={{ 
                            position: 'absolute', 
                            bottom: 15, 
                            right: 15, 
                            background: 'rgba(0,0,0,0.5)', 
                            color: 'white', 
                            padding: '4px 8px', 
                            borderRadius: '4px',
                            fontSize: 10,
                            backdropFilter: 'blur(4px)'
                        }}>
                           🔍 Pulsa para ampliar
                        </div>
                    </div>
                    
                    {images.length > 1 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginTop: 16 }}>
                            {images.map((img, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => setActiveImage(idx)}
                                    style={{ 
                                        padding: 0, 
                                        border: activeImage === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        overflow: 'hidden',
                                        opacity: activeImage === idx ? 1 : 0.6,
                                        transition: 'all 0.2s ease',
                                        aspectRatio: '1/1'
                                    }}
                                >
                                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Col: Info */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>{product.name}</h1>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{ color: 'var(--color-warning)', letterSpacing: 2 }}>
                            {'★'.repeat(5)}
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>({reviews.length} valoraciones de clientes)</span>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 42, fontWeight: 900, color: 'var(--color-primary)', display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            €{product.price.toFixed(2)}
                            <span style={{ fontSize: 14, color: 'var(--color-text-muted)', fontWeight: 400 }}>IVA Incluido</span>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
                            Base imponible: €{basePrice.toFixed(2)} | IVA (21%): €{iva.toFixed(2)}
                        </div>
                    </div>

                    {/* Short Description */}
                    <p style={{ fontSize: 16, color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
                        {product.description}
                    </p>

                    {/* Financing Section */}
                    {product.price > 100 && (
                        <div style={{ 
                            background: 'rgba(124,107,255,0.05)', 
                            border: '1px dashed var(--color-primary)', 
                            borderRadius: 'var(--radius)', 
                            padding: 20, 
                            marginBottom: 32,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16
                        }}>
                            <div style={{ fontSize: 24 }}>💳</div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>Págalo en 3 plazos de €{installmentPrice}/mes</div>
                                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Sin intereses. Elige "Financiación" al finalizar tu compra.</div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                border: '1px solid var(--color-border)', 
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden'
                            }}>
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    style={{ background: 'transparent', padding: '12px 16px', border: 'none', fontWeight: 600 }}
                                >-</button>
                                <input 
                                    type="number" 
                                    value={quantity} 
                                    readOnly 
                                    style={{ width: 50, textAlign: 'center', border: 'none', background: 'transparent', fontWeight: 700 }} 
                                />
                                <button 
                                    onClick={() => setQuantity(q => Math.min(product.inventory, q + 1))}
                                    style={{ background: 'transparent', padding: '12px 16px', border: 'none', fontWeight: 600 }}
                                >+</button>
                            </div>
                            <button 
                                onClick={handleAdd}
                                className="btn btn-primary" 
                                style={{ flex: 1, padding: '16px 32px', fontSize: 16, fontWeight: 700 }}
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                        <div style={{ fontSize: 13, color: product.inventory > 5 ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 600 }}>
                            {product.inventory > 0 ? `✓ En stock: ${product.inventory} unidades disponibles` : '✗ Sin existencias'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Long Description / Product Tabs */}
            <section style={{ marginBottom: 80, borderTop: '1px solid var(--color-border)', paddingTop: 48 }}>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Detalles del Producto</h2>
                <div style={{ maxWidth: 800, lineHeight: 1.8, fontSize: 16, color: 'var(--color-text-muted)' }}>
                    {product.long_description || product.description}
                </div>
            </section>

            {/* Recommendations */}
            {relatedProducts.length > 0 && (
                <section style={{ marginBottom: 80 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32 }}>También te puede interesar</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 24 }}>
                        {relatedProducts.map(p => (
                            <a key={p.id} href={`/products/${p.id}`} className="card" style={{ textDecoration: 'none', padding: 0, overflow: 'hidden' }}>
                                <img src={p.image_url!} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
                                <div style={{ padding: 16 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--color-text)' }}>{p.name}</h3>
                                    <div style={{ color: 'var(--color-primary)', fontWeight: 800 }}>€{p.price.toFixed(2)}</div>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800 }}>Reseñas Verificadas</h2>
                    {!user && <button onClick={() => useAuth().openAuthModal()} className="btn btn-ghost btn-sm">Iniciar sesión para opinar</button>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
                    {/* Add Review */}
                    {user && (
                        <div className="card" style={{ height: 'fit-content', border: '1px solid rgba(124,107,255,0.2)' }}>
                            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Cuéntanos tu experiencia</h3>
                            <form onSubmit={handleReview}>
                                <div style={{ marginBottom: 16 }}>
                                    <label style={{ display: 'block', fontSize: 12, marginBottom: 8 }}>Puntuación</label>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <button 
                                                key={s} 
                                                type="button"
                                                onClick={() => setRating(s)}
                                                style={{ 
                                                    background: 'transparent', 
                                                    border: 'none', 
                                                    padding: 0, 
                                                    fontSize: 24,
                                                    color: s <= rating ? 'var(--color-warning)' : 'var(--color-border)',
                                                    cursor: 'pointer'
                                                }}
                                            >★</button>
                                        ))}
                                    </div>
                                </div>
                                <textarea 
                                    value={comment} 
                                    onChange={e => setComment(e.target.value)}
                                    placeholder="¿Qué te ha parecido el producto?" 
                                    rows={4} 
                                    style={{ marginBottom: 16 }} 
                                />
                                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                    {submitting ? 'Publicando...' : 'Publicar Valoración'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Review List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {reviews.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)', background: 'var(--color-surface2)', borderRadius: 'var(--radius)' }}>
                                Nadie ha opinado sobre este producto todavía.
                            </div>
                        ) : (
                            reviews.map(r => (
                                <div key={r.id} className="card" style={{ padding: 24 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                            {r.userName}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                                            {new Date(r.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div style={{ color: 'var(--color-warning)', fontSize: 12, marginBottom: 12 }}>
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </div>
                                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                                        {r.comment}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Full Screen Image Viewer */}
            {showFullImage && (
                <div 
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        zIndex: 100000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 40,
                        cursor: 'zoom-out'
                    }}
                    onClick={() => setShowFullImage(false)}
                >
                    <button 
                        style={{ position: 'absolute', top: 30, right: 30, background: 'transparent', color: 'white', fontSize: 40 }}
                        onClick={() => setShowFullImage(false)}
                    >
                        &times;
                    </button>
                    <img 
                        src={images[activeImage]} 
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} 
                        alt="Zoom view"
                    />
                </div>
            )}

            {toast && <div className="toast toast-success" style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 10000 }}>{toast}</div>}
        </div>
    );
}
