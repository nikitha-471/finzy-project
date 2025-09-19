const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const SECRET_KEY = 'finzy-secret';

function loadUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(USERS_FILE));
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

router.post('/simulate', authMiddleware, (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.email === req.user.email);
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.usage = (user.usage || 0) + 1;
    saveUsers(users);

    res.json({ message: 'Scenario simulated', usage: user.usage });
});

router.post('/report', authMiddleware, (req, res) => {
    const report = { ...req.body, user: req.user.email, date: new Date() };
    console.log('Report generated:', report);
    res.json({ message: 'Report saved', report });
});

module.exports = router;
