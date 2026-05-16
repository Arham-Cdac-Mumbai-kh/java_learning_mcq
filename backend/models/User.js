const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    progress: {
        type: Map,
        of: Number,
        default: {}
    },
    completedQuizzes: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
