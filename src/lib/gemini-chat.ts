import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import type { Product } from './types';

// ─── Gemini client ────────────────────────────────────────────────────────────
const genAI = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY as string);

const SYSTEM_PROMPT = `Eres un asistente de compras para Tienda Mishe.
Tu única función es ayudar al usuario a encontrar productos.
Cuando el usuario mencione un producto o necesidad, extrae las palabras clave más relevantes para buscar en el catálogo.
Responde SIEMPRE con JSON válido en este formato exacto, sin markdown ni bloques de código:
{ "message": "texto amigable al usuario", "searchTerms": ["término1", "término2"] }
Si no hay intención de compra clara, devuelve searchTerms como array vacío [].`;

export interface GeminiChatResponse {
  message: string;
  searchTerms: string[];
}

export async function extractSearchTerms(
  message: string,
  history: Array<{ role: 'user' | 'model'; text: string }> = []
): Promise<GeminiChatResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const chat = model.startChat({
    history: history.map((h) => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
  });

  const result = await chat.sendMessage(message);
  const text = result.response.text().trim();

  try {
    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(cleaned);
    return {
      message: parsed.message ?? 'Entendido, déjame buscar...',
      searchTerms: Array.isArray(parsed.searchTerms) ? parsed.searchTerms : [],
    };
  } catch {
    // Fallback: return the raw text as message, no search
    return { message: text, searchTerms: [] };
  }
}

// ─── Supabase product search ──────────────────────────────────────────────────
const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL as string,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string
);

export async function searchProductsByTerms(terms: string[]): Promise<Product[]> {
  if (!terms || terms.length === 0) return [];

  // Build OR filter: name ilike '%term%' OR description ilike '%term%'
  const orParts = terms.flatMap((term) => [
    `name.ilike.%${term}%`,
    `description.ilike.%${term}%`,
  ]);
  const orFilter = orParts.join(',');

  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, image_url, category, inventory, created_at')
    .or(orFilter)
    .limit(3);

  if (error) {
    console.error('[gemini-chat] Supabase search error:', error);
    return [];
  }

  return (data ?? []) as Product[];
}
