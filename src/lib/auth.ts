import { supabase } from './supabase';

export async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
        },
    });
    return { error };
}

export function redirectByRole(role: string | null) {
    if (role === 'admin') {
        window.location.href = '/admin/dashboard';
    } else {
        window.location.href = '/';
    }
}
