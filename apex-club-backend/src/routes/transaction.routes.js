const express = require('express');
const router = express.Router();

// Example route for getting all transactions
router.get('/', (req, res) => {
    res.status(200).json({ message: 'Get all transactions' });
});

// Example route for creating a new transaction
router.post('/', (req, res) => {
    res.status(201).json({ message: 'Transaction created' });
});

// Add more transaction-related routes as needed

module.exports = router;