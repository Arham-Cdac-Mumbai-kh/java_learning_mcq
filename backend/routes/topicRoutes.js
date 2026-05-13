const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDb');

router.get('/', async (req, res) => {
    try {
        const topics = await db.read('topics');
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching topics' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const topics = await db.read('topics');
        const topic = topics.find(t => t.id === req.params.id);
        if (!topic) return res.status(404).json({ message: 'Topic not found' });
        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching topic' });
    }
});

module.exports = router;
