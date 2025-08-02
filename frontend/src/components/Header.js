// frontend/src/components/Header.js

import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import authService from "../services/authService";

const Header = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        window.location.reload(); 
    };

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between p-4">
                <Link to="/" className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Authintic Logo" className="h-10 w-10" />
                    <div>
                        <span className="text-xl font-bold text-indigo-600">
                            Authintic
                        </span>
                        <p className="text-xs text-gray-500 -mt-1">
                            the plagiarism checker
                        </p>
                    </div>
                </Link>
                
                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600">Home</Link>
                    <Link to="/about" className="text-gray-600 hover:text-indigo-600">About</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                            <button onClick={handleLogout} className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                            <Link to="/register" className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Sign Up</Link>
                        </>
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="flex flex-col items-center space-y-4 p-4">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link to="/about" className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>About</Link>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                <button onClick={handleLogout} className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="w-full text-center px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;
