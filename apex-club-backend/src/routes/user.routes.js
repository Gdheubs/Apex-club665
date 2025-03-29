const express = require('express');
const router = express.Router();

// Example route for getting all users
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all users' });
});

// Example route for creating a new user
router.post('/', (req, res) => {
    res.status(201).json({ message: 'User created' });
});

// Add more user-related routes as needed

module.exports = router;