import React from 'react';
import App from '../App';
import ProfilePage from '../pages/ProfilePage';

export default function ProfileWrapper() {
    return (
        <App currentPath="/profile">
            <ProfilePage />
        </App>
    );
}
