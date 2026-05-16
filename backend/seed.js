require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { connectDb } = require('./config/db');

const Topic = require('./models/Topic');
const Mcq = require('./models/Mcq');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

const seedData = async () => {
    try {
        await connectDb();
        console.log('Connected to MongoDB Atlas for seeding...');

        const dataFiles = {
            topics: './data/topics.json',
            mcqs: './data/mcqs.json',
            users: './data/users.json',
            quizzes: './data/quizzes.json',
        };

        const models = {
            topics: Topic,
            mcqs: Mcq,
            users: User,
            quizzes: Quiz,
        };

        for (const [collection, filePath] of Object.entries(dataFiles)) {
            const fullPath = path.join(__dirname, filePath);
            if (!fs.existsSync(fullPath)) {
                console.log(`Skipping ${collection}: File not found at ${fullPath}`);
                continue;
            }

            const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            const model = models[collection];

            console.log(`Cleaning ${collection} collection...`);
            await model.deleteMany({});

            console.log(`Seeding ${collection} with ${data.length} items...`);
            await model.insertMany(data);
            console.log(`Successfully seeded ${collection}.`);
        }

        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
        throw error;
    }
};

module.exports = { seedData };
