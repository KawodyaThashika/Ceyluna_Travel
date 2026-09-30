import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { getDestinationById } from '../data/destinations';
import { Calendar, MapPin, CheckCircle2, XCircle, ArrowLeft, Star, Clock, Compass, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function PackageDetailPage() {
    const { slug } = useParams();
    const { getPackageBySlug, loading } = useContent();
    const pkg = getPackageBySlug(slug || '');
    const [activeTab, setActiveTab] = useState<'itinerary' | 'details'>('itinerary');

    if (loading && !pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20 bg-surface-50 text-surface-400 text-sm">
                Loading package…
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20 bg-surface-50">
                <h2 className="text-xl font-bold text-surface-800">Package Not Found</h2>
                <Link to="/packages" className="btn-primary mt-4">
                    <ArrowLeft size={16} /> Back to Packages
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-20 lg:pt-28 pb-16 bg-surface-50">
            {/* Hero */}
            <div className="relative h-[350px] sm:h-[450px]">
                <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/20 to-transparent" />
                <div className="absolute bottom-8 left-0 right-0 z-10">
                    <div className="container-custom">
                        <Link to="/packages" className="inline-flex items-center gap-1.5 text-white/80 hover:text-white mb-4 text-sm font-semibold transition-colors">
                            <ArrowLeft size={16} /> Back to Packages
                        </Link>
                        <div className="flex items-center gap-1.5 text-white mb-2">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-bold">{pkg.rating} ({pkg.reviewCount} customer reviews)</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mb-2">{pkg.name}</h1>
                        <p className="text-white/85 text-sm/relaxed max-w-xl">{pkg.tagline}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Overview / Tabs */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card">
                            <div className="flex border-b border-surface-100 mb-6 gap-6">
                                <button
                                    onClick={() => setActiveTab('itinerary')}
                                    className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'itinerary' ? 'border-primary-600 text-primary-750' : 'border-transparent text-surface-500'}`}
                                >
                                    Day-by-Day Itinerary
                                </button>
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary-600 text-primary-750' : 'border-transparent text-surface-500'}`}
                                >
                                    Features & Details
                                </button>
                            </div>

                            {activeTab === 'itinerary' ? (
                                <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-surface-200">
                                    {pkg.itinerary.map((day, idx) => (
                                        <div key={idx} className="relative pl-8">
                                            <div className="absolute left-[3px] top-1.5 w-[21px] h-[21px] rounded-full border-4 border-white bg-primary-600 shadow-sm" />
                                            <div>
                                                <div className="flex gap-2 items-center">
                                                    <span className="px-2 py-0.5 bg-primary-50 rounded text-primary-750 font-bold text-xs uppercase">
                                                        Day {day.day}
                                                    </span>
                                                    <h3 className="font-bold text-surface-900 text-base">{day.title}</h3>
                                                </div>
                                                <p className="text-sm text-surface-650 mt-2 leading-relaxed">{day.description}</p>

                                                <div className="flex flex-wrap gap-4 mt-4 bg-surface-50 p-3 rounded-xl border border-surface-100 text-xs">
                                                    {day.destinations.length > 0 && (
                                                        <div className="flex items-center gap-1 text-surface-700">
                                                            <MapPin size={14} className="text-primary-600" />
                                                            <span><strong>Destinations: </strong>{day.destinations.map(d => getDestinationById(d)?.name || d).join(', ')}</span>
                                                        </div>
                                                    )}
                                                    {day.activities.length > 0 && (
                                                        <div className="flex items-center gap-1 text-surface-700">
                                                            <Compass size={14} className="text-primary-600" />
                                                            <span><strong>Activities: </strong>{day.activities.join(', ')}</span>
                                                        </div>
                                                    )}
                                                    {day.meals.length > 0 && (
                                                        <div className="text-surface-700">
                                                            <strong>Meals: </strong>{day.meals.join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-surface-900 mb-2">Package Description</h3>
                                        <p className="text-sm text-surface-600 leading-relaxed">{pkg.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-surface-100">
                                        <div>
                                            <strong>Transport Vehicle: </strong>
                                            <span className="text-sm text-surface-605 capitalize">{pkg.vehicleType}</span>
                                        </div>
                                        <div>
                                            <strong>Accommodation Option: </strong>
                                            <span className="text-sm text-surface-605 capitalize">{pkg.accommodationCategory} class standard</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-3 flex items-center gap-1.5 text-sm">
                                                <CheckCircle2 className="text-primary-600" size={16} /> What's Included
                                            </h4>
                                            <ul className="space-y-2">
                                                {pkg.includes.map((inc, i) => (
                                                    <li key={i} className="text-xs text-surface-600 flex gap-2">
                                                        <span>✓</span> {inc}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 mb-3 flex items-center gap-1.5 text-sm">
                                                <XCircle className="text-red-500" size={16} /> What's Excluded
                                            </h4>
                                            <ul className="space-y-2">
                                                {pkg.excludes.map((exc, i) => (
                                                    <li key={i} className="text-xs text-surface-600 flex gap-2">
                                                        <span>✗</span> {exc}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Pricing & Booking */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-surface-100">
                            <span className="text-xs text-surface-450 block font-medium">Starting price per person</span>
                            <div className="flex items-baseline gap-1 mt-1 mb-6">
                                <span className="text-4xl font-extrabold text-primary-850 font-display">${pkg.startingPrice}</span>
                                <span className="text-sm text-surface-450">/ pax</span>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`https://wa.me/94767674827?text=${encodeURIComponent(`Hi! I'm interested in booking the "${pkg.name}" package. Can you give me a quotation?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-accent w-full text-center py-3 font-semibold text-sm shadow-md"
                                >
                                    Book via WhatsApp
                                </a>
                                <a
                                    href={`mailto:ceylunatravelstours@gmail.com?subject=${encodeURIComponent(`Booking Inquiry: ${pkg.name}`)}&body=${encodeURIComponent(`Hi,\n\nI would like to inquire about booking the "${pkg.name}" package.\n\nPlease let me know the available dates and a quotation.`)}`}
                                    className="btn-primary w-full text-center py-3 font-semibold text-sm"
                                >
                                    Book via Email
                                </a>
                            </div>

                            <div className="mt-6 pt-6 border-t border-surface-100 flex items-center gap-3">
                                <Clock className="text-primary-650 flex-shrink-0" size={18} />
                                <div className="text-xs text-surface-600">
                                    <strong>Duration:</strong> {pkg.duration} Days / {pkg.duration - 1} Nights
                                </div>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <MapPin className="text-primary-650 flex-shrink-0" size={18} />
                                <div className="text-xs text-surface-605">
                                    <strong>Drives:</strong> Tangalle departure area base
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
                            <h3 className="text-sm font-bold text-surface-900 flex items-center gap-2">
                                <ShieldCheck className="text-primary-600" /> Payment & Cancellation
                            </h3>
                            <p className="text-xs text-surface-550 leading-relaxed">
                                A 30% deposit secures your booking. Free cancelation options up to 14 days before departure are available. Outstanding balance can be settled in USD, EUR, or LKR.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
