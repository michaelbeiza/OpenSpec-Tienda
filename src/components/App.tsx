import React, { type ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';
import Navbar from './Navbar';

interface AppProps {
    children: ReactNode;
    currentPath?: string;
}

export default function App({ children, currentPath = '/' }: AppProps) {
    return (
        <AuthProvider>
            <CartProvider>
                <Navbar currentPath={currentPath} />
                <main style={{ minHeight: 'calc(100vh - 64px)' }}>
                    {children}
                </main>
                <footer style={{ borderTop: '1px solid var(--color-border)', textAlign: 'center', color: 'var(--color-text-muted)', padding: '24px', fontSize: 13 }}>
                    © 2024 Tienda Online. Todos los derechos reservados.
                </footer>
            </CartProvider>
        </AuthProvider>
    );
}
