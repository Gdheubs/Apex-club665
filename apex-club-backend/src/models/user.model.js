const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false // Don't return password in queries by default
    },
    role: {
        type: String,
        enum: ['user', 'creator', 'admin'],
        default: 'user'
    },
    profilePicture: {
        type: String,
        default: 'default-profile.jpg'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    tokens: [{
        type: String
    }],
    refreshTokens: [{
        type: String
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tokenBalance: {
        type: Number,
        default: 0
    },
    earnings: {
        total: {
            type: Number,
            default: 0
        },
        history: [{
            amount: Number,
            type: {
                type: String,
                enum: ['content_sale', 'tip', 'subscription']
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    },
    preferences: {
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            showProfile: {
                type: Boolean,
                default: true
            },
            showActivity: {
                type: Boolean,
                default: true
            }
        }
    }
}, {
    timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Generate JWT token
userSchema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign(
            { userId: this._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        this.tokens = this.tokens.concat(token);
        await this.save();
        
        return token;
    } catch (error) {
        throw error;
    }
};

// Generate refresh token
userSchema.methods.generateRefreshToken = async function() {
    try {
        const refreshToken = jwt.sign(
            { userId: this._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );
        
        this.refreshTokens = this.refreshTokens.concat(refreshToken);
        await this.save();
        
        return refreshToken;
    } catch (error) {
        throw error;
    }
};

// Remove tokens from the response
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.tokens;
    delete user.refreshTokens;
    delete user.verificationToken;
    delete user.resetPasswordToken;
    return user;
};

// Add follower
userSchema.methods.addFollower = async function(followerId) {
    if (!this.followers.includes(followerId)) {
        this.followers.push(followerId);
        await this.save();
    }
};

// Remove follower
userSchema.methods.removeFollower = async function(followerId) {
    this.followers = this.followers.filter(id => !id.equals(followerId));
    await this.save();
};

// Update token balance
userSchema.methods.updateTokenBalance = async function(amount, type) {
    this.tokenBalance += amount;
    this.earnings.total += amount;
    this.earnings.history.push({
        amount,
        type
    });
    await this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;