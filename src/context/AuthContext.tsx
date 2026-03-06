import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, UserRole } from '../lib/types';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    role: UserRole | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    isAuthModalOpen: boolean;
    authModalView: 'login' | 'register';
    openAuthModal: (view?: 'login' | 'register') => void;
    closeAuthModal: () => void;
    setAuthModalView: (view: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

    const openAuthModal = (view: 'login' | 'register' = 'login') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
    };
    const closeAuthModal = () => setIsAuthModalOpen(false);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    const { data: newData, error: createError } = await supabase
                        .from('profiles')
                        .insert([{ id: userId, email: user?.email, role: 'user' }])
                        .select()
                        .single();
                    if (!createError) setProfile(newData);
                }
            } else {
                setProfile(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const signUp = async (email: string, password: string) => {
        // Supabase maneja automáticamente el envío de email si "Confirm email" está activo
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/verify`
            }
        });
        
        if (!error && data.user && data.session === null) {
            alert('¡Te hemos enviado un correo de confirmación! Por favor, revisa tu bandeja de entrada para activar tu cuenta.');
        }
        
        return { error };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
        // Redirigir al inicio después de salir
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ 
            user, session, profile, role: profile?.role ?? null, loading, 
            signIn, signUp, signOut,
            isAuthModalOpen, authModalView, openAuthModal, closeAuthModal, setAuthModalView
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
