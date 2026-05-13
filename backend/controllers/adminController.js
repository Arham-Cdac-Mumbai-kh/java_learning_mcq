const db = require('../utils/jsonDb');

exports.getAdminStats = async (req, res) => {
    try {
        const users = await db.read('users');
        const topics = await db.read('topics');
        const mcqs = await db.read('mcqs');
        res.json({
            userCount: users.length,
            topicCount: topics.length,
            mcqCount: mcqs.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const { id } = req.params;
        const topics = await db.read('topics');
        const index = topics.findIndex(t => t.id === id);
        if (index === -1) return res.status(404).json({ message: 'Topic not found' });

        topics[index] = { ...topics[index], ...req.body };
        await db.write('topics', topics);
        res.json({ message: 'Topic updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addMcq = async (req, res) => {
    try {
        const mcqs = await db.read('mcqs');
        const newMcq = {
            id: Date.now().toString(),
            ...req.body
        };
        mcqs.push(newMcq);
        await db.write('mcqs', mcqs);
        res.status(201).json(newMcq);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteMcq = async (req, res) => {
    try {
        const { id } = req.params;
        let mcqs = await db.read('mcqs');
        mcqs = mcqs.filter(m => m.id !== id);
        await db.write('mcqs', mcqs);
        res.json({ message: 'MCQ deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
