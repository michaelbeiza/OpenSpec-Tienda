import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const { error } = await signIn(email, password);
        if (error) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        } else {
            window.location.href = '/';
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div className="card" style={{ padding: 40 }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🔑</div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Iniciar sesión</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Bienvenido de vuelta</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Email</label>
                            <input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Contraseña</label>
                            <input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
                        </div>
                        {error && (
                            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--color-danger)' }}>
                                {error}
                            </div>
                        )}
                        <button id="login-submit" type="submit" className="btn btn-primary" style={{ marginTop: 8, width: '100%', padding: 13 }} disabled={loading}>
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        ¿No tienes cuenta? <a href="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Regístrate</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
