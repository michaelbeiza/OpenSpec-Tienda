import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Order, OrderItem } from '../../lib/types';

interface Props { userId: string; email: string; onClose: () => void; }

export default function UserOrdersModal({ userId, email, onClose }: Props) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [items, setItems] = useState<Record<string, (OrderItem & { product?: { name: string } })[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { data } = await supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false });
            setOrders(data ?? []);
            setLoading(false);
        }
        load();
    }, [userId]);

    const toggleOrder = async (orderId: string) => {
        if (expanded === orderId) { setExpanded(null); return; }
        setExpanded(orderId);
        if (!items[orderId]) {
            const { data } = await supabase.from('order_items').select('*, product:products(name)').eq('order_id', orderId);
            setItems(prev => ({ ...prev, [orderId]: data ?? [] }));
        }
    };

    const statusColors: Record<string, string> = { pending: 'bg-amber-500/10 text-amber-400', paid: 'bg-violet-500/10 text-violet-400', shipped: 'bg-green-500/10 text-green-400', cancelled: 'bg-red-500/10 text-red-400' };
    const statusLabels: Record<string, string> = { pending: 'Pendiente', paid: 'Pagado', shipped: 'Enviado', cancelled: 'Cancelado' };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 w-full max-w-xl shadow-2xl max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-lg font-bold">Historial de pedidos</h2>
                        <p className="text-gray-400 text-sm">{email}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
                </div>

                <div className="overflow-y-auto flex-1">
                    {loading ? (
                        <div className="text-center py-8 text-gray-400">Cargando...</div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-3xl mb-2">📋</div>
                            <p className="text-gray-400 text-sm">Este usuario no tiene pedidos.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {orders.map(o => (
                                <div key={o.id} className="bg-[#0d0d1a] rounded-xl overflow-hidden">
                                    <button onClick={() => toggleOrder(o.id)}
                                        className="w-full px-4 py-3 flex items-center gap-3 text-left text-sm hover:bg-[#2a2a4a]/30 transition-colors">
                                        <span className="font-mono text-gray-500 text-xs">#{o.id.slice(0, 8)}</span>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[o.status] ?? ''}`}>{statusLabels[o.status] ?? o.status}</span>
                                        <span className="text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString('es-ES')}</span>
                                        <span className="ml-auto font-bold text-[#7c6bff]">€{o.total.toFixed(2)}</span>
                                        <span className="text-gray-500 text-xs">{expanded === o.id ? '▲' : '▼'}</span>
                                    </button>
                                    {expanded === o.id && (
                                        <div className="px-4 pb-3 pt-1 border-t border-[#2a2a4a] space-y-1">
                                            {items[o.id]
                                                ? items[o.id].map(item => (
                                                    <div key={item.id} className="flex justify-between text-xs text-gray-400">
                                                        <span>{item.product?.name ?? 'Producto'} × {item.quantity}</span>
                                                        <span>€{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))
                                                : <p className="text-xs text-gray-500">Cargando items...</p>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
