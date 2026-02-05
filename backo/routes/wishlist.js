const express = require('express');
const Wishlist = require('../models/wishlist');
const auth = require('../middleware/auth'); // JWT middleware

const router = express.Router();

/**
 * ✅ ADD to wishlist
 * POST /api/wishlist
 */
router.post('/', auth, async (req, res) => {
    try {
        const { productId } = req.body;

        const item = await Wishlist.create({
            user: req.user.id,
            product: productId,
        });

        res.status(201).json({ message: 'Added to wishlist', item });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Already in wishlist' });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * 📦 GET user wishlist
 * GET /api/wishlist
 */
router.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id })
            .populate('product');

        res.json(wishlist);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * ❌ REMOVE from wishlist
 * DELETE /api/wishlist/:productId
 */
router.delete('/:productId', auth, async (req, res) => {
    try {
        await Wishlist.findOneAndDelete({
            user: req.user.id,
            product: req.params.productId,
        });

        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
