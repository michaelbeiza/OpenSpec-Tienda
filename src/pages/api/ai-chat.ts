import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { extractSearchTerms, searchProductsByTerms } from '../../lib/gemini-chat';

export const POST: APIRoute = async ({ request }) => {
  console.log('[api/ai-chat] POST received');
  
  let message = '';
  try {
    // Lectura lo más directa posible del cuerpo
    message = await request.text();
    console.log('[api/ai-chat] Raw body read:', message);

    if (!message || message.trim() === '') {
      const contentType = request.headers.get('content-type');
      return new Response(JSON.stringify({ 
        error: 'El mensaje está vacío.',
        debug: { contentType, method: request.method }
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e: any) {
    console.error('[api/ai-chat] Error reading request text:', e.message);
    return new Response(JSON.stringify({ error: 'Error al leer la petición.' }), { status: 400 });
  }

  // Auth check
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const supabase = createClient(import.meta.env.PUBLIC_SUPABASE_URL, import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
  
  let user = null;
  if (token) {
    const { data } = await supabase.auth.getUser(token);
    user = data?.user;
  }

  if (!user) {
     return new Response(JSON.stringify({ error: 'No autorizado. Por favor reinicia sesión.' }), { status: 401 });
  }

  try {
    const { message: reply, searchTerms } = await extractSearchTerms(message);
    const products = await searchProductsByTerms(searchTerms);

    return new Response(JSON.stringify({ reply, products }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('[api/ai-chat] Logic error:', err);
    return new Response(JSON.stringify({ error: 'Error del asistente.', details: err?.message }), { status: 500 });
  }
};
