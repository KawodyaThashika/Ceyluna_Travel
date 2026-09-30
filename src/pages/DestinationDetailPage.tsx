import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, ArrowLeft, Calendar, Compass, ShieldCheck } from 'lucide-react';
import { destinations } from '../data/destinations';
import { getHotelsByDestination } from '../data/services';
import { useContent } from '../context/ContentContext';

export default function DestinationDetailPage() {
    const { slug } = useParams();
    const { getActivitiesByDestination } = useContent();
    const dest = destinations.find(d => d.slug === slug);

    if (!dest) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-surface-50">
                <Compass size={48} className="text-surface-300 mb-4 animate-spin" />
                <h2 className="text-xl font-bold text-surface-800">Destination Not Found</h2>
                <Link to="/destinations" className="btn-primary mt-4">
                    <ArrowLeft size={16} /> Back to Destinations
                </Link>
            </div>
        );
    }

    const activities = getActivitiesByDestination(dest.id);
    const hotels = getHotelsByDestination(dest.id);

    return (
        <main className="min-h-screen pt-20 lg:pt-28 pb-16 bg-surface-50">
            {/* Hero Section */}
            <div className="relative h-[400px] sm:h-[500px]">
                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/30 to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 z-10">
                    <div className="container-custom">
                        <Link to="/destinations" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white mb-4 text-sm font-semibold transition-colors">
                            <ArrowLeft size={16} /> Back to Destinations
                        </Link>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold uppercase tracking-wide">
                                {dest.region} Region
                            </span>
                            {dest.category.map(c => (
                                <span key={c} className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold capitalize backdrop-blur-sm">
                                    {c}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mb-2">{dest.name}</h1>
                        <p className="text-white/80 text-sm flex items-center gap-1.5">
                            <Clock size={16} className="text-accent-400" />
                            Estimated Travel Time from Tangalle: <span className="font-semibold text-white">{dest.travelTimeFromTangalle} ({dest.distanceFromTangalle} km)</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Info & Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card">
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 mb-4">About the Destination</h2>
                            <p className="text-surface-600 leading-relaxed text-balance mb-6">{dest.description}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-surface-100">
                                <div>
                                    <h4 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-1">Best Time to Visit</h4>
                                    <p className="text-primary-700 font-medium text-sm flex items-center gap-1">
                                        <Calendar size={14} /> {dest.bestTimeToVisit}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-surface-800 uppercase tracking-wide mb-1">Recommended Duration</h4>
                                    <p className="text-primary-700 font-medium text-sm flex items-center gap-1">
                                        <Clock size={14} /> {dest.estimatedTimeRequired}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Attractions */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card">
                            <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 mb-6">Top Attractions</h2>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {dest.attractions.map((attraction, idx) => (
                                    <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100">
                                        <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-surface-800 text-sm">{attraction}</h3>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Activities */}
                        {activities.length > 0 && (
                            <div className="space-y-6">
                                <h2 className="text-xl sm:text-2xl font-display font-bold text-surface-900 px-1">Things to Do</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {activities.map((act) => (
                                        <div key={act.id} className="bg-white border rounded-xl overflow-hidden shadow-sm group">
                                            <div className="h-40 overflow-hidden relative">
                                                <img src={act.image} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-surface-700 shadow-sm border border-surface-200">
                                                    {act.category}
                                                </span>
                                            </div>
                                            <div className="p-4 flex flex-col justify-between h-40">
                                                <div>
                                                    <h3 className="font-bold text-surface-950 text-sm group-hover:text-primary-600 transition-colors">{act.name}</h3>
                                                    <p className="text-xs text-surface-400 mt-1">{act.duration}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-surface-50">
                                                    <span className="text-xs text-surface-500">From <strong className="text-primary-700 text-sm font-semibold">${act.price}</strong></span>
                                                    <Link to="/build-tour" className="text-xs font-semibold text-primary-600 flex items-center gap-0.5">
                                                        Add to builder →
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar Plan Tour */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-primary-900 via-primary-850 to-surface-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                            <h3 className="text-xl font-display font-bold mb-3 flex items-center gap-2">
                                <Compass className="text-accent-400" /> Plan Your Trip
                            </h3>
                            <p className="text-sm text-white/70 mb-6 leading-relaxed">
                                Add {dest.name} to your customized itinerary list using our interactive tour planning engine, or request a complete quotation.
                            </p>
                            <div className="space-y-3">
                                <a
                                    href={`https://wa.me/94767674827?text=${encodeURIComponent(`Hi! I'm interested in planning a trip to ${dest.name}. Can you help me build a custom tour?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full shadow-lg block text-center"
                                >
                                    Book via WhatsApp
                                </a>
                                <a
                                    href={`mailto:ceylunatravelstours@gmail.com?subject=${encodeURIComponent(`Custom Tour Inquiry: ${dest.name}`)}&body=${encodeURIComponent(`Hi,\n\nI would like to inquire about planning a custom tour to ${dest.name}.\n\nTell me more details about packages and custom tours.`)}`}
                                    className="inline-flex w-full justify-center items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/10 rounded-xl font-semibold text-white transition-colors text-center"
                                >
                                    Book via Email
                                </a>
                            </div>
                        </div>

                        {/* Hotels / Accommodations Preview */}
                        <div className="bg-white rounded-2xl p-6 shadow-card">
                            <h3 className="text-lg font-display font-bold text-surface-900 mb-4 flex items-center gap-2">
                                🏨 Recommended Stays
                            </h3>
                            {hotels.length > 0 ? (
                                <div className="space-y-4">
                                    {hotels.map((hotel) => (
                                        <div key={hotel.id} className="flex gap-3 items-center p-2 rounded-xl hover:bg-surface-50 transition-all border border-transparent hover:border-surface-100">
                                            <img src={hotel.image} alt={hotel.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-xs text-surface-850 truncate">{hotel.name}</h4>
                                                <div className="flex gap-1.5 items-center mt-1">
                                                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary-50 text-primary-700 font-semibold uppercase">
                                                        {hotel.category}
                                                    </span>
                                                    <span className="text-xs text-surface-500 font-medium">
                                                        ${hotel.priceRange.min}-${hotel.priceRange.max}/night
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-surface-450 text-xs">
                                    <p>Our team recommends several luxury & standard hotels in {dest.name}. Detailed accommodation selections will be shared with the final custom quote.</p>
                                </div>
                            )}
                        </div>

                        {/* Safety & Peace of Mind */}
                        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
                            <h3 className="text-lg font-display font-bold text-surface-900 mb-2 flex items-center gap-2">
                                <ShieldCheck className="text-primary-600" /> Travel Safely
                            </h3>
                            <div className="space-y-3 text-xs text-surface-600">
                                <p>✓ All transport via Ceyluna Travels is fully insured and tracked dynamically.</p>
                                <p>✓ Professional speaking chauffeurs prioritize your travel pace and preferences.</p>
                                <p>✓ Instant support helpline while on tour through our dedicated WhatsApp experts.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
