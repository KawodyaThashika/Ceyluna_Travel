import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Heart } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-surface-900 text-surface-300">
            {/* Newsletter Section */}
            <div className="border-b border-surface-700/50">
                <div className="container-custom py-12">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-display font-bold text-white mb-2">
                                Get Travel Inspiration
                            </h3>
                            <p className="text-surface-400">
                                Subscribe for exclusive deals, travel tips, and Sri Lanka secrets.
                            </p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-5 py-3.5 rounded-l-xl bg-surface-800 border border-surface-700 text-white placeholder:text-surface-500 focus:outline-none focus:border-primary-500 transition-colors"
                                required
                            />
                            <button type="submit" className="px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-r-xl hover:from-primary-700 hover:to-primary-600 transition-all">
                                {subscribed ? '✓ Subscribed!' : 'Subscribe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img
                                    src="https://raw.githubusercontent.com/KawodyaThashika/Ceyluna_Travel/refs/heads/main/public/logo.png"
                                    alt="Ceyluna Travels"
                                    className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div>
                                <span className="text-xl font-display font-bold text-white">
                                    Ceyluna<span className="text-accent-400">Travels</span>
                                </span>
                            </div>
                        </Link>
                        <p className="text-surface-400 text-sm leading-relaxed mb-6">
                            Your premium travel partner in Sri Lanka. We craft personalized tours that turn your Sri Lankan dreams into unforgettable realities.
                        </p>
                        <div className="flex gap-3 text-surface-400">
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface-800 hover:bg-primary-600 flex items-center justify-center transition-colors text-white" aria-label="Facebook">
                                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface-800 hover:bg-pink-600 flex items-center justify-center transition-colors text-white" aria-label="Instagram">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg bg-surface-800 hover:bg-red-600 flex items-center justify-center transition-colors text-white" aria-label="YouTube">
                                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.39.51a3.003 3.003 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.5 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.51 9.39.51 9.39.51s7.505 0 9.39-.51a3.003 3.003 0 0 0 2.11-2.107c.5-1.89.5-5.837.5-5.837s0-3.947-.5-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-5">Explore</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Destinations', path: '/destinations' },
                                { label: 'Tour Packages', path: '/packages' },
                                { label: 'Build Your Tour', path: '/build-tour' },
                                { label: 'Activities & Experiences', path: '/activities' },
                                { label: 'Custom Tour Request', path: '/custom-tour-request' },
                                { label: 'About Us', path: '/about' },
                            ].map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors group">
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Popular Destinations */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-5">Popular Destinations</h4>
                        <ul className="space-y-3">
                            {['Tangalle', 'Ella', 'Yala National Park', 'Sigiriya', 'Galle', 'Mirissa'].map(dest => (
                                <li key={dest}>
                                    <Link to={`/destinations/${dest.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center gap-2 text-sm text-surface-400 hover:text-primary-400 transition-colors group">
                                        <ArrowRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                        {dest}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-display font-semibold text-lg mb-5">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-surface-400">
                                    Tangalle, Southern Province,<br />Sri Lanka
                                </p>
                            </div>
                            <a href="tel:+94767674827" className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors">
                                <Phone size={18} className="text-primary-400 flex-shrink-0" />
                                +94 76 767 4827
                            </a>
                            <a href="mailto:ceylunatravelstours@gmail.com" className="flex items-center gap-3 text-sm text-surface-400 hover:text-primary-400 transition-colors">
                                <Mail size={18} className="text-primary-400 flex-shrink-0" />
                                ceylunatravelstours@gmail.com
                            </a>
                            <div className="pt-4">
                                <Link
                                    to="/contact"
                                    className="btn-secondary text-sm !py-2.5 !border-surface-600 !text-black hover:!text-black hover:!border-primary-500"
                                >
                                    Send a Message
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-surface-700/50">
                <div className="container-custom py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-surface-500">
                        © {new Date().getFullYear()} Ceyluna Travels. All rights reserved.
                    </p>
                    {/* <p className="text-sm text-surface-500 flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-400 fill-red-400" /> in Sri Lanka
                    </p> */}
                </div>
            </div>
        </footer>
    );
}
