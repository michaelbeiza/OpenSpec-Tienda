import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
    currentPath: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
    const { user, profile, role, signOut } = useAuth();
    const { itemCount } = useCart();
    const [isBouncing, setIsBouncing] = useState(false);

    // Trigger bounce animation when item count changes
    useEffect(() => {
        if (itemCount > 0) {
            setIsBouncing(true);
            const timer = setTimeout(() => setIsBouncing(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    return (
        <nav style={{
            background: 'rgba(18,18,26,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            transition: 'all 0.3s ease'
        }}>
            <style>
                {`
                @keyframes bump {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                .cart-bounce {
                    animation: bump 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .nav-link {
                    padding: 8px 16px;
                    border-radius: var(--radius);
                    transition: all 0.2s;
                    text-decoration: none;
                }
                .nav-link:hover {
                    background: rgba(255,255,255,0.05);
                }
                .nav-link-ofertas {
                    color: #ef4444; /* Tailwind red-500 */
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .nav-link-ofertas:hover {
                    background: rgba(239, 68, 68, 0.1);
                }
                `}
            </style>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12, height: 64 }}>
                <a href="/" style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginRight: 'auto' }}>
                    🛍️ Tienda
                </a>

                <div style={{ display: 'flex', gap: 4 }}>
                    <a href="/products" className="nav-link text-white text-sm font-medium">Productos</a>
                    <a href="/products" className="nav-link nav-link-ofertas text-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                        Ofertas
                    </a>
                </div>

                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

                {user ? (
                    <>
                        <a href="/cart" className="nav-link text-white text-sm font-medium" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            Carrito
                            {itemCount > 0 && (
                                <span className={isBouncing ? 'cart-bounce' : ''} style={{ position: 'absolute', top: -2, right: -10, background: '#ef4444', color: '#fff', borderRadius: '50%', minWidth: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, padding: '0 4px', boxShadow: '0 4px 10px rgba(239,68,68,0.4)', transition: 'all 0.2s' }}>
                                    {itemCount}
                                </span>
                            )}
                        </a>
                        <a href="/profile" className="nav-link text-white text-sm font-medium">Mi cuenta</a>
                        {role === 'admin' && (
                            <a href="/admin" className="nav-link text-sm font-medium" style={{ color: 'var(--color-warning)' }}>Admin</a>
                        )}
                        <button className="nav-link text-gray-400 text-sm font-medium hover:text-white" onClick={signOut}>Salir</button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <a href="/login" className="btn btn-ghost" style={{ fontSize: 14, padding: '8px 16px' }}>Entrar</a>
                        <a href="/register" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 16px' }}>Registrarse</a>
                    </div>
                )}
            </div>
        </nav>
    );
}
