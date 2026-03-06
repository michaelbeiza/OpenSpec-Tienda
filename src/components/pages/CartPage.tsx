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
                        <div key={item.product.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '24px', display: 'flex', gap: 24, alignItems: 'center', transition: 'transform 0.2s ease' }}>
                            <div style={{ width: 120, height: 120, overflow: 'hidden', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                                {item.product.image_url ? (
                                    <img 
                                        src={item.product.image_url} 
                                        alt={item.product.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }} 
                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--color-surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
                                )}
                            </div>
                            <div style={{ flex: 1 }}>
                                <a href={`/products/${item.product.id}`} style={{ fontWeight: 800, fontSize: 18, color: 'var(--color-text)', textDecoration: 'none' }}>{item.product.name}</a>
                                <p style={{ color: 'var(--color-primary)', fontWeight: 800, marginTop: 6, fontSize: 16 }}>€{item.product.price.toFixed(2)}</p>
                                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>Categoría: {item.product.category || 'Tecnología'}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--color-surface2)', borderRadius: 'var(--radius-sm)', padding: '4px' }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ fontWeight: 700, width: 32, padding: 0 }}>–</button>
                                <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 800 }}>{item.quantity}</span>
                                <button className="btn btn-ghost btn-sm" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ fontWeight: 700, width: 32, padding: 0 }}>+</button>
                            </div>
                            <div style={{ minWidth: 100, textAlign: 'right' }}>
                                <p style={{ fontWeight: 900, fontSize: 18, marginBottom: 8 }}>€{(item.product.price * item.quantity).toFixed(2)}</p>
                                <button 
                                    className="btn btn-sm" 
                                    style={{ background: 'rgba(248,113,113,0.1)', color: 'var(--color-danger)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} 
                                    onClick={() => removeItem(item.product.id)}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ width: 320, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24, position: 'sticky', top: 80, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: 20, fontSize: 18 }}>Resumen del pedido</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>Subtotal (Base imponible)</span>
                            <span style={{ fontWeight: 600 }}>€{(subtotal / 1.21).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>IVA (21%)</span>
                            <span style={{ fontWeight: 600 }}>€{(subtotal - (subtotal / 1.21)).toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20, marginBottom: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontWeight: 800, fontSize: 20 }}>Total</span>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ color: 'var(--color-primary)', fontWeight: 900, fontSize: 24 }}>€{subtotal.toFixed(2)}</div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 400 }}>IVA Incluido</div>
                            </div>
                        </div>
                    </div>

                    {user ? (
                        <a href="/checkout" className="btn btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, borderRadius: 'var(--radius)', textDecoration: 'none' }}>
                            Tramitar Pedido →
                        </a>
                    ) : (
                        <button onClick={() => useAuth().openAuthModal()} className="btn btn-ghost" style={{ width: '100%', padding: '16px', fontWeight: 600 }}>
                            Inicia sesión para pagar
                        </button>
                    )}
                    
                    <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
                        <span style={{ fontSize: 20 }}>🛡️</span>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.2 }}>Pago 100% seguro con cifrado SSL de 256 bits</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
