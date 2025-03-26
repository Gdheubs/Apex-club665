import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const LoginForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/feed';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginError, setLoginError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setLoginError('');

        try {
            const response = await fetch('http://localhost:5000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store the token in local storage
            localStorage.setItem('apexToken', data.data.token);
            
            // Navigate to the protected route the user tried to access, or default to feed
            navigate(from, { replace: true });

        } catch (error) {
            setLoginError('Invalid email or password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-md">
                <div className="card backdrop-blur-lg">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold">
                            <span className="text-apex-gold">APEX</span>
                            <span className="text-white">CLUB</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Welcome back</p>
                    </div>

                    {loginError && (
                        <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="relative">
                                <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="Enter your email"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.email && (
                                <p className="form-error">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="password" className="form-label">Password</label>
                                <Link to="/forgot-password" className="text-sm text-apex-gold hover:text-apex-gold/80 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Enter your password"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.password && (
                                <p className="form-error">{errors.password}</p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 rounded border-gray-700 bg-apex-gray text-apex-gold focus:ring-apex-gold focus:ring-offset-0"
                                disabled={isSubmitting}
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                                Remember me
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`btn-primary w-full flex items-center justify-center ${
                                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt mr-2"></i>
                                    Sign In
                                </>
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/invite" className="text-apex-gold hover:text-apex-gold/80 transition-colors">
                                Request an invitation
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Security Notice */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <i className="fas fa-shield-alt mr-2"></i>
                    Protected by Apex Club's advanced security system
                </div>
            </div>
        </div>
    );
};

export default LoginForm;