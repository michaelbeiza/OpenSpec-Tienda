import React from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
    const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
    const { user } = useAuth();

    if (items.length === 0) return (
        <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Tu carrito está vacío</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Añade productos para empezar a comprar.</p>
            <a href="/products" className="btn btn-primary">Ver productos</a>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800 }}>Tu carrito ({items.length})</h1>
                <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: 'var(--color-danger)' }}>Vaciar carrito</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {items.map(item => (
                        <div key={item.product.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 20, display: 'flex', gap: 20, alignItems: 'center' }}>
                            {item.product.image_url ? (
                                <img src={item.product.image_url} alt={item.product.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                            ) : (
                                <div style={{ width: 80, height: 80, background: 'var(--color-surface2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📦</div>
                            )}
                            <div style={{ flex: 1 }}>
                                <a href={`/products/${item.product.id}`} style={{ fontWeight: 700, fontSize: 15 }}>{item.product.name}</a>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 700, marginTop: 4 }}>€{item.product.price.toFixed(2)}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ fontWeight: 700, width: 32, padding: 0 }}>–</button>
                                <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ fontWeight: 700, width: 32, padding: 0 }}>+</button>
                            </div>
                            <div style={{ minWidth: 80, textAlign: 'right' }}>
                                <p style={{ fontWeight: 700, marginBottom: 8 }}>€{(item.product.price * item.quantity).toFixed(2)}</p>
                                <button className="btn btn-sm" style={{ background: 'transparent', color: 'var(--color-danger)', fontSize: 18 }} onClick={() => removeItem(item.product.id)}>×</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ width: 300, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24, position: 'sticky', top: 80 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Resumen del pedido</h3>
                    {items.map(i => (
                        <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, color: 'var(--color-text-muted)' }}>
                            <span>{i.product.name} × {i.quantity}</span>
                            <span>€{(i.product.price * i.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 16, paddingTop: 16, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-primary)' }}>€{subtotal.toFixed(2)}</span>
                    </div>
                    {user ? (
                        <a href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: 20, padding: 13, display: 'block', textAlign: 'center' }}>Proceder al checkout →</a>
                    ) : (
                        <a href="/login" className="btn btn-ghost" style={{ width: '100%', marginTop: 20, padding: 13, display: 'block', textAlign: 'center' }}>Inicia sesión para comprar</a>
                    )}
                </div>
            </div>
        </div>
    );
}
