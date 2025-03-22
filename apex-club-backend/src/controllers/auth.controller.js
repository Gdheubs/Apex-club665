const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/email.utils');

exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return next(new AppError(
                'User with this email or username already exists',
                400
            ));
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Create new user
        const user = new User({
            username,
            email,
            password,
            verificationToken,
            verificationTokenExpires
        });

        await user.save();

        // Generate tokens
        const token = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            data: {
                user: user.toJSON(),
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Check if password is correct
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return next(new AppError('Invalid email or password', 401));
        }

        // Check if user is verified
        if (!user.isVerified) {
            return next(new AppError('Please verify your email first', 401));
        }

        // Check if user is active
        if (user.status !== 'active') {
            return next(new AppError('Your account is not active', 401));
        }

        // Generate tokens
        const token = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        res.status(200).json({
            success: true,
            data: {
                user: user.toJSON(),
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        const user = req.user;
        const token = req.token;

        // Remove the current token
        user.tokens = user.tokens.filter(t => t !== token);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const user = req.user;
        const oldRefreshToken = req.refreshToken;

        // Remove old refresh token
        user.refreshTokens = user.refreshTokens.filter(t => t !== oldRefreshToken);

        // Generate new tokens
        const token = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshToken();

        res.status(200).json({
            success: true,
            data: {
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired verification token', 400));
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
        await user.save();

        // Send reset email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (error) {
        next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Invalid or expired reset token', 400));
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return next(new AppError('Current password is incorrect', 401));
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        next(error);
    }
};