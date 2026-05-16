const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDb } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const topicRoutes = require('./routes/topicRoutes');
const mcqRoutes = require('./routes/mcqRoutes');
const adminRoutes = require('./routes/adminRoutes');
const quizRoutes = require('./routes/quizRoutes');
const { seedData } = require('./seed');

app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/mcqs', mcqRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'UP', message: 'Java OOP Learning Server is running' });
});

const startServer = async () => {
    await connectDb();

    // Temporary: Seed the database on startup
    try {
        console.log('Running seed data script...');
        await seedData();
        console.log('Database seeded successfully!');
    } catch (err) {
        console.error('Seeding failed, but continuing to start server:', err);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();
