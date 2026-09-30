import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Search, ArrowRight, Compass } from 'lucide-react';
import { destinations } from '../data/destinations';

export default function DestinationsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const regions = ['All', ...new Set(destinations.map(d => d.region))];
    const categories = ['All', 'Beach', 'Wildlife', 'Cultural', 'Nature', 'Adventure', 'Relaxation'];

    const filteredDestinations = destinations.filter(dest => {
        const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dest.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = selectedRegion === 'All' || dest.region === selectedRegion;
        const matchesCategory = selectedCategory === 'All' || dest.category.includes(selectedCategory.toLowerCase());
        return matchesSearch && matchesRegion && matchesCategory;
    });

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            {/* Banner */}
            <div className="relative py-20 bg-primary-900 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1588258219511-64eb629cb833?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="relative z-10 container-custom text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Explore Sri Lanka</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Discover breathtaking beaches, lush tea country, ancient marvels, and rich wildlife habitats across the island.
                    </p>
                </div>
            </div>

            <div className="container-custom">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="select w-full sm:w-44 !py-2.5 bg-surface-50 text-sm border-surface-200"
                        >
                            <option value="All">All Regions</option>
                            {regions.filter(r => r !== 'All').map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select w-full sm:w-44 !py-2.5 bg-surface-50 text-sm border-surface-200"
                        >
                            <option value="All">All Categories</option>
                            {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Destinations Grid */}
                {filteredDestinations.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDestinations.map((dest) => (
                            <Link to={`/destinations/${dest.slug}`} key={dest.id} className="card group overflow-hidden">
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={dest.image}
                                        alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="overlay-gradient" />
                                    <div className="absolute top-4 right-4">
                                        <span className="badge !bg-white/95 !text-surface-800 !border-0 backdrop-blur-sm shadow-sm font-semibold">
                                            {dest.region}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 text-white">
                                        <h2 className="text-xl font-display font-bold">{dest.name}</h2>
                                        <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                                            <Clock size={12} /> {dest.travelTimeFromTangalle} from Tangalle
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col h-44">
                                    <p className="text-sm text-surface-500 line-clamp-3 mb-4">{dest.shortDescription}</p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex gap-1.5 overflow-hidden">
                                            {dest.category.map(cat => (
                                                <span key={cat} className="text-[10px] px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium capitalize">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-primary-600 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Explore <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-card">
                        <Compass size={48} className="text-surface-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-surface-800 mb-1">No Destinations Found</h3>
                        <p className="text-surface-500 text-sm">Try modifying your search or filters to see more results.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
