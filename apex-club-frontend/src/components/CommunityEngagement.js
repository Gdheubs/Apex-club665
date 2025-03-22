import React, { useState, useEffect, useRef } from 'react';

const CommunityEngagement = () => {
    const [activeTab, setActiveTab] = useState('messages');
    const [messages, setMessages] = useState([]);
    const [events, setEvents] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chats, setChats] = useState([]);
    const messageEndRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock data moved inside useEffect
                const mockData = {
                    chats: [
                        {
                            id: 1,
                            user: {
                                name: 'Sarah J.',
                                avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
                                online: true,
                                verified: true
                            },
                            lastMessage: 'Thanks for the feedback on my latest post!',
                            timestamp: '2024-01-20T10:30:00Z',
                            unread: 2
                        },
                        {
                            id: 2,
                            user: {
                                name: 'Michael R.',
                                avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
                                online: false,
                                verified: true
                            },
                            lastMessage: 'Would love to collaborate on the next project',
                            timestamp: '2024-01-19T15:45:00Z',
                            unread: 0
                        }
                    ],
                    messages: [
                        {
                            id: 1,
                            senderId: 1,
                            text: 'Hey! I loved your latest content.',
                            timestamp: '2024-01-20T10:25:00Z'
                        },
                        {
                            id: 2,
                            senderId: 'me',
                            text: 'Thank you so much! I put a lot of effort into it.',
                            timestamp: '2024-01-20T10:27:00Z'
                        },
                        {
                            id: 3,
                            senderId: 1,
                            text: 'The editing was fantastic. Would you mind sharing some tips?',
                            timestamp: '2024-01-20T10:28:00Z'
                        }
                    ],
                    events: [
                        {
                            id: 1,
                            title: 'Creator Meetup',
                            date: '2024-02-01T18:00:00Z',
                            description: 'Join us for our monthly creator meetup!',
                            participants: 45,
                            type: 'virtual'
                        },
                        {
                            id: 2,
                            title: 'Photography Workshop',
                            date: '2024-02-15T15:00:00Z',
                            description: 'Learn advanced photography techniques from pro creators.',
                            participants: 30,
                            type: 'workshop'
                        }
                    ],
                    challenges: [
                        {
                            id: 1,
                            title: 'Urban Photography Challenge',
                            endDate: '2024-02-10T23:59:59Z',
                            prize: 1000,
                            participants: 156,
                            description: 'Capture the essence of city life in your unique style.'
                        },
                        {
                            id: 2,
                            title: 'Creative Storytelling',
                            endDate: '2024-02-20T23:59:59Z',
                            prize: 1500,
                            participants: 89,
                            description: 'Create a compelling visual story in 60 seconds.'
                        }
                    ]
                };

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                setMessages(mockData.messages);
                setEvents(mockData.events);
                setChallenges(mockData.challenges);
                setChats(mockData.chats);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array since we don't have external dependencies

    useEffect(() => {
        // Scroll to bottom of messages
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const newMsg = {
            id: messages.length + 1,
            senderId: 'me',
            text: newMessage,
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const tabs = [
        { id: 'messages', label: 'Messages', icon: 'fa-comments' },
        { id: 'events', label: 'Events', icon: 'fa-calendar-alt' },
        { id: 'challenges', label: 'Challenges', icon: 'fa-trophy' }
    ];

    return (
        <div className="min-h-screen py-20 px-4">
            <div className="container mx-auto">
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
                    <div className="card animate-pulse">
                        <div className="h-8 bg-apex-gray/50 rounded w-1/4 mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="h-20 bg-apex-gray/50 rounded"></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Chat List */}
                        {activeTab === 'messages' && (
                            <>
                                {/* Chat List */}
                                <div className="lg:col-span-1">
                                    <div className="card">
                                        <h2 className="text-xl font-display font-semibold mb-6">Conversations</h2>
                                        <div className="space-y-4">
                                            {chats.map(chat => (
                                                <div
                                                    key={chat.id}
                                                    onClick={() => setSelectedChat(chat)}
                                                    className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-all ${
                                                        selectedChat?.id === chat.id
                                                            ? 'bg-apex-gold/20'
                                                            : 'bg-apex-gray/50 hover:bg-apex-gray'
                                                    }`}
                                                >
                                                    <div className="relative">
                                                        <img
                                                            src={chat.user.avatar}
                                                            alt={chat.user.name}
                                                            className="w-12 h-12 rounded-full"
                                                        />
                                                        {chat.user.online && (
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-apex-black"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium flex items-center">
                                                                {chat.user.name}
                                                                {chat.user.verified && (
                                                                    <i className="fas fa-check-circle text-apex-gold ml-1 text-sm"></i>
                                                                )}
                                                            </h3>
                                                            <span className="text-sm text-gray-400">
                                                                {formatDate(chat.timestamp)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400 truncate">
                                                            {chat.lastMessage}
                                                        </p>
                                                    </div>
                                                    {chat.unread > 0 && (
                                                        <div className="bg-apex-gold text-apex-black w-5 h-5 rounded-full flex items-center justify-center text-xs">
                                                            {chat.unread}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="lg:col-span-2">
                                    <div className="card h-[600px] flex flex-col">
                                        {selectedChat ? (
                                            <>
                                                {/* Chat Header */}
                                                <div className="flex items-center space-x-4 p-4 border-b border-gray-800">
                                                    <img
                                                        src={selectedChat.user.avatar}
                                                        alt={selectedChat.user.name}
                                                        className="w-10 h-10 rounded-full"
                                                    />
                                                    <div>
                                                        <h3 className="font-medium flex items-center">
                                                            {selectedChat.user.name}
                                                            {selectedChat.user.verified && (
                                                                <i className="fas fa-check-circle text-apex-gold ml-1 text-sm"></i>
                                                            )}
                                                        </h3>
                                                        <p className="text-sm text-gray-400">
                                                            {selectedChat.user.online ? 'Online' : 'Offline'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Messages */}
                                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                                    {messages.map(message => (
                                                        <div
                                                            key={message.id}
                                                            className={`flex ${
                                                                message.senderId === 'me' ? 'justify-end' : 'justify-start'
                                                            }`}
                                                        >
                                                            <div className={`max-w-[70%] ${
                                                                message.senderId === 'me'
                                                                    ? 'bg-apex-gold text-apex-black'
                                                                    : 'bg-apex-gray'
                                                            } rounded-lg p-3`}>
                                                                <p>{message.text}</p>
                                                                <p className="text-xs mt-1 opacity-75">
                                                                    {formatDate(message.timestamp)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <div ref={messageEndRef} />
                                                </div>

                                                {/* Message Input */}
                                                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
                                                    <div className="flex space-x-4">
                                                        <input
                                                            type="text"
                                                            value={newMessage}
                                                            onChange={(e) => setNewMessage(e.target.value)}
                                                            placeholder="Type your message..."
                                                            className="input-field flex-1"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="btn-primary px-6"
                                                            disabled={!newMessage.trim()}
                                                        >
                                                            <i className="fas fa-paper-plane"></i>
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        ) : (
                                            <div className="flex-1 flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <i className="fas fa-comments text-4xl mb-4"></i>
                                                    <p>Select a conversation to start messaging</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Events */}
                        {activeTab === 'events' && (
                            <div className="lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {events.map(event => (
                                        <div key={event.id} className="card">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                                                    <p className="text-gray-400">{event.description}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    event.type === 'virtual'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-purple-500/20 text-purple-400'
                                                }`}>
                                                    {event.type}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm text-gray-400">
                                                <div>
                                                    <i className="far fa-calendar mr-2"></i>
                                                    {formatDate(event.date)}
                                                </div>
                                                <div>
                                                    <i className="far fa-user mr-2"></i>
                                                    {event.participants} participants
                                                </div>
                                            </div>
                                            <button className="btn-primary w-full mt-4">
                                                Join Event
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Challenges */}
                        {activeTab === 'challenges' && (
                            <div className="lg:col-span-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {challenges.map(challenge => (
                                        <div key={challenge.id} className="card">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="text-xl font-semibold">{challenge.title}</h3>
                                                <div className="text-apex-gold">
                                                    <i className="fas fa-coins mr-1"></i>
                                                    {challenge.prize} tokens
                                                </div>
                                            </div>
                                            <p className="text-gray-400 mb-4">{challenge.description}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                                <div>
                                                    <i className="far fa-clock mr-2"></i>
                                                    Ends: {formatDate(challenge.endDate)}
                                                </div>
                                                <div>
                                                    <i className="far fa-user mr-2"></i>
                                                    {challenge.participants} participants
                                                </div>
                                            </div>
                                            <button className="btn-primary w-full">
                                                Join Challenge
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityEngagement;