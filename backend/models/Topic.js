const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    notes: { type: String },
    examples: { type: String },
    codeSnippets: { type: String },
    interviewQuestions: [String],
    practiceQuestions: [String],
}, { id: false });

module.exports = mongoose.model('Topic', TopicSchema);
