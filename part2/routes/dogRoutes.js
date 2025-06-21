const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET dogs by owner (for owners to select from)
router.get('/owned', async (req, res) => {
  // Check the user is logged in, this route is only for logged in owners
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
    // Query the DB for dogs owned by the logged in user and return the results
    const [rows] = await db.query(`
      SELECT dog_id, name FROM Dogs WHERE owner_id = ?
    `, req.session.user.user_id);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch dogs by owner' });
  }
});

// GET all dogs
router.get('/', async (req, res) => {
  try {
    // Query the DB for all dogs and return the results
    const [dogs] = await db.query('SELECT d.dog_id, d.name AS dog_name, d.size, d.owner_id, u.username AS owner_username FROM Dogs d JOIN Users u On d.owner_id = u.user_id');
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;