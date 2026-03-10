import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../lib/types';

// ── Types ──────────────────────────────────────────────────────────────────────
// Task 3.5
interface Message {
  role: 'user' | 'bot';
  text: string;
  products?: Product[];
}

// ── Product Card ──────────────────────────────────────────────────────────────
// Task 3.6
function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        background: 'var(--color-surface2)',
        border: '1px solid var(--color-border)',
        borderRadius: 10,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(124,107,255,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div style={{ height: 80, background: 'var(--color-input-bg)', overflow: 'hidden' }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
            🛍️
          </div>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '8px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>
          {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
        </div>
        <button
          onClick={() => { window.location.href = `/products/${product.id}`; }}
          style={{
            marginTop: 4,
            padding: '5px 0',
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        >
          Ver producto →
        </button>
      </div>
    </div>
  );
}

// ── Typing indicator ──────────────────────────────────────────────────────────
// Task 3.7
function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, flexShrink: 0,
      }}>
        🤖
      </div>
      <div style={{
        background: 'var(--color-surface2)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px 16px 16px 4px',
        padding: '10px 14px',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        <style>{`
          @keyframes chatDot {
            0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'block',
            animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Main ChatBot Component ────────────────────────────────────────────────────
export default function ChatBot() {
  // Task 3.1
  const { user, profile, session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Task 3.8: Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Task 4.1 + 4.2: Auto-greet on login
  useEffect(() => {
    if (!user) return;
    const alreadyGreeted = sessionStorage.getItem('chatbot-greeted');
    if (!alreadyGreeted) {
      const displayName = profile?.email?.split('@')[0] ?? user.email?.split('@')[0] ?? 'Usuario';
      sessionStorage.setItem('chatbot-greeted', 'true');
      setIsOpen(true);
      setMessages([{
        role: 'bot',
        text: `¡Hola, ${displayName}! 👋 Soy tu asistente de compras de Tienda Mishe. ¿Qué estás buscando hoy?`,
      }]);
    }
  }, [user, profile]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Task 4.3: Direct Client-Side Search (Simulated AI)
  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const lowerText = text.toLowerCase();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    // Importamos supabase (el cliente de navegador ya existente)
    const { supabase } = await import('../lib/supabase');

    // Simulamos un pequeño retraso de "pensamiento"
    await new Promise(resolve => setTimeout(resolve, 800));

    // 🧠 Mapa de Intenciones Extendido
    const INTENT_MAP: Record<string, { terms: string[], reply: string }> = {
      musica: { terms: ['auriculares', 'audio', 'musica', 'sonido'], reply: '¡Qué bien! Un poco de música siempre ayuda. He buscado los mejores productos de audio para ti:' },
      escuchar: { terms: ['auriculares', 'audio', 'sonido'], reply: 'Para escuchar con la mejor calidad, te recomiendo estos productos:' },
      jugar: { terms: ['gamer', 'gaming', 'juego', 'consola', 'raton'], reply: '¡A darle caña! 🎮 Aquí tienes todo lo necesario para tu zona gaming:' },
      videojuegos: { terms: ['juego', 'consola', 'gaming', 'gamer'], reply: 'Si buscas videojuegos o accesorios, estos son mis favoritos ahora mismo:' },
      trabajar: { terms: ['monitor', 'teclado', 'oficina', 'silla', 'escritorio'], reply: 'Para mejorar tu productividad, he encontrado estos periféricos y accesorios:' },
      estudiar: { terms: ['monitor', 'teclado', 'luz', 'escritorio'], reply: 'Para que te concentres al máximo, mira estos productos para tu setup de estudio:' },
      regalo: { terms: ['gadget', 'acero', 'especial', 'nuevo'], reply: '¿Buscando un detalle especial? He seleccionado estos productos que suelen gustar mucho para regalo:' },
      vestir: { terms: ['ropa', 'camiseta', 'pantalon', 'moda', 'zapatillas'], reply: '¡Claro! Aquí tienes algunas opciones para renovar tu armario:' },
      ropa: { terms: ['camisa', 'chaqueta', 'ropa', 'moda'], reply: 'He buscado las mejores prendas de vestir que tenemos disponibles:' },
      videos: { terms: ['monitor', 'pantalla', 'auriculares', 'streaming'], reply: 'Para disfrutar de tus vídeos favoritos, estos productos te darán la mejor experiencia:' },
      pelis: { terms: ['monitor', 'pantalla', 'audio', 'cine', 'proyector'], reply: '¡Sesión de cine! 🍿 Aquí tienes lo mejor para montar tu propio cine en casa:' },
      peliculas: { terms: ['monitor', 'pantalla', 'sonido', 'cine'], reply: 'Disfruta de tus películas como nunca con estos productos:' },
      streaming: { terms: ['microfono', 'camara', 'luz', 'monitor', 'streaming'], reply: '¿Quieres empezar a emitir? He seleccionado el kit básico para streaming:' },
      viajar: { terms: ['mochila', 'maleta', 'powerbank', 'viaje'], reply: '¡Buen viaje! ✈️ Estos accesorios te vendrán genial para tu aventura:' },
      diseñar: { terms: ['monitor', 'tableta', 'raton', 'diseño'], reply: 'Para dar rienda suelta a tu creatividad, te recomiendo estas herramientas de diseño:' },
      leer: { terms: ['lampara', 'luz', 'e-reader', 'comodo'], reply: 'Para tus momentos de lectura, he encontrado estos productos perfectos para ti:' },
      cocinar: { terms: ['cocina', 'utensilio', 'electrodomestico', 'comida'], reply: '¡A los fogones! 👨‍🍳 Mira estos accesorios para tu cocina:' }
    };

    try {
      // 1. Detectar Intenciones primero
      const words = lowerText.split(' ');
      let activeIntent = null;
      
      for (const word of words) {
        // Limpiamos la palabra de puntos o comas
        const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
        if (INTENT_MAP[cleanWord]) {
          activeIntent = INTENT_MAP[cleanWord];
          break;
        }
      }

      let searchTerms = lowerText.split(' ').filter(word => word.length > 2);
      let replyMessage = `He encontrado ${0} productos que coinciden con tu búsqueda:`;
      
      if (activeIntent) {
        searchTerms = activeIntent.terms;
        replyMessage = activeIntent.reply;
      }

      // 2. Realizar la búsqueda
      let foundProducts: Product[] = [];
      let isFallback = false;
      
      if (searchTerms.length > 0) {
        const orFilter = searchTerms
          .map(t => `name.ilike.%${t}%,description.ilike.%${t}%`)
          .join(',');
        
        const { data } = await supabase
          .from('products')
          .select('*')
          .or(orFilter)
          .limit(4);
          
        foundProducts = (data as Product[]) || [];
      }

      // 3. Fallback si no hay nada
      if (foundProducts.length === 0) {
        isFallback = true;
        const { data: fallbackData } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
        
        foundProducts = (fallbackData as Product[]) || [];
      }

      // 4. Responder al usuario
      if (isFallback) {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: `No he encontrado nada específico para "${text}", pero mira estas novedades de la tienda que podrían interesarte:`,
          products: foundProducts
        }]);
      } else {
        // Si hay una intención activa, usamos su mensaje personalizado
        const finalReply = activeIntent ? activeIntent.reply : `He encontrado estos productos para "${text}":`;
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: finalReply,
          products: foundProducts
        }]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: 'Lo siento, he tenido un pequeño error al acceder al catálogo. ¿Podemos intentarlo de nuevo?'
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  // Only render for authenticated users
  if (!user) return null;

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { transform: translateY(20px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes chatFabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(124, 107, 255, 0.4); }
          50% { box-shadow: 0 0 0 12px rgba(124, 107, 255, 0); }
        }
        .chatbot-fab:hover {
          transform: scale(1.08) !important;
        }
        .chat-input:focus {
          border-color: var(--color-primary) !important;
          outline: none;
        }
      `}</style>

      {/* Task 3.2: Floating action button */}
      <button
        className="chatbot-fab"
        id="chatbot-fab-btn"
        onClick={() => setIsOpen((v) => !v)}
        title={isOpen ? 'Cerrar asistente' : 'Abrir asistente IA'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9000,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          color: '#fff',
          boxShadow: '0 4px 20px rgba(124, 107, 255, 0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          animation: isOpen ? 'none' : 'chatFabPulse 2.5s ease-in-out infinite',
        }}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Task 3.3 + 3.4: Chat window */}
      {isOpen && (
        <div
          id="chatbot-window"
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            zIndex: 8999,
            width: 360,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 20,
            overflow: 'hidden',
            background: 'rgba(18, 18, 26, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--color-glass-border)',
            boxShadow: '0 8px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124,107,255,0.15)',
            animation: 'chatSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(135deg, rgba(124,107,255,0.2) 0%, rgba(255,107,157,0.1) 100%)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>
              🤖
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>
                Asistente IA
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }} />
                En línea
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              title="Cerrar chat"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--color-text-muted)', padding: 4, borderRadius: 6,
                fontSize: 16, lineHeight: 1, transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)')}
            >
              ✕
            </button>
          </div>

          {/* Task 3.5: Messages area */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13, marginTop: 40 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🛍️</div>
                Escríbeme qué buscas y te ayudo a encontrarlo.
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx}>
                {/* Bubble */}
                <div style={{
                  display: 'flex',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 8,
                }}>
                  {msg.role === 'bot' && (
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                    }}>
                      🤖
                    </div>
                  )}
                  <div style={{
                    maxWidth: '78%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, var(--color-primary), #9180ff)'
                      : 'var(--color-surface2)',
                    border: msg.role === 'user'
                      ? 'none'
                      : '1px solid var(--color-border)',
                    color: msg.role === 'user' ? '#fff' : 'var(--color-text)',
                    fontSize: 13,
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                  }}>
                    {msg.text}
                  </div>
                </div>

                {/* Product cards */}
                {msg.products && msg.products.length > 0 && (
                  <div style={{
                    marginTop: 10,
                    marginLeft: 36,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${Math.min(msg.products.length, 2)}, 1fr)`,
                    gap: 8,
                  }}>
                    {msg.products.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Task 3.7: Typing indicator */}
            {isLoading && <TypingIndicator />}

            {/* Task 3.8: Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--color-border)',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              className="chat-input"
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(); }}
              placeholder="Escribe tu pregunta aquí..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                padding: '10px 14px',
                fontSize: 13,
                color: 'var(--color-text)',
                transition: 'border-color 0.2s',
                opacity: isLoading ? 0.6 : 1,
              }}
            />
            <button
              id="chatbot-send-btn"
              onClick={sendMessage}
              disabled={isLoading || !inputValue.trim()}
              title="Enviar mensaje"
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: inputValue.trim() && !isLoading
                  ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                  : 'var(--color-surface2)',
                border: '1px solid var(--color-border)',
                cursor: inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
                color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
