import React from 'react';
import App from '../App';
import LoginPage from '../pages/LoginPage';

export default function LoginWrapper() {
    return (
        <App currentPath="/login">
            <LoginPage />
        </App>
    );
}
