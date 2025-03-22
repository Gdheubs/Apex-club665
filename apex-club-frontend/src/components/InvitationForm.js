import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InvitationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        socialLinks: '',
        reason: '',
        contentType: '',
        referralCode: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const contentTypes = [
        { value: 'photos', label: 'Photography' },
        { value: 'videos', label: 'Video Content' },
        { value: 'art', label: 'Digital Art' },
        { value: 'music', label: 'Music' },
        { value: 'writing', label: 'Writing' },
        { value: 'other', label: 'Other' }
    ];

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

        if (!formData.reason.trim()) {
            newErrors.reason = 'Please tell us why you want to join';
        } else if (formData.reason.length < 50) {
            newErrors.reason = 'Please provide a more detailed reason (minimum 50 characters)';
        }

        if (!formData.contentType) {
            newErrors.contentType = 'Please select your primary content type';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // Simulated API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            setSubmitStatus({
                type: 'success',
                message: 'Your invitation request has been submitted successfully! We will review your application and contact you soon.'
            });

            // Reset form after successful submission
            setFormData({
                fullName: '',
                email: '',
                socialLinks: '',
                reason: '',
                contentType: '',
                referralCode: ''
            });

            // Redirect to thank you page after 3 seconds
            setTimeout(() => {
                navigate('/');
            }, 3000);

        } catch (error) {
            setSubmitStatus({
                type: 'error',
                message: 'Something went wrong. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-2xl">
                <div className="card backdrop-blur-lg">
                    <h1 className="heading-secondary text-center mb-8">Request an Invitation</h1>
                    
                    {submitStatus && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            submitStatus.type === 'success' 
                                ? 'bg-green-900/50 text-green-300 border border-green-700' 
                                : 'bg-red-900/50 text-red-300 border border-red-700'
                        }`}>
                            {submitStatus.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`input-field w-full ${errors.fullName ? 'border-red-500' : ''}`}
                                placeholder="Enter your full name"
                                disabled={isSubmitting}
                            />
                            {errors.fullName && (
                                <p className="form-error">{errors.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                                placeholder="Enter your email address"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="form-error">{errors.email}</p>
                            )}
                        </div>

                        {/* Social Links */}
                        <div className="form-group">
                            <label htmlFor="socialLinks" className="form-label">
                                Social Media Links <span className="text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="socialLinks"
                                name="socialLinks"
                                value={formData.socialLinks}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="Instagram, Twitter, or other social media links"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Content Type */}
                        <div className="form-group">
                            <label htmlFor="contentType" className="form-label">Primary Content Type</label>
                            <select
                                id="contentType"
                                name="contentType"
                                value={formData.contentType}
                                onChange={handleChange}
                                className={`input-field w-full ${errors.contentType ? 'border-red-500' : ''}`}
                                disabled={isSubmitting}
                            >
                                <option value="">Select your primary content type</option>
                                {contentTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            {errors.contentType && (
                                <p className="form-error">{errors.contentType}</p>
                            )}
                        </div>

                        {/* Reason */}
                        <div className="form-group">
                            <label htmlFor="reason" className="form-label">Why do you want to join Apex Club?</label>
                            <textarea
                                id="reason"
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                className={`input-field w-full h-32 resize-none ${errors.reason ? 'border-red-500' : ''}`}
                                placeholder="Tell us about yourself and why you want to join our exclusive community..."
                                disabled={isSubmitting}
                            ></textarea>
                            {errors.reason && (
                                <p className="form-error">{errors.reason}</p>
                            )}
                        </div>

                        {/* Referral Code */}
                        <div className="form-group">
                            <label htmlFor="referralCode" className="form-label">
                                Referral Code <span className="text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                id="referralCode"
                                name="referralCode"
                                value={formData.referralCode}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="Enter referral code if you have one"
                                disabled={isSubmitting}
                            />
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
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    Submit Request
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InvitationForm;