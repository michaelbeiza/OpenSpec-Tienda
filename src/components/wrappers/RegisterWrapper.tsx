import React from 'react';
import App from '../App';
import RegisterPage from '../pages/RegisterPage';

export default function RegisterWrapper() {
    return (
        <App currentPath="/register">
            <RegisterPage />
        </App>
    );
}
