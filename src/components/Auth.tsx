import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../lib/auth';

export default function Auth() {
    const { signIn, signUp } = useAuth();
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); setSuccess('');
        if (tab === 'register' && password !== confirm) { setError('Las contraseñas no coinciden.'); return; }
        setLoading(true);
        if (tab === 'login') {
            const { error } = await signIn(email, password);
            if (error) setError('Credenciales incorrectas.');
            // redirect handled by AuthContext
        } else {
            const { error } = await signUp(email, password);
            if (error) setError('Error al registrar. El email puede estar en uso.');
            else setSuccess('¡Cuenta creada! Revisa tu email para confirmarla.');
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        const { error } = await signInWithGoogle();
        if (error) setError('Error al iniciar sesión con Google.');
    };

    return (
        <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-3">🛒</div>
                    <h1 className="text-3xl font-bold text-white mb-1">Tienda Online</h1>
                    <p className="text-gray-400 text-sm">Panel de gestión</p>
                </div>

                <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-8">
                    {/* Tabs */}
                    <div className="flex mb-6 bg-[#0d0d1a] rounded-xl p-1">
                        {(['login', 'register'] as const).map(t => (
                            <button key={t} onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? 'bg-[#7c6bff] text-white' : 'text-gray-400 hover:text-white'}`}>
                                {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
                                className="w-full bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors placeholder-gray-600" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                                className="w-full bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors placeholder-gray-600" />
                        </div>
                        {tab === 'register' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirmar contraseña</label>
                                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required
                                    className="w-full bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors placeholder-gray-600" />
                            </div>
                        )}

                        {error && <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}
                        {success && <div className="bg-green-500/10 border border-green-500/50 rounded-xl px-4 py-3 text-green-400 text-sm">{success}</div>}

                        <button type="submit" disabled={loading}
                            className="w-full bg-[#7c6bff] hover:bg-[#6b5cee] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                            {loading ? 'Cargando...' : tab === 'login' ? 'Entrar' : 'Crear cuenta'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#2a2a4a]" />
                        <span className="text-gray-500 text-xs">o continúa con</span>
                        <div className="flex-1 h-px bg-[#2a2a4a]" />
                    </div>

                    <button onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 border border-[#2a2a4a] text-white rounded-xl py-3 hover:bg-[#2a2a4a]/50 transition-colors text-sm font-medium">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.103 17.64 11.847 17.64 9.2z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                        </svg>
                        Continuar con Google
                    </button>
                </div>
            </div>
        </div>
    );
}
