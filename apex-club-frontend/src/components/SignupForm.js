import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignupForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
        agreeToTerms: false
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupError, setSignupError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.inviteCode.trim()) {
            newErrors.inviteCode = 'Invitation code is required';
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
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
        setSignupError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSignupError('');

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // For demo purposes, we'll just set a token
            localStorage.setItem('apexToken', 'demo-token');
            
            // Navigate to the feed page
            navigate('/feed');

        } catch (error) {
            setSignupError('An error occurred during signup. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-lg">
                <div className="card backdrop-blur-lg">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-display font-bold">
                            <span className="text-apex-gold">APEX</span>
                            <span className="text-white">CLUB</span>
                        </h1>
                        <p className="text-gray-400 mt-2">Create your exclusive account</p>
                    </div>

                    {signupError && (
                        <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
                            <i className="fas fa-exclamation-circle mr-2"></i>
                            {signupError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <div className="relative">
                                <i className="fas fa-user absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                                    placeholder="Enter your full name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.fullName && (
                                <p className="form-error">{errors.fullName}</p>
                            )}
                        </div>

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
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="Create a strong password"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.password && (
                                <p className="form-error">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <div className="relative">
                                <i className="fas fa-lock absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    placeholder="Confirm your password"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="form-error">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Invite Code */}
                        <div className="form-group">
                            <label htmlFor="inviteCode" className="form-label">Invitation Code</label>
                            <div className="relative">
                                <i className="fas fa-ticket-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
                                <input
                                    type="text"
                                    id="inviteCode"
                                    name="inviteCode"
                                    value={formData.inviteCode}
                                    onChange={handleChange}
                                    className={`input-field w-full pl-10 ${errors.inviteCode ? 'border-red-500' : ''}`}
                                    placeholder="Enter your invitation code"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.inviteCode && (
                                <p className="form-error">{errors.inviteCode}</p>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="form-group">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        id="agreeToTerms"
                                        name="agreeToTerms"
                                        checked={formData.agreeToTerms}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-700 bg-apex-gray text-apex-gold focus:ring-apex-gold focus:ring-offset-0"
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="ml-3">
                                    <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
                                        I agree to the{' '}
                                        <Link to="/terms" className="text-apex-gold hover:text-apex-gold/80">
                                            Terms of Service
                                        </Link>
                                        {' '}and{' '}
                                        <Link to="/privacy" className="text-apex-gold hover:text-apex-gold/80">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                    {errors.agreeToTerms && (
                                        <p className="form-error mt-1">{errors.agreeToTerms}</p>
                                    )}
                                </div>
                            </div>
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
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus mr-2"></i>
                                    Create Account
                                </>
                            )}
                        </button>

                        {/* Login Link */}
                        <div className="text-center text-gray-400 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-apex-gold hover:text-apex-gold/80 transition-colors">
                                Sign in
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

export default SignupForm;