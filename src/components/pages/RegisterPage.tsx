import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signInWithGoogle } from '../../lib/auth';

export default function RegisterPage() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
        setLoading(true);
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
            setError(signUpError.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await signInWithGoogle();
        // Redirect handled by OAuth
    };

    if (success) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 420, width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontWeight: 800, marginBottom: 12 }}>¡Cuenta creada!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Revisa tu email para confirmar tu cuenta.</p>
                <a href="/login" className="btn btn-primary" style={{ width: '100%', padding: '12px', display: 'block' }}>Ir a iniciar sesión</a>
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,107,255,0.08), transparent)',
        }}>
            <div className="card" style={{
                width: '100%',
                maxWidth: 420,
                padding: '40px 32px',
                textAlign: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: 8,
                    background: 'linear-gradient(135deg, #fff 40%, var(--color-primary))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Crear cuenta
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 32, fontSize: 14 }}>
                    Únete a nuestra comunidad
                </p>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="btn btn-ghost"
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 12,
                        marginBottom: 24,
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px'
                    }}
                >
                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    <span>Registrarse con Google</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', color: 'var(--color-text-muted)' }}>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ margin: '0 12px', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>o con email</span>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                {error && (
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        borderRadius: 'var(--radius)',
                        marginBottom: 16,
                        fontSize: 14,
                        textAlign: 'left'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: 13, marginBottom: 8, color: 'var(--color-text-muted)' }}>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--color-text)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: 13, marginBottom: 8, color: 'var(--color-text-muted)' }}>Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--color-text)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ display: 'block', fontSize: 13, marginBottom: 8, color: 'var(--color-text-muted)' }}>Confirmar Contraseña</label>
                        <input
                            type="password"
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: 'var(--radius)',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: 'var(--color-text)',
                                outline: 'none',
                                transition: 'all 0.2s'
                            }}
                            placeholder="Repite tu contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '12px', marginTop: 8 }}
                    >
                        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p style={{ marginTop: 24, fontSize: 14, color: 'var(--color-text-muted)' }}>
                    ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Inicia sesión</a>
                </p>
            </div>
        </div>
    );
}
