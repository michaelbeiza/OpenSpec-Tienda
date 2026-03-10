import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
    currentPath: string;
}

export default function Navbar({ currentPath }: NavbarProps) {
    const { user, profile, role, signOut } = useAuth();
    const { itemCount } = useCart();
    const [isBouncing, setIsBouncing] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Trigger bounce animation when item count changes
    useEffect(() => {
        if (itemCount > 0) {
            setIsBouncing(true);
            const timer = setTimeout(() => setIsBouncing(false), 300);
            return () => clearTimeout(timer);
        }
    }, [itemCount]);

    const categoriesTree = [
        { name: 'Novedades', icon: '✨', isNew: true },
        { name: 'Hombre', icon: '👔', subcategories: ['Camisetas', 'Pantalones', 'Chaquetas', 'Calzado'] },
        { name: 'Mujer', icon: '👗', subcategories: ['Vestidos', 'Tops', 'Faldas', 'Calzado'] },
        { name: 'Deportes', icon: '🏃‍♂️', subcategories: ['Running', 'Gimnasio', 'Fútbol', 'Yoga'] },
        { name: 'Accesorios', icon: '🎒', subcategories: ['Mochilas', 'Relojes', 'Gafas', 'Gorras'] },
        { name: 'Tecnología', icon: '💻', subcategories: ['Laptops', 'Móviles', 'Audio', 'Gaming'] },
    ];

    return (
        <nav style={{
            background: 'var(--color-nav-bg)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--color-border)',
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
                    background: var(--color-glass);
                    color: var(--color-text);
                }
                .nav-link-ofertas {
                    color: #fff;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: rgba(239, 68, 68, 0.15);
                    border: 1px solid rgba(239, 68, 68, 0.4);
                    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2), inset 0 0 10px rgba(239, 68, 68, 0.1);
                    text-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
                }
                .nav-link-ofertas:hover {
                    background: rgba(239, 68, 68, 0.25);
                    border-color: rgba(239, 68, 68, 0.6);
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.2);
                    transform: translateY(-1px);
                }
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    z-index: 999;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                .sidebar-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 320px;
                    height: 100vh;
                    background: var(--color-surface);
                    backdrop-filter: blur(20px);
                    border-right: 1px solid var(--color-border);
                    z-index: 1000;
                    transform: translateX(-100%);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }
                .sidebar.open {
                    transform: translateX(0);
                }
                .cat-btn {
                    width: 100%;
                    text-align: left;
                    padding: 16px 24px;
                    background: transparent;
                    border: none;
                    border-bottom: 1px solid var(--color-border);
                    color: var(--color-text);
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: background 0.2s;
                }
                .cat-btn:hover {
                    background: var(--color-glass);
                }
                .subcat-list {
                    padding: 8px 24px 16px 50px;
                    background: var(--color-input-bg);
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .subcat-link {
                    color: var(--color-text-muted);
                    text-decoration: none;
                    font-size: 14px;
                    transition: color 0.2s;
                }
                .subcat-link:hover {
                    color: var(--color-primary);
                }
                `}
            </style>

            {/* Sidebar Overlay and Content */}
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Categorías</h2>
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div style={{ flex: 1 }}>
                    <button className="cat-btn" style={{ color: 'var(--color-primary)', fontWeight: 700 }} onClick={() => window.location.href = '/products'}>
                        <span>🌟</span> Todas las categorías
                    </button>
                    {categoriesTree.map(cat => (
                        <div key={cat.name}>
                            <button className="cat-btn" onClick={() => window.location.href = `/categories/${cat.name}`}>
                                <span>{cat.icon}</span> {cat.name}
                                {cat.isNew && <span style={{ marginLeft: 'auto', background: 'var(--color-accent)', fontSize: 10, padding: '2px 6px', borderRadius: 4, color: 'white' }}>NUEVO</span>}
                            </button>
                            {cat.subcategories && (
                                <div className="subcat-list">
                                    {cat.subcategories.map(sub => (
                                        <a href={`/categories/${sub}`} key={sub} className="subcat-link">{sub}</a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 12, height: 64 }}>
                <button onClick={() => setIsSidebarOpen(true)} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text)', display: 'flex', alignItems: 'center', padding: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>

                <a href="/" style={{ fontWeight: 800, fontSize: 20, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginRight: 'auto' }}>
                    🛍️ Tienda
                </a>

                <div style={{ display: 'flex', gap: 4 }}>
                    <a href="/products" className="nav-link" style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 500 }}>Productos</a>
                    <a href="/products" className="nav-link nav-link-ofertas text-sm" style={{ border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                        Ofertas
                    </a>
                </div>

                <div style={{ width: 1, height: 24, background: 'var(--color-border)', margin: '0 8px' }} />

                {user ? (
                    <>
                        <a href="/cart" className="nav-link" style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 500, position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            Carrito
                            {itemCount > 0 && (
                                <span className={isBouncing ? 'cart-bounce' : ''} style={{ position: 'absolute', top: -2, right: -10, background: '#ef4444', color: '#fff', borderRadius: '50%', minWidth: 20, height: 20, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, padding: '0 4px', boxShadow: '0 4px 10px rgba(239,68,68,0.4)', transition: 'all 0.2s' }}>
                                    {itemCount}
                                </span>
                            )}
                        </a>
                        <a href="/profile" className="nav-link" style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 500 }}>Mi cuenta</a>
                        {role === 'admin' && (
                            <a href="/admin" className="nav-link" style={{ color: 'var(--color-warning)', fontSize: 14, fontWeight: 500 }}>Admin</a>
                        )}
                        <button className="nav-link" style={{ color: 'var(--color-text-muted)', fontSize: 14, fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={signOut}>Salir</button>
                    </>
                ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <a href="/login" className="btn btn-ghost" style={{ fontSize: 14, padding: '8px 16px' }}>Entrar</a>
                        <a href="/register" className="btn btn-primary" style={{ fontSize: 14, padding: '8px 16px' }}>Registrarse</a>
                    </div>
                )}
                <div style={{ marginLeft: 8 }}>
                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
