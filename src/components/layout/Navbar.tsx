import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ChevronDown, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Tour Packages', path: '/packages' },
    { label: 'Build Your Tour', path: '/build-tour' },
    { label: 'Activities', path: '/activities' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastScrollY = useRef(0);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            // Only start hiding once we've scrolled past the top-bar/nav height,
            // and only react to meaningful movement so tiny jitters don't flicker it.
            if (Math.abs(currentScrollY - lastScrollY.current) < 6) return;

            if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
                setHidden(true); // scrolling down -> hide
            } else {
                setHidden(false); // scrolling up -> show
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Keep the bar visible whenever the mobile menu is open, so it can't
    // slide away while someone is using it.
    useEffect(() => {
        if (isOpen) setHidden(false);
    }, [isOpen]);

    const navBg = scrolled || !isHome
        ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-surface-100'
        : 'bg-transparent';

    const textColor = scrolled || !isHome ? 'text-surface-800' : 'text-white';
    const logoColor = scrolled || !isHome ? 'text-primary-700' : 'text-white';

    return (
        <>
            {/* Top Bar */}
            <div className="hidden lg:block bg-primary-900 text-primary-100 text-sm">
                <div className="container-custom flex justify-between items-center py-2">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={14} />
                            Tangalle, Sri Lanka
                        </span>
                        <a href="mailto:ceylunatravelstours@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Mail size={14} />
                            ceylunatravelstours@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        <a href="tel:+94767674827" className="flex items-center gap-1.5 hover:text-white transition-colors">
                            <Phone size={14} />
                            +94 76 767 4827
                        </a>
                        <span className="text-primary-300">|</span>
                        <Link to="/build-tour" className="font-semibold text-accent-300 hover:text-accent-200 transition-colors">
                            Plan Your Dream Trip
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Nav */}
            <nav
                className={`fixed top-0 lg:top-[40px] left-0 right-0 z-50 transition-all duration-300 ${navBg} ${hidden && !isOpen ? '-translate-y-[200%]' : 'translate-y-0'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex justify-between items-center h-16 lg:h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <img
                                    src="https://raw.githubusercontent.com/KawodyaThashika/Ceyluna_Travels/refs/heads/main/public/logo.png"
                                    alt="Ceyluna Travels"
                                    className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div>
                                <span className={`text-xl font-display font-bold ${logoColor} transition-colors`}>
                                    Ceyluna<span className="text-accent-500">Travels</span>
                                </span>
                                <span className={`hidden sm:block text-[10px] tracking-widest uppercase ${scrolled || !isHome ? 'text-surface-400' : 'text-white/70'} -mt-1`}>
                                    Premium Sri Lanka Tours
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                    ${location.pathname === link.path
                                            ? 'text-primary-600 bg-primary-50'
                                            : `${textColor} hover:text-primary-600 hover:bg-primary-50/80`
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* CTA & Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            <a href="https://wa.me/94767674827" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex btn-primary text-sm !px-5 !py-2.5">
                                Get a Quote
                            </a>
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`lg:hidden p-2 rounded-lg ${textColor} hover:bg-surface-100/20`}
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}>
                    <div className="bg-white border-t border-surface-100 shadow-lg">
                        <div className="container-custom py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${location.pathname === link.path
                                            ? 'text-primary-700 bg-primary-50'
                                            : 'text-surface-700 hover:bg-surface-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-3 border-t border-surface-100 space-y-2">
                                <a href="https://wa.me/94767674827" target="_blank" rel="noopener noreferrer" className="btn-primary w-full text-sm justify-center">
                                    Get a Free Quote
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
