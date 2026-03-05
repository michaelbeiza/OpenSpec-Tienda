import React from 'react';
import App from '../App';
import AdminPage from '../pages/AdminPage';

export default function AdminIndexWrapper() {
    return (
        <App currentPath="/admin">
            <AdminPage />
        </App>
    );
}
