const express = require('express');
const router = express.Router();
const Land = require('../models/land');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');



router.post('/',auth, upload.array('images'), async (req, res) => {
    try {
        const {
            title,
            price,
            squareFeet,
            city,
            street,
            mobile,
            description
        } = req.body;

        
        if (!title || !price || !squareFeet || !city || !street || !mobile) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        
     const images = req.files ? req.files.map(file => file.path) : [];




        
        const land = await Land.create({
            title,
            price,
            squareFeet,
            city,
            street,
            mobile,
            description,
            images,
             owner: req.user._id
        });

        res.status(201).json(land);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const lands = await Land.find().sort({ createdAt: -1 });
        res.json(lands);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



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
