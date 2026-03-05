import React from 'react';
import App from '../App';
import CheckoutPage from '../pages/CheckoutPage';

export default function CheckoutWrapper() {
    return (
        <App currentPath="/checkout">
            <CheckoutPage />
        </App>
    );
}
