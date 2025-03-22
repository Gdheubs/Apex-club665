const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Validation middleware
const contentValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    body('type')
        .isIn(['image', 'video', 'article'])
        .withMessage('Invalid content type'),
    body('category')
        .isIn(['photography', 'art', 'music', 'dance', 'writing', 'education', 'lifestyle', 'technology', 'other'])
        .withMessage('Invalid category'),
    body('contentType')
        .isIn(['free', 'premium'])
        .withMessage('Invalid content type'),
    body('tokenPrice')
        .if(body('contentType').equals('premium'))
        .isInt({ min: 1 })
        .withMessage('Token price must be greater than 0 for premium content'),
    body('tags')
        .optional()
        .isString()
        .withMessage('Tags must be a comma-separated string')
];

// Routes
router.post(
    '/upload',
    authMiddleware,
    roleMiddleware('creator'),
    upload.array('files', 10),
    contentValidation,
    contentController.uploadContent
);

router.get(
    '/',
    contentController.getContents
);

router.get(
    '/:id',
    contentController.getContent
);

router.patch(
    '/:id',
    authMiddleware,
    roleMiddleware('creator'),
    contentValidation,
    contentController.updateContent
);

router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('creator'),
    contentController.deleteContent
);

// Engagement routes
router.post(
    '/:id/like',
    authMiddleware,
    contentController.likeContent
);

router.post(
    '/:id/comment',
    authMiddleware,
    [
        body('text')
            .trim()
            .isLength({ min: 1, max: 500 })
            .withMessage('Comment must be between 1 and 500 characters')
    ],
    contentController.commentOnContent
);

router.post(
    '/:id/purchase',
    authMiddleware,
    contentController.purchaseContent
);

// Creator analytics routes
router.get(
    '/creator/stats',
    authMiddleware,
    roleMiddleware('creator'),
    async (req, res) => {
        try {
            const stats = await Content.aggregate([
                { $match: { creator: req.user._id } },
                {
                    $group: {
                        _id: null,
                        totalContent: { $sum: 1 },
                        totalViews: { $sum: '$stats.views' },
                        totalLikes: { $sum: '$stats.likes' },
                        totalEarnings: { $sum: '$stats.earnings' }
                    }
                }
            ]);

            res.json({
                success: true,
                data: stats[0] || {
                    totalContent: 0,
                    totalViews: 0,
                    totalLikes: 0,
                    totalEarnings: 0
                }
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/creator/content',
    authMiddleware,
    roleMiddleware('creator'),
    async (req, res) => {
        try {
            const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

            const contents = await Content.find({ creator: req.user._id })
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await Content.countDocuments({ creator: req.user._id });

            res.json({
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
    }
);

// Content discovery routes
router.get(
    '/discover/trending',
    async (req, res) => {
        try {
            const trendingContent = await Content.find({
                status: 'published',
                visibility: 'public',
                'stats.views': { $gt: 0 }
            })
            .sort('-stats.views')
            .limit(10)
            .populate('creator', 'username profilePicture');

            res.json({
                success: true,
                data: trendingContent
            });
        } catch (error) {
            next(error);
        }
    }
);

router.get(
    '/discover/featured',
    async (req, res) => {
        try {
            const featuredContent = await Content.find({
                status: 'published',
                visibility: 'public',
                contentType: 'premium'
            })
            .sort('-stats.earnings')
            .limit(5)
            .populate('creator', 'username profilePicture');

            res.json({
                success: true,
                data: featuredContent
            });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;