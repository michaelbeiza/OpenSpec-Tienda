import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';
import { CATEGORIES } from '../../lib/constants';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const { addItem } = useCart();
    const [toast, setToast] = useState('');
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const categories = ['Todas', ...CATEGORIES];

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 200;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from('products').select('*').gt('inventory', 0).order('created_at', { ascending: false });
            setProducts(data ?? []);
            setFiltered(data ?? []);
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        let result = products;
        if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
        if (minPrice) result = result.filter(p => p.price >= parseFloat(minPrice));
        if (maxPrice) result = result.filter(p => p.price <= parseFloat(maxPrice));

        if (selectedCategory !== 'Todas') {
            result = result.filter(p => p.category === selectedCategory);
        }

        setFiltered(result);
    }, [search, minPrice, maxPrice, selectedCategory, products]);

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
                    <div className="badge badge-primary" style={{ marginBottom: 16 }}>Nuevos artículos</div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: 16,
                        background: 'linear-gradient(135deg, #fff 30%, var(--color-primary))',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Catálogo de Productos
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
                        Encuentra exactamente lo que buscas en nuestra cuidada selección.
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 20,
                    marginBottom: 40,
                    background: 'rgba(255,255,255,0.03)',
                    padding: 24,
                    borderRadius: 'var(--radius)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(10px)',
                }}>
                    {/* Category Tabs with Navigation Arrows */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        {showLeftArrow && (
                            <button
                                onClick={() => scroll('left')}
                                style={{
                                    position: 'absolute',
                                    left: -12,
                                    zIndex: 10,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'rgba(18,18,26,0.8)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                        )}

                        <div
                            ref={scrollRef}
                            onScroll={checkScroll}
                            style={{
                                display: 'flex',
                                gap: 12,
                                overflowX: 'auto',
                                paddingBottom: 8,
                                WebkitOverflowScrolling: 'touch',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                scrollBehavior: 'smooth',
                                width: '100%',
                                paddingLeft: 4,
                                paddingRight: 4
                            }}
                        >
                            <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        padding: '8px 20px',
                                        borderRadius: 30,
                                        border: cat === selectedCategory ? '1px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                                        background: cat === selectedCategory ? 'rgba(124,107,255,0.15)' : 'rgba(0,0,0,0.2)',
                                        color: cat === selectedCategory ? '#fff' : 'var(--color-text-muted)',
                                        fontWeight: cat === selectedCategory ? 700 : 500,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        boxShadow: cat === selectedCategory ? '0 4px 15px rgba(124,107,255,0.2)' : 'none'
                                    }}
                                    onMouseOver={e => {
                                        if (cat !== selectedCategory) {
                                            e.currentTarget.style.color = '#fff';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        }
                                    }}
                                    onMouseOut={e => {
                                        if (cat !== selectedCategory) {
                                            e.currentTarget.style.color = 'var(--color-text-muted)';
                                            e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                                        }
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {showRightArrow && (
                            <button
                                onClick={() => scroll('right')}
                                style={{
                                    position: 'absolute',
                                    right: -12,
                                    zIndex: 10,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    background: 'rgba(18,18,26,0.8)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    cursor: 'pointer'
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 250px', position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px 12px 48px',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    fontSize: 14
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <input
                                type="number"
                                placeholder="Min €"
                                value={minPrice}
                                onChange={e => setMinPrice(e.target.value)}
                                style={{
                                    width: 100,
                                    padding: '12px',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                    fontSize: 14
                                }}
                            />
                            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-muted)' }}>-</span>
                            <input
                                type="number"
                                placeholder="Max €"
                                value={maxPrice}
                                onChange={e => setMaxPrice(e.target.value)}
                                style={{
                                    width: 100,
                                    padding: '12px',
                                    borderRadius: 'var(--radius)',
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'var(--color-text)',
                                    outline: 'none',
                                    fontSize: 14
                                }}
                            />
                        </div>

                        {(search || minPrice || maxPrice || selectedCategory !== 'Todas') && (
                            <button
                                onClick={() => { setSearch(''); setMinPrice(''); setMaxPrice(''); setSelectedCategory('Todas'); }}
                                style={{
                                    padding: '12px 20px',
                                    background: 'transparent',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    borderRadius: 'var(--radius)',
                                    fontSize: 14,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            border: '3px solid rgba(255,255,255,0.1)',
                            borderTopColor: 'var(--color-primary)',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <span style={{ color: 'var(--color-text-muted)' }}>Cargando catálogo...</span>
                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 24px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: 'var(--radius)',
                        border: '1px dashed rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>📭</div>
                        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No hay resultados</h3>
                        <p style={{ color: 'var(--color-text-muted)' }}>Prueba a ajustar tus filtros de búsqueda.</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: 32
                    }}>
                        {filtered.map(p => (
                            <div key={p.id} className="card" style={{
                                padding: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                border: '1px solid rgba(255,255,255,0.05)',
                                background: 'rgba(255,255,255,0.02)',
                            }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,107,255,0.15)';
                                    e.currentTarget.style.border = '1px solid rgba(124,107,255,0.3)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)';
                                }}>
                                <a href={`/products/${p.id}`} style={{ display: 'block', position: 'relative', background: 'rgba(0,0,0,0.5)' }}>
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 240, objectFit: 'cover', transition: 'transform 0.5s' }}
                                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2))' }}>
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
                                            fontWeight: 600,
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
                                                background: 'rgba(255,255,255,0.05)',
                                                borderRadius: 4,
                                                color: 'var(--color-text-muted)',
                                                border: '1px solid rgba(255,255,255,0.1)'
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span style={{ fontWeight: 500 }}>{toast}</span>
                    <style>{`@keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
                </div>
            )}
        </div>
    );
}
