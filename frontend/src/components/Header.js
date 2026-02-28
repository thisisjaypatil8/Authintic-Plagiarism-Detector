import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsProfileOpen(false);
        navigate('/login');
    };

    const userName = user?.user?.name || user?.name || '';
    const userInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/resources', label: 'Resources' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <header className="w-full glass-nav border-b border-gray-200/60 sticky top-0 z-50">
            <div className="container mx-auto px-6 flex items-center justify-between h-14">
                {/* Logo — owl image + "A" and first "i" in teal, with animation */}
                <Link to="/" className="logo-animated logo-hover flex items-center gap-2 cursor-pointer">
                    <img src="/logo.png" alt="Authintic" className="w-8 h-8 object-contain" />
                    <span className="text-2xl font-extrabold tracking-tight">
                        <span className="logo-teal" style={{ color: '#0ABAB5' }}>A</span>
                        <span className="text-gray-800">uth</span>
                        <span className="logo-teal" style={{ color: '#0ABAB5' }}>i</span>
                        <span className="text-gray-800">ntic</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-7">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-[13px] font-medium transition-colors ${
                                location.pathname === link.to 
                                    ? 'text-[#0ABAB5]' 
                                    : 'text-gray-600 hover:text-[#0ABAB5]'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="hidden md:inline-flex items-center px-5 py-1.5 text-[13px] font-semibold text-white rounded-full transition-all hover:shadow-lg"
                                style={{ background: '#0ABAB5' }}
                            >
                                Dashboard
                            </Link>

                            {/* Profile Avatar */}
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md transition-transform hover:scale-105"
                                    style={{ background: '#0ABAB5' }}
                                >
                                    {userInitial}
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 top-11 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fadeInUp">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{user?.user?.email || user?.email || ''}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-[13px] font-medium text-gray-700 hover:text-[#0ABAB5] transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-1.5 text-[13px] font-semibold text-white rounded-full transition-all hover:shadow-lg"
                                style={{ background: '#0ABAB5' }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-100/60 bg-white/90 backdrop-blur-xl px-6 py-4 space-y-3">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="block text-sm font-medium text-gray-700 hover:text-[#0ABAB5] py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {user ? (
                        <Link to="/dashboard" className="block text-sm font-semibold py-2" style={{ color: '#0ABAB5' }}>
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="block text-sm font-medium text-gray-700 py-2">Login</Link>
                            <Link to="/register" className="block text-sm font-semibold py-2" style={{ color: '#0ABAB5' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
