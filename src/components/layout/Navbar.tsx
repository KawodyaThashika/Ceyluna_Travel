import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

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
    const { theme, toggleTheme, isDark } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            if (Math.abs(currentScrollY - lastScrollY.current) < 6) return;

            if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastScrollY.current = currentScrollY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    useEffect(() => {
        if (isOpen) setHidden(false);
    }, [isOpen]);

    const navBg = scrolled || !isHome
        ? isDark
            ? 'bg-surface-900/95 backdrop-blur-lg shadow-sm border-b border-surface-700'
            : 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-surface-100'
        : 'bg-transparent';

    const textColor = scrolled || !isHome
        ? isDark ? 'text-surface-200' : 'text-surface-800'
        : 'text-white';

    const logoColor = scrolled || !isHome
        ? isDark ? 'text-primary-400' : 'text-primary-700'
        : 'text-white';

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
                                    src="https://raw.githubusercontent.com/KawodyaThashika/Ceyluna_Travel/refs/heads/main/public/logo.png"
                                    alt="Ceyluna Travels"
                                    className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                            <div>
                                <span className={`text-xl font-display font-bold ${logoColor} transition-colors`}>
                                    Ceyluna<span className="text-accent-500">Travels</span>
                                </span>
                                <span className={`hidden sm:block text-[10px] tracking-widest uppercase ${scrolled || !isHome ? (isDark ? 'text-surface-500' : 'text-surface-400') : 'text-white/70'} -mt-1`}>
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
                                            ? isDark
                                                ? 'text-primary-400 bg-primary-900/50'
                                                : 'text-primary-600 bg-primary-50'
                                            : `${textColor} ${isDark ? 'hover:text-primary-400 hover:bg-primary-900/30' : 'hover:text-primary-600 hover:bg-primary-50/80'}`
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Theme Toggle + CTA + Mobile Toggle */}
                        <div className="flex items-center gap-3">
                            {/* Dark/Light Mode Toggle */}
                            <button
                                onClick={toggleTheme}
                                className={`theme-toggle ${scrolled || !isHome
                                    ? isDark
                                        ? 'bg-surface-800 hover:bg-surface-700 text-amber-400'
                                        : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
                                    : 'bg-white/10 hover:bg-white/20 text-white'
                                    }`}
                                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                                id="theme-toggle-btn"
                            >
                                <Sun size={18} className="sun-icon" />
                                <Moon size={18} className="moon-icon" />
                            </button>

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
                    <div className={`${isDark ? 'bg-surface-900' : 'bg-white'} border-t ${isDark ? 'border-surface-700' : 'border-surface-100'} shadow-lg`}>
                        <div className="container-custom py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors
                    ${location.pathname === link.path
                                            ? isDark
                                                ? 'text-primary-400 bg-primary-900/40'
                                                : 'text-primary-700 bg-primary-50'
                                            : isDark
                                                ? 'text-surface-300 hover:bg-surface-800'
                                                : 'text-surface-700 hover:bg-surface-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className={`pt-3 border-t ${isDark ? 'border-surface-700' : 'border-surface-100'} space-y-2`}>
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
