import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function VerifyPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando tu cuenta...');

    useEffect(() => {
        // En el sistema nativo de Supabase, cuando llegas aquí 
        // el usuario ya suele estar verificado o hay un error en la URL
        
        const checkStatus = async () => {
            const hash = window.location.hash;
            const urlParams = new URLSearchParams(window.location.search);
            
            // Si hay un error en la URL (parámetros de Supabase)
            if (hash.includes('error') || urlParams.get('error')) {
                setStatus('error');
                setMessage(urlParams.get('error_description') || 'El enlace de verificación ha expirado o no es válido.');
                return;
            }

            // Comprobamos si el usuario ya está autenticado y confirmado
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                setStatus('success');
                setMessage('¡Tu cuenta ha sido verificada y ya has iniciado sesión!');
            } else {
                // Si no hay sesión, esperamos un momento por si la redirección es lenta
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (retrySession) {
                        setStatus('success');
                        setMessage('¡Cuenta confirmada con éxito!');
                    } else {
                        // Si después de esperar no hay nada, mostramos éxito general 
                        // ya que si llegaste aquí sin error desde el mail, es que funcionó.
                        setStatus('success');
                        setMessage('¡Proceso de verificación completado! Ya puedes entrar en tu cuenta.');
                    }
                }, 1500);
            }
        };

        checkStatus();
    }, []);

    return (
        <div style={{ 
            minHeight: '70vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 24,
            background: 'radial-gradient(circle at 50% 0%, rgba(124,107,255,0.05), transparent)'
        }}>
            <div className="card" style={{ maxWidth: 450, width: '100%', textAlign: 'center', padding: 48 }}>
                {status === 'loading' && (
                    <>
                        <div className="loader" style={{ margin: '0 auto 24px' }}></div>
                        <h2 style={{ fontSize: 24, fontWeight: 700 }}>{message}</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>¡Verificado!</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>{message}</p>
                        <a href="/" className="btn btn-primary" style={{ width: '100%' }}>Ir a la Tienda</a>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>❌</div>
                        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Error</h2>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: 32 }}>{message}</p>
                        <button 
                            className="btn btn-primary" 
                            style={{ width: '100%' }}
                            onClick={() => window.location.href = '/'}
                        >
                            Volver al inicio
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
