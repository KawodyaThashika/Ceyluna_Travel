import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    MapPin, Calendar, Users, Star, ArrowRight, ChevronRight, ChevronDown,
    Shield, Headphones, Heart, Compass, Camera, Mountain, Waves, TreePine,
    Sparkles, Clock, Globe, CheckCircle, Play, Quote, Minus, Plus,
} from 'lucide-react';
import { destinations } from '../data/destinations';
import { reviews, faqs } from '../data/services';
import { useContent } from '../context/ContentContext';

// ============ Animated Counter Hook ============
function useCountUp(end: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const increment = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
}

// ============ Section Observer Hook ============
function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}

// ============ HERO SECTION ============
function HeroSection() {
    const heroImages = [
        'https://www.holidify.com/images/bgImages/BENTOTA.jpg',
        'https://www.spendlifetraveling.com/wp-content/uploads/2019/02/must_visit_places_sri_lanka_sigiriya.jpg',
        'https://www.holidaymonk.com/wp-content/uploads/2025/10/Top-Tourist-Destinations-in-Sri-Lanka-1536x864.webp',
    ];
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setCurrent(i => (i + 1) % heroImages.length), 6000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="hero" className="relative h-screen min-h-[700px] max-h-[1000px] overflow-hidden">
            {/* Background Images */}
            {heroImages.map((img, i) => (
                <div
                    key={i}
                    className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={img} alt="Sri Lanka" className="w-full h-full object-cover" />
                </div>
            ))}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-surface-950/70 via-surface-950/40 to-surface-950/80" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center container-custom">
                <div className="max-w-3xl">
                    <div className="animate-fade-in-down">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium border border-white/20 mb-6">
                            <Sparkles size={16} className="text-accent-400" />
                            Premium Sri Lanka Tours from Tangalle
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6 animate-fade-in-up">
                        Discover the{' '}
                        <span className="bg-gradient-to-r from-primary-300 via-accent-300 to-ocean-300 bg-clip-text text-transparent">
                            Magic
                        </span>
                        <br />of Sri Lanka
                    </h1>

                    <p className="text-lg sm:text-xl text-white/80 max-w-xl mb-8 animate-fade-in-up delay-200">
                        Personalized tours crafted by local experts. From pristine beaches to ancient temples,
                        misty mountains to wildlife safaris — your Sri Lankan adventure starts here.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                        <Link to="/build-tour" className="btn-primary text-base !px-8 !py-4 shadow-xl">
                            <Compass size={20} />
                            Plan My Trip
                        </Link>
                        <Link to="/packages" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/20 transition-all duration-300">
                            <Play size={20} />
                            Explore Packages
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 mt-12 animate-fade-in-up delay-400">
                        {[
                            { value: '500+', label: 'Happy Travelers' },
                            { value: '50+', label: 'Destinations' },
                            { value: '4.9', label: 'Rating' },
                            { value: '8+', label: 'Years Experience' },
                        ].map(stat => (
                            <div key={stat.label} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-white/60 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-float">
                <ChevronDown size={28} className="text-white/50" />
            </div>

            {/* Image indicators */}
            <div className="absolute bottom-8 right-8 z-10 flex gap-2">
                {heroImages.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>
        </section>
    );
}

// ============ PLAN YOUR TRIP SECTION ============
function PlanTripSection() {
    const { ref, inView } = useInView();
    return (
        <section ref={ref} className="relative -mt-20 z-20 container-custom">
            <div className={`bg-white rounded-2xl shadow-premium p-6 sm:p-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 text-center lg:text-left">
                        <h2 className="text-2xl font-display font-bold text-surface-900 mb-2">
                            Ready to Explore Sri Lanka?
                        </h2>
                        <p className="text-surface-500">Tell us your dream trip and we'll make it happen.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <Link to="/build-tour" className="btn-primary justify-center">
                            <Compass size={18} />
                            Build Your Tour
                        </Link>
                        <Link to="/custom-tour-request" className="btn-accent justify-center">
                            <Sparkles size={18} />
                            Get Custom Quote
                        </Link>
                        <Link to="/packages" className="btn-secondary justify-center">
                            View Packages
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============ DESTINATIONS SECTION ============
function DestinationsSection() {
    const { ref, inView } = useInView();
    const featured = destinations.slice(0, 8);
    const categories = ['All', 'Beach', 'Wildlife', 'Cultural', 'Nature', 'Adventure'];
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? featured
        : featured.filter(d => d.category.includes(activeCategory.toLowerCase()));

    return (
        <section ref={ref} className="section-padding bg-surface-50" id="destinations-section">
            <div className="container-custom">
                {/* Header */}
                <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="badge mb-4">🌴 Destinations</span>
                    <h2 className="section-heading mb-4">
                        Explore Sri Lanka's <span className="gradient-text">Best Destinations</span>
                    </h2>
                    <p className="section-subheading mx-auto">
                        From southern beaches to ancient kingdoms, Sri Lanka offers incredible diversity in a compact island paradise.
                    </p>
                </div>

                {/* Category Filter */}
                <div className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 
                ${activeCategory === cat
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white text-surface-600 hover:bg-primary-50 hover:text-primary-700 border border-surface-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filtered.map((dest, i) => (
                        <Link
                            key={dest.id}
                            to={`/destinations/${dest.slug}`}
                            className={`card group overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
                        >
                            <div className="relative h-52 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="overlay-gradient" />
                                <div className="absolute top-3 right-3">
                                    <span className="badge !bg-white/90 !text-surface-700 !border-0 backdrop-blur-sm text-xs">
                                        {dest.region}
                                    </span>
                                </div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-lg font-display font-bold text-white">{dest.name}</h3>
                                    <p className="text-white/70 text-xs flex items-center gap-1 mt-1">
                                        <Clock size={12} /> {dest.travelTimeFromTangalle} from Tangalle
                                    </p>
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-surface-500 line-clamp-2">{dest.shortDescription}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex flex-wrap gap-1">
                                        {dest.category.slice(0, 2).map(c => (
                                            <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-medium capitalize">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                    <ArrowRight size={16} className="text-primary-500 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="text-center mt-10">
                    <Link to="/destinations" className="btn-secondary">
                        View All Destinations
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============ TOUR PACKAGES SECTION ============
function PackagesSection() {
    const { ref, inView } = useInView();
    const { packages: tourPackages } = useContent();
    const featured = tourPackages.filter(p => p.featured).slice(0, 4);

    return (
        <section ref={ref} className="section-padding" id="packages-section">
            <div className="container-custom">
                <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="badge-accent mb-4">🎒 Tour Packages</span>
                    <h2 className="section-heading mb-4">
                        Curated <span className="gradient-text">Tour Packages</span>
                    </h2>
                    <p className="section-subheading mx-auto">
                        Choose from our carefully crafted tour packages or customize any package to match your dream trip.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {featured.map((pkg, i) => (
                        <div
                            key={pkg.id}
                            className={`card group overflow-hidden transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: inView ? `${i * 150}ms` : '0ms' }}
                        >
                            <div className="flex flex-col lg:flex-row">
                                <div className="relative lg:w-72 h-52 lg:h-auto overflow-hidden flex-shrink-0">
                                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="overlay-gradient" />
                                    {pkg.popular && (
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-accent-500 text-white text-xs font-bold rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold">{pkg.rating}</span>
                                        <span className="text-xs text-white/60">({pkg.reviewCount})</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-5 flex flex-col">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div>
                                            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{pkg.tagline}</p>
                                            <h3 className="text-lg font-display font-bold text-surface-900 mt-1">{pkg.name}</h3>
                                        </div>
                                    </div>
                                    <p className="text-sm text-surface-500 line-clamp-2 mb-3">{pkg.description}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="flex items-center gap-1 text-xs text-surface-500">
                                            <Calendar size={13} /> {pkg.duration} Days
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-surface-500">
                                            <MapPin size={13} /> {pkg.destinations.length} Destinations
                                        </span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div>
                                            <span className="text-xs text-surface-400">From</span>
                                            <span className="text-2xl font-bold text-primary-700 ml-1">${pkg.startingPrice}</span>
                                            <span className="text-xs text-surface-400">/person</span>
                                        </div>
                                        <Link to={`/packages/${pkg.slug}`} className="btn-primary text-sm !px-5 !py-2.5">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link to="/packages" className="btn-secondary">
                        View All Packages <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============ WHY CHOOSE US ============
function WhyChooseSection() {
    const { ref, inView } = useInView();
    const features = [
        { icon: Shield, title: 'Trusted & Safe', description: 'Licensed, insured, and committed to your safety. Your well-being is our top priority.' },
        { icon: Heart, title: 'Personalized Service', description: 'Every tour is customized to your interests, pace, and budget. No cookie-cutter trips here.' },
        { icon: Headphones, title: '24/7 Support', description: 'Available on WhatsApp around the clock. We\'re always just a message away.' },
        { icon: Globe, title: 'Local Expertise', description: 'Born and raised in Sri Lanka. We share insider knowledge that guidebooks can\'t offer.' },
        { icon: Camera, title: 'Unique Experiences', description: 'From hidden beaches to village cooking classes — we curate moments, not just trips.' },
        { icon: Star, title: 'Best Value', description: 'Premium service at fair prices. No hidden costs, no surprises. Full transparency always.' },
    ];

    return (
        <section ref={ref} className="section-padding bg-gradient-to-br from-primary-900 via-primary-800 to-surface-900 text-white" id="why-us">
            <div className="container-custom">
                <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm border border-white/20 mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                        Your <span className="text-accent-400">Personal Travel Expert</span> in Sri Lanka
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        We don't just plan tours. We create unforgettable memories tailored to your dreams.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feat, i) => (
                        <div
                            key={feat.title}
                            className={`p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 group ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <feat.icon size={24} className="text-white" />
                            </div>
                            <h3 className="text-lg font-display font-bold mb-2">{feat.title}</h3>
                            <p className="text-sm text-white/60 leading-relaxed">{feat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============ HOW IT WORKS ============
function HowItWorksSection() {
    const { ref, inView } = useInView();
    const steps = [
        { num: '01', title: 'Tell Us Your Dream', description: 'Share your dates, interests, and budget. Use our tour builder or simply send us a message.', icon: Sparkles },
        { num: '02', title: 'Get a Custom Plan', description: 'Our experts craft a personalized itinerary with the best destinations, accommodations, and experiences for you.', icon: Compass },
        { num: '03', title: 'Refine & Confirm', description: 'Review the plan, suggest changes, and approve the final itinerary. Pay a small deposit to confirm.', icon: CheckCircle },
        { num: '04', title: 'Enjoy Your Adventure', description: 'We handle everything. Your private driver picks you up and the adventure begins. Just enjoy!', icon: Heart },
    ];

    return (
        <section ref={ref} className="section-padding bg-surface-50" id="how-it-works">
            <div className="container-custom">
                <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="badge mb-4">🗺️ How It Works</span>
                    <h2 className="section-heading mb-4">
                        Your Journey in <span className="gradient-text">4 Simple Steps</span>
                    </h2>
                    <p className="section-subheading mx-auto">
                        From your first inquiry to your last sunset — we make planning effortless.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, i) => (
                        <div
                            key={step.num}
                            className={`text-center relative transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: inView ? `${i * 150}ms` : '0ms' }}
                        >
                            <div className="relative inline-flex mb-6">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg">
                                    <step.icon size={32} className="text-white" />
                                </div>
                                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent-500 text-white text-sm font-bold flex items-center justify-center shadow">
                                    {step.num}
                                </span>
                            </div>
                            <h3 className="text-lg font-display font-bold text-surface-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-surface-500 leading-relaxed">{step.description}</p>
                            {i < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 -right-4 w-8">
                                    <ChevronRight size={24} className="text-primary-300" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/build-tour" className="btn-primary text-base !px-8 !py-4">
                        <Compass size={20} />
                        Start Planning Now
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============ TESTIMONIALS ============
function TestimonialsSection() {
    const { ref, inView } = useInView();

    return (
        <section ref={ref} className="section-padding" id="testimonials">
            <div className="container-custom">
                <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="badge mb-4">💬 Testimonials</span>
                    <h2 className="section-heading mb-4">
                        What Our <span className="gradient-text">Travelers Say</span>
                    </h2>
                    <p className="section-subheading mx-auto">
                        Real stories from real travelers who chose Ceyluna Travels for their Sri Lankan adventure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.slice(0, 6).map((review, i) => (
                        <div
                            key={review.id}
                            className={`card-static p-6 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
                        >
                            <div className="flex items-center gap-1 mb-3">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <Star key={j} size={16} className={j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-surface-200'} />
                                ))}
                            </div>
                            <h4 className="font-display font-bold text-surface-900 mb-2">{review.title}</h4>
                            <p className="text-sm text-surface-500 leading-relaxed mb-4 line-clamp-4">{review.content}</p>
                            <div className="pt-4 border-t border-surface-100 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-surface-800">{review.customerName}</p>
                                    <p className="text-xs text-surface-400">{review.country}</p>
                                </div>
                                <span className="text-[10px] text-primary-600 bg-primary-50 px-2 py-1 rounded-full font-medium">
                                    {review.tourName}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============ TRAVEL INSPIRATION ============
function InspirationSection() {
    const { ref, inView } = useInView();
    const tiles = [
        { img: 'https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&q=80', title: 'Safari Adventures', cat: 'Wildlife' },
        { img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80', title: 'Golden Beaches', cat: 'Beach' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk_Y1DP4w8SzowxqYB95uk8g2Qv-hEtvpb6yVdUeW2zw&s=10', title: 'Tea Country', cat: 'Nature' },
        { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2FksNfGeBzTtKb-TG69THyFf9o-JjytUsC0ZhxuccNw&s=10', title: 'Ancient Wonders', cat: 'Cultural' },
        { img: 'https://images.unsplash.com/photo-1505459668311-8dfac7952bf0?w=600&q=80', title: 'Surf Paradise', cat: 'Adventure' },
        { img: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=600&q=80', title: 'Elephant Encounters', cat: 'Wildlife' },
    ];

    return (
        <section ref={ref} className="section-padding bg-surface-50" id="inspiration">
            <div className="container-custom">
                <div className={`text-center mb-12 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <span className="badge mb-4">📸 Travel Inspiration</span>
                    <h2 className="section-heading mb-4">
                        Get Inspired for Your <span className="gradient-text">Sri Lankan Adventure</span>
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {tiles.map((tile, i) => (
                        <div
                            key={tile.title}
                            className={`relative group rounded-2xl overflow-hidden cursor-pointer ${i === 0 ? 'row-span-2 h-full min-h-[300px]' : 'h-48 md:h-56'} transition-all duration-700 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                            style={{ transitionDelay: inView ? `${i * 100}ms` : '0ms' }}
                        >
                            <img src={tile.img} alt={tile.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-4 left-4">
                                <span className="text-xs text-white/70 font-medium">{tile.cat}</span>
                                <h3 className="text-lg font-display font-bold text-white">{tile.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============ FAQ SECTION ============
function FAQSection() {
    const { ref, inView } = useInView();
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section ref={ref} className="section-padding" id="faq">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className={`lg:w-5/12 transition-all duration-700 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <span className="badge mb-4">❓ FAQ</span>
                        <h2 className="section-heading mb-4">
                            Frequently Asked <span className="gradient-text">Questions</span>
                        </h2>
                        <p className="text-surface-500 mb-6">
                            Everything you need to know about planning your Sri Lankan adventure. Can't find what you're looking for? Contact us anytime!
                        </p>
                        <Link to="/contact" className="btn-primary">
                            <Headphones size={18} />
                            Ask Us Anything
                        </Link>
                    </div>

                    <div className={`lg:w-7/12 space-y-3 transition-all duration-700 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                className={`rounded-xl border transition-all duration-300 ${openIdx === i ? 'border-primary-200 bg-primary-50/50 shadow-sm' : 'border-surface-200 bg-white hover:border-surface-300'}`}
                            >
                                <button
                                    onClick={() => setOpenIdx(openIdx === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className={`font-medium text-sm pr-4 ${openIdx === i ? 'text-primary-700' : 'text-surface-800'}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${openIdx === i ? 'bg-primary-600 text-white' : 'bg-surface-100 text-surface-500'}`}>
                                        {openIdx === i ? <Minus size={14} /> : <Plus size={14} />}
                                    </span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openIdx === i ? 'max-h-48' : 'max-h-0'}`}>
                                    <p className="px-5 pb-5 text-sm text-surface-500 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ============ CTA SECTION ============
function CTASection() {
    const { ref, inView } = useInView();

    return (
        <section ref={ref} className="relative py-24 overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1586523969104-3de5e83a2711?w=1600&q=80"
                alt="Sri Lanka"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-surface-900/80" />
            <div className={`relative z-10 container-custom text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                    Your Sri Lankan Adventure Awaits
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
                    Let us craft the perfect journey for you. Whether it's a romantic getaway, a family adventure,
                    or a solo exploration — we'll make it unforgettable.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/build-tour" className="btn-primary text-base !px-8 !py-4 shadow-xl">
                        <Compass size={20} />
                        Plan My Trip
                    </Link>
                    <Link to="/custom-tour-request" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/25 hover:bg-white/20 transition-all">
                        <Sparkles size={20} />
                        Get a Custom Quote
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ============ HOME PAGE ============
export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <PlanTripSection />
            <DestinationsSection />
            <PackagesSection />
            <WhyChooseSection />
            <HowItWorksSection />
            <TestimonialsSection />
            <InspirationSection />
            <FAQSection />
            <CTASection />
        </main>
    );
}
