import React, { type ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';
import AuthModal from './AuthModal';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProductsPage from './pages/ProductsPage';
import ProfilePage from './pages/ProfilePage';
import VerifyPage from './pages/VerifyPage';

interface AppProps {
    children?: ReactNode;
    currentPath?: string;
    productId?: string;
}

export default function App({ children, currentPath = '/', productId }: AppProps) {
    return (
        <AuthProvider>
            <CartProvider>
                <Navbar currentPath={currentPath} />
                <main style={{ minHeight: 'calc(100vh - 64px)' }}>
                    {productId ? (
                        <ProductDetailPage productId={productId} />
                    ) : currentPath === '/cart' ? (
                        <CartPage />
                    ) : currentPath === '/products' ? (
                        <ProductsPage />
                    ) : currentPath === '/profile' ? (
                        <ProfilePage />
                    ) : currentPath === '/verify' ? (
                        <VerifyPage />
                    ) : currentPath === '/' ? (
                        <HomePage />
                    ) : (
                        children
                    )}
                </main>
                <AuthModal />
                <footer style={{ borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px', fontSize: 13 }}>
                    © 2024 Tienda Online. Todos los derechos reservados.
                </footer>
            </CartProvider>
        </AuthProvider>
    );
}
