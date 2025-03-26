import React, { useState, useEffect } from 'react';

const ContentFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/content'); // Replace with actual API endpoint
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load content. Please try again later.');
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const filters = [
        { id: 'all', label: 'All Content' },
        { id: 'images', label: 'Images' },
        { id: 'videos', label: 'Videos' },
        { id: 'premium', label: 'Premium' },
    ];

    const handlePostClick = (post) => {
        if (post.premium) {
            // Handle premium content access
            console.log('Premium content clicked:', post.id);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto">
                {/* Content Filters */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {filters.map((filterOption) => (
                            <button
                                key={filterOption.id}
                                onClick={() => setFilter(filterOption.id)}
                                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                                    filter === filterOption.id
                                        ? 'bg-apex-gold text-apex-black'
                                        : 'bg-apex-gray text-white hover:bg-apex-gold/20'
                                }`}
                            >
                                {filterOption.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="card animate-pulse">
                                <div className="h-64 bg-apex-gray/50 rounded-lg mb-4"></div>
                                <div className="h-4 bg-apex-gray/50 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-apex-gray/50 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-8">
                        <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.filter(post => {
                            if (filter === 'all') return true;
                            if (filter === 'images') return post.type === 'image';
                            if (filter === 'videos') return post.type === 'video';
                            if (filter === 'premium') return post.premium;
                            return true;
                        }).map((post) => (
                            <div
                                key={post.id}
                                className="card group cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                                onClick={() => handlePostClick(post)}
                            >
                                {/* Content Preview */}
                                <div className="relative overflow-hidden rounded-lg mb-4">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        className="w-full h-64 object-cover protected-content"
                                    />
                                    {post.premium && (
                                        <div className="absolute top-2 right-2 bg-apex-gold text-apex-black px-3 py-1 rounded-full text-sm font-semibold">
                                            <i className="fas fa-crown mr-1"></i>
                                            Premium
                                        </div>
                                    )}
                                    {post.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <i className="fas fa-play-circle text-4xl text-white opacity-80 group-hover:opacity-100 transition-opacity"></i>
                                        </div>
                                    )}
                                </div>

                                {/* Content Info */}
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <div>
                                            <h3 className="font-semibold flex items-center">
                                                {post.author.name}
                                                {post.author.verified && (
                                                    <i className="fas fa-check-circle text-apex-gold ml-1 text-sm"></i>
                                                )}
                                            </h3>
                                        </div>
                                    </div>

                                    <h2 className="text-lg font-semibold">{post.title}</h2>
                                    <p className="text-gray-400">{post.description}</p>

                                    {/* Engagement Stats */}
                                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <i className="fas fa-heart mr-1"></i>
                                            {post.likes.toLocaleString()}
                                        </div>
                                        <div className="flex items-center">
                                            <i className="fas fa-comment mr-1"></i>
                                            {post.comments.toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-apex-gold">
                                            <i className="fas fa-coins mr-1"></i>
                                            {post.tokens} tokens
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="btn-secondary">
                        <i className="fas fa-spinner mr-2"></i>
                        Load More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContentFeed;