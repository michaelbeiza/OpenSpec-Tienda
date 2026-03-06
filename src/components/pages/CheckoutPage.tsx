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

    const [processingPayment, setProcessingPayment] = useState(false);
    const [processingMessage, setProcessingMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);

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
        if (!cardNumber || !expiry || !cvv) {
            setError('Por favor rellena todos los campos de la tarjeta.');
            return;
        }
        
        setLoading(true);
        setProcessingPayment(true);
        setError('');
        
        try {
            // Simulated Payment steps
            setProcessingMessage('🔒 Cifrando datos de pago...');
            await new Promise(r => setTimeout(r, 1000));
            
            setProcessingMessage('🏦 Contactando con su entidad bancaria...');
            await new Promise(r => setTimeout(r, 1200));

            setProcessingMessage('✅ Pago autorizado por el banco.');
            await new Promise(r => setTimeout(r, 800));

            // Actually Create order in Supabase
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
                await supabase.from('products').update({ inventory: (i.product.inventory || 10) - i.quantity }).eq('id', i.product.id);
            }

            setOrderId(order.id);
            setShowSuccessToast(true);
            clearCart();
            setStep('done');

            // Wait 2 seconds with the toast and sound-like visual, then redirect
            setTimeout(() => {
                window.location.href = '/';
            }, 2500);

        } catch (e: any) {
            setError(e.message ?? 'Error al procesar el pedido.');
            setProcessingPayment(false);
        }
        setLoading(false);
        setProcessingPayment(false);
    };

    if (step === 'done') return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
            {showSuccessToast && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-success)',
                    color: '#000',
                    padding: '16px 32px',
                    borderRadius: '50px',
                    fontWeight: 800,
                    fontSize: '18px',
                    boxShadow: '0 10px 40px rgba(74, 222, 128, 0.4)',
                    zIndex: 20000,
                    animation: 'slideInDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    ✅ ¡Pago hecho! Redirigiendo...
                </div>
            )}
            <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>¡Pedido realizado con éxito!</h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 8 }}>Tu pedido <strong style={{ color: 'var(--color-primary)' }}>#{orderId.slice(0, 8)}</strong> se ha registrado correctamente.</p>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>Volviendo a la página principal...</p>
        </div>
    );

    return (
        <div className="container" style={{ padding: '40px 24px' }}>
            {/* Payment Processing Overlay */}
            {processingPayment && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center'
                }}>
                    <div className="loader" style={{ width: 80, height: 80, borderWidth: 4, marginBottom: 24 }}></div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Procesando su pago</h2>
                    <p style={{ fontSize: 18, color: 'var(--color-primary)', fontWeight: 600, animation: 'pulse 2s infinite' }}>
                        {processingMessage}
                    </p>
                    <p style={{ fontSize: 13, marginTop: 40, opacity: 0.5 }}>No cierres esta ventana ni refresques la página</p>
                </div>
            )}

            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Checkout</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
                <div>
                    {step === 'address' && (
                        <div className="card" style={{ padding: 32, animation: 'fadeIn 0.3s ease-out' }}>
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
                        <div className="card" style={{ padding: 32, animation: 'fadeIn 0.3s ease-out' }}>
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
