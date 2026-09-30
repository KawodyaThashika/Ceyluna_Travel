import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { destinations } from '../data/destinations';
import { useContent } from '../context/ContentContext';
import { Sparkles, ArrowRight, CheckCircle2, Calendar, Users, Briefcase, MapPin, Plane, HelpCircle } from 'lucide-react';

export default function CustomTourRequestPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const packageParam = searchParams.get('package');
    const { getPackageById } = useContent();

    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        country: '',
        arrivalDate: '',
        departureDate: '',
        adults: 2,
        children: 0,
        budget: 'standard',
        interests: [] as string[],
        preferredDestinations: [] as string[],
        accommodationType: 'standard',
        airportPickup: false,
        flightNumber: '',
        arrivalTime: '',
        specialRequirements: '',
        dietaryRequirements: '',
        notes: '',
    });

    const [submitted, setSubmitted] = useState(false);
    const [createdRequest, setCreatedRequest] = useState<any>(null);

    // Set default values from package query param
    useEffect(() => {
        if (packageParam) {
            const pkg = getPackageById(packageParam);
            if (pkg) {
                setFormData(prev => ({
                    ...prev,
                    preferredDestinations: pkg.destinations,
                    accommodationType: pkg.accommodationCategory,
                    notes: `Interested in tour package: ${pkg.name} (${pkg.duration} Days)`
                }));
            }
        }
    }, [packageParam]);

    const toggleInterest = (interest: string) => {
        setFormData(prev => {
            const interests = prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest];
            return { ...prev, interests };
        });
    };

    const toggleDestination = (destId: string) => {
        setFormData(prev => {
            const preferredDestinations = prev.preferredDestinations.includes(destId)
                ? prev.preferredDestinations.filter(id => id !== destId)
                : [...prev.preferredDestinations, destId];
            return { ...prev, preferredDestinations };
        });
    };

    const [submitError, setSubmitError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        let msg = `*New Custom Tour Request*\n\n`;
        msg += `*Name:* ${formData.customerName}\n`;
        msg += `*Email:* ${formData.email}\n`;
        msg += `*Country:* ${formData.country}\n`;
        msg += `*Travelers:* ${formData.adults} Adults, ${formData.children} Children\n`;
        msg += `*Dates:* ${formData.arrivalDate} to ${formData.departureDate}\n`;
        msg += `*Budget/Hotel:* ${formData.budget} budget, ${formData.accommodationType} hotel\n`;
        msg += `*Destinations:* ${formData.preferredDestinations.map(d => destinations.find(x => x.id === d)?.name || d).join(', ')}\n`;

        if (formData.interests.length > 0) {
            msg += `*Interests:* ${formData.interests.join(', ')}\n`;
        }
        if (formData.dietaryRequirements) {
            msg += `*Dietary/Health:* ${formData.dietaryRequirements}\n`;
        }
        if (formData.notes) {
            msg += `*Notes:* ${formData.notes}\n`;
        }

        const whatsappUrl = `https://wa.me/94767674827?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, '_blank');
        setSubmitted(true);
    };

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            <div className="container-custom max-w-4xl">
                <div className="text-center mb-10">
                    <span className="badge-accent mb-3">Ceyluna Tour Request</span>
                    <h1 className="text-3xl sm:text-4xl font-display font-bold text-surface-900 mb-3">
                        Request a Custom Tour Plan
                    </h1>
                    <p className="text-sm sm:text-base text-surface-555 max-w-xl mx-auto">
                        Provide details about your group size, travel preferences, and preferred route.
                        Our Sri Lankan travel experts will build a customized itinerary and quotation for you.
                    </p>
                </div>

                {submitted ? (
                    <div className="bg-white p-8 rounded-2xl border border-primary-200 shadow-premium max-w-2xl mx-auto space-y-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center mx-auto">
                            <CheckCircle2 size={36} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display font-bold text-surface-905">Inquiry Submitted Successfully!</h2>
                            <p className="text-xs text-surface-450 mt-1">Reference ID: <span className="font-mono font-semibold text-primary-750">{createdRequest?.inquiryRef}</span></p>
                        </div>
                        <p className="text-sm text-surface-550 leading-relaxed max-w-md mx-auto">
                            We have received your custom tour planning request. A personal travel advisor has been assigned to your inquiry and will send the first draft of your itinerary and quotation to <strong className="text-surface-700">{formData.email}</strong> within 24 hours.
                        </p>

                        <div className="bg-surface-50 p-4 rounded-xl text-left text-xs space-y-2 border border-surface-100">
                            <p>👝 <strong>Travelers:</strong> {formData.adults} Adults, {formData.children} Children</p>
                            <p>📅 <strong>Arrival:</strong> {formData.arrivalDate || 'Not specified'}</p>
                            <p>🏩 <strong>Hotel Category:</strong> <span className="capitalize">{formData.accommodationType}</span></p>
                            {formData.preferredDestinations.length > 0 && (
                                <p>📍 <strong>Destinations Selected:</strong> {formData.preferredDestinations.map(id => destinations.find(d => d.id === id)?.name || id).join(', ')}</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                            <button onClick={() => navigate('/')} className="btn-secondary">
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-card border border-surface-100 space-y-8">

                        {/* Section 1: Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <Users className="text-primary-600" size={20} /> 1. Contact Information
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone / WhatsApp Number</label>
                                    <input
                                        type="text"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Home Country</label>
                                    <input
                                        type="text"
                                        placeholder="United Kingdom, Germany, etc."
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Travel Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <Calendar className="text-primary-600" size={20} /> 2. Tour Planning & Travelers
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="label">Arrival Date</label>
                                    <input
                                        type="date"
                                        value={formData.arrivalDate}
                                        onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Departure Date</label>
                                    <input
                                        type="date"
                                        value={formData.departureDate}
                                        onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Adults (12+ yrs)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={formData.adults}
                                        onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 2 })}
                                        className="input"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Children (2-11 yrs)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.children}
                                        onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                                        className="input"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Preferences */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <Briefcase className="text-primary-600" size={20} /> 3. Budget & Travel Style
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="label">Preferred Budget Tier</label>
                                    <select
                                        value={formData.budget}
                                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                        className="select"
                                    >
                                        <option value="budget">Budget (Guesthouses, clean basic lodging)</option>
                                        <option value="standard">Standard (3-star hotels, comfortable private transport)</option>
                                        <option value="premium">Premium (4-star boutique hotels, upgrade vehicles)</option>
                                        <option value="luxury">Luxury (5-star private resorts, heritage villas, premium service)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Accommodation Type</label>
                                    <select
                                        value={formData.accommodationType}
                                        onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                                        className="select"
                                    >
                                        <option value="budget">Budget Lodging / Homestays</option>
                                        <option value="standard">Standard Hotels</option>
                                        <option value="boutique">Boutique Hotels / Retreats</option>
                                        <option value="luxury">Luxury Resorts & Villas</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="label">Interests & Travel Styles</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {['Beach Relaxation', 'Wildlife Safari', 'Cultural Antiquity', 'Hiking & Adventure', 'Culinary / Tea', 'Honeymoon', 'Family Holiday', 'Nature & Eco'].map(style => (
                                        <button
                                            type="button"
                                            key={style}
                                            onClick={() => toggleInterest(style)}
                                            className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${formData.interests.includes(style) ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-surface-50 border-surface-200 text-surface-700 hover:border-surface-300'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Destinations */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <MapPin className="text-primary-600" size={20} /> 4. Preferred Destinations
                            </h3>
                            <p className="text-xs text-surface-450">Select any destinations you definitely want to visit:</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {destinations.map(d => (
                                    <button
                                        type="button"
                                        key={d.id}
                                        onClick={() => toggleDestination(d.id)}
                                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center gap-1.5 ${formData.preferredDestinations.includes(d.id) ? 'bg-primary-600 border-primary-600 text-white shadow-sm' : 'bg-surface-50 border-surface-200 text-surface-700 hover:border-surface-300'}`}
                                    >
                                        <span className="truncate">{d.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Section 5: Pickup */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <Plane className="text-primary-600" size={20} /> 5. Starting / Pickup Location
                            </h3>
                            <div>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.airportPickup}
                                        onChange={(e) => setFormData({ ...formData, airportPickup: e.target.checked })}
                                        className="w-4 h-4 rounded border-surface-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm font-semibold text-surface-800">I require Airport Pickup</span>
                                </label>
                            </div>

                            {formData.airportPickup && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-surface-50 border border-surface-100 animate-in">
                                    <div>
                                        <label className="label">Flight Number</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. UL 504"
                                            value={formData.flightNumber}
                                            onChange={(e) => setFormData({ ...formData, flightNumber: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Arrival Time</label>
                                        <input
                                            type="time"
                                            value={formData.arrivalTime}
                                            onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Section 6: Dietary or special notes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-surface-900 border-b border-surface-100 pb-2 flex items-center gap-2">
                                <HelpCircle className="text-primary-600" size={20} /> 6. Special Remarks
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="label">Dietary Requirements / Health guidelines</label>
                                    <input
                                        type="text"
                                        placeholder="Vegetarian, vegan, food allergy warnings, wheelchair assistance required, etc."
                                        value={formData.dietaryRequirements}
                                        onChange={(e) => setFormData({ ...formData, dietaryRequirements: e.target.value })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="label">Additional Notes or Preferred Route Guidelines</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Let us know any custom plans, particular hotels, or specific guide requests you have."
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="textarea"
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 text-base shadow-md">
                            Submit My Custom Planning Request
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
