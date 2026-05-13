const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDb');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { topicId, score, totalQuestions } = req.body;

        if (!topicId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
            return res.status(400).json({ message: 'topicId, score, and totalQuestions are required' });
        }

        const percentage = totalQuestions > 0
            ? Math.round((score / totalQuestions) * 100)
            : 0;

        const quizzes = await db.read('quizzes');
        const users = await db.read('users');
        const userIndex = users.findIndex(user => user.id === req.user.id);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        const quizResult = {
            id: Date.now().toString(),
            userId: req.user.id,
            topicId,
            score,
            totalQuestions,
            percentage,
            submittedAt: new Date().toISOString()
        };

        quizzes.push(quizResult);

        const user = users[userIndex];
        user.progress = {
            ...(user.progress || {}),
            [topicId]: Math.max(user.progress?.[topicId] || 0, percentage)
        };
        user.completedQuizzes = [
            ...(user.completedQuizzes || []),
            quizResult.id
        ];

        users[userIndex] = user;

        await db.write('quizzes', quizzes);
        await db.write('users', users);

        res.status(201).json({
            message: 'Quiz submitted successfully',
            quiz: quizResult,
            progress: user.progress
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
