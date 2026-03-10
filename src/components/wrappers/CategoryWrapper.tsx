import React from 'react';
import App from '../App';
import CategoryPage from '../pages/CategoryPage';

interface CategoryWrapperProps {
    category: string;
}

export default function CategoryWrapper({ category }: CategoryWrapperProps) {
    return (
        <App currentPath={`/categories/${category}`}>
            <CategoryPage category={category} />
        </App>
    );
}
