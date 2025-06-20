const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET dogs by owner (for owners to select from)
router.get('/owned', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }

  try {
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
    const [dogs] = await db.query('SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username FROM Dogs JOIN Users On Dogs.owner_id = Users.user_id');
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;