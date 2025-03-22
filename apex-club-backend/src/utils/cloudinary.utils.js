const cloudinary = require('cloudinary').v2;
const { AppError } = require('../middleware/error.middleware');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
exports.uploadToCloudinary = async (file, type) => {
    try {
        // Create data URI from buffer
        const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        // Set upload options based on content type
        const uploadOptions = {
            resource_type: type === 'video' ? 'video' : 'image',
            folder: `apex-club/${type}s`,
            allowed_formats: type === 'video' ? ['mp4', 'webm', 'mov'] : ['jpg', 'png', 'gif', 'webp']
        };

        // Add specific options based on content type
        if (type === 'image') {
            uploadOptions.transformation = [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ];
        } else if (type === 'video') {
            uploadOptions.transformation = [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
                { width: 1280 },
                { crop: 'limit' }
            ];
            uploadOptions.eager = [
                { width: 300, crop: 'scale', format: 'jpg' } // Generate thumbnail
            ];
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(fileStr, uploadOptions);

        // Return upload result
        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            resource_type: result.resource_type,
            thumbnail_url: type === 'video' ? result.eager[0].secure_url : result.secure_url,
            width: result.width,
            height: result.height,
            duration: result.duration // for videos
        };
    } catch (error) {
        throw new AppError(`Error uploading file to Cloudinary: ${error.message}`, 500);
    }
};

// Delete file from Cloudinary
exports.deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new AppError(`Error deleting file from Cloudinary: ${error.message}`, 500);
    }
};

// Generate signed URL for secure content delivery
exports.generateSecureUrl = async (publicId, options = {}) => {
    try {
        const signedUrl = cloudinary.url(publicId, {
            secure: true,
            sign_url: true,
            ...options
        });
        return signedUrl;
    } catch (error) {
        throw new AppError(`Error generating secure URL: ${error.message}`, 500);
    }
};

// Create transformation URL
exports.createTransformation = (publicId, transformations) => {
    try {
        return cloudinary.url(publicId, {
            transformation: transformations,
            secure: true
        });
    } catch (error) {
        throw new AppError(`Error creating transformation URL: ${error.message}`, 500);
    }
};

// Generate video thumbnail
exports.generateVideoThumbnail = async (publicId) => {
    try {
        const thumbnailUrl = cloudinary.url(publicId, {
            resource_type: 'video',
            transformation: [
                { width: 300, crop: 'scale' },
                { format: 'jpg' }
            ]
        });
        return thumbnailUrl;
    } catch (error) {
        throw new AppError(`Error generating video thumbnail: ${error.message}`, 500);
    }
};

// Optimize image for different devices
exports.optimizeImage = (publicId, deviceType = 'desktop') => {
    try {
        const transformations = {
            desktop: [
                { width: 1920, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ],
            tablet: [
                { width: 1024, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ],
            mobile: [
                { width: 768, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        };

        return cloudinary.url(publicId, {
            transformation: transformations[deviceType] || transformations.desktop,
            secure: true
        });
    } catch (error) {
        throw new AppError(`Error optimizing image: ${error.message}`, 500);
    }
};

// Check if resource exists
exports.checkResourceExists = async (publicId) => {
    try {
        const result = await cloudinary.api.resource(publicId);
        return !!result;
    } catch (error) {
        return false;
    }
};