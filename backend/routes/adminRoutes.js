const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Helper to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

router.get('/stats', authMiddleware, adminOnly, adminController.getAdminStats);
router.put('/topics/:id', authMiddleware, adminOnly, adminController.updateTopic);
router.post('/mcqs', authMiddleware, adminOnly, adminController.addMcq);
router.delete('/mcqs/:id', authMiddleware, adminOnly, adminController.deleteMcq);

module.exports = router;
