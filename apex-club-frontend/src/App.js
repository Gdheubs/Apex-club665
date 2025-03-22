import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import InvitationForm from './components/InvitationForm';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ContentFeed from './components/ContentFeed';
import UploadContent from './components/UploadContent';
import CreatorDashboard from './components/CreatorDashboard';
import CommunityEngagement from './components/CommunityEngagement';
import VideoRecordingPage from './components/VideoRecordingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Prevent screenshots and recordings
    useEffect(() => {
        const preventCopyPaste = (e) => {
            e.preventDefault();
            return false;
        };

        // Prevent copy/paste
        document.addEventListener('copy', preventCopyPaste);
        document.addEventListener('paste', preventCopyPaste);
        document.addEventListener('cut', preventCopyPaste);

        // Prevent drag/drop
        document.addEventListener('dragstart', preventCopyPaste);
        document.addEventListener('drop', preventCopyPaste);

        return () => {
            document.removeEventListener('copy', preventCopyPaste);
            document.removeEventListener('paste', preventCopyPaste);
            document.removeEventListener('cut', preventCopyPaste);
            document.removeEventListener('dragstart', preventCopyPaste);
            document.removeEventListener('drop', preventCopyPaste);
        };
    }, []);

    return (
        <div className="min-h-screen bg-apex-black flex flex-col">
            <Navbar />
            
            <main className="flex-grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/invite" element={<InvitationForm />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/feed" element={<ContentFeed />} />
                        <Route path="/upload" element={<UploadContent />} />
                        <Route path="/dashboard" element={<CreatorDashboard />} />
                        <Route path="/community" element={<CommunityEngagement />} />
                        <Route path="/record" element={<VideoRecordingPage />} />
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <div className="text-center animate-fadeIn">
                                <h1 className="text-6xl font-display text-apex-gold mb-4">404</h1>
                                <p className="text-xl text-white mb-8 font-body">Page not found</p>
                                <Link to="/" className="btn-primary">
                                    Return Home
                                </Link>
                            </div>
                        </div>
                    } />
                </Routes>
            </main>

            {/* Footer */}
            <footer className="bg-apex-gray mt-auto py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-apex-gold font-display text-xl mb-4">Apex Club</h3>
                            <p className="text-gray-400">
                                The exclusive platform for elite content creators and discerning audiences.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-apex-gold font-display text-xl mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/invite" className="text-gray-400 hover:text-apex-gold transition-colors">Join Waitlist</Link></li>
                                <li><Link to="/login" className="text-gray-400 hover:text-apex-gold transition-colors">Login</Link></li>
                                <li><Link to="/signup" className="text-gray-400 hover:text-apex-gold transition-colors">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-apex-gold font-display text-xl mb-4">Connect</h3>
                            <div className="flex space-x-4">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-apex-gold transition-colors">
                                    <i className="fab fa-twitter text-xl"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-apex-gold transition-colors">
                                    <i className="fab fa-instagram text-xl"></i>
                                </a>
                                <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-apex-gold transition-colors">
                                    <i className="fab fa-discord text-xl"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Apex Club. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;