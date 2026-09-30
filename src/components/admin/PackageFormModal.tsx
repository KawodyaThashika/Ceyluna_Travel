import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { TourPackage, PackageDay } from '../../types';

interface PackageFormModalProps {
    initial?: TourPackage | null;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

const CATEGORIES = ['beach', 'adventure', 'wildlife', 'cultural', 'honeymoon', 'family', 'luxury'];
const VEHICLE_TYPES = ['sedan', 'suv', 'van', 'luxury', 'minibus'];
const ACCOM_CATEGORIES = ['budget', 'standard', 'premium', 'luxury'];

const emptyDay = (day: number): PackageDay => ({
    day,
    title: '',
    description: '',
    destinations: [],
    activities: [],
    meals: [],
    accommodation: '',
});

export default function PackageFormModal({ initial, onClose, onSave }: PackageFormModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: initial?.name || '',
        tagline: initial?.tagline || '',
        duration: initial?.duration ?? 3,
        category: initial?.category || 'cultural',
        destinations: (initial?.destinations || []).join(', '),
        description: initial?.description || '',
        image: initial?.image || '',
        startingPrice: initial?.startingPrice ?? 100,
        includes: (initial?.includes || []).join(', '),
        excludes: (initial?.excludes || []).join(', '),
        vehicleType: initial?.vehicleType || 'sedan',
        accommodationCategory: initial?.accommodationCategory || 'standard',
        featured: initial?.featured ?? false,
        popular: initial?.popular ?? false,
    });
    const [itinerary, setItinerary] = useState<PackageDay[]>(
        initial?.itinerary?.length ? initial.itinerary : [emptyDay(1)]
    );

    const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

    const updateDay = (index: number, key: keyof PackageDay, value: any) => {
        setItinerary((prev) => prev.map((d, i) => (i === index ? { ...d, [key]: value } : d)));
    };

    const addDay = () => setItinerary((prev) => [...prev, emptyDay(prev.length + 1)]);
    const removeDay = (index: number) =>
        setItinerary((prev) => prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim() || !form.startingPrice || !form.duration) {
            setError('Name, duration and starting price are required.');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                duration: Number(form.duration),
                startingPrice: Number(form.startingPrice),
                destinations: form.destinations.split(',').map((s) => s.trim()).filter(Boolean),
                includes: form.includes.split(',').map((s) => s.trim()).filter(Boolean),
                excludes: form.excludes.split(',').map((s) => s.trim()).filter(Boolean),
                itinerary,
            };
            await onSave(payload);
        } catch (err: any) {
            setError(err.message || 'Something went wrong saving the package.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-surface-150 sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="font-display font-bold text-lg text-surface-900">
                        {initial ? 'Edit Tour Package' : 'Add New Tour Package'}
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
                            <label className="label">Package Name *</label>
                            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Tagline</label>
                            <input className="input" value={form.tagline} onChange={(e) => update('tagline', e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Duration (days) *</label>
                            <input type="number" min={1} className="input" value={form.duration} onChange={(e) => update('duration', e.target.value)} required />
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
                            <label className="label">Starting Price (USD) *</label>
                            <input type="number" min={0} className="input" value={form.startingPrice} onChange={(e) => update('startingPrice', e.target.value)} required />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Destinations (comma-separated ids)</label>
                            <input className="input" value={form.destinations} onChange={(e) => update('destinations', e.target.value)} placeholder="tangalle, mirissa, galle" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Description</label>
                            <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => update('description', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Image URL</label>
                            <input className="input" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="label">Vehicle Type</label>
                            <select className="select" value={form.vehicleType} onChange={(e) => update('vehicleType', e.target.value)}>
                                {VEHICLE_TYPES.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Accommodation</label>
                            <select className="select" value={form.accommodationCategory} onChange={(e) => update('accommodationCategory', e.target.value)}>
                                {ACCOM_CATEGORIES.map((v) => (
                                    <option key={v} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Includes (comma-separated)</label>
                            <input className="input" value={form.includes} onChange={(e) => update('includes', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Excludes (comma-separated)</label>
                            <input className="input" value={form.excludes} onChange={(e) => update('excludes', e.target.value)} />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-surface-700">
                            <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} />
                            Featured on homepage
                        </label>
                        <label className="flex items-center gap-2 text-sm text-surface-700">
                            <input type="checkbox" checked={form.popular} onChange={(e) => update('popular', e.target.checked)} />
                            Marked as popular
                        </label>
                    </div>

                    {/* Itinerary editor */}
                    <div className="border-t border-surface-150 pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-sm text-surface-800">Itinerary</h4>
                            <button type="button" onClick={addDay} className="btn-secondary text-xs !py-1.5 !px-3">
                                <Plus size={14} /> Add Day
                            </button>
                        </div>
                        <div className="space-y-3">
                            {itinerary.map((day, idx) => (
                                <div key={idx} className="bg-surface-50 border border-surface-150 rounded-xl p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-primary-750">Day {day.day}</span>
                                        {itinerary.length > 1 && (
                                            <button type="button" onClick={() => removeDay(idx)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <input
                                        className="input !py-2 text-sm"
                                        placeholder="Day title"
                                        value={day.title}
                                        onChange={(e) => updateDay(idx, 'title', e.target.value)}
                                    />
                                    <textarea
                                        className="input !py-2 text-sm min-h-[60px]"
                                        placeholder="Day description"
                                        value={day.description}
                                        onChange={(e) => updateDay(idx, 'description', e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2 sticky bottom-0 bg-white pb-1">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Create Package'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
