const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDb');

router.get('/:topicId', async (req, res) => {
    try {
        const mcqs = await db.read('mcqs');
        const topicMcqs = mcqs.filter(m => m.topicId === req.params.topicId);
        res.json(topicMcqs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching MCQs' });
    }
});

module.exports = router;
