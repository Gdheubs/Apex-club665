const nodemailer = require('nodemailer');
const { AppError } = require('../middleware/error.middleware');

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Email templates
const emailTemplates = {
    verification: (token) => ({
        subject: 'Verify Your Apex Club Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to Apex Club!</h2>
                <p>Thank you for joining our exclusive platform. Please verify your email address to get started.</p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/verify-email/${token}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Verify Email
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>${process.env.FRONTEND_URL}/verify-email/${token}</p>
                <p>This link will expire in 24 hours.</p>
            </div>
        `
    }),

    passwordReset: (token) => ({
        subject: 'Reset Your Apex Club Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>You requested to reset your password. Click the button below to create a new password.</p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/reset-password/${token}" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Reset Password
                    </a>
                </div>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>${process.env.FRONTEND_URL}/reset-password/${token}</p>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `
    }),

    welcomeCreator: (username) => ({
        subject: 'Welcome to Apex Club Creator Program',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Welcome to the Creator Program!</h2>
                <p>Dear ${username},</p>
                <p>We're excited to have you join our creator community. Here's what you can do now:</p>
                <ul style="list-style-type: none; padding: 0;">
                    <li style="margin: 10px 0;">📝 Upload exclusive content</li>
                    <li style="margin: 10px 0;">💰 Earn tokens from your content</li>
                    <li style="margin: 10px 0;">📊 Track your performance</li>
                    <li style="margin: 10px 0;">🤝 Engage with your audience</li>
                </ul>
                <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/creator/dashboard" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        `
    }),

    contentPurchased: (buyer, content) => ({
        subject: 'New Content Purchase',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Purchase Notification</h2>
                <p>Your content "${content.title}" was purchased by ${buyer.username}.</p>
                <p>Amount earned: ${content.tokenPrice} tokens</p>
                <div style="margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/creator/dashboard" 
                       style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                        View Details
                    </a>
                </div>
            </div>
        `
    })
};

// Send email
const sendEmail = async (to, template) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject: template.subject,
            html: template.html
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new AppError(`Error sending email: ${error.message}`, 500);
    }
};

// Export email sending functions
exports.sendVerificationEmail = async (email, token) => {
    await sendEmail(email, emailTemplates.verification(token));
};

exports.sendPasswordResetEmail = async (email, token) => {
    await sendEmail(email, emailTemplates.passwordReset(token));
};

exports.sendWelcomeCreatorEmail = async (email, username) => {
    await sendEmail(email, emailTemplates.welcomeCreator(username));
};

exports.sendContentPurchaseEmail = async (email, buyer, content) => {
    await sendEmail(email, emailTemplates.contentPurchased(buyer, content));
};

// Verify email configuration
exports.verifyEmailConfig = async () => {
    try {
        await transporter.verify();
        console.log('Email configuration is valid');
        return true;
    } catch (error) {
        console.error('Email configuration error:', error);
        return false;
    }
};