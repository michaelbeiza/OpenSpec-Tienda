import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { CartProvider } from '../../context/CartContext';
import UsersTable from '../admin/UsersTable';

export default function AdminUsuariosWrapper() {
    return (
        <AuthProvider>
            <CartProvider>
                <UsersTable />
            </CartProvider>
        </AuthProvider>
    );
}
