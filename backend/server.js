const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const mcqRoutes = require('./routes/mcqRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/mcqs', mcqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', message: 'Java OOP Learning Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
