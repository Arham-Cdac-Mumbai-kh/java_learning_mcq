require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { connectDb } = require('./config/db');

const Topic = require('./models/Topic');
const Mcq = require('./models/Mcq');
const User = require('./models/User');
const Quiz = require('./models/Quiz');

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

        // 1. Clean all collections first
        for (const collection of Object.keys(models)) {
            console.log(`Cleaning ${collection} collection...`);
            await models[collection].deleteMany({});
        }

        // 2. Seed Users first to build ID mapping
        const usersPath = path.join(__dirname, dataFiles.users);
        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
        const userMap = {}; // { jsonId: mongoId }

        console.log(`Seeding users with ${userData.length} items...`);
        for (const user of userData) {
            const jsonId = user.id;
            const { id, ...userWithoutId } = user; // Remove JSON id
            const createdUser = await User.create(userWithoutId);
            userMap[jsonId] = createdUser._id;
        }
        console.log('Successfully seeded users.');

        // 3. Seed other collections
        const remainingCollections = ['topics', 'mcqs', 'quizzes'];
        for (const collection of remainingCollections) {
            const filePath = path.join(__dirname, dataFiles[collection]);
            if (!fs.existsSync(filePath)) continue;

            let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const model = models[collection];

            // Data transformation for Quiz relationships
            if (collection === 'quizzes') {
                data = data.map(quiz => {
                    const { id, ...quizWithoutId } = quiz;
                    // Replace JSON userId with actual MongoDB ObjectId
                    if (quizWithoutId.userId && userMap[quizWithoutId.userId]) {
                        quizWithoutId.userId = userMap[quizWithoutId.userId];
                    } else {
                        // Fallback: assign to first user if mapping fails to avoid validation error
                        const firstUser = Object.values(userMap)[0];
                        quizWithoutId.userId = firstUser || new mongoose.Types.ObjectId();
                    }
                    return quizWithoutId;
                });
            } else {
                // For other collections, just remove the JSON id
                data = data.map(({ id, ...rest }) => rest);
            }

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
