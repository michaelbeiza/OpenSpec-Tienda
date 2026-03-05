import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import DashboardPage from '../admin/DashboardPage';

export default function AdminDashboardWrapper() {
    return (
        <AuthProvider>
            <CartProvider>
                <DashboardPage />
            </CartProvider>
        </AuthProvider>
    );
}
