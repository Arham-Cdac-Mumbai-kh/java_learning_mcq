const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/jsonDb');
const { isMongoConnected } = require('../config/db');
const User = require('../models/User');

const SECRET_KEY = process.env.JWT_SECRET || 'java-learning-secret-key';

const serializeUser = (user) => ({
    id: user._id?.toString() || user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    progress: user.progress instanceof Map ? Object.fromEntries(user.progress) : (user.progress || {}),
    completedQuizzes: user.completedQuizzes || []
});

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email, and password are required' });
        }

        if (isMongoConnected()) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'user',
                progress: {},
                completedQuizzes: []
            });

            return res.status(201).json({ message: 'User registered successfully' });
        }

        const users = await db.read('users');

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            role: 'user',
            progress: {}, // topicId: completionPercentage
            completedQuizzes: []
        };

        users.push(newUser);
        await db.write('users', users);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        if (isMongoConnected()) {
            const user = await User.findOne({ email: email.toLowerCase() });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user._id.toString(), role: user.role }, SECRET_KEY, { expiresIn: '24h' });
            return res.json({
                token,
                user: serializeUser(user)
            });
        }

        const users = await db.read('users');
        const user = users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        if (isMongoConnected()) {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });

            return res.json(serializeUser(user));
        }

        const users = await db.read('users');
        const user = users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
