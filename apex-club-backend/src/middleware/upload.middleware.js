const multer = require('multer');
const path = require('path');
const { AppError } = require('./error.middleware');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    // Check file type based on content type in request
    const contentType = req.body.type;
    
    if (contentType === 'image' && allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
    } else if (contentType === 'video' && allowedVideoTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new AppError(`Invalid file type. Allowed types for ${contentType}: ${
            contentType === 'image' ? allowedImageTypes.join(', ') : allowedVideoTypes.join(', ')
        }`, 400), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
        files: 10 // Maximum 10 files
    }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size too large. Maximum size is 100MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return next(new AppError('Too many files. Maximum is 10 files', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return next(new AppError('Unexpected field', 400));
        }
        return next(new AppError(err.message, 400));
    }
    next(err);
};

// Middleware to check file presence
const checkFilePresence = (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return next(new AppError('Please upload at least one file', 400));
    }
    next();
};

// Middleware to validate file size and dimensions for images
const validateFileProperties = async (req, res, next) => {
    try {
        if (!req.files) return next();

        const contentType = req.body.type;
        const maxImageSize = 10 * 1024 * 1024; // 10MB for images
        const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos

        for (const file of req.files) {
            // Check file size
            if (contentType === 'image' && file.size > maxImageSize) {
                return next(new AppError(`Image size should not exceed 10MB: ${file.originalname}`, 400));
            }
            if (contentType === 'video' && file.size > maxVideoSize) {
                return next(new AppError(`Video size should not exceed 100MB: ${file.originalname}`, 400));
            }

            // Additional checks can be added here (e.g., image dimensions)
        }

        next();
    } catch (error) {
        next(error);
    }
};

// Middleware to process files before upload
const processFiles = async (req, res, next) => {
    try {
        if (!req.files) return next();

        // Add any additional file processing here
        // For example, you might want to:
        // - Generate thumbnails
        // - Extract metadata
        // - Compress images
        // - Convert video formats

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    upload,
    handleMulterError,
    checkFilePresence,
    validateFileProperties,
    processFiles
};