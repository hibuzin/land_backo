const express = require('express');
const router = express.Router();
const Land = require('../models/land');
const upload = require('../middleware/upload');

/**
 * ✅ CREATE LAND
 * POST /api/lands
 */
router.post('/', upload.array('images'), async (req, res) => {
    try {
        const {
            title,
            price,
            squareFeet,
            city,
            street,
            description
        } = req.body;

        // ✅ required fields check
        if (!title || !price || !squareFeet || !city || !street) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // ✅ images
        const images = req.files
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        // ✅ create land
        const land = await Land.create({
            title,
            price,
            squareFeet,
            city,
            street,
            description,
            images
        });

        res.status(201).json(land);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


/**
 * ✅ GET ALL LANDS
 * GET /api/lands
 */
router.get('/', async (req, res) => {
    try {
        const lands = await Land.find().sort({ createdAt: -1 });
        res.json(lands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ GET SINGLE LAND
 * GET /api/lands/:id
 */
router.get('/:id', async (req, res) => {
    try {
        const land = await Land.findById(req.params.id);

        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        res.json(land);
    } catch (err) {
        res.status(400).json({ message: 'Invalid land ID' });
    }
});

/**
 * ✅ UPDATE LAND
 * PUT /api/lands/:id
 */
router.put('/:id', async (req, res) => {
    try {
        const land = await Land.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        res.json(land);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

/**
 * ✅ DELETE LAND
 * DELETE /api/lands/:id
 */
router.delete('/:id', async (req, res) => {
    try {
        const land = await Land.findByIdAndDelete(req.params.id);

        if (!land) {
            return res.status(404).json({ message: 'Land not found' });
        }

        res.json({ message: 'Land deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
