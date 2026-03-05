import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { ShippingAddress } from '../../lib/types';

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const [step, setStep] = useState<'address' | 'payment' | 'done'>('address');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [orderId, setOrderId] = useState('');

    const [address, setAddress] = useState<ShippingAddress>({ name: '', address: '', city: '', postal_code: '', country: '' });
    // Mock payment fields
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    if (!user) {
        return (
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <h2 style={{ fontWeight: 800, marginBottom: 16 }}>Debes iniciar sesión para continuar</h2>
                <a href="/login" className="btn btn-primary">Iniciar sesión</a>
            </div>
        );
    }

    if (items.length === 0 && step !== 'done') {
        return (
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
                <h2 style={{ fontWeight: 800, marginBottom: 16 }}>Tu carrito está vacío</h2>
                <a href="/products" className="btn btn-primary">Ver productos</a>
            </div>
        );
    }

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');
        try {
            // Create order
            const { data: order, error: orderErr } = await supabase.from('orders').insert({
                user_id: user.id,
                status: 'paid',
                total: subtotal,
                shipping_address: address,
            }).select().single();
            if (orderErr) throw orderErr;

            // Create order items
            const orderItems = items.map(i => ({
                order_id: order.id,
                product_id: i.product.id,
                quantity: i.quantity,
                price_at_purchase: i.product.price,
            }));
            const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
            if (itemsErr) throw itemsErr;

            // Decrease inventory
            for (const i of items) {
                await supabase.from('products').update({ inventory: i.product.inventory - i.quantity }).eq('id', i.product.id);
            }

            setOrderId(order.id);
            clearCart();
            setStep('done');
        } catch (e: any) {
            setError(e.message ?? 'Error al procesar el pedido.');
        }
        setLoading(false);
    };

    if (step === 'done') return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>¡Pedido confirmado!</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>Tu pedido <strong style={{ color: 'var(--color-primary)' }}>#{orderId.slice(0, 8)}</strong> ha sido procesado correctamente.</p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Recibirás un email con los detalles del envío.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <a href="/profile" className="btn btn-primary">Ver mis pedidos</a>
                <a href="/products" className="btn btn-ghost">Seguir comprando</a>
            </div>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
                <div>
                    {step === 'address' && (
                        <div className="card" style={{ padding: 32 }}>
                            <h2 style={{ fontWeight: 700, marginBottom: 24, fontSize: 18 }}>Dirección de envío</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {([['name', 'Nombre completo', 'text'], ['address', 'Dirección', 'text'], ['city', 'Ciudad', 'text'], ['postal_code', 'Código postal', 'text'], ['country', 'País', 'text']] as [keyof ShippingAddress, string, string][]).map(([field, label, type]) => (
                                    <div key={field}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>{label}</label>
                                        <input type={type} value={address[field]} onChange={e => setAddress(prev => ({ ...prev, [field]: e.target.value }))} placeholder={label} required />
                                    </div>
                                ))}
                                <button className="btn btn-primary" style={{ marginTop: 8, padding: 13 }} onClick={() => {
                                    if (Object.values(address).every(v => v.trim())) setStep('payment');
                                    else setError('Por favor rellena todos los campos.');
                                }}>
                                    Continuar al pago →
                                </button>
                                {error && <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</p>}
                            </div>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="card" style={{ padding: 32 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setStep('address')} style={{ marginBottom: 20 }}>← Volver</button>
                            <h2 style={{ fontWeight: 700, marginBottom: 24, fontSize: 18 }}>Datos de pago</h2>
                            <div style={{ background: 'rgba(124,107,255,0.08)', border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, marginBottom: 20, color: 'var(--color-primary)' }}>
                                🔒 Entorno de test — usa el número 4242 4242 4242 4242
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Número de tarjeta</label>
                                    <input type="text" maxLength={19} placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())} />
                                </div>
                                <div style={{ display: 'flex', gap: 14 }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Caducidad</label>
                                        <input type="text" placeholder="MM/AA" maxLength={5} value={expiry} onChange={e => setExpiry(e.target.value)} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>CVV</label>
                                        <input type="text" placeholder="123" maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)} />
                                    </div>
                                </div>
                                {error && <p style={{ color: 'var(--color-danger)', fontSize: 13 }}>{error}</p>}
                                <button className="btn btn-primary" style={{ padding: 14, marginTop: 8, fontSize: 16 }} onClick={handlePlaceOrder} disabled={loading}>
                                    {loading ? 'Procesando...' : `Pagar €${subtotal.toFixed(2)}`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div style={{ width: 280, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: 24, position: 'sticky', top: 80 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Tu pedido</h3>
                    {items.map(i => (
                        <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{i.product.name} × {i.quantity}</span>
                            <span>€{(i.product.price * i.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--color-primary)' }}>€{subtotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
