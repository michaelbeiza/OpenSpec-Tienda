import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import ProductsTable from '../admin/ProductsTable';

export default function AdminProductosWrapper() {
    return (
        <AuthProvider>
            <CartProvider>
                <ProductsTable />
            </CartProvider>
        </AuthProvider>
    );
}
