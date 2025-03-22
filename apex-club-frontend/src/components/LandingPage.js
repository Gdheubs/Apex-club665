import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const features = [
        {
            icon: 'fa-gem',
            title: 'Exclusive Access',
            description: 'Join our invite-only community of elite content creators and enthusiasts.'
        },
        {
            icon: 'fa-coins',
            title: 'Apex Tokens',
            description: 'Earn and spend our premium in-app currency for exclusive content and features.'
        },
        {
            icon: 'fa-shield-alt',
            title: 'Privacy First',
            description: 'Advanced content protection and privacy measures to keep your content secure.'
        },
        {
            icon: 'fa-users',
            title: 'Elite Community',
            description: 'Connect with like-minded individuals in our curated social space.'
        }
    ];

    const testimonials = [
        {
            name: 'Sarah J.',
            role: 'Content Creator',
            image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
            quote: 'Apex Club has revolutionized how I share and monetize my content. The privacy features are unmatched.'
        },
        {
            name: 'Michael R.',
            role: 'Digital Artist',
            image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
            quote: 'The token system provides a seamless way to earn while doing what I love.'
        }
    ];

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-apex-black via-apex-gray/20 to-apex-black"></div>
                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="heading-primary mb-6">
                        Welcome to <span className="text-gradient">Apex Club</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light">
                        The exclusive platform for elite content creators and discerning audiences.
                        Join our invite-only community and elevate your digital presence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/invite" className="btn-primary">
                            <i className="fas fa-user-plus mr-2"></i>
                            Request Invitation
                        </Link>
                        <Link to="/login" className="btn-secondary">
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Member Login
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-apex-gray">
                <div className="container mx-auto px-4">
                    <h2 className="heading-secondary text-center mb-16">Why Choose Apex Club?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index}
                                className="card group hover:transform hover:scale-105 transition-all duration-300"
                            >
                                <div className="text-apex-gold text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-apex-black">
                <div className="container mx-auto px-4">
                    <h2 className="heading-secondary text-center mb-16">What Our Members Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={index} 
                                className="card flex flex-col items-center text-center"
                            >
                                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-apex-gold">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                                <h4 className="text-apex-gold font-semibold">{testimonial.name}</h4>
                                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-apex-gray to-apex-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="heading-secondary mb-8">Ready to Join the Elite?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Take your content creation to the next level with Apex Club's exclusive features
                        and premium community.
                    </p>
                    <Link to="/invite" className="btn-primary inline-flex items-center">
                        <i className="fas fa-arrow-right mr-2"></i>
                        Get Started Now
                    </Link>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-apex-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="text-4xl font-display text-apex-gold mb-2">10K+</div>
                            <div className="text-gray-400">Active Members</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-display text-apex-gold mb-2">1M+</div>
                            <div className="text-gray-400">Apex Tokens Traded</div>
                        </div>
                        <div className="p-6">
                            <div className="text-4xl font-display text-apex-gold mb-2">100K+</div>
                            <div className="text-gray-400">Premium Content Pieces</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;