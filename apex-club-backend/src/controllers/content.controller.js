const Content = require('../models/content.model');
const User = require('../models/user.model');
const { AppError } = require('../middleware/error.middleware');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary.utils');

exports.uploadContent = async (req, res, next) => {
    try {
        const { title, description, type, category, contentType, tokenPrice, tags } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return next(new AppError('Please upload at least one file', 400));
        }

        // Upload files to Cloudinary
        const uploadedFiles = await Promise.all(
            files.map(async (file) => {
                const result = await uploadToCloudinary(file, type);
                return {
                    url: result.secure_url,
                    type: file.mimetype,
                    publicId: result.public_id,
                    thumbnail: result.thumbnail_url || result.secure_url
                };
            })
        );

        // Create content
        const content = new Content({
            creator: req.user._id,
            title,
            description,
            type,
            category,
            contentType,
            tokenPrice: contentType === 'premium' ? tokenPrice : 0,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            files: uploadedFiles
        });

        await content.save();

        res.status(201).json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
};

exports.getContents = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            type,
            category,
            contentType,
            creator,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {
            status: 'published',
            visibility: 'public'
        };

        if (type) query.type = type;
        if (category) query.category = category;
        if (contentType) query.contentType = contentType;
        if (creator) query.creator = creator;
        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const contents = await Content.find(query)
            .populate('creator', 'username profilePicture')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Get total count
        const total = await Content.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id)
            .populate('creator', 'username profilePicture')
            .populate('engagement.comments.user', 'username profilePicture')
            .populate('purchasedBy.user', 'username profilePicture');

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        // Increment view count
        await content.updateStats('views');

        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
};

exports.updateContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        // Check ownership
        if (content.creator.toString() !== req.user._id.toString()) {
            return next(new AppError('Not authorized to update this content', 403));
        }

        // Update fields
        const allowedUpdates = ['title', 'description', 'category', 'contentType', 'tokenPrice', 'tags', 'status', 'visibility'];
        Object.keys(req.body).forEach((update) => {
            if (allowedUpdates.includes(update)) {
                content[update] = req.body[update];
            }
        });

        await content.save();

        res.status(200).json({
            success: true,
            data: content
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        // Check ownership
        if (content.creator.toString() !== req.user._id.toString()) {
            return next(new AppError('Not authorized to delete this content', 403));
        }

        // Delete files from Cloudinary
        await Promise.all(
            content.files.map(file => deleteFromCloudinary(file.publicId))
        );

        await content.remove();

        res.status(200).json({
            success: true,
            message: 'Content deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

exports.likeContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id);

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        const isLiked = await content.toggleLike(req.user._id);

        res.status(200).json({
            success: true,
            message: isLiked ? 'Content liked' : 'Content unliked'
        });
    } catch (error) {
        next(error);
    }
};

exports.commentOnContent = async (req, res, next) => {
    try {
        const { text } = req.body;
        const content = await Content.findById(req.params.id);

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        const comment = await content.addComment(req.user._id, text);

        res.status(201).json({
            success: true,
            data: comment
        });
    } catch (error) {
        next(error);
    }
};

exports.purchaseContent = async (req, res, next) => {
    try {
        const content = await Content.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (!content) {
            return next(new AppError('Content not found', 404));
        }

        if (content.contentType !== 'premium') {
            return next(new AppError('This content is free', 400));
        }

        // Check if already purchased
        const alreadyPurchased = content.purchasedBy.some(
            purchase => purchase.user.toString() === req.user._id.toString()
        );

        if (alreadyPurchased) {
            return next(new AppError('You have already purchased this content', 400));
        }

        // Check if user has enough tokens
        if (user.tokenBalance < content.tokenPrice) {
            return next(new AppError('Insufficient token balance', 400));
        }

        // Process purchase
        await user.updateTokenBalance(-content.tokenPrice, 'content_purchase');
        await content.addPurchase(req.user._id, content.tokenPrice);

        // Update creator's balance
        const creator = await User.findById(content.creator);
        await creator.updateTokenBalance(content.tokenPrice, 'content_sale');

        res.status(200).json({
            success: true,
            message: 'Content purchased successfully'
        });
    } catch (error) {
        next(error);
    }
};