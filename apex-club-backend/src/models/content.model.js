const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    type: {
        type: String,
        enum: ['image', 'video', 'article'],
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'photography',
            'art',
            'music',
            'dance',
            'writing',
            'education',
            'lifestyle',
            'technology',
            'other'
        ]
    },
    files: [{
        url: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        publicId: String, // For Cloudinary
        thumbnail: String
    }],
    contentType: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    tokenPrice: {
        type: Number,
        default: 0,
        validate: {
            validator: function(v) {
                return this.contentType === 'free' ? v === 0 : v > 0;
            },
            message: props => `Token price must be greater than 0 for premium content`
        }
    },
    tags: [{
        type: String,
        trim: true
    }],
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'published'
    },
    visibility: {
        type: String,
        enum: ['public', 'private', 'followers'],
        default: 'public'
    },
    stats: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        shares: {
            type: Number,
            default: 0
        },
        purchases: {
            type: Number,
            default: 0
        },
        earnings: {
            type: Number,
            default: 0
        }
    },
    engagement: {
        likes: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }],
        comments: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            text: {
                type: String,
                required: true,
                maxlength: [500, 'Comment cannot exceed 500 characters']
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            likes: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }]
        }],
        shares: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            platform: {
                type: String,
                enum: ['internal', 'twitter', 'facebook', 'instagram']
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    },
    purchasedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        amount: Number
    }],
    metadata: {
        duration: Number, // For videos
        dimensions: {
            width: Number,
            height: Number
        },
        size: Number, // in bytes
        format: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
contentSchema.index({ creator: 1, createdAt: -1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ status: 1, visibility: 1 });
contentSchema.index({ 'stats.views': -1 });
contentSchema.index({ title: 'text', description: 'text' });

// Virtual field for comment count
contentSchema.virtual('commentCount').get(function() {
    return this.engagement.comments.length;
});

// Virtual field for like count
contentSchema.virtual('likeCount').get(function() {
    return this.engagement.likes.length;
});

// Methods
contentSchema.methods.updateStats = async function(field, increment = true) {
    const value = increment ? 1 : -1;
    this.stats[field] += value;
    await this.save();
};

contentSchema.methods.addPurchase = async function(userId, amount) {
    this.purchasedBy.push({
        user: userId,
        amount
    });
    this.stats.purchases += 1;
    this.stats.earnings += amount;
    await this.save();
};

contentSchema.methods.toggleLike = async function(userId) {
    const likeIndex = this.engagement.likes.findIndex(like => 
        like.user.toString() === userId.toString()
    );

    if (likeIndex === -1) {
        this.engagement.likes.push({ user: userId });
        this.stats.likes += 1;
    } else {
        this.engagement.likes.splice(likeIndex, 1);
        this.stats.likes -= 1;
    }

    await this.save();
    return likeIndex === -1;
};

contentSchema.methods.addComment = async function(userId, text) {
    const comment = {
        user: userId,
        text,
        likes: []
    };
    this.engagement.comments.push(comment);
    await this.save();
    return comment;
};

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;