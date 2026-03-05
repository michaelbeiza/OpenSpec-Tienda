import React from 'react';
import App from '../App';
import HomePage from '../pages/HomePage';

export default function HomeWrapper() {
    return (
        <App currentPath="/">
            <HomePage />
        </App>
    );
}
