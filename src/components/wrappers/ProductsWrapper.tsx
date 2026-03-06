import React from 'react';
import App from '../App';
import ProductsPage from '../pages/ProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';

interface ProductsWrapperProps {
    currentPath?: string;
    productId?: string;
}

export default function ProductsWrapper({ currentPath = "/products", productId }: ProductsWrapperProps) {
    return (
        <App currentPath={currentPath}>
            {productId ? <ProductDetailPage productId={productId} /> : <ProductsPage />}
        </App>
    );
}
