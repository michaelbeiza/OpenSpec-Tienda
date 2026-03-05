import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

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
        const { error } = await signUp(email, password);
        if (error) {
            setError('Error al registrar. Puede que el email ya esté en uso.');
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    if (success) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 420, width: '100%' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h2 style={{ fontWeight: 800, marginBottom: 12 }}>¡Cuenta creada!</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 24 }}>Revisa tu email para confirmar tu cuenta.</p>
                <a href="/login" className="btn btn-primary" style={{ width: '100%', padding: 13 }}>Ir a iniciar sesión</a>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div className="card" style={{ padding: 40 }}>
                    <div style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>👤</div>
                        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Crear cuenta</h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Únete a nuestra comunidad</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Email</label>
                            <input id="reg-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Contraseña</label>
                            <input id="reg-password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Confirmar contraseña</label>
                            <input id="reg-confirm" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required />
                        </div>
                        {error && (
                            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: 'var(--color-danger)' }}>
                                {error}
                            </div>
                        )}
                        <button id="reg-submit" type="submit" className="btn btn-primary" style={{ marginTop: 8, width: '100%', padding: 13 }} disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--color-text-muted)' }}>
                        ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Inicia sesión</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
