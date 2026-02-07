const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');
const Land = require('../models/land');

// GET wishlist lands
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('wishlist');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST add land to wishlist
router.post('/:landId', auth, async (req, res) => {
    try {
        const { landId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.wishlist.includes(landId)) {
            return res.status(400).json({ error: 'Land already in wishlist' });
        }

        user.wishlist.push(landId);
        await user.save();

        res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE remove land from wishlist
router.delete('/:landId', auth, async (req, res) => {
    try {
        const { landId } = req.params;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ error: 'User not found' });

        user.wishlist = user.wishlist.filter(id => id.toString() !== landId);
        await user.save();

        res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
