import { Compass, Sparkles, MapPin, Layers, Award, Users, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    const stats = [
        { label: 'Guided Safaris', value: '180+' },
        { label: 'Bespoke Itineraries', value: '350+' },
        { label: 'Local Team Members', value: '14' },
        { label: 'Satisfaction Rating', value: '4.95' }
    ];

    return (
        <main className="min-h-screen pt-24 lg:pt-32 pb-16 bg-surface-50">
            {/* Banner */}
            <div className="relative py-20 bg-primary-900 overflow-hidden mb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546587348-d12660c30c50?w=1600&q=80')] bg-cover bg-center mix-blend-overlay opacity-30" />
                <div className="relative z-10 container-custom text-center text-white">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold mb-4">About Ceyluna Travels</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">
                        Based in the serene beaches of Tangalle, we are a premier travel company bringing curated adventures to global tourists.
                    </p>
                </div>
            </div>

            <div className="container-custom space-y-16">
                {/* Main section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="badge mb-4">Our Mission</span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900 mb-6">
                            Empowering Tourists to Experience the Heart of Sri Lanka
                        </h2>
                        <p className="text-sm sm:text-base text-surface-600 leading-relaxed space-y-4">
                            At Ceyluna Travels, we believe that travel should be personalized, seamless, and completely authentic.
                            Having started our roots in Tangalle, Sri Lanka, we’ve expanded to customize itineraries spanning the entire island:
                            from national parks like Yala and Udawalawe to UNESCO Cultural landmarks and mountain villages.
                        </p>
                        <p className="text-sm sm:text-base text-surface-600 leading-relaxed mt-4">
                            We handle all aspects of travel planning: luxury/standard private transport, expert local guide services, booking accommodations, and planning outdoor eco-experiences.
                        </p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-premium h-80 sm:h-96">
                        <img src="https://images.unsplash.com/photo-1588258219511-64eb629cb833?w=800&q=80" alt="Ceyluna Travels Team" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-white p-8 rounded-2xl shadow-card">
                    {stats.map((st, i) => (
                        <div key={i} className="text-center">
                            <span className="text-3xl sm:text-4xl font-extrabold text-primary-650 block font-display">{st.value}</span>
                            <span className="text-xs text-surface-450 mt-1 block font-medium">{st.label}</span>
                        </div>
                    ))}
                </div>

                {/* Core Values */}
                <div className="space-y-8">
                    <div className="text-center">
                        <span className="badge mb-3">Our Values</span>
                        <h2 className="text-2xl sm:text-3xl font-display font-bold text-surface-900">What Drives Ceyluna Travels</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
                            <Compass className="text-primary-600 mb-4" size={32} />
                            <h3 className="font-bold text-surface-850 mb-2">Adventure with Care</h3>
                            <p className="text-xs text-surface-500 leading-relaxed">
                                Whether climbing steep mountains or taking deep sea safaris, safety is integrated into every route plan.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
                            <Heart className="text-accent-500 mb-4" size={32} />
                            <h3 className="font-bold text-surface-850 mb-2">Hospitality & Heart</h3>
                            <p className="text-xs text-surface-500 leading-relaxed">
                                Sri Lankan hospitality is legendary. Our drivers, guides, and staff treat you as personal guests.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm">
                            <Award className="text-primary-600 mb-4" size={32} />
                            <h3 className="font-bold text-surface-850 mb-2">Quality & Authenticity</h3>
                            <p className="text-xs text-surface-500 leading-relaxed">
                                No third-party commissions shape our recommendations. We only book spots verified by our staff.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Call to action */}
                <div className="bg-gradient-to-br from-primary-900 via-primary-850 to-surface-900 p-8 rounded-2xl text-center text-white shadow-lg space-y-6">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold">Ready to Start Planning?</h2>
                    <p className="text-sm text-white/70 max-w-xl mx-auto">
                        Connect with one of our travel advisers today. We will build a customized itinerary based on your days and budget.
                    </p>
                    <div className="flex justify-center gap-3">
                        <Link to="/build-tour" className="btn-primary">
                            Build Your Tour
                        </Link>
                        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:bg-white/10 rounded-xl font-semibold text-white transition-colors">
                            Talk to Advisor
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
