const express = require('express');
const router = express.Router();
const db = require('../utils/jsonDb');
const authMiddleware = require('../middleware/authMiddleware');
const { isMongoConnected } = require('../config/db');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

router.post('/submit', authMiddleware, async (req, res) => {
    try {
        const { topicId, score, totalQuestions } = req.body;

        if (!topicId || typeof score !== 'number' || typeof totalQuestions !== 'number') {
            return res.status(400).json({ message: 'topicId, score, and totalQuestions are required' });
        }

        const percentage = totalQuestions > 0
            ? Math.round((score / totalQuestions) * 100)
            : 0;

        if (isMongoConnected()) {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const quizResult = await Quiz.create({
                userId: user._id,
                topicId,
                score,
                totalQuestions,
                percentage
            });

            const currentProgress = user.progress?.get(topicId) || 0;
            user.progress.set(topicId, Math.max(currentProgress, percentage));
            user.completedQuizzes.push(quizResult._id.toString());
            await user.save();

            return res.status(201).json({
                message: 'Quiz submitted successfully',
                quiz: {
                    id: quizResult._id.toString(),
                    userId: user._id.toString(),
                    topicId,
                    score,
                    totalQuestions,
                    percentage,
                    submittedAt: quizResult.createdAt
                },
                progress: Object.fromEntries(user.progress)
            });
        }

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
