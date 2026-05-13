const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/jsonDb');

const SECRET_KEY = process.env.JWT_SECRET || 'java-learning-secret-key';

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
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
        const users = await db.read('users');
        const user = users.find(u => u.id === req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { password, ...userProfile } = user;
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
