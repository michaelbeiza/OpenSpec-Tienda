import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../lib/types';
import { CATEGORIES } from '../../lib/constants';

interface Props {
    product: Product | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function ProductForm({ product, onClose, onSaved }: Props) {
    const [form, setForm] = useState({ name: '', description: '', price: '', inventory: '', image_url: '', category: '' });
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                description: product.description,
                price: String(product.price),
                inventory: String(product.inventory),
                image_url: product.image_url ?? '',
                category: product.category ?? ''
            });
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const price = parseFloat(form.price);
        const inventory = parseInt(form.inventory);
        if (isNaN(price) || price < 0) { setError('El precio debe ser mayor o igual a 0.'); return; }
        if (isNaN(inventory) || inventory < 0) { setError('El stock debe ser mayor o igual a 0.'); return; }

        setSaving(true);
        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price,
            inventory,
            image_url: form.image_url.trim() || null,
            category: form.category.trim()
        };
        const { error: dbErr } = product
            ? await supabase.from('products').update(payload).eq('id', product.id)
            : await supabase.from('products').insert(payload);

        if (dbErr) setError(dbErr.message);
        else onSaved();
        setSaving(false);
    };

    const fields: { key: keyof typeof form; label: string; type: string; required: boolean; min?: string; step?: string; options?: string[] }[] = [
        { key: 'name', label: 'Nombre del producto', type: 'text', required: true },
        { key: 'description', label: 'Descripción', type: 'text', required: true },
        { key: 'price', label: 'Precio (€)', type: 'number', required: true, min: '0', step: '0.01' },
        { key: 'inventory', label: 'Stock', type: 'number', required: true, min: '0' },
        { key: 'category', label: 'Categoría', type: 'select', required: true, options: CATEGORIES },
        { key: 'image_url', label: 'URL de imagen (opcional)', type: 'url', required: false },
    ];

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] rounded-2xl p-6 w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">{product ? 'Editar producto' : 'Nuevo producto'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">×</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {fields.map(f => (
                        <div key={f.key}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">{f.label}</label>
                            {f.type === 'select' ? (
                                <select
                                    value={form[f.key]}
                                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    required={f.required}
                                    className="w-full bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors appearance-none"
                                >
                                    <option value="" disabled>Seleccionar categoría</option>
                                    {f.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            ) : (
                                <input type={f.type} value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    required={f.required} min={f.min} step={f.step} placeholder={f.label}
                                    className="w-full bg-[#0d0d1a] border border-[#2a2a4a] text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7c6bff] transition-colors placeholder-gray-600" />
                            )}
                        </div>
                    ))}

                    {error && <div className="bg-red-500/10 border border-red-500/50 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>}

                    <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={saving}
                            className="flex-1 bg-[#7c6bff] hover:bg-[#6b5cee] text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm">
                            {saving ? 'Guardando...' : product ? 'Guardar cambios' : 'Crear producto'}
                        </button>
                        <button type="button" onClick={onClose}
                            className="flex-1 border border-[#2a2a4a] hover:bg-[#2a2a4a] text-gray-300 font-semibold py-2.5 rounded-xl transition-colors text-sm">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
