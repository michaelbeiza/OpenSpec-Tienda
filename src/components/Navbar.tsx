import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
    currentPath: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
    const { user, profile, role, signOut, openAuthModal } = useAuth();
    const { itemCount } = useCart();

    return (
        <nav style={{
            background: 'rgba(18,18,26,0.8)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 8, height: 64 }}>
                <a href="/" style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginRight: 'auto' }}>
                    🛍️ Tienda
                </a>

                <a href="/products" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Productos</a>

                {user ? (
                    <>
                        <a href="/cart" className="btn btn-ghost btn-sm" style={{ position: 'relative', textDecoration: 'none' }}>
                            🛒 Carrito
                            {itemCount > 0 && (
                                <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--color-accent)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                    {itemCount}
                                </span>
                            )}
                        </a>
                        <a href="/profile" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>Mi cuenta</a>
                        {role === 'admin' && (
                            <a href="/admin" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none', color: 'var(--color-warning)' }}>Admin</a>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={signOut}>Salir</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => openAuthModal('login')} className="btn btn-ghost btn-sm">Entrar</button>
                        <button onClick={() => openAuthModal('register')} className="btn btn-primary btn-sm">Registrarse</button>
                    </>
                )}
            </div>
        </nav>
    );
}
