import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Check authentication status
    useEffect(() => {
        const token = localStorage.getItem('apexToken');
        setIsAuthenticated(!!token);
    }, [location]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('apexToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const navLinks = isAuthenticated
        ? [
            { path: '/feed', label: 'Feed', icon: 'fa-stream' },
            { path: '/upload', label: 'Upload', icon: 'fa-cloud-upload-alt' },
            { path: '/dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
            { path: '/community', label: 'Community', icon: 'fa-users' },
        ]
        : [
            { path: '/invite', label: 'Join Waitlist', icon: 'fa-user-plus' },
            { path: '/login', label: 'Login', icon: 'fa-sign-in-alt' },
        ];

    const isActive = (path) => {
        return location.pathname === path ? 'text-apex-gold' : 'text-white hover:text-apex-gold';
    };

    return (
        <nav 
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled ? 'bg-apex-black/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <span className="text-2xl font-display font-bold text-apex-gold group-hover:scale-105 transition-transform">
                            APEX
                        </span>
                        <span className="text-white font-display group-hover:text-apex-gold transition-colors">
                            CLUB
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`${isActive(link.path)} transition-colors duration-300 flex items-center space-x-2 font-body`}
                            >
                                <i className={`fas ${link.icon}`}></i>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-apex-gold transition-colors duration-300 flex items-center space-x-2"
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-apex-gold focus:outline-none transition-colors duration-300"
                        >
                            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden animate-fadeIn">
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-apex-black/95 backdrop-blur-sm rounded-b-xl border-t border-gray-800">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`${isActive(link.path)} block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center space-x-2`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <i className={`fas ${link.icon}`}></i>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left text-white hover:text-apex-gold px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center space-x-2"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Logout</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;