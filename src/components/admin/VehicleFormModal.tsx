import { useState } from 'react';
import { X } from 'lucide-react';
import { Vehicle } from '../../types';

interface VehicleFormModalProps {
    initial?: Vehicle | null;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
}

const TYPES = ['car', 'sedan', 'suv', 'van', 'luxury', 'minibus'];

export default function VehicleFormModal({ initial, onClose, onSave }: VehicleFormModalProps) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: initial?.name || '',
        type: initial?.type || 'sedan',
        passengerCapacity: initial?.passengerCapacity ?? 4,
        luggageCapacity: initial?.luggageCapacity ?? 2,
        hasAC: initial?.hasAC ?? true,
        dailyRate: initial?.dailyRate ?? 50,
        perKmRate: initial?.perKmRate ?? 0.2,
        driverIncluded: initial?.driverIncluded ?? true,
        image: initial?.image || '',
        features: (initial?.features || []).join(', '),
        available: initial?.available ?? true,
    });

    const update = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim() || !form.passengerCapacity || !form.dailyRate) {
            setError('Name, passenger capacity and daily rate are required.');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                passengerCapacity: Number(form.passengerCapacity),
                luggageCapacity: Number(form.luggageCapacity),
                dailyRate: Number(form.dailyRate),
                perKmRate: Number(form.perKmRate),
                features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
            };
            await onSave(payload);
        } catch (err: any) {
            setError(err.message || 'Something went wrong saving the vehicle.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-surface-150">
                    <h3 className="font-display font-bold text-lg text-surface-900">
                        {initial ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
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
                            <label className="label">Vehicle Name *</label>
                            <input className="input" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Toyota Premio" />
                        </div>
                        <div>
                            <label className="label">Type</label>
                            <select className="select" value={form.type} onChange={(e) => update('type', e.target.value)}>
                                {TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="label">Passenger Capacity *</label>
                            <input type="number" min={1} className="input" value={form.passengerCapacity} onChange={(e) => update('passengerCapacity', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Luggage Capacity</label>
                            <input type="number" min={0} className="input" value={form.luggageCapacity} onChange={(e) => update('luggageCapacity', e.target.value)} />
                        </div>
                        <div>
                            <label className="label">Daily Rate (USD) *</label>
                            <input type="number" min={0} className="input" value={form.dailyRate} onChange={(e) => update('dailyRate', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label">Per Km Rate (USD)</label>
                            <input type="number" min={0} step="0.01" className="input" value={form.perKmRate} onChange={(e) => update('perKmRate', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Image URL</label>
                            <input className="input" value={form.image} onChange={(e) => update('image', e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Features (comma-separated)</label>
                            <input className="input" value={form.features} onChange={(e) => update('features', e.target.value)} placeholder="Air Conditioning, Bluetooth Audio" />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-surface-700">
                            <input type="checkbox" checked={form.hasAC} onChange={(e) => update('hasAC', e.target.checked)} />
                            Has A/C
                        </label>
                        <label className="flex items-center gap-2 text-sm text-surface-700">
                            <input type="checkbox" checked={form.driverIncluded} onChange={(e) => update('driverIncluded', e.target.checked)} />
                            Driver included
                        </label>
                        <label className="flex items-center gap-2 text-sm text-surface-700">
                            <input type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} />
                            Available for booking
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Add Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
