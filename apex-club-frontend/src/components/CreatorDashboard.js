import React, { useState, useEffect } from 'react';

const CreatorDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [activeTab, setActiveTab] = useState('overview');
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Mock data for demonstration
                const mockStats = {
                    overview: {
                        totalEarnings: {
                            value: 25000,
                            breakdown: [
                                { label: 'Content Sales', value: 15000 },
                                { label: 'Tips', value: 5000 },
                                { label: 'Subscriptions', value: 5000 }
                            ],
                            history: [
                                { date: '2024-01-14', value: 22000 },
                                { date: '2024-01-15', value: 23000 },
                                { date: '2024-01-16', value: 23500 },
                                { date: '2024-01-17', value: 24000 },
                                { date: '2024-01-18', value: 24500 },
                                { date: '2024-01-19', value: 24800 },
                                { date: '2024-01-20', value: 25000 }
                            ]
                        },
                        totalContent: {
                            value: 48,
                            breakdown: [
                                { label: 'Images', value: 30 },
                                { label: 'Videos', value: 15 },
                                { label: 'Articles', value: 3 }
                            ]
                        },
                        totalFollowers: {
                            value: 1200,
                            breakdown: [
                                { label: 'Paid Subscribers', value: 300 },
                                { label: 'Free Followers', value: 900 }
                            ],
                            history: [
                                { date: '2024-01-14', value: 1000 },
                                { date: '2024-01-15', value: 1050 },
                                { date: '2024-01-16', value: 1080 },
                                { date: '2024-01-17', value: 1120 },
                                { date: '2024-01-18', value: 1150 },
                                { date: '2024-01-19', value: 1180 },
                                { date: '2024-01-20', value: 1200 }
                            ]
                        },
                        totalViews: {
                            value: 85000,
                            breakdown: [
                                { label: 'Organic', value: 60000 },
                                { label: 'Shared', value: 20000 },
                                { label: 'Promoted', value: 5000 }
                            ]
                        }
                    },
                    recentTransactions: [
                        {
                            id: 1,
                            type: 'tip',
                            amount: 50,
                            from: 'Anonymous',
                            timestamp: '2024-01-20T10:30:00Z'
                        },
                        {
                            id: 2,
                            type: 'subscription',
                            amount: 100,
                            from: 'John D.',
                            timestamp: '2024-01-19T15:45:00Z'
                        },
                        {
                            id: 3,
                            type: 'content_purchase',
                            amount: 75,
                            from: 'Sarah M.',
                            timestamp: '2024-01-18T09:20:00Z'
                        }
                    ],
                    topContent: [
                        {
                            id: 1,
                            title: 'Sunset Photography Tips',
                            views: 12000,
                            earnings: 2500,
                            thumbnail: 'https://images.pexels.com/photos/1237119/pexels-photo-1237119.jpeg?auto=compress&cs=tinysrgb&w=300'
                        },
                        {
                            id: 2,
                            title: 'Urban Photography Guide',
                            views: 8500,
                            earnings: 1800,
                            thumbnail: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=300'
                        }
                    ]
                };

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                setStats(mockStats);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [selectedPeriod]); // Include selectedPeriod as it affects the data we fetch

    const tabs = [
        { id: 'overview', label: 'Overview', icon: 'fa-chart-line' },
        { id: 'content', label: 'Content', icon: 'fa-photo-video' },
        { id: 'earnings', label: 'Earnings', icon: 'fa-coins' },
        { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' }
    ];

    const periods = [
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'year', label: 'This Year' },
        { value: 'all', label: 'All Time' }
    ];

    const handleCardClick = (cardType) => {
        if (expandedCard === cardType) {
            setExpandedCard(null);
        } else {
            setExpandedCard(cardType);
        }
    };

    const renderExpandedCard = (cardType) => {
        const data = stats.overview[cardType];
        
        return (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-apex-black rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-semibold">
                            {cardType === 'totalEarnings' ? 'Earnings Details' :
                             cardType === 'totalContent' ? 'Content Breakdown' :
                             cardType === 'totalFollowers' ? 'Followers Analysis' :
                             'Views Statistics'}
                        </h2>
                        <button 
                            onClick={() => setExpandedCard(null)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Value and Growth */}
                    <div className="mb-8">
                        <div className="text-4xl font-display text-apex-gold mb-2">
                            {cardType === 'totalEarnings' ? `${data.value.toLocaleString()} Tokens` :
                             data.value.toLocaleString()}
                        </div>
                        <p className="text-sm text-green-500">
                            <i className="fas fa-arrow-up mr-1"></i>
                            +12.5% from last period
                        </p>
                    </div>

                    {/* Breakdown */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
                        <div className="space-y-4">
                            {data.breakdown.map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.label}</span>
                                        <span className="text-apex-gold">
                                            {cardType === 'totalEarnings' ? `${item.value.toLocaleString()} Tokens` :
                                             item.value.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-apex-gray rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-apex-gold"
                                            style={{ width: `${(item.value / data.value) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Historical Data */}
                    {data.history && (
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Last 7 Days Trend</h3>
                            <div className="flex items-end h-40 space-x-2">
                                {data.history.map((point, index) => (
                                    <div key={index} className="flex-1 flex flex-col items-center">
                                        <div 
                                            className="w-full bg-apex-gold rounded-t"
                                            style={{ 
                                                height: `${(point.value / Math.max(...data.history.map(p => p.value))) * 100}%`
                                            }}
                                        ></div>
                                        <span className="text-xs text-gray-400 mt-2">
                                            {new Date(point.date).toLocaleDateString(undefined, { day: 'numeric' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <h1 className="heading-secondary mb-4 md:mb-0">Creator Dashboard</h1>
                    
                    <div className="flex items-center space-x-4">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="input-field"
                        >
                            {periods.map(period => (
                                <option key={period.value} value={period.value}>
                                    {period.label}
                                </option>
                            ))}
                        </select>

                        <button className="btn-secondary">
                            <i className="fas fa-download mr-2"></i>
                            Export
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto mb-8 bg-apex-gray rounded-lg p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all ${
                                activeTab === tab.id
                                    ? 'bg-apex-gold text-apex-black'
                                    : 'text-white hover:bg-white/5'
                            }`}
                        >
                            <i className={`fas ${tab.icon} mr-2`}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    // Loading Skeleton
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="card animate-pulse">
                                <div className="h-8 bg-apex-gray/50 rounded w-1/2 mb-4"></div>
                                <div className="h-10 bg-apex-gray/50 rounded mb-2"></div>
                                <div className="h-4 bg-apex-gray/50 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div 
                                className="card cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                                onClick={() => handleCardClick('totalEarnings')}
                            >
                                <h3 className="text-gray-400 mb-2">Total Earnings</h3>
                                <div className="text-3xl font-display text-apex-gold mb-1">
                                    {stats.overview.totalEarnings.value.toLocaleString()} Tokens
                                </div>
                                <p className="text-sm text-green-500">
                                    <i className="fas fa-arrow-up mr-1"></i>
                                    +12.5% from last period
                                </p>
                                <div className="mt-2 text-sm text-apex-gold">
                                    <i className="fas fa-chart-bar mr-1"></i>
                                    Click for details
                                </div>
                            </div>

                            <div 
                                className="card cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                                onClick={() => handleCardClick('totalContent')}
                            >
                                <h3 className="text-gray-400 mb-2">Total Content</h3>
                                <div className="text-3xl font-display text-white mb-1">
                                    {stats.overview.totalContent.value.toLocaleString()}
                                </div>
                                <p className="text-sm text-gray-400">
                                    Pieces of content
                                </p>
                                <div className="mt-2 text-sm text-apex-gold">
                                    <i className="fas fa-chart-bar mr-1"></i>
                                    Click for details
                                </div>
                            </div>

                            <div 
                                className="card cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                                onClick={() => handleCardClick('totalFollowers')}
                            >
                                <h3 className="text-gray-400 mb-2">Followers</h3>
                                <div className="text-3xl font-display text-white mb-1">
                                    {stats.overview.totalFollowers.value.toLocaleString()}
                                </div>
                                <p className="text-sm text-green-500">
                                    <i className="fas fa-arrow-up mr-1"></i>
                                    +5.2% from last period
                                </p>
                                <div className="mt-2 text-sm text-apex-gold">
                                    <i className="fas fa-chart-bar mr-1"></i>
                                    Click for details
                                </div>
                            </div>

                            <div 
                                className="card cursor-pointer transform hover:scale-[1.02] transition-all duration-300"
                                onClick={() => handleCardClick('totalViews')}
                            >
                                <h3 className="text-gray-400 mb-2">Total Views</h3>
                                <div className="text-3xl font-display text-white mb-1">
                                    {stats.overview.totalViews.value.toLocaleString()}
                                </div>
                                <p className="text-sm text-green-500">
                                    <i className="fas fa-arrow-up mr-1"></i>
                                    +8.3% from last period
                                </p>
                                <div className="mt-2 text-sm text-apex-gold">
                                    <i className="fas fa-chart-bar mr-1"></i>
                                    Click for details
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Transactions */}
                            <div className="lg:col-span-2">
                                <div className="card">
                                    <h2 className="text-xl font-display font-semibold mb-6">Recent Transactions</h2>
                                    <div className="space-y-4">
                                        {stats.recentTransactions.map(transaction => (
                                            <div
                                                key={transaction.id}
                                                className="flex items-center justify-between p-4 bg-apex-gray/50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                        transaction.type === 'tip' ? 'bg-green-500/20 text-green-500' :
                                                        transaction.type === 'subscription' ? 'bg-blue-500/20 text-blue-500' :
                                                        'bg-purple-500/20 text-purple-500'
                                                    }`}>
                                                        <i className={`fas ${
                                                            transaction.type === 'tip' ? 'fa-gift' :
                                                            transaction.type === 'subscription' ? 'fa-star' :
                                                            'fa-shopping-cart'
                                                        }`}></i>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{transaction.from}</p>
                                                        <p className="text-sm text-gray-400">
                                                            {new Date(transaction.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-apex-gold font-medium">
                                                        +{transaction.amount} Tokens
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {transaction.type.replace('_', ' ').toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Performing Content */}
                            <div className="lg:col-span-1">
                                <div className="card">
                                    <h2 className="text-xl font-display font-semibold mb-6">Top Content</h2>
                                    <div className="space-y-4">
                                        {stats.topContent.map(content => (
                                            <div
                                                key={content.id}
                                                className="flex items-center space-x-4 p-4 bg-apex-gray/50 rounded-lg"
                                            >
                                                <img
                                                    src={content.thumbnail}
                                                    alt={content.title}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div>
                                                    <h3 className="font-medium mb-1">{content.title}</h3>
                                                    <p className="text-sm text-gray-400">
                                                        {content.views.toLocaleString()} views
                                                    </p>
                                                    <p className="text-sm text-apex-gold">
                                                        {content.earnings.toLocaleString()} Tokens earned
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Card Modal */}
                        {expandedCard && renderExpandedCard(expandedCard)}
                    </>
                )}
            </div>
        </div>
    );
};

export default CreatorDashboard;