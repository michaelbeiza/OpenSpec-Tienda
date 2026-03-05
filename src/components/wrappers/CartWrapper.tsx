import React from 'react';
import App from '../App';
import CartPage from '../pages/CartPage';

export default function CartWrapper() {
    return (
        <App currentPath="/cart">
            <CartPage />
        </App>
    );
}
