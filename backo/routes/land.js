const express = require('express');
const router = express.Router();
const Land = require('../models/land');
const auth = require('../middleware/auth');

// ✅ ADD LAND
router.post('/', async (req, res) => {
    try {
        const { title, price, location } = req.body;

        if (!title || !price || !location) {
            return res.status(400).json({ message: 'All fields required' });
        }

        const land = await Land.create({
            title,
            price,
            location,
            
        });

        res.status(201).json({
            message: 'Land posted successfully',
            land
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
