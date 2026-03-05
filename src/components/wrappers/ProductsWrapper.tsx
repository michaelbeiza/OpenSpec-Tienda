import React from 'react';
import App from '../App';
import ProductsPage from '../pages/ProductsPage';

export default function ProductsWrapper() {
    return (
        <App currentPath="/products">
            <ProductsPage />
        </App>
    );
}
