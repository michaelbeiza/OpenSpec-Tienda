import type { APIRoute } from 'astro';
import { buscarProductos } from '../../lib/gemini-search';

export const ALL: APIRoute = async ({ request, url }) => {
  let queryParam = '';

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      queryParam = body.q || body.query || '';
    } catch(e) {}
  } else {
    const urlObj = new URL(request.url);
    queryParam = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || '';
  }

  if (!queryParam || queryParam.trim() === '') {
    return new Response(JSON.stringify({
      error: 'Debe proveer un campo "q" o "query".',
      method: request.method,
      url: request.url
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const results = await buscarProductos(queryParam);
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      error: 'Error interno.',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
