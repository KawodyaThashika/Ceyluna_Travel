import { useState } from 'react';
import { X } from 'lucide-react';
import { Activity } from '../../types';

interface ActivityFormModalProps {
    initial?: Activity | null;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

const CATEGORIES = ['wildlife', 'adventure', 'experience', 'nature', 'cultural'];
const DIFFICULTIES = ['Easy', 'Moderate', 'Challenging', 'Beginner to Advanced'];

export default function ActivityFormModal({ initial, onClose, onSave }: ActivityFormModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: initial?.name || '',
        location: initial?.location || '',
        destinationId: initial?.destinationId || '',
        category: initial?.category || 'experience',
        duration: initial?.duration || '',
        price: initial?.price ?? 25,
        priceNote: initial?.priceNote || 'per person',
        minParticipants: initial?.minParticipants ?? 1,
        maxParticipants: initial?.maxParticipants ?? undefined,
        description: initial?.description || '',
        image: initial?.image || '',
        included: (initial?.included || []).join(', '),
        bestTime: initial?.bestTime || '',
        difficulty: initial?.difficulty || 'Easy',
    });

    const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim() || !form.price) {
            setError('Name and price are required.');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                minParticipants: Number(form.minParticipants) || 1,
                maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
                included: form.included.split(',').map((s) => s.trim()).filter(Boolean),
            };
            await onSave(payload);
        } catch (err: any) {
            setError(err.message || 'Something went wrong saving the activity.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-surface-150">
                    <h3 className="font-display font-bold text-lg text-surface-900">
                        {initial ? 'Edit Activity' : 'Add New Activity'}
                    </h3>
                    <button onClick={onClose} className="text-surface-400 hover:text-surface-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-650 text-xs font-medium p-3 rounded-lg">{error}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="label">Activity Name *</label>
                            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Location</label>
                            <input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="Mirissa" />
                        </div>
                        <div>
                            <label className="label">Destination ID</label>
                            <input className="input" value={form.destinationId} onChange={(e) => update('destinationId', e.target.value)} placeholder="mirissa" />
                        </div>
                        <div>
                            <label className="label">Category</label>
                            <select className="select" value={form.category} onChange={(e) => update('category', e.target.value)}>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Duration</label>
                            <input className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="2-3 hours" />
                        </div>
                        <div>
                            <label className="label">Price (USD) *</label>
                            <input type="number" min={0} className="input" value={form.price} onChange={(e) => update('price', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Price Note</label>
                            <input className="input" value={form.priceNote} onChange={(e) => update('priceNote', e.target.value)} placeholder="per person" />
                        </div>
                        <div>
                            <label className="label">Min Participants</label>
                            <input type="number" min={1} className="input" value={form.minParticipants} onChange={(e) => update('minParticipants', e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Max Participants</label>
                            <input type="number" min={1} className="input" value={form.maxParticipants || ''} onChange={(e) => update('maxParticipants', e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Difficulty</label>
                            <select className="select" value={form.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
                                {DIFFICULTIES.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Best Time</label>
                            <input className="input" value={form.bestTime} onChange={(e) => update('bestTime', e.target.value)} placeholder="November to April" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Description</label>
                            <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => update('description', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Image URL</label>
                            <input className="input" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Included (comma-separated)</label>
                            <input className="input" value={form.included} onChange={(e) => update('included', e.target.value)} placeholder="Boat ride, Life jacket, Guide" />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Activity'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
