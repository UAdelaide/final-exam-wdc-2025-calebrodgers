const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET dogs by owner (for owners to select from)
router.get('/', async (req, res) => {
  console.log("dsd");
  const { owner_id } = req.query;

  try {
    const [rows] = await db.query(`
      SELECT dog_id, name FROM Dogs WHERE owner_id = ?
    `, owner_id);
    res.json(rows);
  } catch (error) {
    console.error('SQL Error:', error);
    res.status(500).json({ error: 'Failed to fetch dogs by owner' });
  }
});

module.exports = router;