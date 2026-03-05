import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { useCart } from '../../context/CartContext';

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const { addItem } = useCart();
    const [toast, setToast] = useState('');

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
        setFiltered(result);
    }, [search, minPrice, maxPrice, products]);

    const handleAdd = (p: Product) => {
        addItem(p);
        setToast(`"${p.name}" añadido al carrito`);
        setTimeout(() => setToast(''), 2500);
    };

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Productos</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Descubre nuestra selección de productos</p>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', background: 'var(--color-surface)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--color-border)' }}>
                <input style={{ flex: '1 1 200px' }} type="text" placeholder="🔍 Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} />
                <input style={{ width: 130 }} type="number" placeholder="Precio min" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                <input style={{ width: 130 }} type="number" placeholder="Precio max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                {(search || minPrice || maxPrice) && (
                    <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setMinPrice(''); setMaxPrice(''); }}>Limpiar filtros</button>
                )}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>Cargando productos...</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-text-muted)' }}>No se encontraron productos.</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 24 }}>
                    {filtered.map(p => (
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
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                                    <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)' }}>€{p.price.toFixed(2)}</span>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleAdd(p)}>+ Carrito</button>
                                </div>
                                {p.inventory <= 5 && <p style={{ color: 'var(--color-warning)', fontSize: 12, marginTop: 8 }}>⚠️ Solo {p.inventory} en stock</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && <div className="toast toast-success">{toast}</div>}
        </div>
    );
}
