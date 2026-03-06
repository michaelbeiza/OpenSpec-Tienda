import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, authModalView, setAuthModalView, signIn, signUp } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const isLogin = authModalView === 'login';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                const { error: signInError } = await signIn(email, password);
                if (signInError) throw signInError;
                closeAuthModal();
            } else {
                const { error: signUpError } = await signUp(email, password);
                if (signUpError) throw signUpError;
                // Typically you'd log them in or show a message to check email, 
                // but let's assume successful signup logs them in or we just close it
                closeAuthModal();
            }
        } catch (err: any) {
            setError(err.message || 'Error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '24px'
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '32px',
                position: 'relative',
                animation: 'slideIn 0.3s ease'
            }}>
                <button 
                    onClick={closeAuthModal}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        color: 'var(--color-text-muted)',
                        fontSize: '24px',
                        lineHeight: '1',
                        padding: '4px'
                    }}
                >
                    &times;
                </button>
                
                <h2 style={{ marginBottom: '24px', textAlign: 'center', color: 'var(--color-primary)' }}>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>

                {error && (
                    <div style={{
                        padding: '12px',
                        marginBottom: '16px',
                        backgroundColor: 'rgba(248,113,113,0.15)',
                        color: 'var(--color-danger)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Email</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tucorreo@ejemplo.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--color-text-muted)' }}>Contraseña</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            minLength={6}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ marginTop: '8px', opacity: loading ? 0.7 : 1 }}
                        disabled={loading}
                    >
                        {loading ? 'Cargando...' : (isLogin ? 'Entrar' : 'Registrarse')}
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-text-muted)' }}>
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button 
                        onClick={() => setAuthModalView(isLogin ? 'register' : 'login')}
                        style={{
                            background: 'transparent',
                            color: 'var(--color-primary)',
                            marginLeft: '8px',
                            fontWeight: 600,
                            textDecoration: 'underline'
                        }}
                    >
                        {isLogin ? 'Crear una' : 'Iniciar Sesión'}
                    </button>
                </div>
            </div>
        </div>
    );
}
