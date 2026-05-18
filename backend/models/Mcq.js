const mongoose = require('mongoose');

const McqSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    topicId: { type: String, required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: Number, required: true },
    explanation: { type: String },
}, { id: false });

module.exports = mongoose.model('Mcq', McqSchema);
