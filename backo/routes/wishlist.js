const express = require('express');
const Wishlist = require('../models/wishlist');
const Land = require('../models/land'); // import Land model
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * ADD to wishlist
 * POST /api/wishlist
 */
router.post('/', auth, async (req, res) => {
    try {
        const { landId } = req.body;
        if (!landId) {
            return res.status(400).json({ message: 'Land ID is required' });
        }

        // Check if already in wishlist
        const exists = await Wishlist.findOne({ user: req.user.id, land: landId });
        if (exists) {
            return res.status(400).json({ message: 'Already in wishlist' });
        }

        const item = await Wishlist.create({
            user: req.user.id,
            land: landId,
        });

        res.status(201).json({ message: 'Added to wishlist', item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * GET all wishlist items for user
 * GET /api/wishlist
 */
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id })
            .populate('land') // populate land details
            .sort({ createdAt: -1 });

        res.json({ wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * REMOVE from wishlist
 * DELETE /api/wishlist/:landId
 */
router.delete('/:landId', auth, async (req, res) => {
    try {
        const item = await Wishlist.findOneAndDelete({
            user: req.user.id,
            land: req.params.landId,
        });

        if (!item) {
            return res.status(404).json({ message: 'Land not found in wishlist' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
