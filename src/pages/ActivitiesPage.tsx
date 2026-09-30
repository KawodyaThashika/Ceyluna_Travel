import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Clock, MapPin, Search, Compass, Waves, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ActivitiesPage() {
    const { activities } = useContent();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'wildlife', 'adventure', 'experience', 'nature', 'cultural'];

    const filteredActivities = activities.filter(act => {
        const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            act.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            act.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            {/* Banner */}
            <div className="relative py-20 bg-primary-900 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="relative z-10 container-custom text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">Activities & Experiences</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        From blue-whale watching to surfing retreats, nature safaris, and authentic cooking culinary lessons.
                    </p>
                </div>
            </div>

            <div className="container-custom">
                {/* Search / Filter */}
                <div className="bg-white rounded-2xl shadow-card p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-11"
                        />
                    </div>
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select w-full md:w-48 !py-2.5 bg-surface-50 text-sm border-surface-200 capitalize"
                        >
                            <option value="All">All Activities</option>
                            {categories.filter(c => c !== 'All').map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Display Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredActivities.map((act) => (
                        <div key={act.id} className="card group overflow-hidden flex flex-col h-full bg-white">
                            <div className="relative h-52 overflow-hidden">
                                <img src={act.image} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 right-4">
                                    <span className="badge !bg-white/95 !text-surface-850 !border-0 font-bold capitalize">
                                        {act.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-surface-500 mt-1 mb-2 font-medium">
                                        <MapPin size={13} className="text-primary-650" />
                                        <span>{act.location}</span>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-surface-900 leading-tight mb-2 group-hover:text-primary-700 transition-colors">
                                        {act.name}
                                    </h3>
                                    <p className="text-sm text-surface-500 line-clamp-3 mb-4 leading-relaxed">{act.description}</p>
                                </div>

                                <div className="mt-auto space-y-4">
                                    <div className="pt-4 border-t border-surface-50 flex items-center justify-between text-xs text-surface-500">
                                        <span>Duration: <strong>{act.duration}</strong></span>
                                        {act.difficulty && <span>Difficulty: <strong>{act.difficulty}</strong></span>}
                                    </div>
                                    <div className="flex justify-between items-center bg-surface-50 p-3 rounded-xl">
                                        <div>
                                            <span className="text-[10px] text-surface-400 block">Tariff</span>
                                            <span className="text-xl font-bold text-primary-700 font-display">${act.price}</span>
                                            <span className="text-[10px] text-surface-450 font-medium"> /person</span>
                                        </div>
                                        <Link to="/build-tour" className="btn-primary text-xs !px-4 !py-2 justify-center">
                                            Plan In Tour
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
