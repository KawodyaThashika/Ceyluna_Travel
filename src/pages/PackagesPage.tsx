import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Calendar, MapPin, Star, Sparkles, Sliders } from 'lucide-react';

export default function PackagesPage() {
    const { packages: tourPackages, loading } = useContent();
    const [selectedDuration, setSelectedDuration] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'beach', 'adventure', 'wildlife', 'cultural', 'honeymoon', 'family', 'luxury'];

    const filteredPackages = tourPackages.filter(pkg => {
        const matchesCategory = selectedCategory === 'All' || pkg.category === selectedCategory;

        let matchesDuration = true;
        if (selectedDuration !== 'All') {
            if (selectedDuration === 'short') matchesDuration = pkg.duration <= 4;
            else if (selectedDuration === 'medium') matchesDuration = pkg.duration > 4 && pkg.duration <= 7;
            else if (selectedDuration === 'long') matchesDuration = pkg.duration > 7;
        }

        return matchesCategory && matchesDuration;
    });

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            {/* Banner */}
            <div className="relative py-20 bg-primary-900 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549366021-9f761d450615?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="relative z-10 container-custom text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Tour Packages</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Choose a curated itinerary designed by local destination experts. Each package can be customized to match your exact requests.
                    </p>
                </div>
            </div>

            <div className="container-custom">
                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2 text-surface-800">
                        <Sliders size={18} className="text-primary-600" />
                        <span className="font-semibold text-sm">Filter Packages</span>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select w-full sm:w-44 !py-2.5 bg-surface-50 text-sm border-surface-200 capitalize"
                        >
                            <option value="All">All Categories</option>
                            {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="select w-full sm:w-44 !py-2.5 bg-surface-50 text-sm border-surface-200"
                        >
                            <option value="All">Any Duration</option>
                            <option value="short">1 - 4 Days</option>
                            <option value="medium">5 - 7 Days</option>
                            <option value="long">8+ Days</option>
                        </select>
                    </div>
                </div>

                {/* Packages Grid */}
                {loading && tourPackages.length === 0 ? (
                    <div className="text-center py-16 text-surface-400 text-sm">Loading packages…</div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPackages.map((pkg) => (
                        <Link to={`/packages/${pkg.slug}`} key={pkg.id} className="card group flex flex-col h-full overflow-hidden">
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="overlay-gradient" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <span className="badge !bg-white/95 !text-surface-800 !border-0 backdrop-blur-sm shadow-sm font-semibold capitalize">
                                        {pkg.category}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 text-white flex justify-between items-end">
                                    <div>
                                        <h2 className="text-xl font-display font-bold leading-tight group-hover:text-primary-200 transition-colors">{pkg.name}</h2>
                                        <p className="text-xs text-white/70 mt-1 flex items-center gap-1">
                                            <Calendar size={12} /> {pkg.duration} Days
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <p className="text-sm text-surface-500 line-clamp-3 mb-4">{pkg.description}</p>

                                {/* Highlights */}
                                <div className="mb-4 space-y-1.5 flex-1">
                                    <h4 className="text-xs font-bold text-surface-400 uppercase tracking-widest">Destinations Included</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {pkg.destinations.map(d => (
                                            <span key={d} className="text-[10.5px] px-2 py-0.5 rounded bg-surface-100 text-surface-700 capitalize font-medium">
                                                {d}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-surface-100 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] text-surface-400 block">Starting from</span>
                                        <span className="text-2xl font-bold text-primary-700">${pkg.startingPrice}</span>
                                        <span className="text-xs text-surface-400 font-medium"> /pax</span>
                                    </div>
                                    <span className="btn-primary text-xs !px-4 !py-2 justify-center">
                                        View Package
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                )}
            </div>
        </main>
    );
}
